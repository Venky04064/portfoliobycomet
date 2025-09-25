# 🚀 Portfolio by Comet

**Advanced Full-Stack Portfolio with 25+ Glassmorphic Themes & 3D Animations**

## ✨ Features

### 🔐 Authentication & Security
- Session management with username + access code
- Protected backend folders (data-storage, upload)
- Real-time access code updates from text files
- JWT token authentication

### 🎨 25+ Glassmorphic Themes
- **Creative (7)**: Cosmic Purple, Lavender Dream, Rose Quartz, Crimson Red, Pink Flamingo, Purple Haze, Violet Storm
- **Tech (5)**: Aurora Blue, Indigo Night, Cyan Wave, Sky Limit, Zinc Modern
- **Corporate (4)**: Forest Green, Emerald City, Slate Storm, Stone Age
- **Minimal (4)**: Ocean Teal, Mint Fresh, Teal Depths, Neutral Space
- **Vibrant (5)**: Sunset Orange, Golden Hour, Amber Glow, Lime Zest, Orange Burst

### 💫 5 Landing Page Animations
1. **Option 1**: Particles + Fade + Floating Shapes + Smooth Scroll
2. **Option 2**: 3D Elements + Parallax + Particle Interactions + Rotating Elements
3. **Option 3**: Geometric Shapes + Slide-in + Morphing Backgrounds + Interactive Elements
4. **Option 4**: Matrix Background + Typewriter + Glitch Effects + Neon Glow
5. **Option 5**: Glass Bubbles + Smooth Reveal + Liquid Animations + Interactive Panels

### 🎬 Advanced Media Management
- 5 optional media slots (video/image/gif, 200MB max)
- Auto-play videos with mute/unmute controls
- Scroll-based visibility detection
- 3D effects for enabled media slots
- Complete admin dashboard control

### 📊 Analytics & Feedback
- Visitor tracking with IP and user-agent logging
- Real-time statistics and live visitor counts
- 5-star feedback system with admin dashboard
- User behavior analysis

## 🛠️ Tech Stack

- **Backend**: FastAPI + Python
- **Frontend**: Next.js + React
- **Styling**: Tailwind CSS + Custom Glassmorphic CSS
- **Animations**: Framer Motion + CSS3D + Three.js
- **Authentication**: JWT tokens
- **Storage**: File-based (Text files)
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/Venky04064/portfoliobycomet.git
cd portfoliobycomet

# Install dependencies
npm install
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Run development servers
# Terminal 1 - Backend
cd backend
python main.py

# Terminal 2 - Frontend  
npm run dev
```

### 🌐 Access
- **Portfolio**: http://localhost:3000
- **Admin Login**: http://localhost:3000/login
- **API Docs**: http://localhost:8000/docs

### 🔑 Admin Access
- **Username**: Any username
- **Access Code**: `Venky@access345`
- **Configurable**: Edit `backend/data-storage/access_settings.txt`

## 📁 Project Structure

```
portfoliobycomet/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── data-storage/          # Protected settings
│   ├── upload/                # Protected media files
│   └── content.txt            # Portfolio content
├── components/
│   ├── Portfolio/             # Portfolio sections
│   ├── Admin/                 # Admin dashboard
│   ├── Auth/                  # Authentication
│   └── Effects/               # 3D animations
├── contexts/                  # React contexts
├── pages/                     # Next.js pages
├── styles/                    # CSS and styling
└── public/                    # Static assets
```

## 🎯 Key Features

### Portfolio Sections
- **Hero**: Profile photo with animations + dynamic content
- **About**: Professional summary + education + awards
- **Skills**: Animated skills with proficiency levels
- **Experience**: Timeline with projects + certifications
- **Contact**: Contact info + social links
- **Media**: 5 configurable media slots with 3D effects
- **Feedback**: Visitor feedback with star ratings

### Admin Dashboard
- Analytics with visitor tracking
- Theme and landing page management
- Media slot configuration
- Feedback management
- File upload capabilities

### Advanced Effects
- Dynamic particle systems
- 3D floating elements
- Glassmorphic UI components
- Smooth scroll animations
- Interactive media controls

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Environment Variables
```env
USER_ACCESS_CODE=Venky@access345
SECRET_KEY=your-jwt-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
```

## 📱 Progressive Web App

- Offline capability
- Install to home screen
- Mobile app-like experience
- Fast loading and caching

## 🎨 Customization

### Content Management
Edit `backend/content.txt` to update:
- Personal information
- Professional experience
- Skills and certifications
- Contact details

### Theme Management
Use admin dashboard or edit `backend/data-storage/theme_settings.txt`

### Media Management
Upload files to `backend/upload/` folders or use admin dashboard

## 🔒 Security Features

- Protected backend folders
- JWT authentication
- File validation (type + size)
- CORS configuration
- Input sanitization

## 📞 Support

For questions or customization needs, please open an issue.

## 📄 License

MIT License - feel free to use and customize for your own portfolio!

---

**Portfolio by Comet** - Created with ❤️ for impressive portfolio experiences.