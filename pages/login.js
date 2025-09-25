import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import LoginForm from '../components/Auth/LoginForm'
import { motion } from 'framer-motion'
import ParticleBackground from '../components/Effects/ParticleBackground'
import Layout from '../components/Layout/Layout'

export default function LoginPage() {
  const { isAuthenticated } = useAuth()
  const { currentTheme } = useTheme()
  const router = useRouter()

  const handleLoginSuccess = () => {
    router.push('/admin')
  }

  if (isAuthenticated) {
    router.push('/admin')
    return null
  }

  return (
    <Layout title="Admin Login - Portfolio by Comet">
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative">
        <ParticleBackground />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <LoginForm onSuccess={handleLoginSuccess} />
        </motion.div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 border border-white/10 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 border border-white/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-1 h-20 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
        <div className="absolute top-1/4 right-1/4 w-16 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>
    </Layout>
  )
}