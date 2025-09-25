/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'roboto': ['Roboto', 'system-ui', 'sans-serif'],
        'poppins': ['Poppins', 'system-ui', 'sans-serif'],
        'montserrat': ['Montserrat', 'system-ui', 'sans-serif'],
        'opensans': ['Open Sans', 'system-ui', 'sans-serif'],
        'lato': ['Lato', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Dynamic theme colors (will be overridden by CSS variables)
        'theme-primary': 'var(--theme-primary)',
        'theme-secondary': 'var(--theme-secondary)',
        'theme-accent': 'var(--theme-accent)',
        'theme-background': 'var(--theme-background)',
        'theme-surface': 'var(--theme-surface)',
        'theme-glass': 'var(--theme-glass)',
        'theme-text': 'var(--theme-text)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'rotate-3d': 'rotate3d 20s linear infinite',
        'morphing': 'morphing 8s ease-in-out infinite',
        'matrix': 'matrix 15s linear infinite',
        'liquid': 'liquid 12s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'typewriter': 'typewriter 4s steps(40) 1s 1 normal both',
        'glitch': 'glitch 0.3s ease-in-out infinite alternate-reverse'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-20px) translateX(10px)' },
          '50%': { transform: 'translateY(-10px) translateX(-10px)' },
          '75%': { transform: 'translateY(-30px) translateX(5px)' }
        },
        rotate3d: {
          '0%': { transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)' },
          '100%': { transform: 'rotateX(360deg) rotateY(360deg) rotateZ(360deg)' }
        },
        morphing: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '50%': { borderRadius: '50% 60% 30% 60% / 30% 60% 70% 40%' },
          '75%': { borderRadius: '60% 40% 60% 30% / 60% 30% 60% 70%' }
        },
        matrix: {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        liquid: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '25%': { transform: 'translateY(-20px) scale(1.1)' },
          '50%': { transform: 'translateY(-10px) scale(0.9)' },
          '75%': { transform: 'translateY(-30px) scale(1.05)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(107, 70, 193, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(236, 72, 153, 0.7)' }
        },
        typewriter: {
          '0%': { width: '0ch' },
          '100%': { width: '40ch' }
        },
        glitch: {
          '0%': { textShadow: '1px 0 0 red, -1px 0 0 cyan' },
          '1%': { textShadow: '1px 0 0 red, -1px 0 0 cyan' },
          '2%': { textShadow: '1px 0 0 red, -1px 0 0 cyan' },
          '3%': { textShadow: '1px 0 0 red, -1px 0 0 cyan' },
          '4%': { textShadow: '1px 0 0 red, -1px 0 0 cyan' },
          '5%': { textShadow: '-1px 0 0 red, 1px 0 0 cyan' },
          '99%': { textShadow: '-1px 0 0 red, 1px 0 0 cyan' },
          '100%': { textShadow: '1px 0 0 red, -1px 0 0 cyan' }
        }
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      perspective: {
        '500': '500px',
        '1000': '1000px',
        '1500': '1500px',
        '2000': '2000px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function({ addUtilities }) {
      const newUtilities = {
        '.glassmorphic': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glassmorphic-card': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glassmorphic-strong': {
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        },
        '.floating-button': {
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'all 0.3s ease',
        },
        '.floating-controls': {
          position: 'fixed',
          top: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 1000,
        },
        '.text-gradient': {
          background: 'linear-gradient(45deg, var(--theme-primary), var(--theme-secondary))',
          backgroundClip: 'text',
          textFillColor: 'transparent',
        },
        '.neon-glow': {
          textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor',
        },
        '.glitch-text': {
          position: 'relative',
        },
        '.media-slot-3d': {
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        },
        '.video-controls': {
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          transition: 'opacity 0.3s ease',
        }
      }
      addUtilities(newUtilities)
    }
  ],
}