import { NextRequest, NextResponse } from 'next/server'

// Import shared mock data
const mockData: Record<string, any[]> = {
  user: [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'moderator', active: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  post: [
    { id: 1, title: 'First Post', slug: 'first-post', content: 'This is the first post content', published: true, authorId: 1, viewCount: 100, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, title: 'Second Post', slug: 'second-post', content: 'This is the second post content', published: false, authorId: 2, viewCount: 50, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  product: [
    { id: 1, name: 'Laptop', sku: 'LAP001', price: 999.99, stock: 10, category: 'electronics', featured: true, active: true, createdAt: new Date().toISOString() },
    { id: 2, name: 'T-Shirt', sku: 'TSH001', price: 29.99, stock: 100, category: 'clothing', featured: false, active: true, createdAt: new Date().toISOString() },
    { id: 3, name: 'Book', sku: 'BK001', price: 19.99, stock: 50, category: 'books', featured: false, active: true, createdAt: new Date().toISOString() },
  ],
}

export async function GET(
  request: NextRequest,
  { params }: { params: { model: string; id: string } }
) {
  const model = params.model
  const id = parseInt(params.id)
  
  if (!mockData[model]) {
    return NextResponse.json({ error: 'Model not found' }, { status: 404 })
  }
  
  const record = mockData[model].find(r => r.id === id)
  
  if (!record) {
    return NextResponse.json({ error: 'Record not found' }, { status: 404 })
  }
  
  return NextResponse.json(record)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { model: string; id: string } }
) {
  const model = params.model
  const id = parseInt(params.id)
  const body = await request.json()
  
  if (!mockData[model]) {
    return NextResponse.json({ error: 'Model not found' }, { status: 404 })
  }
  
  const index = mockData[model].findIndex(r => r.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Record not found' }, { status: 404 })
  }
  
  mockData[model][index] = {
    ...mockData[model][index],
    ...body,
    id, // Preserve ID
    updatedAt: new Date().toISOString()
  }
  
  return NextResponse.json(mockData[model][index])
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { model: string; id: string } }
) {
  const model = params.model
  const id = parseInt(params.id)
  
  if (!mockData[model]) {
    return NextResponse.json({ error: 'Model not found' }, { status: 404 })
  }
  
  const index = mockData[model].findIndex(r => r.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Record not found' }, { status: 404 })
  }
  
  mockData[model].splice(index, 1)
  
  return NextResponse.json({ success: true })
}