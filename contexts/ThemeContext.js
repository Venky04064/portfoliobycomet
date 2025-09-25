import React, { createContext, useContext, useState, useEffect } from 'react'

// Create Theme Context
const ThemeContext = createContext()

// 25+ Glassmorphic Theme Definitions
const themes = {
  // Creative Themes (7)
  cosmic_purple: {
    name: 'Cosmic Purple',
    category: 'Creative',
    colors: {
      primary: '#6B46C1',
      secondary: '#EC4899',
      accent: '#F59E0B',
      background: '#0F0F23',
      surface: '#1A1A2E',
      glass: 'rgba(107, 70, 193, 0.1)',
      text: '#FFFFFF'
    }
  },
  lavender_dream: {
    name: 'Lavender Dream',
    category: 'Creative',
    colors: {
      primary: '#A855F7',
      secondary: '#EC4899',
      accent: '#06B6D4',
      background: '#0C0C14',
      surface: '#1E1E2E',
      glass: 'rgba(168, 85, 247, 0.1)',
      text: '#FFFFFF'
    }
  },
  rose_quartz: {
    name: 'Rose Quartz',
    category: 'Creative',
    colors: {
      primary: '#F43F5E',
      secondary: '#EC4899',
      accent: '#8B5CF6',
      background: '#0F0A0E',
      surface: '#1C141A',
      glass: 'rgba(244, 63, 94, 0.1)',
      text: '#FFFFFF'
    }
  },
  crimson_red: {
    name: 'Crimson Red',
    category: 'Creative',
    colors: {
      primary: '#DC2626',
      secondary: '#EF4444',
      accent: '#F59E0B',
      background: '#0F0606',
      surface: '#1C0F0F',
      glass: 'rgba(220, 38, 38, 0.1)',
      text: '#FFFFFF'
    }
  },
  pink_flamingo: {
    name: 'Pink Flamingo',
    category: 'Creative',
    colors: {
      primary: '#EC4899',
      secondary: '#F97316',
      accent: '#06B6D4',
      background: '#0F0A0F',
      surface: '#1C141C',
      glass: 'rgba(236, 72, 153, 0.1)',
      text: '#FFFFFF'
    }
  },
  purple_haze: {
    name: 'Purple Haze',
    category: 'Creative',
    colors: {
      primary: '#7C3AED',
      secondary: '#A855F7',
      accent: '#F59E0B',
      background: '#0B0A14',
      surface: '#171428',
      glass: 'rgba(124, 58, 237, 0.1)',
      text: '#FFFFFF'
    }
  },
  violet_storm: {
    name: 'Violet Storm',
    category: 'Creative',
    colors: {
      primary: '#8B5CF6',
      secondary: '#A855F7',
      accent: '#06B6D4',
      background: '#0A0A14',
      surface: '#14142E',
      glass: 'rgba(139, 92, 246, 0.1)',
      text: '#FFFFFF'
    }
  },
  
  // Tech Themes (5)
  aurora_blue: {
    name: 'Aurora Blue',
    category: 'Tech',
    colors: {
      primary: '#3B82F6',
      secondary: '#06B6D4',
      accent: '#10B981',
      background: '#0A0F23',
      surface: '#0F1629',
      glass: 'rgba(59, 130, 246, 0.1)',
      text: '#FFFFFF'
    }
  },
  indigo_night: {
    name: 'Indigo Night',
    category: 'Tech',
    colors: {
      primary: '#4F46E5',
      secondary: '#6366F1',
      accent: '#06B6D4',
      background: '#0A0A1A',
      surface: '#14142A',
      glass: 'rgba(79, 70, 229, 0.1)',
      text: '#FFFFFF'
    }
  },
  cyan_wave: {
    name: 'Cyan Wave',
    category: 'Tech',
    colors: {
      primary: '#06B6D4',
      secondary: '#0891B2',
      accent: '#10B981',
      background: '#0A1414',
      surface: '#0F1B1B',
      glass: 'rgba(6, 182, 212, 0.1)',
      text: '#FFFFFF'
    }
  },
  sky_limit: {
    name: 'Sky Limit',
    category: 'Tech',
    colors: {
      primary: '#0EA5E9',
      secondary: '#38BDF8',
      accent: '#F59E0B',
      background: '#0A1323',
      surface: '#0F1829',
      glass: 'rgba(14, 165, 233, 0.1)',
      text: '#FFFFFF'
    }
  },
  zinc_modern: {
    name: 'Zinc Modern',
    category: 'Tech',
    colors: {
      primary: '#71717A',
      secondary: '#A1A1AA',
      accent: '#3B82F6',
      background: '#09090B',
      surface: '#18181B',
      glass: 'rgba(113, 113, 122, 0.1)',
      text: '#FFFFFF'
    }
  },

  // Corporate Themes (4)
  forest_green: {
    name: 'Forest Green',
    category: 'Corporate',
    colors: {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#F59E0B',
      background: '#064E3B',
      surface: '#065F46',
      glass: 'rgba(5, 150, 105, 0.1)',
      text: '#FFFFFF'
    }
  },
  emerald_city: {
    name: 'Emerald City',
    category: 'Corporate',
    colors: {
      primary: '#10B981',
      secondary: '#34D399',
      accent: '#F59E0B',
      background: '#064E3B',
      surface: '#065F46',
      glass: 'rgba(16, 185, 129, 0.1)',
      text: '#FFFFFF'
    }
  },
  slate_storm: {
    name: 'Slate Storm',
    category: 'Corporate',
    colors: {
      primary: '#475569',
      secondary: '#64748B',
      accent: '#3B82F6',
      background: '#0F172A',
      surface: '#1E293B',
      glass: 'rgba(71, 85, 105, 0.1)',
      text: '#FFFFFF'
    }
  },
  stone_age: {
    name: 'Stone Age',
    category: 'Corporate',
    colors: {
      primary: '#78716C',
      secondary: '#A8A29E',
      accent: '#F59E0B',
      background: '#0C0A09',
      surface: '#1C1917',
      glass: 'rgba(120, 113, 108, 0.1)',
      text: '#FFFFFF'
    }
  },

  // Minimal Themes (4)
  ocean_teal: {
    name: 'Ocean Teal',
    category: 'Minimal',
    colors: {
      primary: '#0D9488',
      secondary: '#14B8A6',
      accent: '#F59E0B',
      background: '#042F2E',
      surface: '#134E4A',
      glass: 'rgba(13, 148, 136, 0.1)',
      text: '#FFFFFF'
    }
  },
  mint_fresh: {
    name: 'Mint Fresh',
    category: 'Minimal',
    colors: {
      primary: '#06B6D4',
      secondary: '#67E8F9',
      accent: '#10B981',
      background: '#0A1414',
      surface: '#164E63',
      glass: 'rgba(6, 182, 212, 0.1)',
      text: '#FFFFFF'
    }
  },
  teal_depths: {
    name: 'Teal Depths',
    category: 'Minimal',
    colors: {
      primary: '#0F766E',
      secondary: '#14B8A6',
      accent: '#F59E0B',
      background: '#042F2E',
      surface: '#134E4A',
      glass: 'rgba(15, 118, 110, 0.1)',
      text: '#FFFFFF'
    }
  },
  neutral_space: {
    name: 'Neutral Space',
    category: 'Minimal',
    colors: {
      primary: '#737373',
      secondary: '#A3A3A3',
      accent: '#3B82F6',
      background: '#0A0A0A',
      surface: '#171717',
      glass: 'rgba(115, 115, 115, 0.1)',
      text: '#FFFFFF'
    }
  },

  // Vibrant Themes (5)
  sunset_orange: {
    name: 'Sunset Orange',
    category: 'Vibrant',
    colors: {
      primary: '#EA580C',
      secondary: '#FB923C',
      accent: '#F59E0B',
      background: '#1A0A06',
      surface: '#2D1B0E',
      glass: 'rgba(234, 88, 12, 0.1)',
      text: '#FFFFFF'
    }
  },
  golden_hour: {
    name: 'Golden Hour',
    category: 'Vibrant',
    colors: {
      primary: '#D97706',
      secondary: '#F59E0B',
      accent: '#EAB308',
      background: '#1C1409',
      surface: '#292017',
      glass: 'rgba(217, 119, 6, 0.1)',
      text: '#FFFFFF'
    }
  },
  amber_glow: {
    name: 'Amber Glow',
    category: 'Vibrant',
    colors: {
      primary: '#F59E0B',
      secondary: '#FBBF24',
      accent: '#EF4444',
      background: '#1C1409',
      surface: '#292017',
      glass: 'rgba(245, 158, 11, 0.1)',
      text: '#FFFFFF'
    }
  },
  lime_zest: {
    name: 'Lime Zest',
    category: 'Vibrant',
    colors: {
      primary: '#65A30D',
      secondary: '#84CC16',
      accent: '#F59E0B',
      background: '#0F1A04',
      surface: '#1A2E0C',
      glass: 'rgba(101, 163, 13, 0.1)',
      text: '#FFFFFF'
    }
  },
  orange_burst: {
    name: 'Orange Burst',
    category: 'Vibrant',
    colors: {
      primary: '#F97316',
      secondary: '#FB923C',
      accent: '#EF4444',
      background: '#1C0F06',
      surface: '#2D1B0E',
      glass: 'rgba(249, 115, 22, 0.1)',
      text: '#FFFFFF'
    }
  }
}

// Font Options
const fonts = {
  inter: 'Inter, system-ui, sans-serif',
  roboto: 'Roboto, system-ui, sans-serif',
  poppins: 'Poppins, system-ui, sans-serif',
  montserrat: 'Montserrat, system-ui, sans-serif',
  opensans: 'Open Sans, system-ui, sans-serif',
  lato: 'Lato, system-ui, sans-serif'
}

// Theme Provider Component
export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('cosmic_purple')
  const [currentFont, setCurrentFont] = useState('inter')
  const [currentLanding, setCurrentLanding] = useState('option1')

  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('portfolio-theme')
      const savedFont = localStorage.getItem('portfolio-font')
      const savedLanding = localStorage.getItem('portfolio-landing')
      
      if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(savedTheme)
      }
      if (savedFont && fonts[savedFont]) {
        setCurrentFont(savedFont)
      }
      if (savedLanding) {
        setCurrentLanding(savedLanding)
      }
    }
  }, [])

  // Apply theme to CSS variables
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const theme = themes[currentTheme]
      const root = document.documentElement
      
      // Set CSS custom properties
      root.style.setProperty('--theme-primary', theme.colors.primary)
      root.style.setProperty('--theme-secondary', theme.colors.secondary)
      root.style.setProperty('--theme-accent', theme.colors.accent)
      root.style.setProperty('--theme-background', theme.colors.background)
      root.style.setProperty('--theme-surface', theme.colors.surface)
      root.style.setProperty('--theme-glass', theme.colors.glass)
      root.style.setProperty('--theme-text', theme.colors.text)
      
      // Extract RGB values for Tailwind compatibility
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        ].join(', ') : null
      }
      
      root.style.setProperty('--theme-primary-rgb', hexToRgb(theme.colors.primary))
      root.style.setProperty('--theme-secondary-rgb', hexToRgb(theme.colors.secondary))
      root.style.setProperty('--theme-accent-rgb', hexToRgb(theme.colors.accent))
      
      // Apply font
      document.body.style.fontFamily = fonts[currentFont]
      document.body.className = `font-${currentFont} theme-${currentTheme}`
      
      // Save to localStorage
      localStorage.setItem('portfolio-theme', currentTheme)
      localStorage.setItem('portfolio-font', currentFont)
      localStorage.setItem('portfolio-landing', currentLanding)
    }
  }, [currentTheme, currentFont, currentLanding])

  const changeTheme = (themeKey, fontKey) => {
    if (themes[themeKey]) setCurrentTheme(themeKey)
    if (fonts[fontKey]) setCurrentFont(fontKey)
  }

  const changeLanding = (landingOption) => {
    setCurrentLanding(landingOption)
  }

  const getCurrentThemeColors = () => {
    return themes[currentTheme]?.colors || themes.cosmic_purple.colors
  }

  const value = {
    themes,
    fonts,
    currentTheme,
    currentFont,
    currentLanding,
    changeTheme,
    changeLanding,
    getCurrentThemeColors
  }

  return React.createElement(ThemeContext.Provider, { value }, children)
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export { themes, fonts }