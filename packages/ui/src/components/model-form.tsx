'use client'

import React, { useState } from 'react'
import { useAdminContext } from './prismate-admin'
import { usePrismateMutations } from '@/hooks/use-prismate-mutations'
import { renderFieldInput } from '@/lib/field-renderer'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { ArrowLeft, Save } from 'lucide-react'

export interface ModelFormProps {
  mode: 'create' | 'edit'
}

export function ModelForm({ mode }: ModelFormProps) {
  const { prismateInstance, currentModel, selectedRecord, onViewChange, onSuccess, onError } = useAdminContext()
  const { createRecord, updateRecord } = usePrismateMutations(prismateInstance, currentModel?.name)
  
  // Initialize form data
  const [formData, setFormData] = useState<Record<string, any>>(
    mode === 'edit' && selectedRecord ? selectedRecord : {}
  )
  const [loading, setLoading] = useState(false)
  
  // Get editable fields
  const editableFields = currentModel?.fields.filter((f: any) => 
    !f.isReadOnly && !f.isGenerated && !f.isId && !f.hidden
  )
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (mode === 'create') {
        await createRecord(formData)
        onSuccess?.('Record created successfully')
      } else {
        const id = selectedRecord[currentModel.primaryKey]
        await updateRecord(id, formData)
        onSuccess?.('Record updated successfully')
      }
      onViewChange('list')
    } catch (error) {
      onError?.(error as Error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }
  
  return (
    <div className="p-6">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {mode === 'create' ? 'Create' : 'Edit'} {currentModel?.displayName}
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onViewChange('list')}
            >
              <ArrowLeft className="h-4 w-4 me-1" />
              Cancel
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {editableFields?.map((field: any) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-medium">
                  {field.label || field.name}
                  {field.isRequired && <span className="text-destructive ms-1">*</span>}
                </label>
                {renderFieldInput(
                  field,
                  formData[field.name],
                  (value) => handleFieldChange(field.name, value),
                  loading
                )}
                {field.helpText && (
                  <p className="text-sm text-muted-foreground">{field.helpText}</p>
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current me-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 me-2" />
                  {mode === 'create' ? 'Create' : 'Update'}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}