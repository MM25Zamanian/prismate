// Main Admin Component - Single Import
export { PrismateAdmin, default as default } from './components/prismate-admin'
export type { PrismateAdminProps } from './types/prismate'

// Components (if needed separately)
export * from './components'

// Hooks (if needed separately)
export * from './hooks'

// Types
export * from './types'

// Utilities
export * from './lib/utils'

// Config Provider (kept for backward compatibility)
export * from './providers/config-provider'

// Styles - users should import this separately
// import '@prismate/ui/styles' or import '@prismate/ui/dist/styles.css'