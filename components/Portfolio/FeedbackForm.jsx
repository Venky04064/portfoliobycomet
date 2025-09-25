import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { Star, Send, MessageCircle } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function FeedbackForm() {
  const { getCurrentThemeColors } = useTheme()
  const colors = getCurrentThemeColors()
  
  const [feedback, setFeedback] = useState({
    rating: 0,
    message: '',
    visitor_name: '',
    visitor_email: ''
  })
  const [hoveredRating, setHoveredRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (feedback.rating === 0) {
      toast.error('Please select a rating')
      return
    }
    
    if (!feedback.message.trim()) {
      toast.error('Please write a message')
      return
    }

    setSubmitting(true)
    
    try {
      await axios.post('/api/feedback', feedback)
      toast.success('Thank you for your feedback!')
      
      // Reset form
      setFeedback({
        rating: 0,
        message: '',
        visitor_name: '',
        visitor_email: ''
      })
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      toast.error('Failed to submit feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section 
      className="py-20"
      style={{
        background: `linear-gradient(to bottom, ${colors.surface}, ${colors.background})`
      }}
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="glassmorphic-card p-8 rounded-3xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ backgroundColor: colors.primary }}
              >
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Share Your <span style={{ color: colors.primary }}>Feedback</span>
              </h2>
              
              <p className="text-gray-300 text-lg">
                Your thoughts help me improve and create better experiences
              </p>
            </motion.div>

            {/* Feedback Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Rating */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  How would you rate your experience?
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <motion.button
                      key={rating}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setFeedback(prev => ({ ...prev, rating }))}
                      onMouseEnter={() => setHoveredRating(rating)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors duration-200 ${
                          rating <= (hoveredRating || feedback.rating)
                            ? 'fill-current'
                            : 'text-gray-500'
                        }`}
                        style={{
                          color: rating <= (hoveredRating || feedback.rating) ? colors.accent : '#6B7280'
                        }}
                      />
                    </motion.button>
                  ))}
                </div>
                {feedback.rating > 0 && (
                  <p className="text-center text-gray-400 text-sm mt-2">
                    {feedback.rating === 1 && "Poor"}
                    {feedback.rating === 2 && "Fair"}
                    {feedback.rating === 3 && "Good"}
                    {feedback.rating === 4 && "Very Good"}
                    {feedback.rating === 5 && "Excellent"}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Your Message *
                </label>
                <textarea
                  value={feedback.message}
                  onChange={(e) => setFeedback(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Share your thoughts, suggestions, or feedback..."
                  rows={4}
                  required
                  className="w-full px-4 py-3 glassmorphic border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 resize-none"
                  style={{
                    borderColor: `${colors.primary}20`,
                    focusRingColor: `${colors.primary}20`
                  }}
                />
              </div>

              {/* Optional Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={feedback.visitor_name}
                    onChange={(e) => setFeedback(prev => ({ ...prev, visitor_name: e.target.value }))}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 glassmorphic border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300"
                    style={{
                      borderColor: `${colors.primary}20`
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Your Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={feedback.visitor_email}
                    onChange={(e) => setFeedback(prev => ({ ...prev, visitor_email: e.target.value }))}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 glassmorphic border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300"
                    style={{
                      borderColor: `${colors.primary}20`
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={submitting || feedback.rating === 0 || !feedback.message.trim()}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className="w-full py-4 px-6 text-white font-semibold rounded-full transition-all duration-300 transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                  boxShadow: `0 10px 30px ${colors.primary}25`
                }}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Feedback
                  </>
                )}
              </motion.button>

              <p className="text-xs text-gray-400 text-center">
                Your feedback helps improve the portfolio experience.
              </p>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}