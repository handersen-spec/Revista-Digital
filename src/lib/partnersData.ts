import { Partner, CreatePartnerRequest, UpdatePartnerRequest } from '@/types/partner'

// In-memory store for partners (shared across API routes)
// Ensure a single shared instance across route modules using globalThis
const GLOBAL_KEY = '__partners_store__'
const g = globalThis as any
if (!g[GLOBAL_KEY]) {
  g[GLOBAL_KEY] = [
  {
    id: '1',
    name: 'Toyota Center Luanda',
    type: 'dealership',
    status: 'active',
    email: 'contato@toyotacenter.ao',
    phone: '+244 222 123 456',
    website: 'www.toyotacenter.ao',
    address: 'Rua Amílcar Cabral, 123',
    city: 'Luanda',
    province: 'Luanda',
    logo: '/api/placeholder/60/60',
    joinDate: '2023-01-15',
    lastActivity: '2024-01-15T10:30:00',
    rating: 4.8,
    reviewsCount: 156,
    vehiclesListed: 45,
    salesCount: 23,
    totalSales: 2300000,
    revenue: 125000,
    commission: 8.5,
    verified: true,
    featured: true,
    description: 'Concessionária oficial Toyota com mais de 20 anos de experiência no mercado angolano.',
    specialties: ['Toyota', 'Lexus', 'Híbridos', 'Peças Originais'],
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'BMW Premium Motors',
    type: 'dealership',
    status: 'active',
    email: 'info@bmwpremium.ao',
    phone: '+244 222 234 567',
    website: 'www.bmwpremium.ao',
    address: 'Avenida 4 de Fevereiro, 567',
    city: 'Luanda',
    province: 'Luanda',
    logo: '/api/placeholder/60/60',
    joinDate: '2023-03-20',
    lastActivity: '2024-01-14T16:45:00',
    rating: 4.6,
    reviewsCount: 89,
    vehiclesListed: 32,
    salesCount: 18,
    totalSales: 1800000,
    revenue: 98500,
    commission: 9.0,
    verified: true,
    featured: true,
    description: 'Concessionária premium BMW oferecendo veículos de luxo e serviços especializados.',
    specialties: ['BMW', 'MINI', 'Veículos de Luxo', 'Serviços Premium'],
    createdAt: '2023-03-20T09:00:00Z',
    updatedAt: '2024-01-14T16:45:00Z'
  },
  {
    id: '3',
    name: 'Seguros Garantia',
    type: 'insurance',
    status: 'active',
    email: 'comercial@segurosgarantia.ao',
    phone: '+244 222 345 678',
    website: 'www.segurosgarantia.ao',
    address: 'Rua da Missão, 789',
    city: 'Luanda',
    province: 'Luanda',
    logo: '/api/placeholder/60/60',
    joinDate: '2023-05-12',
    lastActivity: '2024-01-14T12:20:00',
    rating: 4.4,
    reviewsCount: 234,
    vehiclesListed: 0,
    salesCount: 156,
    totalSales: 780000,
    revenue: 45000,
    commission: 12.0,
    verified: true,
    featured: false,
    description: 'Seguradora líder em Angola, especializada em seguros automóveis e proteção veicular.',
    specialties: ['Seguro Auto', 'Proteção Veicular', 'Assistência 24h', 'Cobertura Nacional'],
    createdAt: '2023-05-12T10:00:00Z',
    updatedAt: '2024-01-14T12:20:00Z'
  },
  {
    id: '4',
    name: 'Mercedes-Benz Benguela',
    type: 'dealership',
    status: 'pending',
    email: 'contato@mercedesbenguela.ao',
    phone: '+244 272 123 456',
    website: 'www.mercedesbenguela.ao',
    address: 'Avenida Norton de Matos, 234',
    city: 'Benguela',
    province: 'Benguela',
    logo: '/api/placeholder/60/60',
    joinDate: '2023-06-10',
    lastActivity: '2024-01-13T09:15:00',
    rating: 4.7,
    reviewsCount: 67,
    vehiclesListed: 28,
    salesCount: 15,
    totalSales: 1500000,
    revenue: 87500,
    commission: 8.0,
    verified: false,
    featured: false,
    description: 'Concessionária Mercedes-Benz em Benguela, especializada em veículos de luxo e comerciais.',
    specialties: ['Mercedes-Benz', 'Veículos Comerciais', 'Luxo', 'Smart'],
    createdAt: '2023-06-10T11:00:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '5',
    name: 'AutoService Pro',
    type: 'service',
    status: 'suspended',
    email: 'contato@autoservicepro.ao',
    phone: '+244 222 567 890',
    website: 'www.autoservicepro.ao',
    address: 'Rua Rainha Ginga, 456',
    city: 'Luanda',
    province: 'Luanda',
    logo: '/api/placeholder/60/60',
    joinDate: '2023-09-05',
    lastActivity: '2024-01-05T11:30:00',
    rating: 3.8,
    reviewsCount: 34,
    vehiclesListed: 0,
    salesCount: 0,
    totalSales: 0,
    revenue: 15000,
    commission: 15.0,
    verified: false,
    featured: false,
    description: 'Oficina especializada em manutenção e reparação de veículos de todas as marcas.',
    specialties: ['Manutenção', 'Reparação', 'Diagnóstico', 'Multimarca'],
    createdAt: '2023-09-05T14:00:00Z',
    updatedAt: '2024-01-05T11:30:00Z'
  }
]
}

const partners: Partner[] = g[GLOBAL_KEY] as Partner[]

export const getPartners = () => partners

export const getPartnerById = (id: string) => partners.find(p => p.id === id) || null

export const updatePartner = (id: string, body: UpdatePartnerRequest) => {
  const index = partners.findIndex(p => p.id === id)
  if (index === -1) return null

  if (body.email) {
    const existing = partners.find(p => p.email === body.email && p.id !== id)
    if (existing) throw new Error('EMAIL_IN_USE')
  }

  const current = partners[index]
  const updated: Partner = {
    ...current,
    ...body,
    id: current.id,
    updatedAt: new Date().toISOString(),
  }
  if (body.status === 'active' && current.status !== 'active') {
    updated.lastActivity = new Date().toISOString()
  }
  partners[index] = updated
  return updated
}

export const deletePartner = (id: string) => {
  const index = partners.findIndex(p => p.id === id)
  if (index === -1) return null
  const deleted = partners[index]
  partners.splice(index, 1)
  return deleted
}

export const createPartner = (body: CreatePartnerRequest) => {
  // Basic validation
  if (!body.name || !body.email || !body.phone || !body.address || !body.province) {
    throw new Error('INVALID_INPUT')
  }
  const existing = partners.find(p => p.email === body.email)
  if (existing) throw new Error('EMAIL_IN_USE')

  const id = String(Math.max(0, ...partners.map(p => parseInt(p.id))) + 1)
  const now = new Date().toISOString()
  const newPartner: Partner = {
    id,
    name: body.name,
    type: body.type,
    status: 'pending',
    email: body.email,
    phone: body.phone,
    website: body.website,
    address: body.address,
    city: '',
    province: body.province,
    logo: body.logo || '',
    joinDate: now.split('T')[0],
    lastActivity: now,
    rating: 0,
    reviewsCount: 0,
    vehiclesListed: 0,
    salesCount: 0,
    totalSales: 0,
    revenue: 0,
    commission: 0,
    verified: false,
    featured: false,
    description: body.description,
    specialties: body.specialties || [],
    createdAt: now,
    updatedAt: now,
  }
  partners.unshift(newPartner)
  return newPartner
}

export interface ListParams {
  type?: string
  status?: string
  province?: string
  verified?: boolean
  featured?: boolean
  search?: string
  page?: number
  limit?: number
  minRating?: number
  sortBy?: 'name' | 'joinDate' | 'rating' | 'revenue'
  sortOrder?: 'asc' | 'desc'
}

export const listPartners = (params: ListParams) => {
  const {
    type, status, province, verified, featured,
    search, page = 1, limit = 10, minRating,
    sortBy = 'name', sortOrder = 'asc'
  } = params

  let result = [...partners]

  if (type) result = result.filter(p => p.type === type)
  if (status) result = result.filter(p => p.status === status)
  if (province) result = result.filter(p => p.province === province)
  if (verified !== undefined) result = result.filter(p => p.verified === verified)
  if (featured !== undefined) result = result.filter(p => p.featured === featured)
  if (minRating !== undefined) result = result.filter(p => (p.rating || 0) >= minRating!)
  if (search) {
    const s = search.toLowerCase()
    result = result.filter(p =>
      (p.name || '').toLowerCase().includes(s) ||
      (p.email || '').toLowerCase().includes(s)
    )
  }

  result.sort((a, b) => {
    const dir = sortOrder === 'asc' ? 1 : -1
    switch (sortBy) {
      case 'rating': return ((a.rating || 0) - (b.rating || 0)) * dir
      case 'revenue': return ((a.revenue || 0) - (b.revenue || 0)) * dir
      case 'joinDate': return (new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()) * dir
      default: return (a.name.localeCompare(b.name)) * dir
    }
  })

  const total = result.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const items = result.slice(start, start + limit)

  return {
    partners: items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    }
  }
}

export const computeStats = () => {
  const total = partners.length
  const active = partners.filter(p => p.status === 'active').length
  const pending = partners.filter(p => p.status === 'pending').length
  const inactive = partners.filter(p => p.status === 'inactive').length
  const totalRevenue = partners.reduce((acc, p) => acc + (p.revenue || 0), 0)
  const averageRating = total ? partners.reduce((acc, p) => acc + (p.rating || 0), 0) / total : 0
  const topPerformers = [...partners]
    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
    .slice(0, 5)

  return {
    total,
    active,
    pending,
    inactive,
    totalRevenue,
    averageRating,
    topPerformers,
  }
}