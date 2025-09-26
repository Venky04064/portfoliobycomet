from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import jwt
import os
import json
import datetime
import uuid
import aiofiles
from pathlib import Path
import logging
from contextlib import asynccontextmanager
import asyncpg

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Config
SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
NEON_DB_URL = os.getenv("NEON_DB_URL")  # postgres://...neon.tech/... or postgresql://

# Paths (file-based fallback)
BASE_DIR = Path(__file__).parent
DATA_STORAGE_DIR = BASE_DIR / "data-storage"
UPLOAD_DIR = BASE_DIR / "upload"
CONTENT_FILE = BASE_DIR / "content.txt"

# Database pool
db_pool: Optional[asyncpg.Pool] = None

# Models
class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=50)
    access_code: str = Field(..., min_length=1, max_length=100)

class FeedbackRequest(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    message: str = Field(..., min_length=1, max_length=1000)
    visitor_name: Optional[str] = Field(None, max_length=100)
    visitor_email: Optional[str] = Field(None, max_length=100)

class ThemeUpdateRequest(BaseModel):
    theme: str = Field(..., min_length=1, max_length=50)
    font: str = Field("inter", min_length=1, max_length=50)
    glassmorphic_opacity: float = Field(0.2, ge=0.0, le=1.0)
    blur_intensity: int = Field(20, ge=0, le=100)

# Utils
def read_file_safe(file_path: Path) -> str:
    try:
        return file_path.read_text(encoding='utf-8')
    except Exception:
        return ""

def write_file_safe(file_path: Path, content: str) -> bool:
    try:
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content, encoding='utf-8')
        return True
    except Exception:
        return False

# Auth
security = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + (expires_delta or datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": datetime.datetime.utcnow()})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token, expire

def require_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return {"username": payload.get("sub"), "exp": payload.get("exp")}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# DB init and helpers
async def init_db_pool():
    global db_pool
    if NEON_DB_URL:
        db_pool = await asyncpg.create_pool(dsn=NEON_DB_URL, min_size=1, max_size=5)
        async with db_pool.acquire() as conn:
            await conn.execute(
                """
                create table if not exists themes (
                  id serial primary key,
                  current_theme text not null default 'cosmic-purple',
                  font text not null default 'inter',
                  glassmorphic_opacity real not null default 0.2,
                  blur_intensity int not null default 20
                );
                """
            )
            await conn.execute(
                """
                create table if not exists access_settings (
                  id serial primary key,
                  access_code text not null
                );
                """
            )
            await conn.execute(
                """
                create table if not exists feedback (
                  id uuid primary key,
                  rating int not null,
                  message text not null,
                  visitor_name text,
                  visitor_email text,
                  created_at timestamptz not null default now()
                );
                """
            )
            # Seed single rows if empty
            await conn.execute("insert into themes (current_theme) select 'cosmic-purple' where not exists (select 1 from themes);")
            await conn.execute("insert into access_settings (access_code) select 'Venky@access345' where not exists (select 1 from access_settings);")
    else:
        logger.info("NEON_DB_URL not set. Using file-based storage.")

async def get_access_code() -> str:
    if db_pool:
        async with db_pool.acquire() as conn:
            row = await conn.fetchrow("select access_code from access_settings order by id asc limit 1")
            return row[0] if row else ""
    return read_file_safe(DATA_STORAGE_DIR / "access_settings.txt").strip() or ""

async def set_theme_settings(t: ThemeUpdateRequest) -> None:
    if db_pool:
        async with db_pool.acquire() as conn:
            await conn.execute("delete from themes where id not in (select id from themes order by id asc limit 1)")
            await conn.execute(
                "update themes set current_theme=$1, font=$2, glassmorphic_opacity=$3, blur_intensity=$4 where id in (select id from themes order by id asc limit 1)",
                t.theme, t.font, t.glassmorphic_opacity, t.blur_intensity
            )
    else:
        write_file_safe(DATA_STORAGE_DIR / "theme_settings.txt", t.theme)

async def get_theme_settings_db() -> Dict[str, Any]:
    if db_pool:
        async with db_pool.acquire() as conn:
            row = await conn.fetchrow("select current_theme, font, glassmorphic_opacity, blur_intensity from themes order by id asc limit 1")
            if row:
                return dict(row)
    return {
        "current_theme": (read_file_safe(DATA_STORAGE_DIR / "theme_settings.txt") or "cosmic-purple").strip(),
        "font": "inter",
        "glassmorphic_opacity": 0.2,
        "blur_intensity": 20,
    }

async def save_feedback(f: FeedbackRequest):
    if db_pool:
        async with db_pool.acquire() as conn:
            await conn.execute(
                "insert into feedback (id, rating, message, visitor_name, visitor_email) values ($1,$2,$3,$4,$5)",
                str(uuid.uuid4()), f.rating, f.message, f.visitor_name, f.visitor_email
            )
    else:
        fb_file = DATA_STORAGE_DIR / "feedback" / "feedback.jsonl"
        fb_file.parent.mkdir(parents=True, exist_ok=True)
        async with aiofiles.open(fb_file, 'a', encoding='utf-8') as f_io:
            await f_io.write(json.dumps(f.dict()) + "\n")

# Lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    (DATA_STORAGE_DIR / "feedback").mkdir(parents=True, exist_ok=True)
    (DATA_STORAGE_DIR / "analytics").mkdir(parents=True, exist_ok=True)
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    if not (DATA_STORAGE_DIR / "access_settings.txt").exists():
        write_file_safe(DATA_STORAGE_DIR / "access_settings.txt", "Venky@access345")
    if not (DATA_STORAGE_DIR / "theme_settings.txt").exists():
        write_file_safe(DATA_STORAGE_DIR / "theme_settings.txt", "cosmic-purple")
    try:
        await init_db_pool()
        logger.info("Database initialized" if db_pool else "File storage mode active")
    except Exception as e:
        logger.error(f"DB init failed, falling back to files: {e}")
    yield

app = FastAPI(title="Portfolio by Comet API", version="2.0.0", docs_url="/docs", redoc_url="/redoc", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.vercel.app",
        "https://portfoliobycomet.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
@app.get("/api/health")
async def health():
    mode = "database" if db_pool else "files"
    return {"status": "ok", "mode": mode, "env": ENVIRONMENT}

@app.post("/api/auth/login")
async def login(body: LoginRequest):
    access_code = await get_access_code()
    if not access_code or body.access_code != access_code:
        raise HTTPException(status_code=401, detail="Invalid access code")
    token, exp = create_access_token({"sub": body.username})
    return {"access_token": token, "token_type": "bearer", "expires_at": exp.isoformat(), "user": {"username": body.username, "is_admin": True}}

@app.get("/api/auth/verify")
async def verify(current=Depends(require_token)):
    return {"authenticated": True, "username": current["username"], "expires": current["exp"]}

@app.get("/api/settings/theme")
async def get_theme():
    data = await get_theme_settings_db()
    return {
        "current_theme": data.get("current_theme", "cosmic-purple"),
        "current_font": data.get("font", "inter"),
        "glassmorphic_opacity": float(data.get("glassmorphic_opacity", 0.2)),
        "blur_intensity": int(data.get("blur_intensity", 20)),
    }

@app.put("/api/settings/theme")
async def update_theme(body: ThemeUpdateRequest, current=Depends(require_token)):
    await set_theme_settings(body)
    return {"status": "success"}

@app.post("/api/feedback")
async def create_feedback(body: FeedbackRequest):
    await save_feedback(body)
    return {"status": "ok"}

@app.get("/api/portfolio/content")
async def portfolio_content():
    content = read_file_safe(CONTENT_FILE)
    sections: Dict[str, Dict[str, str]] = {}
    current_section = None
    for line in content.splitlines():
        line = line.strip()
        if not line:
            continue
        if line.startswith('[') and line.endswith(']'):
            current_section = line[1:-1].lower()
            sections[current_section] = {}
        elif '=' in line and current_section:
            k, v = line.split('=', 1)
            sections[current_section][k.strip()] = v.strip()
    return {"content": sections}

# Access restriction in production if access not configured
@app.middleware("http")
async def restrict_access_if_no_code(request: Request, call_next):
    if ENVIRONMENT == "production":
        access_code = await get_access_code()
        if not access_code:
            return JSONResponse(status_code=503, content={"detail": "Service unavailable: access not configured"})
    return await call_next(request)

@app.exception_handler(404)
async def not_found(request: Request, exc):
    return JSONResponse(status_code=404, content={"detail": "Endpoint not found"})

@app.exception_handler(500)
async def internal_err(request: Request, exc):
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
