import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout/Layout'
import HeroSection from '../components/Portfolio/HeroSection'
import AboutSection from '../components/Portfolio/AboutSection'
import SkillsSection from '../components/Portfolio/SkillsSection'
import ExperienceSection from '../components/Portfolio/ExperienceSection'
import MediaSlots from '../components/Portfolio/MediaSlots'
import ContactSection from '../components/Portfolio/ContactSection'
import FeedbackForm from '../components/Portfolio/FeedbackForm'
import ParticleBackground from '../components/Effects/ParticleBackground'
import AnimatedElements from '../components/Effects/AnimatedElements'
import LandingAnimations from '../components/Effects/LandingAnimations'
import ThemeSelector from '../components/Admin/ThemeSelector'
import { Palette, Settings, Maximize2, Minimize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'

export default function HomePage() {
  const { 
    currentTheme, 
    currentFont, 
    currentLanding,
    changeTheme,
    getCurrentThemeColors 
  } = useTheme()
  const { isAuthenticated } = useAuth()
  
  const [portfolioData, setPortfolioData] = useState(null)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showFloatingControls, setShowFloatingControls] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPortfolioData()
  }, [])

  const loadPortfolioData = async () => {
    try {
      const response = await axios.get('/api/portfolio/content')
      setPortfolioData(response.data)
    } catch (error) {
      console.error('Failed to load portfolio data:', error)
      // Use fallback data if API fails
      setPortfolioData({
        personal_info: {
          name: 'Venkatesh',
          title: 'AUTOSAR Integration Engineer',
          location: 'Bangalore, India',
          email: 'contact@portfoliobycomet.com'
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const handleThemeChange = async (theme, font) => {
    try {
      // Update theme via API for persistence
      await axios.put('/api/settings/theme', {
        theme,
        font,
        glassmorphic_opacity: 0.2,
        blur_intensity: 20
      })
      
      // Update local theme
      changeTheme(theme, font)
    } catch (error) {
      console.error('Failed to update theme:', error)
      // Still update locally even if API fails
      changeTheme(theme, font)
    }
  }

  if (loading) {
    return (
      <Layout title="Portfolio by Comet - Loading">
        <div className={`min-h-screen bg-slate-900 flex items-center justify-center`}>
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
              scale: { duration: 1.5, repeat: Infinity },
              opacity: { duration: 2, repeat: Infinity }
            }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      </Layout>
    )
  }

  return (
    <Layout 
      title="Venkatesh - AUTOSAR Integration Engineer | Portfolio by Comet"
      description="Experienced AUTOSAR Integration Engineer specializing in BSW stacks, ECU testing, and automotive software development. View my portfolio showcasing expertise in DCM, DEM, COM, CAN modules and more."
    >
      <div className={`font-${currentFont} theme-${currentTheme}`}>
        {/* Background Effects */}
        <ParticleBackground />
        <AnimatedElements />
        <LandingAnimations option={currentLanding} />
        
        {/* Floating Controls */}
        <AnimatePresence>
          {showFloatingControls && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="floating-controls"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowThemeSelector(true)}
                className="floating-button group"
                title="Change Theme"
              >
                <Palette className="w-5 h-5" />
              </motion.button>
              
              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => window.open('/admin', '_blank')}
                  className="floating-button group"
                  title="Admin Dashboard"
                >
                  <Settings className="w-5 h-5" />
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowFloatingControls(false)}
                className="floating-button group"
                title="Hide Controls"
              >
                <Minimize2 className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Theme Selector Modal */}
        <AnimatePresence>
          {showThemeSelector && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowThemeSelector(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                <ThemeSelector
                  onThemeChange={handleThemeChange}
                  onClose={() => setShowThemeSelector(false)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-40 glassmorphic-card border-b border-white/20 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <span className="text-white font-semibold text-lg">
                  {portfolioData?.personal_info?.name || 'Venkatesh'}
                </span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:flex items-center gap-6"
              >
                {[
                  { label: 'Home', id: 'hero' },
                  { label: 'About', id: 'about' },
                  { label: 'Skills', id: 'skills' },
                  { label: 'Experience', id: 'experience' },
                  { label: 'Contact', id: 'contact' }
                ].map((item, index) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const element = document.getElementById(item.id)
                      if (element) {
                        element.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        })
                      }
                    }}
                    className="text-white hover:text-purple-400 transition-colors duration-300 text-sm font-medium"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="relative z-10 pt-20">
          <section id="hero">
            <HeroSection data={portfolioData} />
          </section>
          
          <section id="about">
            <AboutSection data={portfolioData} />
          </section>
          
          <section id="skills">
            <SkillsSection data={portfolioData} />
          </section>
          
          <section id="experience">
            <ExperienceSection data={portfolioData} />
          </section>
          
          {/* Media Slots Section */}
          <MediaSlots slots={[1, 2, 3, 4, 5]} />
          
          <section id="contact">
            <ContactSection data={portfolioData} />
          </section>
          
          {/* Feedback Section */}
          <FeedbackForm />
        </main>

        {/* Footer */}
        <footer className="py-12 bg-slate-900 border-t border-white/20">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-center md:text-left"
              >
                <p className="text-gray-300 text-sm">
                  © 2025 {portfolioData?.personal_info?.name || 'Venkatesh'}. All rights reserved.
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Built with Portfolio by Comet
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 text-xs text-gray-400"
              >
                <span>Theme: {currentTheme}</span>
                <span>•</span>
                <span>Font: {currentFont}</span>
                <span>•</span>
                <span>Landing: {currentLanding}</span>
              </motion.div>
            </div>
          </div>
        </footer>

        {/* Toast Notifications */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(107, 70, 193, 0.4)',
              backdropFilter: 'blur(20px)'
            }
          }}
        />
      </div>
    </Layout>
  )
}