'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from '@/providers/config-provider'
import { AdminProvider } from '@/providers/admin-provider'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { AdminContent } from './AdminContent'
import { PrismateAdminConfig } from '@/types/admin'
import { cn } from '@/lib/utils'

export interface PrismateAdminProps {
  config: PrismateAdminConfig
  className?: string
}

/**
 * PrismateAdmin - Complete admin panel with single import
 * 
 * @example
 * ```tsx
 * import { PrismateAdmin } from '@prismate/ui'
 * 
 * const models = [
 *   {
 *     name: 'user',
 *     displayName: 'Users',
 *     fields: [
 *       { name: 'id', type: 'number', required: true },
 *       { name: 'name', type: 'string', required: true },
 *       { name: 'email', type: 'email', required: true },
 *     ]
 *   }
 * ]
 * 
 * export default function AdminPage() {
 *   return (
 *     <PrismateAdmin
 *       config={{
 *         models,
 *         title: 'My Admin Panel',
 *         apiUrl: '/api/admin'
 *       }}
 *     />
 *   )
 * }
 * ```
 */
export function PrismateAdmin({ config, className }: PrismateAdminProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }))
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    config.layout?.sidebarDefaultCollapsed || false
  )
  
  // Apply direction from config
  React.useEffect(() => {
    if (config.i18n?.direction) {
      document.documentElement.dir = config.i18n.direction
    }
  }, [config.i18n?.direction])
  
  // Apply locale from config
  React.useEffect(() => {
    if (config.i18n?.locale) {
      document.documentElement.lang = config.i18n.locale
    }
  }, [config.i18n?.locale])
  
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        config={{
          theme: config.theme?.mode || 'system',
          direction: config.i18n?.direction || 'ltr',
          locale: config.i18n?.locale || 'en-US',
          apiBaseUrl: config.apiUrl || '/api/prismate',
          apiHeaders: config.apiHeaders,
        }}
      >
        <AdminProvider config={config}>
          <div 
            className={cn(
              "flex h-screen w-full overflow-hidden bg-background",
              className
            )}
          >
            {/* Sidebar */}
            <AdminSidebar
              collapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            
            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Header */}
              <AdminHeader />
              
              {/* Content */}
              <AdminContent />
            </div>
          </div>
        </AdminProvider>
      </ConfigProvider>
    </QueryClientProvider>
  )
}

// Export as default for easier import
export default PrismateAdmin