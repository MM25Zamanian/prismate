'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useAdmin } from '@/providers/admin-provider'
import { ModelList } from './ModelList'
import { ModelDetail } from './ModelDetail'
import { ModelForm } from './ModelForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, Database, ArrowRight } from 'lucide-react'

export interface AdminContentProps {
  className?: string
}

export function AdminContent({ className }: AdminContentProps) {
  const { config, state, currentModel, selectModel } = useAdmin()
  
  // No model selected - show dashboard
  if (!state.selectedModel) {
    return (
      <div className={cn("flex-1 overflow-auto p-6", className)}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              {config.title || 'Prismate Admin'}
            </h1>
            {config.description && (
              <p className="mt-2 text-muted-foreground">
                {config.description}
              </p>
            )}
          </div>
          
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {config.models.map((model) => (
              <Card 
                key={model.name}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => selectModel(model.name)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {model.displayName || model.name}
                  </CardTitle>
                  {model.icon || <Database className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Total records
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 w-full"
                  >
                    View All
                    <ArrowRight className="ms-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {config.models.map((model) => (
                  <Button
                    key={model.name}
                    variant="outline"
                    className="justify-start"
                    onClick={() => selectModel(model.name)}
                  >
                    {model.icon || <Database className="h-4 w-4 me-2" />}
                    Manage {model.displayName || model.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  // Model selected - show appropriate view
  return (
    <main className={cn("flex-1 overflow-auto", className)}>
      {state.view === 'list' && <ModelList />}
      {state.view === 'detail' && <ModelDetail />}
      {state.view === 'create' && <ModelForm mode="create" />}
      {state.view === 'edit' && <ModelForm mode="edit" />}
    </main>
  )
}