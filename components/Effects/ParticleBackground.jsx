import { useEffect, useRef } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

export default function ParticleBackground() {
  const canvasRef = useRef(null)
  const { getCurrentThemeColors } = useTheme()
  const animationRef = useRef()
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const colors = getCurrentThemeColors()
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particle class
    class Particle {
      constructor() {
        this.reset()
        this.y = Math.random() * canvas.height
      }
      
      reset() {
        this.x = Math.random() * canvas.width
        this.y = -10
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = Math.random() * 0.5 + 0.2
        this.opacity = Math.random() * 0.8 + 0.2
        this.color = [colors.primary, colors.secondary, colors.accent][Math.floor(Math.random() * 3)]
      }
      
      update() {
        this.x += this.speedX
        this.y += this.speedY
        
        if (this.y > canvas.height + 10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset()
        }
      }
      
      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Add glow effect
        ctx.shadowColor = this.color
        ctx.shadowBlur = this.size * 2
        ctx.fill()
        
        ctx.restore()
      }
    }

    // Create particles
    const createParticles = () => {
      particlesRef.current = []
      const particleCount = Math.min(100, Math.floor(canvas.width * canvas.height / 8000))
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(new Particle())
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Create connected lines between nearby particles
      particlesRef.current.forEach((particle, i) => {
        particle.update()
        particle.draw()
        
        // Connect nearby particles
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const other = particlesRef.current[j]
          const dx = particle.x - other.x
          const dy = particle.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 100) {
            ctx.save()
            ctx.globalAlpha = (100 - distance) / 100 * 0.3
            ctx.strokeStyle = colors.primary
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.stroke()
            ctx.restore()
          }
        }
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }

    createParticles()
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [getCurrentThemeColors])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}