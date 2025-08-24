'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useAdmin } from '@/providers/admin-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Moon,
  Sun,
  Bell,
  User,
  ChevronRight
} from 'lucide-react'
import { useTheme } from '@/providers/config-provider'

export interface AdminHeaderProps {
  className?: string
}

export function AdminHeader({ className }: AdminHeaderProps) {
  const { config, state, currentModel, setView, setSearch } = useAdmin()
  const { theme, setTheme } = useTheme()
  
  // Build breadcrumbs
  const breadcrumbs = []
  if (state.selectedModel) {
    breadcrumbs.push({
      label: currentModel?.displayName || state.selectedModel,
      active: state.view === 'list'
    })
    
    if (state.view === 'create') {
      breadcrumbs.push({ label: 'New', active: true })
    } else if (state.view === 'edit' && state.selectedRecord) {
      breadcrumbs.push({ 
        label: `Edit #${state.selectedRecord.id}`, 
        active: true 
      })
    } else if (state.view === 'detail' && state.selectedRecord) {
      breadcrumbs.push({ 
        label: `#${state.selectedRecord.id}`, 
        active: true 
      })
    }
  }
  
  // Check permissions
  const canCreate = typeof config.permissions?.canCreate === 'function' 
    ? config.permissions.canCreate(state.selectedModel || '')
    : config.permissions?.canCreate !== false
    
  const canExport = typeof config.permissions?.canExport === 'function'
    ? config.permissions.canExport(state.selectedModel || '')
    : config.permissions?.canExport !== false
    
  const canImport = typeof config.permissions?.canImport === 'function'
    ? config.permissions.canImport(state.selectedModel || '')
    : config.permissions?.canImport !== false
  
  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between border-b bg-background px-6",
        className
      )}
    >
      {/* Left Section - Breadcrumbs & Search */}
      <div className="flex items-center gap-4 flex-1">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('list')}
              className="text-muted-foreground"
            >
              Home
            </Button>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                {crumb.active ? (
                  <span className="font-medium">{crumb.label}</span>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView('list')}
                  >
                    {crumb.label}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        
        {/* Search */}
        {config.features?.search !== false && state.view === 'list' && (
          <div className="relative max-w-md flex-1">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="ps-10"
              value={state.search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        {/* Model Actions */}
        {state.selectedModel && state.view === 'list' && (
          <>
            {canCreate && (
              <Button
                size="sm"
                onClick={() => setView('create')}
              >
                <Plus className="h-4 w-4 me-1" />
                New {currentModel?.displayName || 'Record'}
              </Button>
            )}
            
            {config.features?.filters !== false && (
              <Button
                variant="outline"
                size="sm"
              >
                <Filter className="h-4 w-4 me-1" />
                Filter
              </Button>
            )}
            
            {canExport && config.features?.export !== false && (
              <Button
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 me-1" />
                Export
              </Button>
            )}
            
            {canImport && config.features?.import !== false && (
              <Button
                variant="outline"
                size="sm"
              >
                <Upload className="h-4 w-4 me-1" />
                Import
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </>
        )}
        
        {/* Global Actions */}
        <div className="flex items-center gap-1 border-s ps-2">
          {/* Theme Toggle */}
          {config.features?.darkMode !== false && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}
          
          {/* Notifications */}
          {config.features?.notifications !== false && (
            <Button
              variant="ghost"
              size="icon"
              className="relative"
            >
              <Bell className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -end-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
              >
                3
              </Badge>
            </Button>
          )}
          
          {/* User Menu */}
          <Button
            variant="ghost"
            size="icon"
          >
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}