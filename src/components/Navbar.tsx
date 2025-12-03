import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiMoon, HiSun } from 'react-icons/hi'
import { useThemeStore } from '@/stores/themeStore'

export default function Navbar() {
  const { theme, toggleTheme } = useThemeStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHomePage = location.pathname === '/'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-line'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-lg font-bold hover:opacity-70 transition-opacity"
          >
            What Can I Say?
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 hover-bg rounded-md transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <HiSun className="w-5 h-5" />
              ) : (
                <HiMoon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
