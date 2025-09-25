import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginForm({ onSuccess }) {
  const { login } = useAuth()
  const { getCurrentThemeColors } = useTheme()
  const colors = getCurrentThemeColors()
  
  const [formData, setFormData] = useState({
    username: '',
    accessCode: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.username.trim()) {
      toast.error('Please enter a username')
      return
    }
    
    if (!formData.accessCode.trim()) {
      toast.error('Please enter access code')
      return
    }

    setLoading(true)
    
    try {
      const result = await login(formData.username, formData.accessCode)
      
      if (result.success) {
        toast.success('Login successful!')
        if (onSuccess) onSuccess()
      } else {
        toast.error(result.error || 'Login failed')
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glassmorphic-card p-8 rounded-3xl"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div 
            className="w-20 h-20 mx-auto rounded-full mb-4 flex items-center justify-center"
            style={{
              background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`
            }}
          >
            <LogIn className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin <span style={{ color: colors.primary }}>Access</span>
          </h1>
          
          <p className="text-gray-300">
            Enter your credentials to access the admin dashboard
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Username Field */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter any username"
                className="w-full pl-12 pr-4 py-3 glassmorphic border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300"
                style={{
                  borderColor: `${colors.primary}30`,
                  focusRingColor: `${colors.primary}50`
                }}
                required
              />
            </div>
          </div>

          {/* Access Code Field */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Access Code
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.accessCode}
                onChange={(e) => setFormData(prev => ({ ...prev, accessCode: e.target.value }))}
                placeholder="Enter access code"
                className="w-full pl-12 pr-12 py-3 glassmorphic border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300"
                style={{
                  borderColor: `${colors.primary}30`
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Default: Venky@access345
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full py-4 text-white font-semibold rounded-full transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
              boxShadow: `0 10px 30px ${colors.primary}40`
            }}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Authenticating...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Access Dashboard
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-gray-400">
            Access code can be configured in the backend settings
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}