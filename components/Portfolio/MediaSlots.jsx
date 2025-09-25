import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react'
import axios from 'axios'

export default function MediaSlots({ slots = [1, 2, 3, 4, 5] }) {
  const { getCurrentThemeColors } = useTheme()
  const colors = getCurrentThemeColors()
  const [mediaSettings, setMediaSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const videoRefs = useRef({})

  useEffect(() => {
    loadMediaData()
  }, [])

  const loadMediaData = async () => {
    try {
      const response = await axios.get('/api/media/settings')
      setMediaSettings(response.data)
    } catch (error) {
      console.error('Failed to load media data:', error)
    } finally {
      setLoading(false)
    }
  }

  const MediaSlotComponent = ({ slotNumber }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { threshold: 0.3 })
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [showControls, setShowControls] = useState(false)

    const isEnabled = mediaSettings[`slot${slotNumber}`] === 'enabled'
    const title = mediaSettings[`slot${slotNumber}_title`] || `Media Slot ${slotNumber}`
    const caption = mediaSettings[`slot${slotNumber}_caption`] || ''

    if (!isEnabled) return null

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: slotNumber * 0.1 }}
        viewport={{ once: true }}
        className="media-slot-3d group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <div className="glassmorphic-card rounded-2xl overflow-hidden relative">
          {/* 3D Background Effect */}
          <div 
            className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`
            }}
          />
          
          {/* Media Content */}
          <div className="media-content relative">
            {/* Placeholder for media - in real implementation, this would show actual media */}
            <div 
              className="w-full h-64 flex items-center justify-center text-white"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}40, ${colors.secondary}40)`
              }}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">🎬</div>
                <p className="font-semibold">Media Slot {slotNumber}</p>
                <p className="text-sm opacity-75">Upload media in admin dashboard</p>
              </div>
            </div>
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            {title && (
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            )}
            {caption && (
              <p className="text-gray-300 text-sm">{caption}</p>
            )}
          </div>

          {/* 3D Floating Elements */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full opacity-40"
              style={{
                backgroundColor: colors.accent,
                top: '20%',
                left: '20%'
              }}
              animate={{
                x: [0, Math.cos((i * Math.PI * 2) / 3) * 30, 0],
                y: [0, Math.sin((i * Math.PI * 2) / 3) * 30, 0],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-t-transparent rounded-full"
              style={{ borderColor: colors.primary }}
            />
          </div>
        </div>
      </section>
    )
  }

  // Check if any slots are enabled
  const enabledSlots = slots.filter(slot => 
    mediaSettings[`slot${slot}`] === 'enabled'
  )

  if (enabledSlots.length === 0) {
    return null
  }

  return (
    <section 
      className="py-20"
      style={{
        backgroundColor: `${colors.surface}30`
      }}
    >
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Featured <span style={{ color: colors.primary }}>Media</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Explore multimedia content showcasing projects, demonstrations, and visual experiences
          </p>
        </motion.div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enabledSlots.map((slotNumber) => (
            <MediaSlotComponent key={slotNumber} slotNumber={slotNumber} />
          ))}
        </div>
      </div>
    </section>
  )
}