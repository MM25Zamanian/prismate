import { NextRequest, NextResponse } from 'next/server'

// Mock data store
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
  order: [
    { id: 1, orderNumber: 'ORD001', customerId: 1, status: 'delivered', totalAmount: 999.99, shippingAddress: '123 Main St', createdAt: new Date().toISOString() },
    { id: 2, orderNumber: 'ORD002', customerId: 2, status: 'processing', totalAmount: 49.98, shippingAddress: '456 Oak Ave', createdAt: new Date().toISOString() },
  ],
  event: [
    { id: 1, title: 'Conference 2024', description: 'Annual tech conference', startDate: new Date('2024-06-01').toISOString(), endDate: new Date('2024-06-03').toISOString(), location: 'Convention Center', capacity: 500, registrations: 250, status: 'published', featured: true },
    { id: 2, title: 'Workshop', description: 'React workshop', startDate: new Date('2024-07-15').toISOString(), endDate: new Date('2024-07-15').toISOString(), location: 'Online', capacity: 50, registrations: 30, status: 'published', featured: false },
  ],
  setting: [
    { id: 1, key: 'site_name', value: 'My Website', type: 'string', description: 'Website name', public: true, updatedAt: new Date().toISOString() },
    { id: 2, key: 'maintenance_mode', value: 'false', type: 'boolean', description: 'Maintenance mode', public: false, updatedAt: new Date().toISOString() },
  ]
}

export async function GET(
  request: NextRequest,
  { params }: { params: { model: string } }
) {
  const { searchParams } = new URL(request.url)
  const model = params.model
  
  // Get query parameters
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '10')
  const search = searchParams.get('search') || ''
  const sortBy = searchParams.get('sortBy') || 'id'
  const sortOrder = searchParams.get('sortOrder') || 'asc'
  
  // Get mock data for model
  let data = mockData[model] || []
  
  // Apply search
  if (search) {
    data = data.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    )
  }
  
  // Apply sorting
  data.sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    const order = sortOrder === 'asc' ? 1 : -1
    
    if (aVal < bVal) return -order
    if (aVal > bVal) return order
    return 0
  })
  
  // Apply pagination
  const total = data.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedData = data.slice(start, end)
  
  return NextResponse.json({
    data: paginatedData,
    total,
    page,
    pageSize,
    totalPages,
    hasMore: page < totalPages
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: { model: string } }
) {
  const model = params.model
  const body = await request.json()
  
  // Create new record
  const newRecord = {
    ...body,
    id: Math.max(...(mockData[model]?.map(r => r.id) || [0])) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  if (!mockData[model]) {
    mockData[model] = []
  }
  
  mockData[model].push(newRecord)
  
  return NextResponse.json(newRecord, { status: 201 })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { model: string } }
) {
  const model = params.model
  const body = await request.json()
  const { id, ...data } = body
  
  if (!mockData[model]) {
    return NextResponse.json({ error: 'Model not found' }, { status: 404 })
  }
  
  const index = mockData[model].findIndex(r => r.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Record not found' }, { status: 404 })
  }
  
  mockData[model][index] = {
    ...mockData[model][index],
    ...data,
    updatedAt: new Date().toISOString()
  }
  
  return NextResponse.json(mockData[model][index])
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { model: string } }
) {
  const model = params.model
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '0')
  
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