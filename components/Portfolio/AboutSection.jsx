import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { User, Award, GraduationCap, Target } from 'lucide-react'

export default function AboutSection({ data }) {
  const { currentTheme, getCurrentThemeColors } = useTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })

  const professionalSummary = data?.professional_summary?.summary || 'Experienced AUTOSAR Integration Engineer with proven expertise in configuring and validating BSW stacks (COM, CAN, BSWM, DCM, DEM, NvM) and RTE layers across BMW\'s EV platforms.'
  const education = data?.education || {}
  const awards = Object.entries(data?.awards || {}).map(([key, value]) => value)
  const colors = getCurrentThemeColors()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  return (
    <section 
      ref={ref}
      className="py-20 relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, ${colors.background}, ${colors.surface})`
      }}
    >
      {/* Background Animation Elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 border rounded-full"
            style={{
              borderColor: `${colors.primary}10`,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 2) * 30}%`
            }}
            animate={{
              x: [0, Math.sin(i * Math.PI / 3) * 100, 0],
              y: [0, Math.cos(i * Math.PI / 3) * 100, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 2
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
              style={{
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`
              }}
            >
              <User className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              About <span style={{ color: colors.primary }}>Me</span>
            </h2>
            
            <div 
              className="w-24 h-1 mx-auto rounded-full"
              style={{
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`
              }}
            />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Professional Summary */}
            <motion.div
              variants={itemVariants}
              className="space-y-6"
            >
              <div className="glassmorphic-card p-8 rounded-2xl">
                <h3 
                  className="text-2xl font-bold mb-6 flex items-center gap-3"
                  style={{ color: colors.primary }}
                >
                  <Target className="w-6 h-6" />
                  Professional Summary
                </h3>
                
                <p className="text-gray-300 leading-relaxed text-lg mb-6">
                  {professionalSummary}
                </p>
                
                {/* Key Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "AUTOSAR BSW Expert",
                    "Diagnostics Integration", 
                    "ECU Testing & Validation",
                    "Automotive Protocols"
                  ].map((highlight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-2 p-2 rounded-lg glassmorphic"
                    >
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.accent }}
                      />
                      <span className="text-gray-300 text-sm">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Education */}
              {education.degree && (
                <div className="glassmorphic-card p-8 rounded-2xl">
                  <h3 
                    className="text-2xl font-bold mb-6 flex items-center gap-3"
                    style={{ color: colors.primary }}
                  >
                    <GraduationCap className="w-6 h-6" />
                    Education
                  </h3>
                  
                  <div 
                    className="p-4 rounded-lg glassmorphic border-l-4"
                    style={{ borderColor: colors.accent }}
                  >
                    <h4 className="text-white font-semibold text-lg mb-1">
                      {education.degree}
                    </h4>
                    <p 
                      className="font-medium mb-2"
                      style={{ color: colors.secondary }}
                    >
                      {education.institution}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {education.duration}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Awards & Recognition */}
            <motion.div
              variants={itemVariants}
              className="space-y-6"
            >
              {awards.length > 0 && (
                <div className="glassmorphic-card p-8 rounded-2xl">
                  <h3 
                    className="text-2xl font-bold mb-6 flex items-center gap-3"
                    style={{ color: colors.primary }}
                  >
                    <Award className="w-6 h-6" />
                    Awards & Recognition
                  </h3>
                  
                  <div className="space-y-4">
                    {awards.map((award, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="p-4 rounded-lg glassmorphic border-l-4 hover:bg-white/5 transition-all duration-300"
                        style={{ borderColor: colors.primary }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-white font-semibold mb-1">
                              {award.split('–')[0].trim()}
                            </h4>
                            <p 
                              className="text-sm"
                              style={{ color: colors.accent }}
                            >
                              {award.split('–')[1]?.trim()}
                            </p>
                          </div>
                          <div 
                            className="p-2 rounded-full"
                            style={{ backgroundColor: `${colors.primary}20` }}
                          >
                            <Award 
                              className="w-4 h-4"
                              style={{ color: colors.primary }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personal Philosophy */}
              <div className="glassmorphic-card p-8 rounded-2xl">
                <h3 
                  className="text-2xl font-bold mb-6"
                  style={{ color: colors.primary }}
                >
                  Philosophy & Approach
                </h3>
                
                <blockquote 
                  className="text-gray-300 italic text-lg leading-relaxed border-l-4 pl-6"
                  style={{ borderColor: colors.accent }}
                >
                  "Excellence in automotive software engineering comes from understanding both the technical complexity and the real-world impact of every line of code."
                </blockquote>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {[
                    { label: "Problem Solving", value: "Analytical" },
                    { label: "Learning", value: "Continuous" },
                    { label: "Collaboration", value: "Team-First" },
                    { label: "Quality", value: "Uncompromised" }
                  ].map((item, index) => (
                    <div key={index} className="p-3 rounded-lg glassmorphic text-center">
                      <div 
                        className="font-semibold text-sm"
                        style={{ color: colors.accent }}
                      >
                        {item.label}
                      </div>
                      <div className="text-white font-medium text-lg">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { label: "Years Experience", value: "3+", icon: "👨‍💻" },
              { label: "Projects Completed", value: "15+", icon: "🚀" },
              { label: "Technologies", value: "20+", icon: "⚡" },
              { label: "Certifications", value: "7+", icon: "🎓" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glassmorphic-card p-6 rounded-xl text-center group cursor-pointer"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div 
                  className="text-2xl font-bold mb-1 transition-colors"
                  style={{ color: colors.primary }}
                >
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}