import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { Code, Wrench, Brain, Users, Zap, Database } from 'lucide-react'

export default function SkillsSection({ data }) {
  const { currentTheme, getCurrentThemeColors } = useTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })

  const coreSkills = data?.core_skills || {}
  const colors = getCurrentThemeColors()
  
  // Parse skills data
  const skillCategories = {
    'AUTOSAR Modules': {
      icon: Database,
      skills: coreSkills.autosar_modules?.split(', ') || ['NvM', 'DCM', 'DEM', 'BSWM', 'COM', 'CAN'],
      color: 'primary'
    },
    'Development Tools': {
      icon: Wrench,
      skills: coreSkills.tools?.split(', ') || ['DaVinci Configurator', 'DaVinci Developer', 'Canoe', 'Jenkins'],
      color: 'secondary'
    },
    'Programming Languages': {
      icon: Code,
      skills: coreSkills.languages?.split(', ') || ['C', 'Basic Python'],
      color: 'accent'
    },
    'Technical Processes': {
      icon: Zap,
      skills: coreSkills.processes?.split(', ') || ['AutoSAR Integration', 'BSW Configuration', 'RTE Generation'],
      color: 'primary'
    },
    'Soft Skills': {
      icon: Users,
      skills: coreSkills.soft_skills?.split(', ') || ['Communication', 'Team Collaboration', 'Problem Solving'],
      color: 'secondary'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
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

  const SkillBadge = ({ skill, index, colorType }) => {
    const color = colorType === 'primary' ? colors.primary : 
                 colorType === 'secondary' ? colors.secondary : colors.accent
                 
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.3 + index * 0.05, duration: 0.4, ease: 'backOut' }}
        whileHover={{ 
          scale: 1.1, 
          y: -5,
        }}
        whileTap={{ scale: 0.95 }}
        className="glassmorphic-card px-4 py-3 rounded-xl cursor-pointer group transition-all duration-300 border"
        style={{ borderColor: `${color}20` }}
      >
        <span className="text-white font-medium group-hover:text-white transition-colors duration-300">
          {skill.trim()}
        </span>
        
        {/* Animated background */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
          style={{
            background: `linear-gradient(90deg, ${color}00, ${color}10, ${color}00)`
          }}
        />
      </motion.div>
    )
  }

  const SkillCategory = ({ category, data, index }) => {
    const IconComponent = data.icon
    const color = data.color === 'primary' ? colors.primary : 
                 data.color === 'secondary' ? colors.secondary : colors.accent
    
    return (
      <motion.div
        variants={itemVariants}
        className="glassmorphic-card p-6 rounded-2xl relative overflow-hidden group"
      >
        {/* Background Animation */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${color}05, transparent)`
          }}
        />
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div 
            className="p-3 rounded-xl"
            style={{
              background: `linear-gradient(45deg, ${color}, ${color}70)`
            }}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">{category}</h3>
        </div>
        
        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 relative z-10">
          {data.skills.map((skill, skillIndex) => (
            <SkillBadge 
              key={skillIndex}
              skill={skill}
              index={skillIndex}
              colorType={data.color}
            />
          ))}
        </div>
      </motion.div>
    )
  }

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
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
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
              <Brain className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Technical <span style={{ color: colors.primary }}>Skills</span>
            </h2>
            
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-6">
              Comprehensive expertise across automotive software development, from AUTOSAR integration to modern development practices
            </p>
            
            <div 
              className="w-24 h-1 mx-auto rounded-full"
              style={{
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`
              }}
            />
          </motion.div>

          {/* Skills Categories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {Object.entries(skillCategories).map(([category, data], index) => (
              <SkillCategory
                key={category}
                category={category}
                data={data}
                index={index}
              />
            ))}
          </div>

          {/* Skill Level Indicators */}
          <motion.div
            variants={itemVariants}
            className="glassmorphic-card p-8 rounded-2xl"
          >
            <h3 
              className="text-2xl font-bold mb-8 text-center"
              style={{ color: colors.primary }}
            >
              Proficiency Levels
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { skill: 'AUTOSAR BSW', level: 90, category: 'Expert' },
                { skill: 'C Programming', level: 85, category: 'Advanced' },
                { skill: 'Diagnostics (UDS)', level: 88, category: 'Expert' },
                { skill: 'Vector Tools', level: 92, category: 'Expert' },
                { skill: 'ECU Testing', level: 85, category: 'Advanced' },
                { skill: 'Python', level: 70, category: 'Intermediate' },
                { skill: 'Team Leadership', level: 80, category: 'Advanced' },
                { skill: 'Problem Solving', level: 95, category: 'Expert' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 rounded-lg glassmorphic border text-center group hover:border-opacity-60 transition-all duration-300"
                  style={{ borderColor: `${colors.primary}20` }}
                >
                  <div className="mb-3">
                    <h4 className="text-white font-semibold text-sm mb-1">{item.skill}</h4>
                    <p 
                      className="text-xs"
                      style={{ color: colors.accent }}
                    >
                      {item.category}
                    </p>
                  </div>
                  
                  {/* Circular Progress */}
                  <div className="relative w-16 h-16 mx-auto">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-white/20"
                      />
                      <motion.circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke={colors.primary}
                        strokeWidth="4"
                        fill="transparent"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: '0 175.9' }}
                        animate={isInView ? { 
                          strokeDasharray: `${(item.level / 100) * 175.9} 175.9` 
                        } : {}}
                        transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span 
                        className="font-bold text-sm"
                        style={{ color: colors.primary }}
                      >
                        {item.level}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}