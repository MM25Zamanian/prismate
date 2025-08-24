'use client'

import React from 'react'
import { useAdmin } from '@/providers/admin-provider'
import { useModelList } from '@/hooks/use-api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import { formatDate, formatNumber, truncate } from '@/lib/utils'

export function ModelList() {
  const { 
    config, 
    state, 
    currentModel, 
    selectRecord, 
    setView,
    setPagination 
  } = useAdmin()
  
  // Fetch data
  const { data, isLoading, error } = useModelList(
    state.selectedModel!,
    {
      page: state.pagination.page,
      pageSize: state.pagination.pageSize,
      sortBy: state.sorting[0]?.field,
      sortOrder: state.sorting[0]?.order,
      filters: state.filters,
      search: state.search,
    }
  )
  
  React.useEffect(() => {
    if (data) {
      setPagination({ total: data.total })
    }
  }, [data, setPagination])
  
  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Error state
  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-destructive mb-4">Error loading data</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Empty state
  if (!data?.data || data.data.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                No {currentModel?.pluralName || currentModel?.displayName || 'records'} found
              </p>
              <Button onClick={() => setView('create')}>
                Create First {currentModel?.displayName || 'Record'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Get visible fields
  const visibleFields = currentModel?.fields.filter(f => !f.hidden) || []
  
  // Pagination info
  const totalPages = Math.ceil(data.total / state.pagination.pageSize)
  const startRecord = (state.pagination.page - 1) * state.pagination.pageSize + 1
  const endRecord = Math.min(state.pagination.page * state.pagination.pageSize, data.total)
  
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {currentModel?.pluralName || currentModel?.displayName || 'Records'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleFields.map((field) => (
                    <TableHead key={field.name}>
                      {field.label || field.name}
                    </TableHead>
                  ))}
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((record: any) => (
                  <TableRow key={record.id}>
                    {visibleFields.map((field) => (
                      <TableCell key={field.name}>
                        {renderFieldValue(record[field.name], field.type)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => selectRecord(record)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            selectRecord(record)
                            setView('edit')
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
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
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {startRecord} to {endRecord} of {data.total} results
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPagination({ page: 1 })}
                disabled={state.pagination.page === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPagination({ page: state.pagination.page - 1 })}
                disabled={state.pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPagination({ page: state.pagination.page + 1 })}
                disabled={state.pagination.page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPagination({ page: totalPages })}
                disabled={state.pagination.page === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to render field values
function renderFieldValue(value: any, type: string) {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">-</span>
  }
  
  switch (type) {
    case 'boolean':
      return (
        <Badge variant={value ? 'success' : 'secondary'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      )
    case 'date':
    case 'datetime':
      return formatDate(value)
    case 'number':
      return formatNumber(value)
    case 'text':
    case 'string':
      return truncate(String(value), 50)
    default:
      return String(value)
  }
}