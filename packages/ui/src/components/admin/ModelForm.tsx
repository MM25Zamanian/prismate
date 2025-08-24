'use client'

import React, { useState } from 'react'
import { useAdmin } from '@/providers/admin-provider'
import { useCreateModel, useUpdateModel } from '@/hooks/use-api'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save } from 'lucide-react'

export interface ModelFormProps {
  mode: 'create' | 'edit'
}

export function ModelForm({ mode }: ModelFormProps) {
  const { state, currentModel, setView, addNotification } = useAdmin()
  const [formData, setFormData] = useState<Record<string, any>>(
    mode === 'edit' && state.selectedRecord ? state.selectedRecord : {}
  )
  
  const createMutation = useCreateModel(state.selectedModel!, {
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Record created successfully'
      })
      setView('list')
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message
      })
    }
  })
  
  const updateMutation = useUpdateModel(state.selectedModel!, {
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Record updated successfully'
      })
      setView('list')
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message
      })
    }
  })
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (mode === 'create') {
      createMutation.mutate(formData)
    } else {
      updateMutation.mutate({
        id: state.selectedRecord?.id,
        data: formData
      })
    }
  }
  
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }
  
  const visibleFields = currentModel?.fields.filter(f => !f.hidden && !f.readOnly) || []
  
  return (
    <div className="p-6">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {mode === 'create' ? 'Create' : 'Edit'} {currentModel?.displayName || 'Record'}
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setView('list')}
            >
              <ArrowLeft className="h-4 w-4 me-1" />
              Cancel
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {visibleFields.map((field) => (
              <div key={field.name}>
                {renderField(field, formData[field.name], handleFieldChange)}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="h-4 w-4 me-1" />
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

function renderField(field: any, value: any, onChange: (fieldName: string, value: any) => void) {
  const commonProps = {
    label: field.label || field.name,
    required: field.required,
    placeholder: field.placeholder,
    helperText: field.description,
    value: value || '',
    onChange: (e: any) => {
      const newValue = e.target ? e.target.value : e
      onChange(field.name, newValue)
    }
  }
  
  switch (field.type) {
    case 'text':
    case 'string':
      return <Input {...commonProps} />
      
    case 'email':
      return <Input {...commonProps} type="email" />
      
    case 'password':
      return <Input {...commonProps} type="password" />
      
    case 'number':
      return (
        <Input 
          {...commonProps} 
          type="number"
          min={field.min}
          max={field.max}
          step={field.step}
        />
      )
      
    case 'textarea':
      return <Textarea {...commonProps} rows={4} />
      
    case 'select':
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {field.label || field.name}
            {field.required && <span className="text-destructive ms-1">*</span>}
          </label>
          <Select
            value={value}
            onValueChange={(newValue) => onChange(field.name, newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Select...'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.description && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}
        </div>
      )
      
    case 'boolean':
    case 'checkbox':
      return (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={field.name}
            checked={value || false}
            onChange={(e) => onChange(field.name, e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor={field.name} className="text-sm font-medium">
            {field.label || field.name}
          </label>
        </div>
      )
      
    default:
      return <Input {...commonProps} />
  }
}