import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { Mail, Phone, MapPin, Linkedin, Github, Download, Send, ExternalLink } from 'lucide-react'

export default function ContactSection({ data }) {
  const { getCurrentThemeColors } = useTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })
  const colors = getCurrentThemeColors()

  const contactData = data?.contact || {}
  const personalInfo = data?.personal_info || {}

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: contactData.email || personalInfo.email || 'contact@portfoliobycomet.com',
      href: `mailto:${contactData.email || personalInfo.email || 'contact@portfoliobycomet.com'}`,
      color: 'primary'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: personalInfo.phone || '+91-XXXXXXXXXX',
      href: `tel:${personalInfo.phone || '+91-XXXXXXXXXX'}`,
      color: 'secondary'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: contactData.location || personalInfo.location || 'Bangalore, India',
      href: null,
      color: 'accent'
    }
  ]

  const socialLinks = [
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Connect on LinkedIn',
      href: contactData.linkedin || 'https://linkedin.com/in/venkatesh',
      color: 'primary'
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'View Projects',
      href: contactData.github || 'https://github.com/venkatesh',
      color: 'secondary'
    }
  ]

  return (
    <section 
      ref={ref}
      className="py-20 relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, ${colors.surface}, ${colors.background})`
      }}
    >
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, staggerChildren: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            className="text-center mb-16"
          >
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
              style={{
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`
              }}
            >
              <Send className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Let's <span style={{ color: colors.primary }}>Connect</span>
            </h2>
            
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-6">
              Ready to collaborate on automotive software projects or discuss AUTOSAR integration challenges?
            </p>
            
            <div 
              className="w-24 h-1 mx-auto rounded-full"
              style={{
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`
              }}
            />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="glassmorphic-card p-8 rounded-2xl">
                <h3 
                  className="text-2xl font-bold mb-6"
                  style={{ color: colors.primary }}
                >
                  Get In Touch
                </h3>
                
                <div className="space-y-6">
                  {contactInfo.map((contact, index) => {
                    const IconComponent = contact.icon
                    const color = contact.color === 'primary' ? colors.primary :
                                 contact.color === 'secondary' ? colors.secondary : colors.accent
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="group"
                      >
                        {contact.href ? (
                          <a
                            href={contact.href}
                            className="flex items-center gap-4 p-4 rounded-lg glassmorphic hover:bg-white/10 transition-all duration-300 group"
                          >
                            <div 
                              className="p-3 rounded-full transition-colors"
                              style={{
                                backgroundColor: `${color}20`
                              }}
                            >
                              <IconComponent 
                                className="w-5 h-5"
                                style={{ color }}
                              />
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">{contact.label}</h4>
                              <p 
                                className="group-hover:text-white transition-colors"
                                style={{ color }}
                              >
                                {contact.value}
                              </p>
                            </div>
                            <ExternalLink 
                              className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors ml-auto"
                            />
                          </a>
                        ) : (
                          <div className="flex items-center gap-4 p-4 rounded-lg glassmorphic">
                            <div 
                              className="p-3 rounded-full"
                              style={{
                                backgroundColor: `${color}20`
                              }}
                            >
                              <IconComponent 
                                className="w-5 h-5"
                                style={{ color }}
                              />
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">{contact.label}</h4>
                              <p style={{ color }}>{contact.value}</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Social Links */}
              <div className="glassmorphic-card p-8 rounded-2xl">
                <h3 
                  className="text-2xl font-bold mb-6"
                  style={{ color: colors.primary }}
                >
                  Professional Network
                </h3>
                
                <div className="space-y-4">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon
                    const color = social.color === 'primary' ? colors.primary : colors.secondary
                    
                    return (
                      <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-4 p-4 rounded-lg glassmorphic hover:bg-white/10 border border-opacity-40 transition-all duration-300 group"
                        style={{ borderColor: `${color}20` }}
                      >
                        <div 
                          className="p-3 rounded-full group-hover:bg-opacity-30 transition-colors"
                          style={{
                            backgroundColor: `${color}20`
                          }}
                        >
                          <IconComponent 
                            className="w-5 h-5"
                            style={{ color }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{social.label}</h4>
                          <p 
                            className="text-sm"
                            style={{ color }}
                          >
                            {social.value}
                          </p>
                        </div>
                        <ExternalLink 
                          className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors"
                        />
                      </motion.a>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* Call-to-Action */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <div 
                className="glassmorphic-card p-8 rounded-2xl border"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`,
                  borderColor: `${colors.primary}20`
                }}
              >
                <h3 
                  className="text-2xl font-bold mb-4"
                  style={{ color: colors.primary }}
                >
                  Ready to Collaborate?
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Whether you're working on AUTOSAR integration, automotive diagnostics, or ECU software development, 
                  I bring expertise and passion to every project.
                </p>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-4 px-6 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`
                    }}
                  >
                    <Mail className="w-5 h-5" />
                    Send Email
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-4 px-6 glassmorphic border text-white font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2"
                    style={{ borderColor: `${colors.primary}30` }}
                  >
                    <Download className="w-5 h-5" />
                    Download Resume
                  </motion.button>
                </div>
              </div>

              {/* Current Status */}
              <div className="glassmorphic-card p-8 rounded-2xl">
                <h3 
                  className="text-2xl font-bold mb-4"
                  style={{ color: colors.primary }}
                >
                  Current Status
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg glassmorphic">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white font-medium">Available for Projects</span>
                  </div>
                  
                  <div className="text-gray-300 text-sm leading-relaxed">
                    <p>Currently open to:</p>
                    <ul className="mt-2 space-y-1 ml-4">
                      <li>• AUTOSAR integration consulting</li>
                      <li>• Automotive software development</li>
                      <li>• Technical mentoring</li>
                      <li>• Full-time opportunities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}