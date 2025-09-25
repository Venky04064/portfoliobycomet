import Head from 'next/head'
import { useTheme } from '../../contexts/ThemeContext'

export default function Layout({ children, title = "Portfolio by Comet", description = "Dynamic portfolio with glassmorphic themes and 3D animations" }) {
  const { currentTheme, getCurrentThemeColors } = useTheme()
  const colors = getCurrentThemeColors()

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Dynamic theme color for mobile browsers */}
        <meta name="theme-color" content={colors.primary} />
        <meta name="msapplication-navbutton-color" content={colors.primary} />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Open Graph meta tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        
        {/* Performance hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      
      <div className={`min-h-screen theme-${currentTheme} font-inter transition-all duration-500`}>
        {children}
      </div>
    </>
  )
}