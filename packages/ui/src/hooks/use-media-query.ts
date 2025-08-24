import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    // Set the initial value
    setMatches(media.matches)

    // Define the listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add the listener
    if (media.addEventListener) {
      media.addEventListener('change', listener)
    } else {
      // Fallback for older browsers
      media.addListener(listener)
    }

    // Clean up
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener)
      } else {
        // Fallback for older browsers
        media.removeListener(listener)
      }
    }
  }, [query])

  return matches
}

// Predefined breakpoints matching Tailwind CSS
export function useBreakpoint() {
  const isSm = useMediaQuery('(min-width: 640px)')
  const isMd = useMediaQuery('(min-width: 768px)')
  const isLg = useMediaQuery('(min-width: 1024px)')
  const isXl = useMediaQuery('(min-width: 1280px)')
  const is2xl = useMediaQuery('(min-width: 1536px)')

  return {
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    // Convenient helpers
    isMobile: !isMd,
    isTablet: isMd && !isLg,
    isDesktop: isLg,
  }
}

// Check if user prefers reduced motion
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

// Check if user prefers dark color scheme
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)')
}

// Check device orientation
export function useOrientation(): 'portrait' | 'landscape' {
  const isPortrait = useMediaQuery('(orientation: portrait)')
  return isPortrait ? 'portrait' : 'landscape'
}