'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useAdmin } from '@/providers/admin-provider'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Database, 
  ChevronRight, 
  ChevronLeft,
  Settings,
  LogOut,
  Plus,
  List,
  Search
} from 'lucide-react'

export interface AdminSidebarProps {
  className?: string
  collapsed?: boolean
  onToggle?: () => void
}

export function AdminSidebar({ className, collapsed = false, onToggle }: AdminSidebarProps) {
  const { config, state, selectModel, currentModel } = useAdmin()
  
  return (
    <div
      className={cn(
        "flex h-full flex-col border-e bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Logo/Title */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <h2 className="text-lg font-semibold">
            {config.title || 'Prismate Admin'}
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="ms-auto"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {/* Dashboard */}
        <Button
          variant={!state.selectedModel ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start mb-2",
            collapsed && "justify-center"
          )}
          onClick={() => selectModel('')}
        >
          <Home className="h-4 w-4" />
          {!collapsed && <span className="ms-2">Dashboard</span>}
        </Button>

        {/* Models Section */}
        {!collapsed && (
          <div className="mb-2 px-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase">
              Models
            </h3>
          </div>
        )}

        {/* Model List */}
        <div className="space-y-1">
          {config.models.map((model) => {
            const isActive = state.selectedModel === model.name
            const Icon = model.icon ? () => model.icon as React.ReactElement : Database
            
            return (
              <Button
                key={model.name}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  collapsed && "justify-center"
                )}
                onClick={() => selectModel(model.name)}
                title={collapsed ? model.displayName || model.name : undefined}
              >
                <Icon />
                {!collapsed && (
                  <span className="ms-2">
                    {model.displayName || model.name}
                  </span>
                )}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="border-t p-2 space-y-1">
        {!collapsed && (
          <>
            <Button
              variant="ghost"
              className="w-full justify-start"
              size="sm"
            >
              <Settings className="h-4 w-4" />
              <span className="ms-2">Settings</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              size="sm"
            >
              <LogOut className="h-4 w-4" />
              <span className="ms-2">Logout</span>
            </Button>
          </>
        )}
        {collapsed && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="w-full"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-full"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}