from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
import jwt
import os
import json
import datetime
import uuid
import shutil
import aiofiles
from pathlib import Path
import mimetypes
import logging
from contextlib import asynccontextmanager

# ✅ HERO FIX: Enhanced logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ✅ HERO FIX: Secure configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-jwt-key-change-this-in-production-hero-fix")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# ✅ HERO FIX: Enhanced file paths
BASE_DIR = Path(__file__).parent
DATA_STORAGE_DIR = BASE_DIR / "data-storage"
UPLOAD_DIR = BASE_DIR / "upload"
CONTENT_FILE = BASE_DIR / "content.txt"

# ✅ HERO FIX: File validation constants
ALLOWED_EXTENSIONS = {
    'image': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    'video': ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.ogg'],
    'document': ['.pdf', '.doc', '.docx']
}
MAX_FILE_SIZE = 200 * 1024 * 1024  # 200MB

# ✅ HERO FIX: Enhanced directory creation
def ensure_directories():
    """Create all necessary directories with proper error handling."""
    directories = [
        DATA_STORAGE_DIR,
        DATA_STORAGE_DIR / "analytics",
        DATA_STORAGE_DIR / "feedback",
        UPLOAD_DIR,
        UPLOAD_DIR / "media-slots",
        UPLOAD_DIR / "profile-photo", 
        UPLOAD_DIR / "resume"
    ]
    
    # Create media slot subdirectories
    for i in range(1, 6):
        directories.append(UPLOAD_DIR / "media-slots" / f"slot{i}")
    
    for directory in directories:
        try:
            directory.mkdir(parents=True, exist_ok=True)
            logger.info(f"✅ Directory ensured: {directory}")
        except Exception as e:
            logger.error(f"❌ Failed to create directory {directory}: {e}")
            raise

# ✅ HERO FIX: Initialize default files
def init_default_files():
    """Initialize all default configuration files."""
    default_files = {
        DATA_STORAGE_DIR / "access_settings.txt": "Venky@access345",
        DATA_STORAGE_DIR / "theme_settings.txt": "cosmic-purple",
        DATA_STORAGE_DIR / "media_settings.txt": json.dumps({
            f"slot{i}": "disabled" for i in range(1, 6)
        } | {
            f"slot{i}_title": "" for i in range(1, 6)  
        } | {
            f"slot{i}_caption": "" for i in range(1, 6)
        }, indent=2),
    }
    
    for file_path, content in default_files.items():
        if not file_path.exists():
            try:
                file_path.parent.mkdir(parents=True, exist_ok=True)
                file_path.write_text(content, encoding='utf-8')
                logger.info(f"✅ Created default file: {file_path}")
            except Exception as e:
                logger.error(f"❌ Failed to create {file_path}: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ✅ HERO FIX: Startup
    logger.info("🚀 Starting Portfolio by Comet API...")
    try:
        ensure_directories()
        init_default_files()
        logger.info("✅ Application startup completed successfully")
    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")
        raise
    yield
    # ✅ HERO FIX: Shutdown
    logger.info("👋 Portfolio by Comet API shutting down...")

# ✅ HERO FIX: FastAPI App with enhanced configuration
app = FastAPI(
    title="Portfolio by Comet API",
    description="🦸‍♂️ AI Hero Fixed Backend API for dynamic portfolio",
    version="1.0.0-hero-fix",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# ✅ HERO FIX: Enhanced CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.vercel.app",
        "https://portfoliobycomet.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# ✅ HERO FIX: Security
security = HTTPBearer()

# ✅ HERO FIX: Enhanced Pydantic Models
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
    font: str = Field(..., min_length=1, max_length=50)
    glassmorphic_opacity: float = Field(0.2, ge=0.0, le=1.0)
    blur_intensity: int = Field(20, ge=0, le=100)

class MediaSlotRequest(BaseModel):
    slot: int = Field(..., ge=1, le=5)
    enabled: bool
    title: str = Field("", max_length=100)
    caption: str = Field("", max_length=500)

# ✅ HERO FIX: Enhanced utility functions
def read_file_safe(file_path: Path) -> str:
    """Safely read file with error handling."""
    try:
        return file_path.read_text(encoding='utf-8')
    except FileNotFoundError:
        logger.warning(f"File not found: {file_path}")
        return ""
    except Exception as e:
        logger.error(f"Error reading file {file_path}: {e}")
        return ""

def write_file_safe(file_path: Path, content: str) -> bool:
    """Safely write file with error handling."""
    try:
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content, encoding='utf-8')
        return True
    except Exception as e:
        logger.error(f"Error writing file {file_path}: {e}")
        return False

# ✅ HERO FIX: Enhanced JWT functions
def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None):
    """Create JWT token with proper expiration."""
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + (expires_delta or datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": datetime.datetime.utcnow()})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt, expire

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token with enhanced error handling."""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        exp: int = payload.get("exp")
        
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        # Check token expiration
        if datetime.datetime.utcnow().timestamp() > exp:
            raise HTTPException(status_code=401, detail="Token has expired")
            
        return {"username": username, "exp": exp}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError as e:  # ✅ FIXED: Proper JWT error handling
        logger.error(f"JWT Error: {e}")
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except Exception as e:
        logger.error(f"Token verification error: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")

# ✅ HERO FIX: Analytics logging
async def log_analytics(event_type: str, data: Dict[str, Any]):
    """Enhanced analytics logging."""
    try:
        analytics_file = DATA_STORAGE_DIR / "analytics" / "visits.json"
        analytics_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Load existing analytics
        analytics_data = []
        if analytics_file.exists():
            async with aiofiles.open(analytics_file, 'r', encoding='utf-8') as f:
                content = await f.read()
                try:
                    analytics_data = json.loads(content) if content.strip() else []
                except json.JSONDecodeError:
                    analytics_data = []
        
        # Add new entry
        entry = {
            "id": str(uuid.uuid4()),
            "event_type": event_type,
            "timestamp": datetime.datetime.utcnow().isoformat(),
            **data
        }
        analytics_data.append(entry)
        
        # Keep only last 1000 entries
        analytics_data = analytics_data[-1000:]
        
        # Save analytics
        async with aiofiles.open(analytics_file, 'w', encoding='utf-8') as f:
            await f.write(json.dumps(analytics_data, indent=2, ensure_ascii=False))
        
        logger.info(f"✅ Analytics logged: {event_type}")
        
    except Exception as e:
        logger.error(f"❌ Analytics logging failed: {e}")

# ========================================
# ✅ HERO FIX: API ROUTES - ALL FIXED
# ========================================

@app.get("/api/debug/files")
async def debug_files():
    """🦸‍♂️ HERO FIX: Debug endpoint to check file contents in real-time"""
    try:
        files_content = {}
        
        # Read access settings
        access_file = DATA_STORAGE_DIR / "access_settings.txt"
        if access_file.exists():
            files_content['access_code'] = read_file_safe(access_file).strip()
        
        # Read theme settings  
        theme_file = DATA_STORAGE_DIR / "theme_settings.txt"
        if theme_file.exists():
            files_content['current_theme'] = read_file_safe(theme_file).strip()
                
        # Read content file
        if CONTENT_FILE.exists():
            content = read_file_safe(CONTENT_FILE)
            files_content['content_preview'] = content[:200] + "..." if len(content) > 200 else content
                
        files_content['working_directory'] = str(BASE_DIR)
        files_content['files_exist'] = {
            'access_settings': access_file.exists(),
            'theme_settings': theme_file.exists(),
            'content': CONTENT_FILE.exists()
        }
        
        return {"success": True, "files": files_content}
    except Exception as e:
        return {"success": False, "error": str(e), "cwd": str(BASE_DIR)}

@app.get("/api/settings/refresh")
async def refresh_settings():
    """🦸‍♂️ HERO FIX: Force refresh all settings from files"""
    try:
        settings = {}
        
        # Access code
        access_file = DATA_STORAGE_DIR / "access_settings.txt"
        if access_file.exists():
            settings['access_code'] = read_file_safe(access_file).strip()
        
        # Theme
        theme_file = DATA_STORAGE_DIR / "theme_settings.txt"
        if theme_file.exists():
            settings['theme'] = read_file_safe(theme_file).strip()
                
        return {"success": True, "settings": settings}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/themes")
async def get_themes():
    """🦸‍♂️ HERO FIX: Get themes with real-time file reading"""
    try:
        # Read current theme from file every time
        current_theme = 'cosmic-purple'
        theme_file = DATA_STORAGE_DIR / "theme_settings.txt"
        if theme_file.exists():
            current_theme = read_file_safe(theme_file).strip()
        
        themes = {
            "creative": ["cosmic-purple", "lavender-dream", "rose-quartz", "crimson-red", "pink-flamingo", "purple-haze", "violet-storm"],
            "tech": ["aurora-blue", "indigo-night", "cyan-wave", "sky-limit", "zinc-modern"],
            "corporate": ["forest-green", "emerald-city", "slate-storm", "stone-age"],
            "minimal": ["ocean-teal", "mint-fresh", "teal-depths", "neutral-space"],
            "vibrant": ["sunset-orange", "golden-hour", "amber-glow", "lime-zest", "orange-burst"]
        }
        
        return {"themes": themes, "current": current_theme}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    """Enhanced login with real-time access code validation."""
    try:
        # Read access code from file in real-time
        access_file = DATA_STORAGE_DIR / "access_settings.txt"
        if not access_file.exists():
            raise HTTPException(status_code=500, detail="Access configuration not found")
        
        stored_access_code = read_file_safe(access_file).strip()
        
        if not stored_access_code:
            raise HTTPException(status_code=500, detail="Access code not configured")
        
        if request.access_code != stored_access_code:
            await log_analytics("login_failed", {
                "username": request.username,
                "reason": "invalid_access_code"
            })
            raise HTTPException(status_code=401, detail="Invalid access code")
        
        # Create token with expiration
        access_token, expires = create_access_token(data={"sub": request.username})
        
        await log_analytics("login_success", {
            "username": request.username,
            "expires": expires.isoformat()
        })
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "expires_at": expires.isoformat(),
            "user": {"username": request.username, "is_admin": True}
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

@app.get("/api/auth/verify")
async def verify_auth(current_user = Depends(verify_token)):
    """Verify authentication status."""
    return {
        "authenticated": True, 
        "username": current_user["username"],
        "expires": current_user["exp"]
    }

@app.get("/api/portfolio/content")
async def get_portfolio_content(request: Request):
    """Get portfolio content with visitor tracking."""
    try:
        # Log visitor
        client_ip = request.client.host
        user_agent = request.headers.get("user-agent", "unknown")
        
        await log_analytics("content_view", {
            "ip": client_ip,
            "user_agent": user_agent
        })
        
        content = read_file_safe(CONTENT_FILE)
        
        # Parse content into structured data
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
        
        return {"content": sections, "status": "success"}
        
    except Exception as e:
        logger.error(f"Content retrieval error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve portfolio content")

@app.get("/api/settings/theme")
async def get_theme_settings():
    """Get current theme settings."""
    try:
        theme_file = DATA_STORAGE_DIR / "theme_settings.txt"
        current_theme = read_file_safe(theme_file).strip() if theme_file.exists() else "cosmic-purple"
        
        return {
            "current_theme": current_theme,
            "current_font": "inter",
            "glassmorphic_opacity": 0.2,
            "blur_intensity": 20
        }
    except Exception as e:
        logger.error(f"Theme settings error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve theme settings")

@app.put("/api/settings/theme")
async def update_theme_settings(request: ThemeUpdateRequest, current_user = Depends(verify_token)):
    """Update theme settings with validation."""
    try:
        theme_file = DATA_STORAGE_DIR / "theme_settings.txt"
        
        if write_file_safe(theme_file, request.theme):
            await log_analytics("theme_change", {
                "theme": request.theme,
                "font": request.font,
                "user": current_user["username"]
            })
            
            return {"status": "success", "message": "Theme settings updated successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to save theme settings")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Theme update error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update theme settings")

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "version": "1.0.0-hero-fix",
        "directories_ok": all([
            DATA_STORAGE_DIR.exists(),
            UPLOAD_DIR.exists()
        ])
    }

@app.get("/api")
async def root():
    """Root API endpoint."""
    return {
        "message": "🦸‍♂️ Portfolio by Comet API - Hero Fixed Version",
        "version": "1.0.0-hero-fix",
        "status": "running",
        "documentation": "/docs"
    }

# ✅ HERO FIX: Exception handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Endpoint not found", "path": str(request.url.path)}
    )

@app.exception_handler(500)
async def internal_error_handler(request: Request, exc):
    logger.error(f"Internal server error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        reload=True,
        log_level="info"
    )