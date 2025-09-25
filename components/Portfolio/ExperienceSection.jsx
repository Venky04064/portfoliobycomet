import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { Briefcase, Calendar, MapPin, ChevronRight, ExternalLink } from 'lucide-react'

export default function ExperienceSection({ data }) {
  const { getCurrentThemeColors } = useTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })
  const colors = getCurrentThemeColors()

  const professionalExperience = data?.professional_experience || {}
  const certifications = Object.entries(data?.certifications || {}).map(([key, value]) => value)

  const experiences = [
    {
      role: professionalExperience.current_role || 'Software Engineer | KPIT, Bangalore, India',
      period: 'Feb 2023 – Present',
      type: 'Full-time',
      company: 'KPIT',
      location: 'Bangalore, India',
      projects: [
        {
          name: 'DELTA CCU Integration BEV',
          period: 'Feb 2023 – Present',
          description: professionalExperience.project1_desc || 'Implemented DCM and DEM modules for UDS diagnostics as per ISO 14229 standards.',
          highlights: [
            'Validated diagnostics and communication stack functionality using CANoe tool',
            'Used WinIdea for debugging RESET or SW issues during ECU software testing',
            'Generated PDX and A2L files using Bamboo for flashing and validation processes'
          ]
        }
      ]
    },
    {
      role: 'Intern | Remote Internship',
      period: 'Jun 2022 – Aug 2022',
      type: 'Internship',
      company: 'Remote',
      location: 'Remote',
      description: 'Worked on foundational AUTOSAR concepts and Jenkins pipeline basics.',
      highlights: [
        'Worked on foundational AUTOSAR concepts',
        'Jenkins pipeline basics and automation',
        'Built hands-on experience in C programming'
      ]
    }
  ]

  return (
    <section 
      ref={ref}
      className="py-20 relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, ${colors.background}, ${colors.surface})`
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
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
              style={{
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`
              }}
            >
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Professional <span style={{ color: colors.primary }}>Experience</span>
            </h2>
            
            <div 
              className="w-24 h-1 mx-auto rounded-full"
              style={{
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`
              }}
            />
          </motion.div>

          {/* Experience Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute left-8 top-0 bottom-0 w-1 origin-top"
              style={{
                background: `linear-gradient(to bottom, ${colors.primary}, ${colors.secondary})`
              }}
            />

            {/* Experience Items */}
            <div className="space-y-12">
              {experiences.map((experience, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative pl-20"
                >
                  {/* Timeline Node */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.5 + index * 0.2, type: 'spring', stiffness: 200 }}
                    className="absolute left-4 w-8 h-8 rounded-full border-4 flex items-center justify-center"
                    style={{
                      background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                      borderColor: colors.surface
                    }}
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </motion.div>

                  {/* Experience Card */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="glassmorphic-card p-8 rounded-2xl"
                  >
                    <div className="mb-6">
                      <div className="flex flex-wrap items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-white">{experience.role}</h3>
                        <div 
                          className="px-3 py-1 rounded-full border"
                          style={{
                            backgroundColor: `${colors.primary}20`,
                            borderColor: `${colors.primary}30`
                          }}
                        >
                          <span 
                            className="text-sm font-medium"
                            style={{ color: colors.primary }}
                          >
                            {experience.type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{experience.period}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{experience.location}</span>
                        </div>
                      </div>
                    </div>

                    {experience.description && (
                      <p className="text-gray-300 leading-relaxed mb-6">
                        {experience.description}
                      </p>
                    )}

                    {experience.projects && (
                      <div className="space-y-6">
                        {experience.projects.map((project, projectIndex) => (
                          <motion.div
                            key={projectIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.7 + index * 0.2 + projectIndex * 0.1 }}
                            className="p-6 rounded-xl glassmorphic border-l-4"
                            style={{ borderColor: colors.accent }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="text-lg font-semibold text-white">{project.name}</h4>
                              <span 
                                className="text-sm"
                                style={{ color: colors.accent }}
                              >
                                {project.period}
                              </span>
                            </div>
                            
                            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                              {project.description}
                            </p>
                            
                            <div className="space-y-2">
                              {project.highlights.map((highlight, highlightIndex) => (
                                <div key={highlightIndex} className="flex items-start gap-3">
                                  <ChevronRight 
                                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                                    style={{ color: colors.primary }}
                                  />
                                  <span className="text-gray-300 text-sm leading-relaxed">{highlight}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications Section */}
          {certifications.length > 0 && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="mt-20"
            >
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Certifications & <span style={{ color: colors.primary }}>Training</span>
                </h3>
                <div 
                  className="w-16 h-1 mx-auto rounded-full"
                  style={{
                    background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map((cert, index) => {
                  const parts = cert.split(' – ')
                  const title = parts[0]?.trim()
                  const provider = parts[1]?.split(',')[0]?.trim()
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="glassmorphic-card p-6 rounded-xl border transition-all duration-300 group cursor-pointer"
                      style={{ borderColor: `${colors.primary}20` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div 
                          className="p-2 rounded-lg transition-colors"
                          style={{
                            backgroundColor: `${colors.primary}20`
                          }}
                        >
                          <ExternalLink 
                            className="w-5 h-5"
                            style={{ color: colors.primary }}
                          />
                        </div>
                      </div>
                      
                      <h4 className="text-white font-semibold mb-2 leading-tight">
                        {title}
                      </h4>
                      
                      {provider && (
                        <p 
                          className="text-sm font-medium"
                          style={{ color: colors.accent }}
                        >
                          {provider}
                        </p>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}