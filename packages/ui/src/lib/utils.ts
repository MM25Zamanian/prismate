import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names with tailwind-merge for proper class precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Checks if the current direction is RTL
 */
export function isRTL(): boolean {
  if (typeof window === 'undefined') return false
  return document.documentElement.dir === 'rtl' || 
         document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.dir === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

/**
 * Returns direction-aware class names
 */
export function directionClass(ltrClass: string, rtlClass: string): string {
  return isRTL() ? rtlClass : ltrClass
}

/**
 * Format number based on locale
 */
export function formatNumber(value: number, locale?: string): string {
  if (!locale && typeof window !== 'undefined') {
    locale = document.documentElement.lang || 'en-US'
  }
  return new Intl.NumberFormat(locale || 'en-US').format(value)
}

/**
 * Format date based on locale
 */
export function formatDate(date: Date | string, locale?: string, options?: Intl.DateTimeFormatOptions): string {
  if (!locale && typeof window !== 'undefined') {
    locale = document.documentElement.lang || 'en-US'
  }
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale || 'en-US', options).format(dateObj)
}

/**
 * Get opposite direction
 */
export function getOppositeDirection(direction: 'ltr' | 'rtl'): 'ltr' | 'rtl' {
  return direction === 'ltr' ? 'rtl' : 'ltr'
}

/**
 * Apply RTL-aware transform
 */
export function getDirectionalTransform(value: number, direction?: 'ltr' | 'rtl'): string {
  const dir = direction || (isRTL() ? 'rtl' : 'ltr')
  const multiplier = dir === 'rtl' ? -1 : 1
  return `translateX(${value * multiplier}px)`
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      if (timeout) {
        clearTimeout(timeout)
      }
      func(...args)
    }
    
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Generate unique ID
 */
export function generateId(prefix?: string): string {
  const random = Math.random().toString(36).substring(2, 9)
  const timestamp = Date.now().toString(36)
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMerge(target[key] as any, source[key] as any)
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Safe JSON parse
 */
export function safeJSONParse<T = any>(value: string, fallback?: T): T | undefined {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value == null) return true
  if (typeof value === 'boolean') return false
  if (typeof value === 'number') return false
  if (value instanceof Date) return false
  if (value instanceof Error) return value.message === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'string') return value.trim().length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number, suffix = '...'): string {
  if (text.length <= length) return text
  return text.substring(0, length - suffix.length) + suffix
}