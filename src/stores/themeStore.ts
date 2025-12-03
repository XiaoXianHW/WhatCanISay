import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeMode } from '../types'
import config from '../../config/public.config'

interface ThemeStore {
  theme: ThemeMode
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void
  initTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: config.theme.defaultMode as ThemeMode,
      
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      
      setTheme: (theme) => set({ theme }),
      
      initTheme: () => {
        const savedTheme = localStorage.getItem('theme-storage')
        if (savedTheme) {
          const parsed = JSON.parse(savedTheme)
          set({ theme: parsed.state.theme })
        } else {
          set({ theme: config.theme.defaultMode as ThemeMode })
        }
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)
