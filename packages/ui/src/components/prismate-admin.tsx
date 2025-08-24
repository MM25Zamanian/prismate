'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PrismateAdminProps, DetectedModel } from '@/types/prismate'
import { AdminLayout } from './admin-layout'
import { ModelList } from './model-list'
import { ModelDetail } from './model-detail'
import { ModelForm } from './model-form'
import { cn } from '@/lib/utils'

/**
 * PrismateAdmin - Single component admin panel with automatic model detection
 * 
 * @example
 * ```tsx
 * import { PrismateAdmin } from '@prismate/ui'
 * import { prismate } from './lib/prismate'
 * 
 * export default function AdminPage() {
 *   return <PrismateAdmin prismateInstance={prismate} />
 * }
 * ```
 */
export function PrismateAdmin({ 
  prismateInstance,
  overrides = {},
  onError,
  onSuccess,
  className
}: PrismateAdminProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }))

  // State management (simplified)
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [view, setView] = useState<'list' | 'detail' | 'create' | 'edit'>('list')

  // Auto-detect models from Prismate instance
  const detectedModels = useMemo(() => {
    if (!prismateInstance) return []
    
    try {
      // Get available models from Prismate core
      const availableModels = prismateInstance.getAvailableModels?.() || 
                              Object.keys(prismateInstance.schemas || {})
      
      return availableModels.map((modelName: string) => {
        // Get schema for this model
        const schema = prismateInstance.schemas?.[modelName] || 
                      prismateInstance.getSchema?.(modelName)
        
        // Apply overrides if any
        const modelOverride = overrides.models?.[modelName] || {}
        
        // Skip hidden models
        if (modelOverride.hidden) return null
        
        // Build model configuration
        const model: DetectedModel = {
          name: modelName,
          displayName: modelOverride.displayName || 
                      modelName.charAt(0).toUpperCase() + modelName.slice(1),
          pluralName: modelOverride.pluralName || 
                     modelName.charAt(0).toUpperCase() + modelName.slice(1) + 's',
          fields: extractFields(schema, modelOverride.fields) as any[],
          primaryKey: findPrimaryKey(schema) || 'id',
          timestamps: hasTimestamps(schema)
        }
        
        return model
      }).filter(Boolean)
    } catch (error) {
      console.error('Error detecting models:', error)
      onError?.(error as Error)
      return []
    }
  }, [prismateInstance, overrides.models, onError])

  // Apply theme settings
  useEffect(() => {
    if (overrides.ui?.theme) {
      document.documentElement.setAttribute('data-theme', overrides.ui.theme)
    }
    if (overrides.ui?.direction) {
      document.documentElement.dir = overrides.ui.direction
    }
  }, [overrides.ui])

  // Helper functions
  function extractFields(schema: any, fieldOverrides: any = {}) {
    if (!schema?.fields) return []
    
    return Object.entries(schema.fields).map(([fieldName, fieldDef]: [string, any]) => {
      const override = fieldOverrides[fieldName] || {}
      
      // Skip hidden fields
      if (override.hidden) return null
      
      return {
        name: fieldName,
        type: fieldDef.type || 'String',
        isList: fieldDef.isList || false,
        isRequired: fieldDef.isRequired || false,
        isUnique: fieldDef.isUnique || false,
        isId: fieldDef.isId || fieldName === 'id',
        isReadOnly: fieldDef.isReadOnly || fieldDef.isGenerated || false,
        isGenerated: fieldDef.isGenerated || false,
        defaultValue: fieldDef.default,
        relation: fieldDef.relation,
        enumValues: fieldDef.enumValues,
        // Apply UI overrides
        label: override.label || fieldName,
        placeholder: override.placeholder,
        helpText: override.helpText,
        component: override.component
      }
    }).filter(Boolean)
  }

  function findPrimaryKey(schema: any): string {
    const idField = Object.entries(schema?.fields || {})
      .find(([_, fieldDef]: [string, any]) => fieldDef.isId)
    return idField ? idField[0] : 'id'
  }

  function hasTimestamps(schema: any): boolean {
    const fields = schema?.fields || {}
    return 'createdAt' in fields && 'updatedAt' in fields
  }

  // Current model
  const currentModel = detectedModels.find((m: any) => m.name === selectedModel)

  // Handle model selection
  const handleModelSelect = (modelName: string) => {
    setSelectedModel(modelName)
    setSelectedRecord(null)
    setView('list')
  }

  // Handle view changes
  const handleViewChange = (newView: typeof view, record?: any) => {
    setView(newView)
    if (record) setSelectedRecord(record)
  }

  // Context value for child components
  const adminContext = {
    prismateInstance,
    models: detectedModels,
    currentModel,
    selectedModel,
    selectedRecord,
    view,
    overrides,
    onModelSelect: handleModelSelect,
    onViewChange: handleViewChange,
    onError,
    onSuccess
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AdminContext.Provider value={adminContext}>
        <div className={cn('flex h-screen w-full overflow-hidden bg-background', className)}>
          <AdminLayout>
            {!selectedModel ? (
              <Dashboard models={detectedModels} onModelSelect={handleModelSelect} />
            ) : view === 'list' ? (
              <ModelList />
            ) : view === 'detail' ? (
              <ModelDetail />
            ) : view === 'create' || view === 'edit' ? (
              <ModelForm mode={view} />
            ) : null}
          </AdminLayout>
        </div>
      </AdminContext.Provider>
    </QueryClientProvider>
  )
}

// Simple context for sharing state
const AdminContext = React.createContext<any>(null)
export const useAdminContext = () => {
  const context = React.useContext(AdminContext)
  if (!context) throw new Error('useAdminContext must be used within PrismateAdmin')
  return context
}

// Simple dashboard component
function Dashboard({ models, onModelSelect }: any) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {models.map((model: any) => (
          <div
            key={model.name}
            className="p-6 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onModelSelect(model.name)}
          >
            <h3 className="text-lg font-semibold mb-2">{model.displayName}</h3>
            <p className="text-sm text-muted-foreground">
              Manage {model.pluralName.toLowerCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PrismateAdmin