import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { Download, MapPin, Mail, ChevronDown } from 'lucide-react'
import Image from 'next/image'

export default function HeroSection({ data }) {
  const { currentTheme, getCurrentThemeColors } = useTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)

  const personalInfo = data?.personal_info || {}
  const heroData = data?.hero || {}

  const name = personalInfo.name || 'Venkatesh'
  const title = personalInfo.title || 'AUTOSAR Integration Engineer'
  const location = personalInfo.location || 'Bangalore, India'
  const email = personalInfo.email || 'contact@portfoliobycomet.com'
  const headline = heroData.headline || 'Experienced AUTOSAR Integration Engineer'
  const description = heroData.description || 'Proven expertise in configuring and validating BSW stacks'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  const colors = getCurrentThemeColors()

  return (
    <section 
      ref={ref}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.surface} 100%)`
      }}
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: Math.random() * 200 + 50 + 'px',
              height: Math.random() * 200 + 50 + 'px',
              background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 1.5
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Content Side */}
          <div className="text-center lg:text-left space-y-8">
            {/* Name & Title */}
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.h1 
                className="text-5xl lg:text-7xl font-bold text-white leading-tight"
                style={{ textShadow: `0 0 30px ${colors.primary}40` }}
              >
                {name.split(' ').map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.2 }}
                    className={index === 0 ? 'text-white' : 'block'}
                    style={{ color: index > 0 ? colors.primary : 'white' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>
              
              <motion.h2 
                className="text-xl lg:text-2xl font-medium"
                style={{ color: colors.secondary }}
              >
                {title}
              </motion.h2>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants}>
              <p className="text-gray-300 text-lg lg:text-xl leading-relaxed max-w-2xl">
                {description}
              </p>
            </motion.div>

            {/* Quick Info */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-gray-300"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" style={{ color: colors.accent }} />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" style={{ color: colors.accent }} />
                <span>{email}</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full font-semibold text-white shadow-xl transition-all duration-300"
                style={{
                  background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                  boxShadow: `0 10px 30px ${colors.primary}40`
                }}
              >
                <Download className="w-5 h-5 inline mr-2" />
                Download Resume
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full font-semibold text-white border-2 transition-all duration-300 glassmorphic"
                style={{
                  borderColor: colors.primary,
                  color: colors.primary
                }}
                onClick={() => {
                  const contactSection = document.getElementById('contact')
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                Get In Touch
              </motion.button>
            </motion.div>
          </div>

          {/* Profile Photo Side */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center relative"
          >
            <div className="relative group">
              {/* Animated Rings Behind Photo */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 opacity-30"
                  style={{
                    borderColor: [colors.primary, colors.secondary, colors.accent][i],
                    width: `${320 + i * 40}px`,
                    height: `${320 + i * 40}px`,
                    left: `${-20 * (i + 1)}px`,
                    top: `${-20 * (i + 1)}px`
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 10 + i * 5,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              ))}
              
              {/* Profile Photo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-80 h-80 rounded-full overflow-hidden cursor-pointer glassmorphic-strong"
                onClick={() => setShowImageModal(true)}
              >
                {/* Placeholder or actual profile photo */}
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-6xl font-bold">
                  {name.charAt(0).toUpperCase()}
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium">Click to enlarge</span>
                </div>
              </motion.div>
              
              {/* Floating Elements Around Photo */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full opacity-60"
                  style={{
                    backgroundColor: colors.accent,
                    left: `${50 + Math.cos((i * Math.PI * 2) / 6) * 200}px`,
                    top: `${50 + Math.sin((i * Math.PI * 2) / 6) * 200}px`
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.6, 1, 0.6],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-400 cursor-pointer"
            onClick={() => {
              const aboutSection = document.getElementById('about')
              if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          >
            <span className="text-sm">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>

        {/* Image Modal */}
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowImageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-96 h-96 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-8xl font-bold">
                {name.charAt(0).toUpperCase()}
              </div>
              
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}