import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatNumber } from '@/lib/utils'

// Render field for display (read-only)
export function renderFieldDisplay(field: any, value: any) {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>
  }

  // Handle arrays
  if (field.isList && Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((item, index) => (
          <Badge key={index} variant="secondary">
            {renderSingleValue(field, item)}
          </Badge>
        ))}
      </div>
    )
  }

  // Handle relations
  if (field.relation) {
    if (typeof value === 'object' && value !== null) {
      // Display related object's name or title
      return value.name || value.title || value.id || '—'
    }
    return value
  }

  return renderSingleValue(field, value)
}

// Render single value for display
function renderSingleValue(field: any, value: any) {
  const fieldType = field.type.toLowerCase()

  switch (fieldType) {
    case 'boolean':
      return (
        <Badge variant={value ? 'success' : 'secondary'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      )

    case 'datetime':
      return formatDate(value)

    case 'int':
    case 'float':
    case 'decimal':
    case 'bigint':
      return formatNumber(value)

    case 'json':
      return (
        <pre className="text-xs bg-muted p-2 rounded">
          {JSON.stringify(value, null, 2)}
        </pre>
      )

    case 'bytes':
      return <span className="font-mono text-xs">{value}</span>

    default:
      return String(value)
  }
}

// Render field for editing (form input)
export function renderFieldInput(field: any, value: any, onChange: (value: any) => void, disabled = false) {
  // Skip read-only fields
  if (field.isReadOnly || field.isGenerated || field.isId) {
    return renderFieldDisplay(field, value)
  }

  // Handle custom component override
  if (field.component) {
    return renderCustomComponent(field, value, onChange, disabled)
  }

  // Handle arrays
  if (field.isList) {
    return renderArrayInput(field, value, onChange, disabled)
  }

  // Handle relations
  if (field.relation) {
    return renderRelationInput(field, value, onChange, disabled)
  }

  // Handle enums
  if (field.enumValues) {
    return (
      <Select
        value={value || ''}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
        </SelectTrigger>
        <SelectContent>
          {!field.isRequired && (
            <SelectItem value="">None</SelectItem>
          )}
          {field.enumValues.map((enumValue: string) => (
            <SelectItem key={enumValue} value={enumValue}>
              {enumValue}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  // Render based on Prisma type
  const fieldType = field.type.toLowerCase()

  switch (fieldType) {
    case 'boolean':
      return (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={field.name}
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="h-4 w-4"
          />
          <label htmlFor={field.name} className="text-sm">
            {field.label}
          </label>
        </div>
      )

    case 'int':
    case 'bigint':
      return (
        <Input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(parseInt(e.target.value) || null)}
          placeholder={field.placeholder}
          disabled={disabled}
          required={field.isRequired}
        />
      )

    case 'float':
    case 'decimal':
      return (
        <Input
          type="number"
          step="0.01"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || null)}
          placeholder={field.placeholder}
          disabled={disabled}
          required={field.isRequired}
        />
      )

    case 'datetime':
      return (
        <Input
          type="datetime-local"
          value={value ? new Date(value).toISOString().slice(0, 16) : ''}
          onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
          disabled={disabled}
          required={field.isRequired}
        />
      )

    case 'json':
      return (
        <Textarea
          value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
          onChange={(e) => {
            try {
              onChange(JSON.parse(e.target.value))
            } catch {
              onChange(e.target.value)
            }
          }}
          placeholder={field.placeholder || 'Enter JSON'}
          rows={4}
          disabled={disabled}
          required={field.isRequired}
          className="font-mono text-sm"
        />
      )

    case 'bytes':
      return (
        <Input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onloadend = () => {
                onChange(reader.result)
              }
              reader.readAsDataURL(file)
            }
          }}
          disabled={disabled}
          required={field.isRequired}
        />
      )

    default: // String and other text types
      // Check if it's a long text field
      if (field.name.includes('description') || field.name.includes('content') || field.name.includes('body')) {
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            disabled={disabled}
            required={field.isRequired}
          />
        )
      }

      // Check for specific string patterns
      if (field.name.includes('email')) {
        return (
          <Input
            type="email"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || 'email@example.com'}
            disabled={disabled}
            required={field.isRequired}
          />
        )
      }

      if (field.name.includes('password')) {
        return (
          <Input
            type="password"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            required={field.isRequired}
          />
        )
      }

      if (field.name.includes('url') || field.name.includes('website')) {
        return (
          <Input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || 'https://'}
            disabled={disabled}
            required={field.isRequired}
          />
        )
      }

      if (field.name.includes('phone') || field.name.includes('tel')) {
        return (
          <Input
            type="tel"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            required={field.isRequired}
          />
        )
      }

      // Default text input
      return (
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          disabled={disabled}
          required={field.isRequired}
        />
      )
  }
}

// Render custom component based on override
function renderCustomComponent(field: any, value: any, onChange: (value: any) => void, disabled: boolean) {
  switch (field.component) {
    case 'textarea':
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          disabled={disabled}
          required={field.isRequired}
        />
      )

    case 'select':
      return (
        <Select
          value={value || ''}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
          </SelectTrigger>
          <SelectContent>
            {/* Options should be provided in field.options */}
            {field.options?.map((option: any) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label || option.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case 'date':
      return (
        <Input
          type="date"
          value={value ? new Date(value).toISOString().slice(0, 10) : ''}
          onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
          disabled={disabled}
          required={field.isRequired}
        />
      )

    case 'checkbox':
      return (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={field.name}
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="h-4 w-4"
          />
          <label htmlFor={field.name} className="text-sm">
            {field.label}
          </label>
        </div>
      )

    default:
      return renderFieldInput({ ...field, component: undefined }, value, onChange, disabled)
  }
}

// Render array input
function renderArrayInput(field: any, value: any, onChange: (value: any) => void, disabled: boolean) {
  const items = Array.isArray(value) ? value : []

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          {renderFieldInput(
            { ...field, isList: false },
            item,
            (newValue) => {
              const newItems = [...items]
              newItems[index] = newValue
              onChange(newItems)
            },
            disabled
          )}
          <button
            type="button"
            onClick={() => {
              const newItems = items.filter((_, i) => i !== index)
              onChange(newItems)
            }}
            disabled={disabled}
            className="text-destructive hover:text-destructive/80"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        disabled={disabled}
        className="text-sm text-primary hover:text-primary/80"
      >
        Add {field.label}
      </button>
    </div>
  )
}

// Render relation input (simplified - would need actual relation data)
function renderRelationInput(field: any, value: any, onChange: (value: any) => void, disabled: boolean) {
  return (
    <Input
      type="text"
      value={value?.id || value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Enter ${field.relation.to} ID`}
      disabled={disabled}
      required={field.isRequired}
    />
  )
}