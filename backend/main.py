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
        DATA_STORAGE_DIR / "access_settings.txt": "access_code=Venky@access345",
        DATA_STORAGE_DIR / "theme_settings.txt": """current_theme=cosmic_purple
current_font=inter
glassmorphic_opacity=0.2
blur_intensity=20""",
        DATA_STORAGE_DIR / "media_settings.txt": json.dumps({
            f"slot{i}": "disabled" for i in range(1, 6)
        } | {
            f"slot{i}_title": "" for i in range(1, 6)  
        } | {
            f"slot{i}_caption": "" for i in range(1, 6)
        }, indent=2),
        DATA_STORAGE_DIR / "portfolio_settings.txt": """profile_photo=enabled
resume_download=enabled
feedback_enabled=enabled
analytics_enabled=enabled
3d_effects=enabled
smooth_animations=enabled""",
        DATA_STORAGE_DIR / "landing_settings.txt": """current_landing=option1
particle_density=medium
animation_speed=normal
3d_intensity=medium
background_opacity=0.1""",
        DATA_STORAGE_DIR / "analytics.txt": """visits=0
today_visits=0
unique_visitors=0
last_reset=2025-01-01""",
        DATA_STORAGE_DIR / "feedback" / "feedback.json": "[]"
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

def parse_config_file(content: str) -> Dict[str, str]:
    """Parse key=value configuration file."""
    config = {}
    for line in content.split('\n'):
        line = line.strip()
        if '=' in line and not line.startswith('#'):
            key, value = line.split('=', 1)
            config[key.strip()] = value.strip()
    return config

def write_config_file(config: Dict[str, str]) -> str:
    """Write configuration to key=value format."""
    return '\n'.join([f"{k}={v}" for k, v in config.items()])

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
    except jwt.JWTError as e:
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

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    """Enhanced login with real-time access code validation."""
    try:
        # Read access code from file in real-time
        access_file = DATA_STORAGE_DIR / "access_settings.txt"
        if not access_file.exists():
            raise HTTPException(status_code=500, detail="Access configuration not found")
        
        config = parse_config_file(read_file_safe(access_file))
        stored_access_code = config.get("access_code", "")
        
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

@app.post("/api/auth/refresh")
async def refresh_token(current_user = Depends(verify_token)):
    """Refresh JWT token."""
    try:
        new_token, expires = create_access_token(data={"sub": current_user["username"]})
        
        await log_analytics("token_refresh", {
            "username": current_user["username"]
        })
        
        return {
            "access_token": new_token,
            "token_type": "bearer", 
            "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "expires_at": expires.isoformat()
        }
    except Exception as e:
        logger.error(f"Token refresh error: {e}")
        raise HTTPException(status_code=500, detail="Token refresh failed")

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
        config = parse_config_file(read_file_safe(theme_file))
        
        return {
            "current_theme": config.get("current_theme", "cosmic_purple"),
            "current_font": config.get("current_font", "inter"),
            "glassmorphic_opacity": float(config.get("glassmorphic_opacity", "0.2")),
            "blur_intensity": int(config.get("blur_intensity", "20"))
        }
    except Exception as e:
        logger.error(f"Theme settings error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve theme settings")

@app.put("/api/settings/theme")
async def update_theme_settings(request: ThemeUpdateRequest, current_user = Depends(verify_token)):
    """Update theme settings with validation."""
    try:
        theme_file = DATA_STORAGE_DIR / "theme_settings.txt"
        
        config = {
            "current_theme": request.theme,
            "current_font": request.font,
            "glassmorphic_opacity": str(request.glassmorphic_opacity),
            "blur_intensity": str(request.blur_intensity)
        }
        
        if write_file_safe(theme_file, write_config_file(config)):
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

@app.get("/api/media/settings")
async def get_media_settings():
    """Get media slot settings."""
    try:
        media_file = DATA_STORAGE_DIR / "media_settings.txt"
        content = read_file_safe(media_file)
        
        if not content:
            # Return default disabled settings
            return {f"slot{i}": "disabled" for i in range(1, 6)}
        
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            return parse_config_file(content)
            
    except Exception as e:
        logger.error(f"Media settings error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve media settings")

@app.post("/api/feedback")
async def submit_feedback(request: FeedbackRequest, http_request: Request):
    """Submit visitor feedback with validation."""
    try:
        # Get visitor info
        client_ip = http_request.client.host
        user_agent = http_request.headers.get("user-agent", "unknown")
        
        feedback_entry = {
            "id": str(uuid.uuid4()),
            "rating": request.rating,
            "message": request.message.strip(),
            "visitor_name": request.visitor_name.strip() if request.visitor_name else None,
            "visitor_email": request.visitor_email if request.visitor_email else None,
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "ip": client_ip,
            "user_agent": user_agent,
            "status": "new"
        }
        
        # Save feedback
        feedback_file = DATA_STORAGE_DIR / "feedback" / "feedback.json"
        feedback_file.parent.mkdir(parents=True, exist_ok=True)
        
        feedback_list = []
        if feedback_file.exists():
            async with aiofiles.open(feedback_file, 'r', encoding='utf-8') as f:
                content = await f.read()
                try:
                    feedback_list = json.loads(content) if content.strip() else []
                except json.JSONDecodeError:
                    feedback_list = []
        
        feedback_list.append(feedback_entry)
        
        # Keep only last 500 feedback entries
        feedback_list = feedback_list[-500:]
        
        async with aiofiles.open(feedback_file, 'w', encoding='utf-8') as f:
            await f.write(json.dumps(feedback_list, indent=2, ensure_ascii=False))
        
        await log_analytics("feedback_submitted", {
            "rating": request.rating,
            "has_name": bool(request.visitor_name),
            "has_email": bool(request.visitor_email)
        })
        
        return {"status": "success", "message": "Thank you for your feedback!"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Feedback submission error: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit feedback")

@app.get("/api/feedback/list")
async def get_feedback_list(current_user = Depends(verify_token)):
    """Get all feedback for admin dashboard."""
    try:
        feedback_file = DATA_STORAGE_DIR / "feedback" / "feedback.json"
        
        if not feedback_file.exists():
            return {"feedback": [], "total": 0}
        
        async with aiofiles.open(feedback_file, 'r', encoding='utf-8') as f:
            content = await f.read()
            feedback_list = json.loads(content) if content.strip() else []
        
        # Sort by timestamp (newest first)
        feedback_list.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        
        return {"feedback": feedback_list, "total": len(feedback_list)}
        
    except Exception as e:
        logger.error(f"Feedback retrieval error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve feedback")

@app.get("/api/analytics")
async def get_analytics(current_user = Depends(verify_token)):
    """Get analytics data for admin dashboard."""
    try:
        analytics_file = DATA_STORAGE_DIR / "analytics" / "visits.json"
        
        if not analytics_file.exists():
            return {
                "summary": {"visits": 0, "today_visits": 0, "unique_visitors": 0},
                "detailed_visits": []
            }
        
        async with aiofiles.open(analytics_file, 'r', encoding='utf-8') as f:
            content = await f.read()
            analytics_data = json.loads(content) if content.strip() else []
        
        # Calculate summary statistics
        today = datetime.datetime.now().date()
        today_visits = sum(1 for entry in analytics_data 
                          if entry.get("event_type") == "content_view" 
                          and datetime.datetime.fromisoformat(entry.get("timestamp", "")).date() == today)
        
        unique_ips = set(entry.get("ip") for entry in analytics_data 
                        if entry.get("event_type") == "content_view" and entry.get("ip"))
        
        summary = {
            "visits": len([e for e in analytics_data if e.get("event_type") == "content_view"]),
            "today_visits": today_visits,
            "unique_visitors": len(unique_ips),
            "last_updated": datetime.datetime.utcnow().isoformat()
        }
        
        return {
            "summary": summary,
            "detailed_visits": analytics_data[-100:]  # Last 100 entries
        }
        
    except Exception as e:
        logger.error(f"Analytics retrieval error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve analytics")

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