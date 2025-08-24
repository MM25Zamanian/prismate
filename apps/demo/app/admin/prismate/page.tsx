'use client'

import { PrismateAdmin } from '@prismate/ui'
import { Users, FileText, Settings, Package, ShoppingCart, Calendar } from 'lucide-react'

// Define sample models based on typical Prisma schema
const models = [
  {
    name: 'user',
    displayName: 'Users',
    pluralName: 'Users',
    icon: <Users className="h-4 w-4" />,
    fields: [
      { name: 'id', type: 'number', label: 'ID', required: true, readOnly: true },
      { name: 'name', type: 'string', label: 'Name', required: true },
      { name: 'email', type: 'email', label: 'Email', required: true, unique: true },
      { name: 'role', type: 'select', label: 'Role', required: true, options: [
        { value: 'admin', label: 'Administrator' },
        { value: 'user', label: 'User' },
        { value: 'moderator', label: 'Moderator' }
      ]},
      { name: 'active', type: 'boolean', label: 'Active', defaultValue: true },
      { name: 'bio', type: 'textarea', label: 'Biography' },
      { name: 'createdAt', type: 'datetime', label: 'Created At', readOnly: true },
      { name: 'updatedAt', type: 'datetime', label: 'Updated At', readOnly: true }
    ],
    primaryKey: 'id',
    timestamps: true,
    searchFields: ['name', 'email'],
    defaultSort: { field: 'createdAt', order: 'desc' }
  },
  {
    name: 'post',
    displayName: 'Posts',
    pluralName: 'Posts',
    icon: <FileText className="h-4 w-4" />,
    fields: [
      { name: 'id', type: 'number', label: 'ID', required: true, readOnly: true },
      { name: 'title', type: 'string', label: 'Title', required: true },
      { name: 'slug', type: 'string', label: 'Slug', required: true, unique: true },
      { name: 'content', type: 'textarea', label: 'Content', required: true },
      { name: 'excerpt', type: 'text', label: 'Excerpt' },
      { name: 'published', type: 'boolean', label: 'Published', defaultValue: false },
      { name: 'authorId', type: 'number', label: 'Author', required: true },
      { name: 'categoryId', type: 'number', label: 'Category' },
      { name: 'tags', type: 'string', label: 'Tags' },
      { name: 'viewCount', type: 'number', label: 'Views', defaultValue: 0, readOnly: true },
      { name: 'createdAt', type: 'datetime', label: 'Created At', readOnly: true },
      { name: 'updatedAt', type: 'datetime', label: 'Updated At', readOnly: true }
    ],
    primaryKey: 'id',
    timestamps: true,
    searchFields: ['title', 'content'],
    defaultSort: { field: 'createdAt', order: 'desc' }
  },
  {
    name: 'product',
    displayName: 'Products',
    pluralName: 'Products',
    icon: <Package className="h-4 w-4" />,
    fields: [
      { name: 'id', type: 'number', label: 'ID', required: true, readOnly: true },
      { name: 'name', type: 'string', label: 'Name', required: true },
      { name: 'sku', type: 'string', label: 'SKU', required: true, unique: true },
      { name: 'description', type: 'textarea', label: 'Description' },
      { name: 'price', type: 'number', label: 'Price', required: true, min: 0, step: 0.01 },
      { name: 'stock', type: 'number', label: 'Stock', required: true, min: 0, defaultValue: 0 },
      { name: 'category', type: 'select', label: 'Category', options: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'books', label: 'Books' },
        { value: 'food', label: 'Food' }
      ]},
      { name: 'featured', type: 'boolean', label: 'Featured', defaultValue: false },
      { name: 'active', type: 'boolean', label: 'Active', defaultValue: true },
      { name: 'createdAt', type: 'datetime', label: 'Created At', readOnly: true }
    ],
    primaryKey: 'id',
    timestamps: true,
    searchFields: ['name', 'sku', 'description']
  },
  {
    name: 'order',
    displayName: 'Orders',
    pluralName: 'Orders',
    icon: <ShoppingCart className="h-4 w-4" />,
    fields: [
      { name: 'id', type: 'number', label: 'Order ID', required: true, readOnly: true },
      { name: 'orderNumber', type: 'string', label: 'Order Number', required: true, unique: true },
      { name: 'customerId', type: 'number', label: 'Customer', required: true },
      { name: 'status', type: 'select', label: 'Status', required: true, options: [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
      ]},
      { name: 'totalAmount', type: 'number', label: 'Total Amount', required: true, min: 0 },
      { name: 'shippingAddress', type: 'textarea', label: 'Shipping Address', required: true },
      { name: 'notes', type: 'textarea', label: 'Order Notes' },
      { name: 'createdAt', type: 'datetime', label: 'Order Date', readOnly: true }
    ],
    primaryKey: 'id',
    timestamps: true,
    searchFields: ['orderNumber', 'shippingAddress']
  },
  {
    name: 'event',
    displayName: 'Events',
    pluralName: 'Events',
    icon: <Calendar className="h-4 w-4" />,
    fields: [
      { name: 'id', type: 'number', label: 'ID', required: true, readOnly: true },
      { name: 'title', type: 'string', label: 'Title', required: true },
      { name: 'description', type: 'textarea', label: 'Description' },
      { name: 'startDate', type: 'datetime', label: 'Start Date', required: true },
      { name: 'endDate', type: 'datetime', label: 'End Date', required: true },
      { name: 'location', type: 'string', label: 'Location' },
      { name: 'capacity', type: 'number', label: 'Capacity', min: 0 },
      { name: 'registrations', type: 'number', label: 'Registrations', defaultValue: 0, readOnly: true },
      { name: 'status', type: 'select', label: 'Status', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'cancelled', label: 'Cancelled' }
      ]},
      { name: 'featured', type: 'boolean', label: 'Featured Event' }
    ],
    primaryKey: 'id',
    searchFields: ['title', 'description', 'location']
  },
  {
    name: 'setting',
    displayName: 'Settings',
    pluralName: 'Settings',
    icon: <Settings className="h-4 w-4" />,
    fields: [
      { name: 'id', type: 'number', label: 'ID', required: true, readOnly: true },
      { name: 'key', type: 'string', label: 'Key', required: true, unique: true },
      { name: 'value', type: 'text', label: 'Value', required: true },
      { name: 'type', type: 'select', label: 'Type', required: true, options: [
        { value: 'string', label: 'String' },
        { value: 'number', label: 'Number' },
        { value: 'boolean', label: 'Boolean' },
        { value: 'json', label: 'JSON' }
      ]},
      { name: 'description', type: 'textarea', label: 'Description' },
      { name: 'public', type: 'boolean', label: 'Public', defaultValue: false },
      { name: 'updatedAt', type: 'datetime', label: 'Last Updated', readOnly: true }
    ],
    primaryKey: 'id',
    timestamps: true,
    searchFields: ['key', 'description']
  }
]

export default function PrismateAdminDemo() {
  return (
    <PrismateAdmin
      config={{
        // Models configuration
        models,
        
        // UI Configuration
        title: 'Prismate Admin Panel',
        description: 'Comprehensive admin interface for managing your Prisma models',
        
        // API Configuration
        apiUrl: '/api/prismate',
        
        // Layout Configuration
        layout: {
          sidebarCollapsible: true,
          sidebarDefaultCollapsed: false,
        },
        
        // Theme Configuration
        theme: {
          mode: 'system',
        },
        
        // Features
        features: {
          search: true,
          filters: true,
          sorting: true,
          pagination: true,
          export: true,
          import: true,
          bulkActions: true,
          darkMode: true,
          notifications: true,
        },
        
        // Permissions (all enabled for demo)
        permissions: {
          canCreate: true,
          canRead: true,
          canUpdate: true,
          canDelete: true,
          canExport: true,
          canImport: true,
        },
        
        // Localization
        i18n: {
          locale: 'en-US',
          direction: 'ltr',
        },
        
        // Callbacks
        onModelSelect: (model) => {
          console.log('Model selected:', model)
        },
        onRecordSelect: (model, id) => {
          console.log('Record selected:', model, id)
        },
        onAction: (action, model, data) => {
          console.log('Action:', action, 'Model:', model, 'Data:', data)
        },
        onError: (error) => {
          console.error('Admin error:', error)
        },
        onSuccess: (message) => {
          console.log('Success:', message)
        },
      }}
    />
  )
}