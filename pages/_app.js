import { ThemeProvider } from '../contexts/ThemeContext'
import { AuthProvider } from '../contexts/AuthContext'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast' // ✅ HERO FIX: Added missing Toaster import
import '../styles/globals.css'
import Head from 'next/head'
import { useEffect } from 'react' // ✅ HERO FIX: Added useEffect for error handling

// ✅ HERO FIX: Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-red-400">Oops! Something went wrong</h1>
            <p className="text-gray-400 mb-6">We're sorry for the inconvenience. Please refresh the page to try again.</p>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.reload()} 
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                🔄 Refresh Page
              </button>
              <button 
                onClick={() => this.setState({ hasError: false, error: null })} 
                className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                🔄 Try Again
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left text-sm">
                <summary className="cursor-pointer text-gray-500">Error Details</summary>
                <pre className="mt-2 p-2 bg-gray-800 rounded text-red-300 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default function App({ Component, pageProps, router }) {
  // ✅ HERO FIX: Enhanced error handling and performance monitoring
  useEffect(() => {
    // Global error handler
    const handleError = (error) => {
      console.error('Global error:', error)
    }

    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason)
    }

    // Performance monitoring
    const handleLoad = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart
        if (loadTime > 5000) {
          console.warn('Slow page load detected:', loadTime + 'ms')
        }
      }
    }

    // Service Worker Registration
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js')
          console.log('ServiceWorker registration successful:', registration)
        } catch (error) {
          console.log('ServiceWorker registration failed:', error)
        }
      }
    }

    // Event listeners
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('load', handleLoad)

    // Register service worker
    registerServiceWorker()

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('load', handleLoad)
    }
  }, [])

  return (
    <ErrorBoundary>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6B46C1" />
        
        {/* ✅ HERO FIX: Enhanced PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Portfolio by Comet" />
        <meta name="description" content="Advanced portfolio with 25+ glassmorphic themes and 3D animations" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#6B46C1" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Font Preloads - Enhanced */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500;700&family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=Lato:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
        
        {/* ✅ HERO FIX: Performance Hints */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://api.portfoliobycomet.com" />
      </Head>
      
      <ThemeProvider>
        <AuthProvider>
          <AnimatePresence
            mode="wait"
            initial={false}
            onExitComplete={() => {
              if (typeof window !== 'undefined') {
                window.scrollTo(0, 0)
              }
            }}
          >
            <Component {...pageProps} key={router.asPath} />
          </AnimatePresence>
          
          {/* ✅ HERO FIX: Enhanced Toaster with custom styling */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Default options
              className: '',
              duration: 4000,
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              },
              
              // Success toast styling
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#FFFFFF',
                },
                style: {
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                },
              },
              
              // Error toast styling
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#FFFFFF',
                },
                style: {
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                },
              },
              
              // Loading toast styling
              loading: {
                duration: Infinity,
                style: {
                  background: 'rgba(107, 70, 193, 0.1)',
                  border: '1px solid rgba(107, 70, 193, 0.3)',
                },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}