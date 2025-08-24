import { ReactNode } from 'react'

// Simplified interface that works with Prismate core
export interface PrismateAdminProps {
  prismateInstance: any // The actual Prismate instance from @prismate/core
  
  // Simple override system
  overrides?: {
    // Model-level overrides
    models?: {
      [modelName: string]: {
        hidden?: boolean
        displayName?: string
        pluralName?: string
        icon?: ReactNode
        fields?: {
          [fieldName: string]: {
            hidden?: boolean
            label?: string
            placeholder?: string
            helpText?: string
            component?: 'text' | 'textarea' | 'number' | 'email' | 'select' | 'date' | 'checkbox'
          }
        }
        actions?: {
          create?: boolean
          edit?: boolean
          delete?: boolean
          export?: boolean
        }
      }
    }
    
    // UI customization
    ui?: {
      title?: string
      logo?: ReactNode
      theme?: 'light' | 'dark' | 'system'
      layout?: 'sidebar' | 'tabs' | 'dropdown'
      direction?: 'ltr' | 'rtl'
      locale?: string
    }
    
    // API configuration (if not using Prismate's built-in)
    api?: {
      baseUrl?: string
      headers?: Record<string, string>
    }
  }
  
  // Optional callbacks
  onError?: (error: Error) => void
  onSuccess?: (message: string) => void
  className?: string
}

// Auto-detected model from Prismate
export interface DetectedModel {
  name: string
  displayName: string
  pluralName: string
  fields: DetectedField[]
  primaryKey: string
  timestamps?: boolean
}

// Auto-detected field from Prismate schema
export interface DetectedField {
  name: string
  type: string // Prisma type: String, Int, Boolean, DateTime, etc.
  isList?: boolean
  isRequired?: boolean
  isUnique?: boolean
  isId?: boolean
  isReadOnly?: boolean
  isGenerated?: boolean
  defaultValue?: any
  relation?: {
    to: string
    type: 'one-to-one' | 'one-to-many' | 'many-to-many'
  }
  enumValues?: string[]
}