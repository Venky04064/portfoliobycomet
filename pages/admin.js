import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import Layout from '../components/Layout/Layout'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Palette, 
  Upload, 
  Settings, 
  LogOut,
  Star,
  TrendingUp,
  Eye,
  Calendar
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { isAuthenticated, username, logout } = useAuth()
  const { getCurrentThemeColors, currentTheme } = useTheme()
  const router = useRouter()
  const colors = getCurrentThemeColors()
  
  const [activeTab, setActiveTab] = useState('analytics')
  const [analytics, setAnalytics] = useState({})
  const [feedback, setFeedback] = useState([])
  const [mediaSettings, setMediaSettings] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    loadDashboardData()
  }, [isAuthenticated, router])

  const loadDashboardData = async () => {
    try {
      const [analyticsRes, feedbackRes, mediaRes] = await Promise.all([
        axios.get('/api/analytics'),
        axios.get('/api/feedback/list'),
        axios.get('/api/media/settings')
      ])
      
      setAnalytics(analyticsRes.data)
      setFeedback(feedbackRes.data.feedback || [])
      setMediaSettings(mediaRes.data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'media', label: 'Media', icon: Upload },
    { id: 'themes', label: 'Themes', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <Layout title="Admin Dashboard - Loading">
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Admin Dashboard - Portfolio by Comet">
      <div 
        className="min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${colors.background}, ${colors.surface})`
        }}
      >
        {/* Header */}
        <header className="glassmorphic-card border-b border-white/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`
                  }}
                >
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Admin <span style={{ color: colors.primary }}>Dashboard</span>
                  </h1>
                  <p className="text-gray-300 text-sm">Welcome back, {username}!</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open('/', '_blank')}
                  className="px-4 py-2 glassmorphic rounded-lg text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Portfolio
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600/20 border border-red-600/30 rounded-lg text-white hover:bg-red-600/30 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav className="glassmorphic-card p-6 rounded-2xl sticky top-8">
                <h3 className="text-white font-semibold mb-4">Dashboard</h3>
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon
                    const isActive = activeTab === tab.id
                    
                    return (
                      <motion.button
                        key={tab.id}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-left ${
                          isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                        }`}
                        style={{
                          backgroundColor: isActive ? `${colors.primary}20` : 'transparent',
                          borderLeft: isActive ? `3px solid ${colors.primary}` : '3px solid transparent'
                        }}
                      >
                        <IconComponent className="w-5 h-5" />
                        {tab.label}
                      </motion.button>
                    )
                  })}
                </div>
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'analytics' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Analytics Overview</h2>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        label: 'Total Visits',
                        value: analytics.summary?.visits || '0',
                        icon: Eye,
                        color: colors.primary
                      },
                      {
                        label: 'Today\'s Visits',
                        value: analytics.summary?.today_visits || '0',
                        icon: Calendar,
                        color: colors.secondary
                      },
                      {
                        label: 'Unique Visitors',
                        value: analytics.summary?.unique_visitors || '0',
                        icon: Users,
                        color: colors.accent
                      },
                      {
                        label: 'Avg. Rating',
                        value: feedback.length > 0 ? 
                          (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1) : '0',
                        icon: Star,
                        color: colors.primary
                      }
                    ].map((stat, index) => {
                      const IconComponent = stat.icon
                      
                      return (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="glassmorphic-card p-6 rounded-xl text-center group cursor-pointer"
                        >
                          <div 
                            className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3"
                            style={{ backgroundColor: `${stat.color}20` }}
                          >
                            <IconComponent 
                              className="w-6 h-6"
                              style={{ color: stat.color }}
                            />
                          </div>
                          
                          <div 
                            className="text-2xl font-bold mb-1"
                            style={{ color: stat.color }}
                          >
                            {stat.value}
                          </div>
                          
                          <div className="text-gray-400 text-sm">
                            {stat.label}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === 'feedback' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Visitor Feedback</h2>
                  
                  {feedback.length === 0 ? (
                    <div className="glassmorphic-card p-8 rounded-xl text-center">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-400">No feedback received yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {feedback.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="glassmorphic-card p-6 rounded-xl"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < item.rating ? 'fill-current' : 'text-gray-500'
                                    }`}
                                    style={{
                                      color: i < item.rating ? colors.accent : '#6B7280'
                                    }}
                                  />
                                ))}
                                <span className="text-white font-medium">({item.rating}/5)</span>
                              </div>
                              
                              {item.visitor_name && (
                                <p className="text-white font-medium">{item.visitor_name}</p>
                              )}
                              
                              {item.visitor_email && (
                                <p className="text-gray-400 text-sm">{item.visitor_email}</p>
                              )}
                            </div>
                            
                            <span className="text-xs text-gray-400">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <p className="text-gray-300 leading-relaxed">
                            {item.message}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'media' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Media Management</h2>
                  
                  <div className="grid gap-6">
                    {[1, 2, 3, 4, 5].map((slot) => {
                      const isEnabled = mediaSettings[`slot${slot}`] === 'enabled'
                      const title = mediaSettings[`slot${slot}_title`] || ''
                      const caption = mediaSettings[`slot${slot}_caption`] || ''
                      
                      return (
                        <div key={slot} className="glassmorphic-card p-6 rounded-xl">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">
                              Media Slot {slot}
                            </h3>
                            
                            <div className="flex items-center gap-4">
                              <span 
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  isEnabled ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                                }`}
                              >
                                {isEnabled ? 'Enabled' : 'Disabled'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Media title..."
                              value={title}
                              className="w-full px-4 py-2 glassmorphic border rounded-lg text-white placeholder-gray-400"
                              style={{ borderColor: `${colors.primary}20` }}
                            />
                            
                            <input
                              type="text"
                              placeholder="Media caption..."
                              value={caption}
                              className="w-full px-4 py-2 glassmorphic border rounded-lg text-white placeholder-gray-400"
                              style={{ borderColor: `${colors.primary}20` }}
                            />
                            
                            <div className="flex gap-3">
                              <button 
                                className="px-4 py-2 rounded-lg text-white transition-colors"
                                style={{
                                  backgroundColor: isEnabled ? `${colors.accent}40` : `${colors.primary}40`
                                }}
                              >
                                {isEnabled ? 'Disable' : 'Enable'} Slot
                              </button>
                              
                              <button 
                                className="px-4 py-2 glassmorphic rounded-lg text-white hover:bg-white/10 transition-colors"
                              >
                                Upload Media
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === 'themes' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Theme Management</h2>
                  
                  <div className="glassmorphic-card p-8 rounded-xl">
                    <div className="text-center">
                      <p className="text-gray-300 mb-6">
                        Current theme: <strong style={{ color: colors.primary }}>{currentTheme}</strong>
                      </p>
                      
                      <p className="text-gray-400 text-sm mb-6">
                        Use the floating theme selector button on the main portfolio to change themes
                      </p>
                      
                      <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                        <div 
                          className="h-12 rounded-lg border border-white/20"
                          style={{ backgroundColor: colors.primary }}
                        />
                        <div 
                          className="h-12 rounded-lg border border-white/20"
                          style={{ backgroundColor: colors.secondary }}
                        />
                        <div 
                          className="h-12 rounded-lg border border-white/20"
                          style={{ backgroundColor: colors.accent }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Portfolio Settings</h2>
                  
                  <div className="glassmorphic-card p-8 rounded-xl">
                    <p className="text-gray-300 text-center">
                      Settings panel - Configure portfolio features, access codes, and more.
                    </p>
                    
                    <div className="mt-6 p-4 glassmorphic rounded-lg">
                      <p className="text-white font-medium mb-2">Access Code Management</p>
                      <p className="text-gray-400 text-sm">
                        Current access code can be changed in: <code>backend/data-storage/access_settings.txt</code>
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}