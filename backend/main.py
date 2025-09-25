from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import jwt
import os
import json
import datetime
import uuid
import shutil
from pathlib import Path
import mimetypes
from contextlib import asynccontextmanager

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-jwt-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# File paths
BASE_DIR = Path(__file__).parent
DATA_STORAGE_DIR = BASE_DIR / "data-storage"
UPLOAD_DIR = BASE_DIR / "upload"
CONTENT_FILE = BASE_DIR / "content.txt"

# Ensure directories exist
DATA_STORAGE_DIR.mkdir(exist_ok=True)
UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "media-slots").mkdir(exist_ok=True)
(UPLOAD_DIR / "profile-photo").mkdir(exist_ok=True)
(UPLOAD_DIR / "resume").mkdir(exist_ok=True)

# Create subdirectories for media slots
for i in range(1, 6):
    (UPLOAD_DIR / "media-slots" / f"slot{i}").mkdir(exist_ok=True)

# Initialize default files
def init_default_files():
    # Access settings
    access_file = DATA_STORAGE_DIR / "access_settings.txt"
    if not access_file.exists():
        access_file.write_text("access_code=Venky@access345")

    # Theme settings
    theme_file = DATA_STORAGE_DIR / "theme_settings.txt"
    if not theme_file.exists():
        theme_file.write_text("""current_theme=cosmic_purple
current_font=inter
glassmorphic_opacity=0.2
blur_intensity=20""")

    # Media settings
    media_file = DATA_STORAGE_DIR / "media_settings.txt"
    if not media_file.exists():
        content = ""
        for i in range(1, 6):
            content += f"""slot{i}=disabled
slot{i}_title=
slot{i}_caption=
"""
        media_file.write_text(content.strip())

    # Portfolio settings
    portfolio_file = DATA_STORAGE_DIR / "portfolio_settings.txt"
    if not portfolio_file.exists():
        portfolio_file.write_text("""profile_photo=enabled
resume_download=enabled
feedback_enabled=enabled
analytics_enabled=enabled
3d_effects=enabled
smooth_animations=enabled""")

    # Landing settings
    landing_file = DATA_STORAGE_DIR / "landing_settings.txt"
    if not landing_file.exists():
        landing_file.write_text("""current_landing=option1
particle_density=medium
animation_speed=normal
3d_intensity=medium
background_opacity=0.1""")

    # Analytics
    analytics_file = DATA_STORAGE_DIR / "analytics.txt"
    if not analytics_file.exists():
        analytics_file.write_text("""visits=0
today_visits=0
unique_visitors=0
last_reset=2025-01-01""")

    # Feedback
    feedback_file = DATA_STORAGE_DIR / "feedback.txt"
    if not feedback_file.exists():
        feedback_file.write_text("[]")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_default_files()
    yield
    # Shutdown

# FastAPI App
app = FastAPI(
    title="Portfolio by Comet API",
    description="Backend API for dynamic portfolio with glassmorphic themes",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Pydantic Models
class LoginRequest(BaseModel):
    username: str
    access_code: str

class FeedbackRequest(BaseModel):
    rating: int
    message: str
    visitor_name: Optional[str] = None
    visitor_email: Optional[str] = None

class ThemeUpdateRequest(BaseModel):
    theme: str
    font: str
    glassmorphic_opacity: float
    blur_intensity: int

class MediaSlotRequest(BaseModel):
    slot: int
    enabled: bool
    title: str
    caption: str

# Utility Functions
def read_file(file_path: Path) -> str:
    try:
        return file_path.read_text()
    except FileNotFoundError:
        return ""

def write_file(file_path: Path, content: str):
    file_path.write_text(content)

def parse_config_file(content: str) -> Dict[str, str]:
    config = {}
    for line in content.split('\n'):
        if '=' in line:
            key, value = line.split('=', 1)
            config[key.strip()] = value.strip()
    return config

def write_config_file(config: Dict[str, str]) -> str:
    return '\n'.join([f"{k}={v}" for k, v in config.items()])

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication")
        return username
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication")

# Authentication Routes
@app.post("/api/auth/login")
async def login(request: LoginRequest):
    try:
        # Read access code from file
        access_file = DATA_STORAGE_DIR / "access_settings.txt"
        config = parse_config_file(read_file(access_file))
        stored_access_code = config.get("access_code", "")
        
        if request.access_code != stored_access_code:
            raise HTTPException(status_code=401, detail="Invalid access code")
        
        # Create token
        access_token = create_access_token(data={"sub": request.username})
        
        return {"access_token": access_token, "token_type": "bearer"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/auth/verify")
async def verify_auth(username: str = Depends(verify_token)):
    return {"username": username, "authenticated": True}

# Portfolio Content Routes
@app.get("/api/portfolio/content")
async def get_portfolio_content():
    try:
        content = read_file(CONTENT_FILE)
        
        # Parse content.txt into structured data
        sections = {}
        current_section = None
        
        for line in content.split('\n'):
            line = line.strip()
            if line.startswith('[') and line.endswith(']'):
                current_section = line[1:-1].lower()
                sections[current_section] = {}
            elif '=' in line and current_section:
                key, value = line.split('=', 1)
                sections[current_section][key.strip()] = value.strip()
        
        return sections
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Theme Management Routes
@app.get("/api/settings/theme")
async def get_theme_settings():
    try:
        theme_file = DATA_STORAGE_DIR / "theme_settings.txt"
        return parse_config_file(read_file(theme_file))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/settings/theme")
async def update_theme_settings(request: ThemeUpdateRequest):
    try:
        theme_file = DATA_STORAGE_DIR / "theme_settings.txt"
        config = {
            "current_theme": request.theme,
            "current_font": request.font,
            "glassmorphic_opacity": str(request.glassmorphic_opacity),
            "blur_intensity": str(request.blur_intensity)
        }
        write_file(theme_file, write_config_file(config))
        return {"status": "success", "message": "Theme settings updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Media Management Routes
@app.get("/api/media/settings")
async def get_media_settings():
    try:
        media_file = DATA_STORAGE_DIR / "media_settings.txt"
        return parse_config_file(read_file(media_file))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/media/slot")
async def update_media_slot(request: MediaSlotRequest, username: str = Depends(verify_token)):
    try:
        media_file = DATA_STORAGE_DIR / "media_settings.txt"
        config = parse_config_file(read_file(media_file))
        
        config[f"slot{request.slot}"] = "enabled" if request.enabled else "disabled"
        config[f"slot{request.slot}_title"] = request.title
        config[f"slot{request.slot}_caption"] = request.caption
        
        write_file(media_file, write_config_file(config))
        return {"status": "success", "message": f"Media slot {request.slot} updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Feedback Routes
@app.post("/api/feedback")
async def submit_feedback(request: FeedbackRequest):
    try:
        feedback_file = DATA_STORAGE_DIR / "feedback.txt"
        
        # Load existing feedback
        try:
            feedback_list = json.loads(read_file(feedback_file))
        except:
            feedback_list = []
        
        # Add new feedback
        new_feedback = {
            "id": str(uuid.uuid4()),
            "rating": request.rating,
            "message": request.message,
            "visitor_name": request.visitor_name,
            "visitor_email": request.visitor_email,
            "timestamp": datetime.datetime.now().isoformat()
        }
        
        feedback_list.append(new_feedback)
        
        # Save feedback
        write_file(feedback_file, json.dumps(feedback_list, indent=2))
        
        return {"status": "success", "message": "Feedback submitted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/feedback/list")
async def get_feedback_list(username: str = Depends(verify_token)):
    try:
        feedback_file = DATA_STORAGE_DIR / "feedback.txt"
        
        try:
            feedback_list = json.loads(read_file(feedback_file))
        except:
            feedback_list = []
        
        return {"feedback": feedback_list}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Analytics Routes
@app.get("/api/analytics")
async def get_analytics(username: str = Depends(verify_token)):
    try:
        analytics_file = DATA_STORAGE_DIR / "analytics.txt"
        config = parse_config_file(read_file(analytics_file))
        
        # Basic analytics summary
        summary = {
            "visits": int(config.get("visits", "0")),
            "today_visits": int(config.get("today_visits", "0")),
            "unique_visitors": int(config.get("unique_visitors", "0")),
            "last_reset": config.get("last_reset", "")
        }
        
        return {
            "summary": summary,
            "detailed_visits": []
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health Check
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.datetime.now().isoformat(),
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/api")
async def root():
    return {
        "message": "Portfolio by Comet API",
        "version": "1.0.0",
        "status": "running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)