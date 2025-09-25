import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { Palette, X, Check, Eye, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ThemeSelector({ onThemeChange, onClose }) {
  const { themes, fonts, currentTheme, currentFont } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState(currentTheme)
  const [selectedFont, setSelectedFont] = useState(currentFont)
  const [previewMode, setPreviewMode] = useState(false)
  
  // Group themes by category
  const themesByCategory = {}
  Object.entries(themes).forEach(([key, theme]) => {
    if (!themesByCategory[theme.category]) {
      themesByCategory[theme.category] = []
    }
    themesByCategory[theme.category].push({ key, ...theme })
  })

  const handleApplyTheme = () => {
    if (onThemeChange) {
      onThemeChange(selectedTheme, selectedFont)
    }
    toast.success('Theme applied successfully!')
    if (onClose) onClose()
  }

  const handlePreview = (themeKey, fontKey) => {
    setSelectedTheme(themeKey)
    setSelectedFont(fontKey)
    
    if (previewMode && onThemeChange) {
      onThemeChange(themeKey, fontKey)
    }
  }

  const ThemeCard = ({ theme, isSelected, onClick }) => {
    const colors = theme.colors
    
    return (
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`relative p-4 rounded-xl cursor-pointer border-2 transition-all duration-300 ${
          isSelected ? 'ring-4 ring-opacity-50' : 'hover:border-opacity-60'
        }`}
        style={{
          background: `linear-gradient(135deg, ${colors.background}, ${colors.surface})`,
          borderColor: isSelected ? colors.primary : `${colors.primary}30`,
          ringColor: colors.primary
        }}
      >
        {/* Color Preview */}
        <div className="flex gap-2 mb-3">
          <div 
            className="w-6 h-6 rounded-full border border-white/20"
            style={{ backgroundColor: colors.primary }}
          />
          <div 
            className="w-6 h-6 rounded-full border border-white/20"
            style={{ backgroundColor: colors.secondary }}
          />
          <div 
            className="w-6 h-6 rounded-full border border-white/20"
            style={{ backgroundColor: colors.accent }}
          />
        </div>
        
        {/* Theme Info */}
        <h3 className="text-white font-semibold text-sm mb-1">{theme.name}</h3>
        <p 
          className="text-xs mb-3"
          style={{ color: colors.primary }}
        >
          {theme.category}
        </p>
        
        {/* Preview Elements */}
        <div className="space-y-2">
          <div 
            className="h-2 rounded-full"
            style={{ backgroundColor: colors.primary }}
          />
          <div 
            className="h-1 rounded-full w-3/4"
            style={{ backgroundColor: colors.secondary }}
          />
          <div 
            className="h-1 rounded-full w-1/2"
            style={{ backgroundColor: colors.accent }}
          />
        </div>
        
        {/* Selection Indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="glassmorphic-card p-8 rounded-3xl max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div 
            className="p-3 rounded-xl"
            style={{
              background: `linear-gradient(45deg, ${themes[selectedTheme].colors.primary}, ${themes[selectedTheme].colors.secondary})`
            }}
          >
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Theme <span style={{ color: themes[selectedTheme].colors.primary }}>Selector</span>
            </h2>
            <p className="text-gray-300 text-sm">Choose from 25+ glassmorphic themes</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Preview Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPreviewMode(!previewMode)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              previewMode ? 'bg-blue-600' : 'glassmorphic'
            }`}
            title="Live Preview Mode"
          >
            <Eye className="w-5 h-5 text-white" />
          </motion.button>
          
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 glassmorphic rounded-lg hover:bg-red-600/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Font Selector */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" style={{ color: themes[selectedTheme].colors.accent }} />
          Font Family
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(fonts).map(([fontKey, fontValue]) => (
            <motion.button
              key={fontKey}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePreview(selectedTheme, fontKey)}
              className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                selectedFont === fontKey 
                  ? 'border-opacity-100' 
                  : 'border-opacity-30 hover:border-opacity-60'
              }`}
              style={{
                borderColor: themes[selectedTheme].colors.primary,
                backgroundColor: selectedFont === fontKey ? `${themes[selectedTheme].colors.primary}20` : 'transparent',
                fontFamily: fontValue
              }}
            >
              <span className="text-white text-sm font-medium capitalize">
                {fontKey}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Theme Categories */}
      <div className="space-y-8">
        {Object.entries(themesByCategory).map(([category, categoryThemes]) => (
          <div key={category}>
            <h3 
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: themes[selectedTheme].colors.secondary }}
            >
              <span className="capitalize">{category} Themes</span>
              <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                {categoryThemes.length}
              </span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {categoryThemes.map((theme) => (
                <ThemeCard
                  key={theme.key}
                  theme={theme}
                  isSelected={selectedTheme === theme.key}
                  onClick={() => handlePreview(theme.key, selectedFont)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-4 mt-8"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApplyTheme}
          className="flex-1 py-4 px-6 text-white font-semibold rounded-full transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(45deg, ${themes[selectedTheme].colors.primary}, ${themes[selectedTheme].colors.secondary})`,
            boxShadow: `0 10px 30px ${themes[selectedTheme].colors.primary}40`
          }}
        >
          <Check className="w-5 h-5" />
          Apply Theme
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="px-6 py-4 glassmorphic border text-white font-semibold rounded-full transition-all duration-300"
          style={{ borderColor: `${themes[selectedTheme].colors.primary}30` }}
        >
          Cancel
        </motion.button>
      </motion.div>

      {/* Current Selection Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 p-4 glassmorphic rounded-lg"
      >
        <p className="text-white text-sm">
          <strong>Current Selection:</strong> {themes[selectedTheme].name} with {selectedFont} font
          {previewMode && (
            <span 
              className="ml-2 text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: `${themes[selectedTheme].colors.primary}20`,
                color: themes[selectedTheme].colors.primary
              }}
            >
              Live Preview ON
            </span>
          )}
        </p>
      </motion.div>
    </div>
  )
}