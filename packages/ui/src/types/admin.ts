import { ReactNode } from 'react'
import { ModelSchema } from './index'

export interface PrismateAdminConfig {
  // API Configuration
  apiUrl?: string
  apiHeaders?: Record<string, string>
  
  // Models Configuration
  models: ModelSchema[]
  
  // UI Configuration
  title?: string
  logo?: ReactNode | string
  favicon?: string
  description?: string
  
  // Layout Configuration
  layout?: {
    sidebarWidth?: number | string
    headerHeight?: number | string
    contentPadding?: number | string
    sidebarCollapsible?: boolean
    sidebarDefaultCollapsed?: boolean
  }
  
  // Theme Configuration
  theme?: {
    mode?: 'light' | 'dark' | 'system'
    primaryColor?: string
    accentColor?: string
    borderRadius?: string
    fontSize?: string
  }
  
  // Features
  features?: {
    search?: boolean
    filters?: boolean
    sorting?: boolean
    pagination?: boolean
    export?: boolean
    import?: boolean
    bulkActions?: boolean
    realtime?: boolean
    darkMode?: boolean
    i18n?: boolean
    notifications?: boolean
  }
  
  // Permissions
  permissions?: {
    canCreate?: boolean | ((model: string) => boolean)
    canRead?: boolean | ((model: string) => boolean)
    canUpdate?: boolean | ((model: string) => boolean)
    canDelete?: boolean | ((model: string) => boolean)
    canExport?: boolean | ((model: string) => boolean)
    canImport?: boolean | ((model: string) => boolean)
  }
  
  // Custom Components
  customComponents?: {
    logo?: ReactNode
    footer?: ReactNode
    emptyState?: ReactNode
    errorBoundary?: ReactNode
    notFound?: ReactNode
    unauthorized?: ReactNode
  }
  
  // Localization
  i18n?: {
    locale?: string
    direction?: 'ltr' | 'rtl'
    translations?: Record<string, any>
    dateFormat?: string
    numberFormat?: string
  }
  
  // Callbacks
  onError?: (error: Error) => void
  onSuccess?: (message: string) => void
  onNavigate?: (path: string) => void
  onModelSelect?: (model: string) => void
  onRecordSelect?: (model: string, id: string | number) => void
  onAction?: (action: string, model: string, data?: any) => void
}

export interface AdminRoute {
  path: string
  model?: string
  view?: 'list' | 'detail' | 'create' | 'edit'
  id?: string | number
}

export interface AdminBreadcrumb {
  label: string
  path?: string
  icon?: ReactNode
}

export interface AdminNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface AdminState {
  selectedModel?: string
  selectedRecord?: any
  view: 'list' | 'detail' | 'create' | 'edit'
  filters: Record<string, any>
  sorting: Array<{ field: string; order: 'asc' | 'desc' }>
  pagination: {
    page: number
    pageSize: number
    total: number
  }
  search: string
  selectedRows: Set<string | number>
}