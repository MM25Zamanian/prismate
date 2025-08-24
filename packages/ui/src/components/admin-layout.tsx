'use client'

import React, { useState } from 'react'
import { useAdminContext } from './prismate-admin'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { Menu, X, ChevronRight, Sun, Moon, Home, Plus } from 'lucide-react'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { models, currentModel, selectedModel, view, overrides, onModelSelect, onViewChange } = useAdminContext()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const title = overrides?.ui?.title || 'Admin Panel'
  const layout = overrides?.ui?.layout || 'sidebar'
  
  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }
  
  // Render breadcrumbs
  const renderBreadcrumbs = () => {
    const items = []
    
    items.push(
      <button
        key="home"
        onClick={() => onModelSelect('')}
        className="text-muted-foreground hover:text-foreground"
      >
        Dashboard
      </button>
    )
    
    if (selectedModel) {
      items.push(
        <ChevronRight key="sep1" className="h-4 w-4 text-muted-foreground" />,
        <button
          key="model"
          onClick={() => onViewChange('list')}
          className={view === 'list' ? 'font-medium' : 'text-muted-foreground hover:text-foreground'}
        >
          {currentModel?.displayName}
        </button>
      )
      
      if (view === 'create') {
        items.push(
          <ChevronRight key="sep2" className="h-4 w-4 text-muted-foreground" />,
          <span key="create" className="font-medium">New</span>
        )
      } else if (view === 'edit' || view === 'detail') {
        items.push(
          <ChevronRight key="sep2" className="h-4 w-4 text-muted-foreground" />,
          <span key="record" className="font-medium">
            {view === 'edit' ? 'Edit' : 'Details'}
          </span>
        )
      }
    }
    
    return items
  }
  
  if (layout === 'tabs') {
    // Tabs layout
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{title}</h1>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onModelSelect('')}
              className={cn(
                "px-4 py-2 rounded-lg",
                !selectedModel ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
            >
              Dashboard
            </button>
            {models.map((model: any) => (
              <button
                key={model.name}
                onClick={() => onModelSelect(model.name)}
                className={cn(
                  "px-4 py-2 rounded-lg",
                  selectedModel === model.name ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                )}
              >
                {model.displayName}
              </button>
            ))}
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    )
  }
  
  // Default sidebar layout
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside
        className={cn(
          "border-e bg-card transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            {sidebarOpen && <h2 className="font-semibold">{title}</h2>}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-2">
            <Button
              variant={!selectedModel ? "secondary" : "ghost"}
              className={cn("w-full justify-start", !sidebarOpen && "justify-center")}
              onClick={() => onModelSelect('')}
            >
              <Home className="h-4 w-4" />
              {sidebarOpen && <span className="ms-2">Dashboard</span>}
            </Button>
            
            {sidebarOpen && (
              <div className="mt-4 mb-2 px-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase">Models</h3>
              </div>
            )}
            
            {models.map((model: any) => (
              <Button
                key={model.name}
                variant={selectedModel === model.name ? "secondary" : "ghost"}
                className={cn("w-full justify-start", !sidebarOpen && "justify-center")}
                onClick={() => onModelSelect(model.name)}
                title={!sidebarOpen ? model.displayName : undefined}
              >
                <span className="text-lg">📄</span>
                {sidebarOpen && <span className="ms-2">{model.displayName}</span>}
              </Button>
            ))}
          </nav>
          
          {/* Footer */}
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size={sidebarOpen ? "sm" : "icon"}
              className="w-full"
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {sidebarOpen && <span className="ms-2">Toggle Theme</span>}
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b px-6">
          <nav className="flex items-center space-x-2">
            {renderBreadcrumbs()}
          </nav>
          
          {selectedModel && view === 'list' && (
            <Button size="sm" onClick={() => onViewChange('create')}>
              <Plus className="h-4 w-4 me-1" />
              New {currentModel?.displayName}
            </Button>
          )}
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}