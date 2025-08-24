'use client'

import { PrismateAdmin } from '@prismate/ui'

// Mock Prismate instance that simulates what @prismate/core would provide
const mockPrismate = {
  // Available models (auto-detected from Prisma schema)
  getAvailableModels() {
    return ['user', 'post', 'product', 'order']
  },
  
  // Schema information for each model
  schemas: {
    user: {
      fields: {
        id: { type: 'Int', isId: true, isGenerated: true },
        name: { type: 'String', isRequired: true },
        email: { type: 'String', isRequired: true, isUnique: true },
        password: { type: 'String', isRequired: true },
        role: { type: 'String', enumValues: ['admin', 'user', 'moderator'] },
        active: { type: 'Boolean', default: true },
        createdAt: { type: 'DateTime', isGenerated: true },
        updatedAt: { type: 'DateTime', isGenerated: true },
        posts: { type: 'Post', isList: true, relation: { to: 'Post', type: 'one-to-many' } }
      }
    },
    post: {
      fields: {
        id: { type: 'Int', isId: true, isGenerated: true },
        title: { type: 'String', isRequired: true },
        content: { type: 'String', isRequired: true },
        published: { type: 'Boolean', default: false },
        authorId: { type: 'Int', isRequired: true },
        author: { type: 'User', relation: { to: 'User', type: 'many-to-one' } },
        tags: { type: 'String', isList: true },
        createdAt: { type: 'DateTime', isGenerated: true },
        updatedAt: { type: 'DateTime', isGenerated: true }
      }
    },
    product: {
      fields: {
        id: { type: 'Int', isId: true, isGenerated: true },
        name: { type: 'String', isRequired: true },
        sku: { type: 'String', isRequired: true, isUnique: true },
        description: { type: 'String' },
        price: { type: 'Float', isRequired: true },
        stock: { type: 'Int', isRequired: true, default: 0 },
        category: { type: 'String', enumValues: ['electronics', 'clothing', 'books', 'food'] },
        featured: { type: 'Boolean', default: false },
        createdAt: { type: 'DateTime', isGenerated: true }
      }
    },
    order: {
      fields: {
        id: { type: 'Int', isId: true, isGenerated: true },
        orderNumber: { type: 'String', isRequired: true, isUnique: true },
        customerId: { type: 'Int', isRequired: true },
        status: { type: 'String', enumValues: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
        totalAmount: { type: 'Float', isRequired: true },
        shippingAddress: { type: 'String', isRequired: true },
        notes: { type: 'String' },
        items: { type: 'Json' },
        createdAt: { type: 'DateTime', isGenerated: true }
      }
    }
  },
  
  // Mock data for each model
  _data: {
    user: [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', active: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', active: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'moderator', active: false, createdAt: new Date(), updatedAt: new Date() },
    ],
    post: [
      { id: 1, title: 'First Post', content: 'This is the first post', published: true, authorId: 1, tags: ['news', 'update'], createdAt: new Date(), updatedAt: new Date() },
      { id: 2, title: 'Second Post', content: 'Another great post', published: false, authorId: 2, tags: ['tutorial'], createdAt: new Date(), updatedAt: new Date() },
    ],
    product: [
      { id: 1, name: 'Laptop', sku: 'LAP001', description: 'High-performance laptop', price: 999.99, stock: 10, category: 'electronics', featured: true, createdAt: new Date() },
      { id: 2, name: 'T-Shirt', sku: 'TSH001', description: 'Comfortable cotton t-shirt', price: 29.99, stock: 100, category: 'clothing', featured: false, createdAt: new Date() },
    ],
    order: [
      { id: 1, orderNumber: 'ORD001', customerId: 1, status: 'delivered', totalAmount: 999.99, shippingAddress: '123 Main St', createdAt: new Date() },
      { id: 2, orderNumber: 'ORD002', customerId: 2, status: 'processing', totalAmount: 59.98, shippingAddress: '456 Oak Ave', createdAt: new Date() },
    ]
  },
  
  // Prisma-like API methods (simulated)
  user: {
    async findMany() {
      return mockPrismate._data.user
    },
    async create({ data }: any) {
      const newUser = { ...data, id: Date.now(), createdAt: new Date(), updatedAt: new Date() }
      mockPrismate._data.user.push(newUser)
      return newUser
    },
    async update({ where, data }: any) {
      const index = mockPrismate._data.user.findIndex(u => u.id === where.id)
      if (index !== -1) {
        mockPrismate._data.user[index] = { ...mockPrismate._data.user[index], ...data, updatedAt: new Date() }
        return mockPrismate._data.user[index]
      }
      throw new Error('User not found')
    },
    async delete({ where }: any) {
      const index = mockPrismate._data.user.findIndex(u => u.id === where.id)
      if (index !== -1) {
        return mockPrismate._data.user.splice(index, 1)[0]
      }
      throw new Error('User not found')
    }
  },
  
  post: {
    async findMany() {
      return mockPrismate._data.post
    },
    async create({ data }: any) {
      const newPost = { ...data, id: Date.now(), createdAt: new Date(), updatedAt: new Date() }
      mockPrismate._data.post.push(newPost)
      return newPost
    },
    async update({ where, data }: any) {
      const index = mockPrismate._data.post.findIndex(p => p.id === where.id)
      if (index !== -1) {
        mockPrismate._data.post[index] = { ...mockPrismate._data.post[index], ...data, updatedAt: new Date() }
        return mockPrismate._data.post[index]
      }
      throw new Error('Post not found')
    },
    async delete({ where }: any) {
      const index = mockPrismate._data.post.findIndex(p => p.id === where.id)
      if (index !== -1) {
        return mockPrismate._data.post.splice(index, 1)[0]
      }
      throw new Error('Post not found')
    }
  },
  
  product: {
    async findMany() {
      return mockPrismate._data.product
    },
    async create({ data }: any) {
      const newProduct = { ...data, id: Date.now(), createdAt: new Date() }
      mockPrismate._data.product.push(newProduct)
      return newProduct
    },
    async update({ where, data }: any) {
      const index = mockPrismate._data.product.findIndex(p => p.id === where.id)
      if (index !== -1) {
        mockPrismate._data.product[index] = { ...mockPrismate._data.product[index], ...data }
        return mockPrismate._data.product[index]
      }
      throw new Error('Product not found')
    },
    async delete({ where }: any) {
      const index = mockPrismate._data.product.findIndex(p => p.id === where.id)
      if (index !== -1) {
        return mockPrismate._data.product.splice(index, 1)[0]
      }
      throw new Error('Product not found')
    }
  },
  
  order: {
    async findMany() {
      return mockPrismate._data.order
    },
    async create({ data }: any) {
      const newOrder = { ...data, id: Date.now(), createdAt: new Date() }
      mockPrismate._data.order.push(newOrder)
      return newOrder
    },
    async update({ where, data }: any) {
      const index = mockPrismate._data.order.findIndex(o => o.id === where.id)
      if (index !== -1) {
        mockPrismate._data.order[index] = { ...mockPrismate._data.order[index], ...data }
        return mockPrismate._data.order[index]
      }
      throw new Error('Order not found')
    },
    async delete({ where }: any) {
      const index = mockPrismate._data.order.findIndex(o => o.id === where.id)
      if (index !== -1) {
        return mockPrismate._data.order.splice(index, 1)[0]
      }
      throw new Error('Order not found')
    }
  }
}

export default function SimplifiedAdminDemo() {
  return (
    <PrismateAdmin 
      prismateInstance={mockPrismate}
      overrides={{
        // Simple overrides - everything else is auto-detected!
        models: {
          user: {
            fields: {
              password: { hidden: true }, // Hide password field
              email: { label: 'Email Address' } // Custom label
            },
            actions: {
              delete: false // Disable delete for users
            }
          }
        },
        ui: {
          title: 'Simplified Admin',
          theme: 'system',
          layout: 'sidebar',
          direction: 'ltr'
        }
      }}
      onSuccess={(message) => console.log('Success:', message)}
      onError={(error) => console.error('Error:', error)}
    />
  )
}