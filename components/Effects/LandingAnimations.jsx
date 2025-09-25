import { useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

export default function LandingAnimations({ option = 'option1' }) {
  const { getCurrentThemeColors } = useTheme()

  useEffect(() => {
    const colors = getCurrentThemeColors()
    
    // Remove existing animation elements
    const existingElements = document.querySelectorAll('.landing-animation')
    existingElements.forEach(el => el.remove())

    // Create animation elements based on option
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
  }, [option, getCurrentThemeColors])

  const createParticleAnimation = (colors) => {
    const container = document.createElement('div')
    container.className = 'landing-animation fixed inset-0 pointer-events-none z-0'
    container.style.overflow = 'hidden'

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div')
      particle.className = 'absolute rounded-full opacity-30'
      particle.style.width = Math.random() * 4 + 2 + 'px'
      particle.style.height = particle.style.width
      particle.style.backgroundColor = [colors.primary, colors.secondary, colors.accent][Math.floor(Math.random() * 3)]
      particle.style.left = Math.random() * 100 + '%'
      particle.style.top = Math.random() * 100 + '%'
      particle.style.animation = `float ${Math.random() * 10 + 5}s ease-in-out infinite`
      particle.style.animationDelay = Math.random() * 5 + 's'
      
      container.appendChild(particle)
    }

    document.body.appendChild(container)
  }

  const create3DFloatingElements = (colors) => {
    const container = document.createElement('div')
    container.className = 'landing-animation fixed inset-0 pointer-events-none z-0'
    container.style.perspective = '1000px'

    for (let i = 0; i < 20; i++) {
      const element = document.createElement('div')
      element.className = 'absolute opacity-20'
      element.style.width = Math.random() * 20 + 10 + 'px'
      element.style.height = element.style.width
      element.style.backgroundColor = colors.primary
      element.style.left = Math.random() * 100 + '%'
      element.style.top = Math.random() * 100 + '%'
      element.style.transformStyle = 'preserve-3d'
      element.style.animation = `rotate-3d ${Math.random() * 20 + 10}s linear infinite`
      element.style.animationDelay = Math.random() * 5 + 's'
      
      container.appendChild(element)
    }

    document.body.appendChild(container)
  }

  const createGeometricShapes = (colors) => {
    const container = document.createElement('div')
    container.className = 'landing-animation fixed inset-0 pointer-events-none z-0'

    for (let i = 0; i < 15; i++) {
      const shape = document.createElement('div')
      shape.className = 'absolute border opacity-20'
      shape.style.width = Math.random() * 60 + 20 + 'px'
      shape.style.height = shape.style.width
      shape.style.borderColor = colors.secondary
      shape.style.borderWidth = '1px'
      shape.style.left = Math.random() * 100 + '%'
      shape.style.top = Math.random() * 100 + '%'
      
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
  }

  const createMatrixRain = (colors) => {
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
      
      const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      let text = ''
      for (let j = 0; j < 20; j++) {
        text += chars[Math.floor(Math.random() * chars.length)] + '<br>'
      }
      column.innerHTML = text
      
      container.appendChild(column)
    }

    document.body.appendChild(container)
  }

  const createGlassBubbles = (colors) => {
    const container = document.createElement('div')
    container.className = 'landing-animation fixed inset-0 pointer-events-none z-0'

    for (let i = 0; i < 10; i++) {
      const bubble = document.createElement('div')
      bubble.className = 'absolute rounded-full opacity-20'
      const size = Math.random() * 200 + 100
      bubble.style.width = size + 'px'
      bubble.style.height = size + 'px'
      bubble.style.background = `linear-gradient(45deg, ${colors.primary}40, ${colors.secondary}40)`
      bubble.style.backdropFilter = 'blur(10px)'
      bubble.style.border = `1px solid ${colors.accent}30`
      bubble.style.left = Math.random() * 100 + '%'
      bubble.style.top = Math.random() * 100 + '%'
      bubble.style.animation = `liquid ${Math.random() * 12 + 8}s ease-in-out infinite`
      bubble.style.animationDelay = Math.random() * 5 + 's'
      
      container.appendChild(bubble)
    }

    document.body.appendChild(container)
  }

  const startAnimationLoop = () => {
    // Animation loop for dynamic elements if needed
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    />
  )
}