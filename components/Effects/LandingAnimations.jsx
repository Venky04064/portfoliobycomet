import { useEffect, useRef } from 'react' // ✅ HERO FIX: Added missing useRef import
import { useTheme } from '../../contexts/ThemeContext'

export default function LandingAnimations({ option = 'option1' }) {
  const { getCurrentThemeColors } = useTheme()
  const containerRef = useRef(null) // ✅ HERO FIX: Added missing containerRef
  const animationRef = useRef(null) // ✅ HERO FIX: Animation cleanup reference

  useEffect(() => {
    const colors = getCurrentThemeColors()
    
    // ✅ HERO FIX: Enhanced cleanup
    const cleanup = () => {
      const existingElements = document.querySelectorAll('.landing-animation')
      existingElements.forEach(el => el.remove())
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
    
    cleanup() // Clean up before creating new animations

    // ✅ HERO FIX: Error handling for animation creation
    try {
      switch (option) {
        case 'option1':
          createParticleAnimation(colors)
          break
        case 'option2':
          create3DFloatingElements(colors)
          break
        case 'option3':
          createGeometricShapes(colors)
          break
        case 'option4':
          createMatrixRain(colors)
          break
        case 'option5':
          createGlassBubbles(colors)
          break
        default:
          createParticleAnimation(colors)
      }
    } catch (error) {
      console.error('Landing animation error:', error)
    }

    // ✅ HERO FIX: Return cleanup function
    return cleanup
  }, [option, getCurrentThemeColors])

  // ✅ HERO FIX: Enhanced particle animation with performance optimization
  const createParticleAnimation = (colors) => {
    const container = document.createElement('div')
    container.className = 'landing-animation fixed inset-0 pointer-events-none z-0'
    container.style.overflow = 'hidden'
    container.style.willChange = 'transform' // Performance optimization

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div')
      particle.className = 'absolute rounded-full opacity-30'
      const size = Math.random() * 4 + 2
      particle.style.width = size + 'px'
      particle.style.height = size + 'px'
      particle.style.backgroundColor = [colors.primary, colors.secondary, colors.accent][Math.floor(Math.random() * 3)]
      particle.style.left = Math.random() * 100 + '%'
      particle.style.top = Math.random() * 100 + '%'
      particle.style.animation = `float ${Math.random() * 10 + 5}s ease-in-out infinite`
      particle.style.animationDelay = Math.random() * 5 + 's'
      particle.style.willChange = 'transform' // Performance optimization
      
      container.appendChild(particle)
    }

    document.body.appendChild(container)
  }

  // ✅ HERO FIX: Enhanced 3D floating elements with error handling
  const create3DFloatingElements = (colors) => {
    try {
      const container = document.createElement('div')
      container.className = 'landing-animation fixed inset-0 pointer-events-none z-0'
      container.style.perspective = '1000px'
      container.style.transformStyle = 'preserve-3d'

      for (let i = 0; i < 20; i++) {
        const element = document.createElement('div')
        element.className = 'absolute opacity-20'
        const size = Math.random() * 20 + 10
        element.style.width = size + 'px'
        element.style.height = size + 'px'
        element.style.backgroundColor = colors.primary
        element.style.left = Math.random() * 100 + '%'
        element.style.top = Math.random() * 100 + '%'
        element.style.transformStyle = 'preserve-3d'
        element.style.animation = `rotate-3d ${Math.random() * 20 + 10}s linear infinite`
        element.style.animationDelay = Math.random() * 5 + 's'
        element.style.willChange = 'transform'
        
        container.appendChild(element)
      }

      document.body.appendChild(container)
    } catch (error) {
      console.error('3D elements creation failed:', error)
    }
  }

  // ✅ HERO FIX: Enhanced geometric shapes with validation
  const createGeometricShapes = (colors) => {
    try {
      const container = document.createElement('div')
      container.className = 'landing-animation fixed inset-0 pointer-events-none z-0'

      for (let i = 0; i < 15; i++) {
        const shape = document.createElement('div')
        shape.className = 'absolute border opacity-20'
        const size = Math.random() * 60 + 20
        shape.style.width = size + 'px'
        shape.style.height = size + 'px'
        shape.style.borderColor = colors.secondary
        shape.style.borderWidth = '1px'
        shape.style.left = Math.random() * 100 + '%'
        shape.style.top = Math.random() * 100 + '%'
        shape.style.willChange = 'transform'
        
        if (Math.random() > 0.5) {
          shape.style.borderRadius = '50%'
        } else {
          shape.style.transform = 'rotate(45deg)'
        }
        
        shape.style.animation = `morphing ${Math.random() * 15 + 10}s ease-in-out infinite`
        shape.style.animationDelay = Math.random() * 5 + 's'
        
        container.appendChild(shape)
      }

      document.body.appendChild(container)
    } catch (error) {
      console.error('Geometric shapes creation failed:', error)
    }
  }

  // ✅ HERO FIX: Enhanced matrix rain with performance optimization
  const createMatrixRain = (colors) => {
    try {
      const container = document.createElement('div')
      container.className = 'landing-animation fixed inset-0 pointer-events-none z-0'
      container.style.overflow = 'hidden'

      for (let i = 0; i < 20; i++) {
        const column = document.createElement('div')
        column.className = 'absolute font-mono text-sm opacity-30'
        column.style.color = colors.primary
        column.style.left = Math.random() * 100 + '%'
        column.style.top = '-100vh'
        column.style.textShadow = `0 0 10px ${colors.primary}`
        column.style.animation = `matrix ${Math.random() * 10 + 15}s linear infinite`
        column.style.animationDelay = Math.random() * 5 + 's'
        column.style.willChange = 'transform'
        
        const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ🦸‍♂️⚡🚀✨'
        let text = ''
        for (let j = 0; j < 20; j++) {
          text += chars[Math.floor(Math.random() * chars.length)] + '<br>'
        }
        column.innerHTML = text
        
        container.appendChild(column)
      }

      document.body.appendChild(container)
    } catch (error) {
      console.error('Matrix rain creation failed:', error)
    }
  }

  // ✅ HERO FIX: Enhanced glass bubbles with better effects
  const createGlassBubbles = (colors) => {
    try {
      const container = document.createElement('div')
      container.className = 'landing-animation fixed inset-0 pointer-events-none z-0'

      for (let i = 0; i < 10; i++) {
        const bubble = document.createElement('div')
        bubble.className = 'absolute rounded-full opacity-20'
        const size = Math.random() * 200 + 100
        bubble.style.width = size + 'px'
        bubble.style.height = size + 'px'
        bubble.style.background = `linear-gradient(45deg, ${colors.primary}40, ${colors.secondary}40)`
        bubble.style.backdropFilter = 'blur(15px)'
        bubble.style.border = `1px solid ${colors.accent}30`
        bubble.style.left = Math.random() * 100 + '%'
        bubble.style.top = Math.random() * 100 + '%'
        bubble.style.animation = `liquid ${Math.random() * 12 + 8}s ease-in-out infinite`
        bubble.style.animationDelay = Math.random() * 5 + 's'
        bubble.style.willChange = 'transform'
        
        container.appendChild(bubble)
      }

      document.body.appendChild(container)
    } catch (error) {
      console.error('Glass bubbles creation failed:', error)
    }
  }

  // ✅ HERO FIX: Return the container reference for proper cleanup
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        willChange: 'transform' // Performance optimization
      }}
    />
  )
}