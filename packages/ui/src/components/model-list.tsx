'use client'

import React from 'react'
import { useAdminContext } from './prismate-admin'
import { usePrismateData } from '@/hooks/use-prismate-data'
import { renderFieldDisplay } from '@/lib/field-renderer'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Eye, Edit, Trash2 } from 'lucide-react'

export function ModelList() {
  const { prismateInstance, currentModel, onViewChange, onSuccess, onError } = useAdminContext()
  
  // Fetch data using Prismate instance
  const { data, isLoading, error, refetch } = usePrismateData(prismateInstance, currentModel?.name)
  
  // Get visible fields
  const visibleFields = currentModel?.fields.filter((f: any) => 
    !f.isId && !f.isReadOnly && !f.hidden && !f.relation
  ).slice(0, 5) // Show max 5 fields in table
  
  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-destructive mb-2">Error loading data</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
              <Button onClick={() => refetch()} className="mt-4">Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  if (!data || data.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                No {currentModel?.pluralName.toLowerCase()} found
              </p>
              <Button onClick={() => onViewChange('create')}>
                Create First {currentModel?.displayName}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  const handleDelete = async (record: any) => {
    if (!confirm('Are you sure you want to delete this record?')) return
    
    try {
      await prismateInstance[currentModel.name].delete({
        where: { [currentModel.primaryKey]: record[currentModel.primaryKey] }
      })
      onSuccess?.('Record deleted successfully')
      refetch()
    } catch (error) {
      onError?.(error as Error)
    }
  }
  
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>{currentModel?.pluralName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleFields?.map((field: any) => (
                    <TableHead key={field.name}>
                      {field.label || field.name}
                    </TableHead>
                  ))}
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((record: any) => (
                  <TableRow key={record[currentModel.primaryKey]}>
                    {visibleFields?.map((field: any) => (
                      <TableCell key={field.name}>
                        {renderFieldDisplay(field, record[field.name])}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewChange('detail', record)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewChange('edit', record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(record)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}