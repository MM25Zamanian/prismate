'use client'

import React from 'react'
import { useAdminContext } from './prismate-admin'
import { renderFieldDisplay } from '@/lib/field-renderer'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'

export function ModelDetail() {
  const { currentModel, selectedRecord, onViewChange } = useAdminContext()
  
  if (!selectedRecord) {
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
  
  const visibleFields = currentModel?.fields.filter((f: any) => !f.hidden)
  
  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{currentModel?.displayName} Details</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewChange('list')}
            >
              <ArrowLeft className="h-4 w-4 me-1" />
              Back
            </Button>
            <Button
              size="sm"
              onClick={() => onViewChange('edit', selectedRecord)}
            >
              <Edit className="h-4 w-4 me-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-border">
            {visibleFields?.map((field: any) => (
              <div key={field.name} className="py-3 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-muted-foreground">
                  {field.label || field.name}
                </dt>
                <dd className="text-sm col-span-2">
                  {renderFieldDisplay(field, selectedRecord[field.name])}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}