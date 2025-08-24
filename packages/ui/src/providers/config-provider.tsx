'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { PrismateUIConfig, Theme, Direction } from '@/types'
import { deepMerge } from '@/lib/utils'

// Default configuration
const defaultConfig: PrismateUIConfig = {
  theme: 'system',
  direction: 'ltr',
  locale: 'en-US',
  apiBaseUrl: '/api',
  apiHeaders: {},
  dateFormat: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  numberFormat: {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  },
  features: {
    search: true,
    filter: true,
    sort: true,
    pagination: true,
    export: true,
    import: true,
    bulkActions: true,
    virtualization: true,
    infiniteScroll: false,
    realtime: false,
  },
  customComponents: {},
  hooks: {},
}

// Context type
interface ConfigContextType {
  config: PrismateUIConfig
  updateConfig: (updates: Partial<PrismateUIConfig>) => void
  theme: Theme
  setTheme: (theme: Theme) => void
  direction: Direction
  setDirection: (direction: Direction) => void
  locale: string
  setLocale: (locale: string) => void
}

// Create context
const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

// Provider props
export interface ConfigProviderProps {
  children: React.ReactNode
  config?: Partial<PrismateUIConfig>
  defaultTheme?: Theme
  storageKey?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

// Provider component
export function ConfigProvider({
  children,
  config: userConfig,
  defaultTheme = 'system',
  storageKey = 'prismate-ui-config',
  enableSystem = true,
  disableTransitionOnChange = false,
}: ConfigProviderProps) {
  // Merge user config with defaults
  const [config, setConfig] = useState<PrismateUIConfig>(() => 
    deepMerge(defaultConfig, userConfig || {})
  )

  // Theme management
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`${storageKey}-theme`)
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored as Theme
      }
    }
    return config.theme || defaultTheme
  })

  // Direction management
  const [direction, setDirectionState] = useState<Direction>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`${storageKey}-direction`)
      if (stored && ['ltr', 'rtl'].includes(stored)) {
        return stored as Direction
      }
    }
    return config.direction || 'ltr'
  })

  // Locale management
  const [locale, setLocaleState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`${storageKey}-locale`)
      if (stored) return stored
    }
    return config.locale || 'en-US'
  })

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement

    // Remove previous theme classes
    root.classList.remove('light', 'dark')

    // Handle system theme
    if (enableSystem && theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.remove('light', 'dark')
        root.classList.add(e.matches ? 'dark' : 'light')
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else if (theme !== 'system') {
      root.classList.add(theme)
    }
  }, [theme, enableSystem])

  // Apply direction to document
  useEffect(() => {
    const root = window.document.documentElement
    root.dir = direction
    root.setAttribute('dir', direction)
  }, [direction])

  // Apply locale to document
  useEffect(() => {
    const root = window.document.documentElement
    root.lang = locale
    root.setAttribute('lang', locale)
  }, [locale])

  // Save theme to localStorage
  const setTheme = (newTheme: Theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${storageKey}-theme`, newTheme)
    }
    
    if (disableTransitionOnChange) {
      const root = window.document.documentElement
      root.style.transition = 'none'
      setThemeState(newTheme)
      
      // Re-enable transitions after a frame
      requestAnimationFrame(() => {
        root.style.transition = ''
      })
    } else {
      setThemeState(newTheme)
    }
    
    setConfig(prev => ({ ...prev, theme: newTheme }))
  }

  // Save direction to localStorage
  const setDirection = (newDirection: Direction) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${storageKey}-direction`, newDirection)
    }
    setDirectionState(newDirection)
    setConfig(prev => ({ ...prev, direction: newDirection }))
  }

  // Save locale to localStorage
  const setLocale = (newLocale: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${storageKey}-locale`, newLocale)
    }
    setLocaleState(newLocale)
    setConfig(prev => ({ ...prev, locale: newLocale }))
  }

  // Update config
  const updateConfig = (updates: Partial<PrismateUIConfig>) => {
    setConfig(prev => deepMerge(prev, updates))
  }

  // Context value
  const value: ConfigContextType = {
    config,
    updateConfig,
    theme,
    setTheme,
    direction,
    setDirection,
    locale,
    setLocale,
  }

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  )
}

// Hook to use config
export function useConfig() {
  const context = useContext(ConfigContext)
  
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  
  return context
}

// Hook to use theme
export function useTheme() {
  const { theme, setTheme } = useConfig()
  return { theme, setTheme }
}

// Hook to use direction
export function useDirection() {
  const { direction, setDirection } = useConfig()
  return { direction, setDirection }
}

// Hook to use locale
export function useLocale() {
  const { locale, setLocale } = useConfig()
  return { locale, setLocale }
}