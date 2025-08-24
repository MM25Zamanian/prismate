'use client'

import React from 'react'
import { useAdmin } from '@/providers/admin-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, ArrowLeft } from 'lucide-react'

export function ModelDetail() {
  const { state, currentModel, setView } = useAdmin()
  
  if (!state.selectedRecord) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">No record selected</p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  const visibleFields = currentModel?.fields.filter(f => !f.hidden) || []
  
  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {currentModel?.displayName || 'Record'} Details
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView('list')}
            >
              <ArrowLeft className="h-4 w-4 me-1" />
              Back
            </Button>
            <Button
              size="sm"
              onClick={() => setView('edit')}
            >
              <Edit className="h-4 w-4 me-1" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 me-1" />
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-border">
            {visibleFields.map((field) => (
              <div key={field.name} className="py-3 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-muted-foreground">
                  {field.label || field.name}
                </dt>
                <dd className="text-sm col-span-2">
                  {state.selectedRecord[field.name] || '-'}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}