import { useEffect, useRef } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

export default function AnimatedElements() {
  const { getCurrentThemeColors } = useTheme()
  const containerRef = useRef(null)
  const elementsRef = useRef([])

  useEffect(() => {
    const colors = getCurrentThemeColors()
    
    if (containerRef.current) {
      containerRef.current.innerHTML = ''
    }
    elementsRef.current = []

    createFloatingElements(colors)
    create3DShapes(colors)
    createLiquidEffects(colors)
    
    startAnimationLoop()

    return () => {
      elementsRef.current = []
    }
  }, [getCurrentThemeColors])

  const createFloatingElements = (colors) => {
    if (!containerRef.current) return

    for (let i = 0; i < 12; i++) {
      const element = document.createElement('div')
      element.className = 'floating-element absolute pointer-events-none'
      
      const size = Math.random() * 40 + 20
      element.style.width = size + 'px'
      element.style.height = size + 'px'
      element.style.left = Math.random() * 100 + '%'
      element.style.top = Math.random() * 100 + '%'
      
      element.style.background = `linear-gradient(45deg, ${colors.primary}40, ${colors.secondary}40)`
      element.style.backdropFilter = 'blur(10px)'
      element.style.border = `1px solid ${colors.accent}30`
      element.style.borderRadius = Math.random() > 0.5 ? '50%' : '8px'
      element.style.opacity = '0.6'
      element.style.transformStyle = 'preserve-3d'
      
      containerRef.current.appendChild(element)
      elementsRef.current.push({
        element,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotationX: Math.random() * 360,
        rotationY: Math.random() * 360,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        rotationSpeedX: (Math.random() - 0.5) * 2,
        rotationSpeedY: (Math.random() - 0.5) * 2,
        type: 'floating'
      })
    }
  }

  const create3DShapes = (colors) => {
    if (!containerRef.current) return

    for (let i = 0; i < 8; i++) {
      const element = document.createElement('div')
      element.className = 'shape-3d absolute pointer-events-none'
      
      const size = Math.random() * 60 + 30
      element.style.width = size + 'px'
      element.style.height = size + 'px'
      element.style.left = Math.random() * 100 + '%'
      element.style.top = Math.random() * 100 + '%'
      
      const shapeType = Math.floor(Math.random() * 3)
      switch (shapeType) {
        case 0:
          element.style.background = `linear-gradient(45deg, ${colors.primary}60, ${colors.secondary}60)`
          element.style.borderRadius = '8px'
          break
        case 1:
          element.style.background = `radial-gradient(circle, ${colors.accent}60, ${colors.primary}60)`
          element.style.borderRadius = '50%'
          break
        case 2:
          element.style.background = `linear-gradient(45deg, ${colors.secondary}60, ${colors.accent}60)`
          element.style.clipPath = 'polygon(50% 0%, 0% 50%, 50% 100%, 100% 50%)'
          break
      }
      
      element.style.transformStyle = 'preserve-3d'
      element.style.perspective = '1000px'
      
      containerRef.current.appendChild(element)
      elementsRef.current.push({
        element,
        rotationX: Math.random() * 360,
        rotationY: Math.random() * 360,
        rotationSpeedX: (Math.random() - 0.5) * 1,
        rotationSpeedY: (Math.random() - 0.5) * 1,
        scale: 1,
        scaleDirection: Math.random() > 0.5 ? 1 : -1,
        type: '3d-shape'
      })
    }
  }

  const createLiquidEffects = (colors) => {
    if (!containerRef.current) return

    for (let i = 0; i < 6; i++) {
      const element = document.createElement('div')
      element.className = 'liquid-effect absolute pointer-events-none'
      
      const size = Math.random() * 120 + 80
      element.style.width = size + 'px'
      element.style.height = size + 'px'
      element.style.left = Math.random() * 100 + '%'
      element.style.top = Math.random() * 100 + '%'
      
      element.style.borderRadius = '60% 40% 30% 70% / 60% 30% 70% 40%'
      element.style.background = `linear-gradient(45deg, ${colors.primary}20, ${colors.secondary}20, ${colors.accent}20)`
      element.style.backdropFilter = 'blur(15px)'
      element.style.border = `1px solid ${colors.primary}30`
      element.style.opacity = '0.7'
      element.style.animation = `morphing ${8 + i * 2}s ease-in-out infinite, floating ${12 + i * 1.5}s ease-in-out infinite`
      element.style.animationDelay = `${i * 0.5}s`
      
      containerRef.current.appendChild(element)
    }
  }

  const startAnimationLoop = () => {
    const animate = () => {
      elementsRef.current.forEach(item => {
        if (item.type === 'floating') {
          item.x += item.speedX
          item.y += item.speedY
          item.rotationX += item.rotationSpeedX
          item.rotationY += item.rotationSpeedY
          
          if (item.x < -50 || item.x > window.innerWidth + 50) {
            item.speedX = -item.speedX
          }
          if (item.y < -50 || item.y > window.innerHeight + 50) {
            item.speedY = -item.speedY
          }
          
          item.element.style.transform = `
            translate3d(${item.x}px, ${item.y}px, 0)
            rotateX(${item.rotationX}deg)
            rotateY(${item.rotationY}deg)
          `
        } else if (item.type === '3d-shape') {
          item.rotationX += item.rotationSpeedX
          item.rotationY += item.rotationSpeedY
          
          item.scale += 0.002 * item.scaleDirection
          if (item.scale > 1.2 || item.scale < 0.8) {
            item.scaleDirection = -item.scaleDirection
          }
          
          item.element.style.transform = `
            rotateX(${item.rotationX}deg)
            rotateY(${item.rotationY}deg)
            scale(${item.scale})
          `
        }
      })
      
      requestAnimationFrame(animate)
    }
    
    animate()
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