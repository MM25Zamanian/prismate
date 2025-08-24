'use client'

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { PrismateAdminConfig, AdminState, AdminNotification } from '@/types/admin'
import { ModelSchema } from '@/types'
import { ApiClient } from '@/lib/api-client'

interface AdminContextType {
  config: PrismateAdminConfig
  state: AdminState
  setState: React.Dispatch<React.SetStateAction<AdminState>>
  
  // Model management
  models: ModelSchema[]
  currentModel?: ModelSchema
  selectModel: (modelName: string) => void
  
  // View management
  setView: (view: AdminState['view']) => void
  
  // Record management
  selectRecord: (record: any) => void
  clearSelectedRecord: () => void
  
  // Filtering and sorting
  setFilters: (filters: Record<string, any>) => void
  setSorting: (sorting: AdminState['sorting']) => void
  setSearch: (search: string) => void
  
  // Pagination
  setPagination: (pagination: Partial<AdminState['pagination']>) => void
  
  // Selection
  toggleRowSelection: (id: string | number) => void
  clearSelection: () => void
  selectAll: (ids: (string | number)[]) => void
  
  // Notifications
  notifications: AdminNotification[]
  addNotification: (notification: Omit<AdminNotification, 'id'>) => void
  removeNotification: (id: string) => void
  
  // API client
  apiClient: ApiClient
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export interface AdminProviderProps {
  children: React.ReactNode
  config: PrismateAdminConfig
}

export function AdminProvider({ children, config }: AdminProviderProps) {
  // Initialize API client
  const apiClient = useMemo(() => new ApiClient({
    baseUrl: config.apiUrl || '/api/prismate',
    headers: config.apiHeaders,
  }), [config.apiUrl, config.apiHeaders])
  
  // Admin state
  const [state, setState] = useState<AdminState>({
    view: 'list',
    filters: {},
    sorting: [],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
    },
    search: '',
    selectedRows: new Set(),
  })
  
  // Notifications
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  
  // Get current model
  const currentModel = useMemo(() => {
    return config.models.find(m => m.name === state.selectedModel)
  }, [config.models, state.selectedModel])
  
  // Model management
  const selectModel = useCallback((modelName: string) => {
    setState(prev => ({
      ...prev,
      selectedModel: modelName,
      selectedRecord: undefined,
      view: 'list',
      filters: {},
      sorting: [],
      search: '',
      selectedRows: new Set(),
      pagination: {
        ...prev.pagination,
        page: 1,
      },
    }))
    config.onModelSelect?.(modelName)
  }, [config])
  
  // View management
  const setView = useCallback((view: AdminState['view']) => {
    setState(prev => ({ ...prev, view }))
  }, [])
  
  // Record management
  const selectRecord = useCallback((record: any) => {
    setState(prev => ({ ...prev, selectedRecord: record, view: 'detail' }))
    if (state.selectedModel && record?.id) {
      config.onRecordSelect?.(state.selectedModel, record.id)
    }
  }, [config, state.selectedModel])
  
  const clearSelectedRecord = useCallback(() => {
    setState(prev => ({ ...prev, selectedRecord: undefined }))
  }, [])
  
  // Filtering and sorting
  const setFilters = useCallback((filters: Record<string, any>) => {
    setState(prev => ({ 
      ...prev, 
      filters,
      pagination: { ...prev.pagination, page: 1 }
    }))
  }, [])
  
  const setSorting = useCallback((sorting: AdminState['sorting']) => {
    setState(prev => ({ ...prev, sorting }))
  }, [])
  
  const setSearch = useCallback((search: string) => {
    setState(prev => ({ 
      ...prev, 
      search,
      pagination: { ...prev.pagination, page: 1 }
    }))
  }, [])
  
  // Pagination
  const setPagination = useCallback((pagination: Partial<AdminState['pagination']>) => {
    setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, ...pagination }
    }))
  }, [])
  
  // Selection
  const toggleRowSelection = useCallback((id: string | number) => {
    setState(prev => {
      const newSelection = new Set(prev.selectedRows)
      if (newSelection.has(id)) {
        newSelection.delete(id)
      } else {
        newSelection.add(id)
      }
      return { ...prev, selectedRows: newSelection }
    })
  }, [])
  
  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedRows: new Set() }))
  }, [])
  
  const selectAll = useCallback((ids: (string | number)[]) => {
    setState(prev => ({ ...prev, selectedRows: new Set(ids) }))
  }, [])
  
  // Notifications
  const addNotification = useCallback((notification: Omit<AdminNotification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`
    const newNotification: AdminNotification = { ...notification, id }
    
    setNotifications(prev => [...prev, newNotification])
    
    // Auto-remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 5000)
    }
  }, [])
  
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])
  
  // Context value
  const value: AdminContextType = {
    config,
    state,
    setState,
    models: config.models,
    currentModel,
    selectModel,
    setView,
    selectRecord,
    clearSelectedRecord,
    setFilters,
    setSorting,
    setSearch,
    setPagination,
    toggleRowSelection,
    clearSelection,
    selectAll,
    notifications,
    addNotification,
    removeNotification,
    apiClient,
  }
  
  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}