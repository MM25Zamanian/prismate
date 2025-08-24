import { ReactNode, ComponentType, HTMLAttributes } from 'react'
import { z } from 'zod'

// Direction types
export type Direction = 'ltr' | 'rtl'

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// Common component props
export interface BaseComponentProps extends HTMLAttributes<HTMLElement> {
  className?: string
  children?: ReactNode
  asChild?: boolean
  dir?: Direction
}

// Configuration types
export interface PrismateUIConfig {
  theme?: Theme
  direction?: Direction
  locale?: string
  apiBaseUrl?: string
  apiHeaders?: Record<string, string>
  dateFormat?: Intl.DateTimeFormatOptions
  numberFormat?: Intl.NumberFormatOptions
  features?: {
    search?: boolean
    filter?: boolean
    sort?: boolean
    pagination?: boolean
    export?: boolean
    import?: boolean
    bulkActions?: boolean
    virtualization?: boolean
    infiniteScroll?: boolean
    realtime?: boolean
  }
  customComponents?: {
    [key: string]: ComponentType<any>
  }
  hooks?: {
    beforeRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
    afterRequest?: (response: any) => any | Promise<any>
    onError?: (error: Error) => void
  }
}

// API types
export interface RequestConfig {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  params?: Record<string, any>
  data?: any
  timeout?: number
  withCredentials?: boolean
}

export interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
  search?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasMore: boolean
}

// Model types
export interface ModelField {
  name: string
  type: FieldType
  label?: string
  required?: boolean
  unique?: boolean
  defaultValue?: any
  validation?: z.ZodType<any>
  description?: string
  placeholder?: string
  options?: FieldOption[]
  min?: number
  max?: number
  step?: number
  pattern?: string
  readOnly?: boolean
  hidden?: boolean
  group?: string
  order?: number
  format?: string
  component?: ComponentType<any>
  componentProps?: Record<string, any>
}

export type FieldType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'time'
  | 'email'
  | 'url'
  | 'tel'
  | 'text'
  | 'password'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'file'
  | 'image'
  | 'color'
  | 'range'
  | 'rating'
  | 'json'
  | 'relation'
  | 'custom'

export interface FieldOption {
  value: any
  label: string
  disabled?: boolean
  icon?: ReactNode
  description?: string
}

export interface ModelSchema {
  name: string
  displayName?: string
  pluralName?: string
  description?: string
  icon?: ReactNode
  fields: ModelField[]
  primaryKey?: string
  timestamps?: boolean
  softDelete?: boolean
  searchFields?: string[]
  defaultSort?: {
    field: string
    order: 'asc' | 'desc'
  }
  permissions?: {
    create?: boolean
    read?: boolean
    update?: boolean
    delete?: boolean
    export?: boolean
    import?: boolean
  }
  hooks?: {
    beforeCreate?: (data: any) => any | Promise<any>
    afterCreate?: (data: any) => void | Promise<void>
    beforeUpdate?: (data: any) => any | Promise<any>
    afterUpdate?: (data: any) => void | Promise<void>
    beforeDelete?: (id: any) => void | Promise<void>
    afterDelete?: (id: any) => void | Promise<void>
  }
}

// Table types
export interface Column<T = any> {
  id: string
  header: string | ReactNode
  accessorKey?: string
  accessorFn?: (row: T) => any
  cell?: (props: { row: T; value: any }) => ReactNode
  size?: number
  minSize?: number
  maxSize?: number
  enableSorting?: boolean
  enableFiltering?: boolean
  enableHiding?: boolean
  enableResizing?: boolean
  filterFn?: (row: T, columnId: string, filterValue: any) => boolean
  sortingFn?: (rowA: T, rowB: T, columnId: string) => number
  aggregationFn?: (values: any[]) => any
  meta?: Record<string, any>
}

export interface TableState {
  sorting?: Array<{ id: string; desc: boolean }>
  filtering?: Array<{ id: string; value: any }>
  pagination?: {
    pageIndex: number
    pageSize: number
  }
  selection?: Record<string, boolean>
  expanded?: Record<string, boolean>
  grouping?: string[]
  columnVisibility?: Record<string, boolean>
  columnOrder?: string[]
  columnSizing?: Record<string, number>
}

// Form types
export interface FormField<T = any> {
  name: string
  label?: string
  type: FieldType
  value?: T
  defaultValue?: T
  placeholder?: string
  description?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  validation?: z.ZodType<T>
  error?: string
  touched?: boolean
  onChange?: (value: T) => void
  onBlur?: () => void
  onFocus?: () => void
}

export interface FormState<T = any> {
  values: T
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValidating: boolean
  isDirty: boolean
  isValid: boolean
}

// Hook types
export interface UseQueryOptions<T = any> {
  enabled?: boolean
  refetchInterval?: number
  refetchOnWindowFocus?: boolean
  refetchOnMount?: boolean
  retry?: number | boolean
  retryDelay?: number
  staleTime?: number
  cacheTime?: number
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  onSettled?: (data?: T, error?: Error) => void
}

export interface UseMutationOptions<T = any, V = any> {
  onSuccess?: (data: T, variables: V) => void | Promise<void>
  onError?: (error: Error, variables: V) => void
  onSettled?: (data?: T, error?: Error, variables?: V) => void
  onMutate?: (variables: V) => any | Promise<any>
}

// Action types
export type ActionType = 'create' | 'edit' | 'delete' | 'view' | 'export' | 'import' | 'custom'

export interface Action<T = any> {
  id: string
  label: string
  icon?: ReactNode
  type: ActionType
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  onClick?: (item?: T) => void | Promise<void>
  href?: string
  target?: '_self' | '_blank'
  disabled?: boolean | ((item?: T) => boolean)
  hidden?: boolean | ((item?: T) => boolean)
  confirmation?: {
    title: string
    description?: string
    confirmText?: string
    cancelText?: string
  }
  bulk?: boolean
  position?: 'start' | 'end'
  group?: string
  order?: number
}

// Layout types
export interface MenuItem {
  id: string
  label: string
  icon?: ReactNode
  href?: string
  onClick?: () => void
  children?: MenuItem[]
  disabled?: boolean
  hidden?: boolean
  badge?: string | number
  group?: string
  order?: number
}

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: ReactNode
  active?: boolean
}

// Export types
export type ExportFormat = 'csv' | 'excel' | 'json' | 'pdf'

export interface ExportOptions {
  format: ExportFormat
  filename?: string
  columns?: string[]
  includeHeaders?: boolean
  dateFormat?: string
  numberFormat?: string
  delimiter?: string
  encoding?: string
}

// Import types
export interface ImportOptions {
  format: 'csv' | 'excel' | 'json'
  mapping?: Record<string, string>
  skipRows?: number
  maxRows?: number
  validation?: boolean
  upsert?: boolean
  onProgress?: (progress: number) => void
}

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id?: string
  type: NotificationType
  title: string
  description?: string
  duration?: number
  closable?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

// Filter types
export type FilterOperator = 
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'greater_than_or_equal'
  | 'less_than'
  | 'less_than_or_equal'
  | 'between'
  | 'in'
  | 'not_in'
  | 'is_null'
  | 'is_not_null'

export interface Filter {
  field: string
  operator: FilterOperator
  value: any
  label?: string
  type?: FieldType
}

// Search types
export interface SearchConfig {
  placeholder?: string
  fields?: string[]
  minLength?: number
  debounce?: number
  fuzzy?: boolean
  highlight?: boolean
  suggestions?: boolean
  maxSuggestions?: number
}

// Virtualization types
export interface VirtualizerOptions {
  count: number
  estimateSize: (index: number) => number
  overscan?: number
  horizontal?: boolean
  scrollElement?: HTMLElement | Window | null
  scrollMargin?: number
  scrollPadding?: number
  initialOffset?: number
  initialIndex?: number
  getItemKey?: (index: number) => string | number
  rangeExtractor?: (range: { start: number; end: number }) => number[]
  enableSmoothScroll?: boolean
  scrollToFn?: (offset: number, behavior?: ScrollBehavior) => void
}

// Export simplified types
export * from './prismate'

// Chart types
export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
    fill?: boolean
    tension?: number
  }>
}

export interface ChartOptions {
  responsive?: boolean
  maintainAspectRatio?: boolean
  plugins?: {
    legend?: {
      display?: boolean
      position?: 'top' | 'bottom' | 'left' | 'right'
    }
    tooltip?: {
      enabled?: boolean
      mode?: 'index' | 'dataset' | 'point' | 'nearest'
    }
  }
  scales?: {
    x?: {
      display?: boolean
      grid?: {
        display?: boolean
      }
    }
    y?: {
      display?: boolean
      grid?: {
        display?: boolean
      }
    }
  }
}