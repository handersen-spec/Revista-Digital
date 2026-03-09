import { query } from '@/lib/db'
import type { Partner, CreatePartnerRequest, UpdatePartnerRequest } from '@/types/partner'

function mapRowToPartner(row: any): Partner {
  const joinDate = row.join_date instanceof Date ? row.join_date.toISOString().split('T')[0] : (row.join_date || '')
  const lastActivity = row.last_activity instanceof Date ? row.last_activity.toISOString() : (row.last_activity || '')
  const createdAt = row.created_at instanceof Date ? row.created_at.toISOString() : (row.created_at || '')
  const updatedAt = row.updated_at instanceof Date ? row.updated_at.toISOString() : (row.updated_at || '')
  return {
    id: String(row.id),
    name: row.name,
    type: row.type,
    status: row.status,
    email: row.email,
    phone: row.phone || '',
    website: row.website || '',
    address: row.address || '',
    city: row.city || '',
    province: row.province || '',
    logo: row.logo || '',
    joinDate,
    lastActivity,
    rating: Number(row.rating || 0),
    reviewsCount: Number(row.reviews_count || 0),
    vehiclesListed: Number(row.vehicles_listed || 0),
    salesCount: Number(row.sales_count || 0),
    totalSales: Number(row.total_sales || 0),
    revenue: Number(row.revenue || 0),
    commission: Number(row.commission || 0),
    verified: !!row.verified,
    featured: !!row.featured,
    description: row.description || '',
    specialties: Array.isArray(row.specialties) ? row.specialties : [],
    createdAt,
    updatedAt,
  }
}

export interface ListParamsDB {
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

export async function listPartnersDB(params: ListParamsDB) {
  const {
    type, status, province, verified, featured,
    search, page = 1, limit = 10, minRating,
    sortBy = 'name', sortOrder = 'asc'
  } = params

  const where: string[] = []
  const values: any[] = []

  if (type) { values.push(type); where.push(`type = $${values.length}`) }
  if (status) { values.push(status); where.push(`status = $${values.length}`) }
  if (province) { values.push(province); where.push(`province = $${values.length}`) }
  if (verified !== undefined) { values.push(verified); where.push(`verified = $${values.length}`) }
  if (featured !== undefined) { values.push(featured); where.push(`featured = $${values.length}`) }
  if (minRating !== undefined) { values.push(minRating); where.push(`rating >= $${values.length}`) }
  if (search) {
    values.push(`%${search.toLowerCase()}%`)
    where.push(`(LOWER(name) LIKE $${values.length} OR LOWER(email) LIKE $${values.length})`)
  }

  const orderColumn =
    sortBy === 'rating' ? 'rating' :
    sortBy === 'revenue' ? 'revenue' :
    sortBy === 'joinDate' ? 'join_date' : 'name'

  const dir = sortOrder === 'desc' ? 'DESC' : 'ASC'
  const offset = (page - 1) * limit
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const totalRes = await query<{ count: string }>(`SELECT COUNT(*)::text AS count FROM partners ${whereSql}`, values)
  const total = Number(totalRes.rows[0]?.count || 0)
  const totalPages = Math.ceil(total / limit)

  const itemsRes = await query<any>(
    `SELECT * FROM partners ${whereSql} ORDER BY ${orderColumn} ${dir} LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, limit, offset]
  )

  const partners = itemsRes.rows.map(mapRowToPartner)
  return { partners, pagination: { page, limit, total, totalPages } }
}

export async function createPartnerDB(body: CreatePartnerRequest): Promise<Partner> {
  const now = new Date()
  const joinDate = now.toISOString().split('T')[0]
  const specialties = body.specialties || []
  const res = await query<any>(
    `INSERT INTO partners (name, type, status, email, phone, website, address, city, province, logo, join_date, last_activity, rating, reviews_count, vehicles_listed, sales_count, total_sales, revenue, commission, verified, featured, description, specialties, created_at, updated_at)
     VALUES ($1, $2, 'pending', $3, $4, $5, $6, $7, $8, $9, $10, $11, 0, 0, 0, 0, 0, 0, 0, FALSE, FALSE, $12, $13, NOW(), NOW())
     RETURNING *`,
    [
      body.name, body.type, body.email, body.phone, body.website,
      body.address, body.city, body.province, body.logo || '',
      joinDate, now.toISOString(), body.description, specialties
    ]
  )
  return mapRowToPartner(res.rows[0])
}

export async function getPartnerByIdDB(id: string): Promise<Partner | null> {
  const res = await query<any>('SELECT * FROM partners WHERE id = $1', [id])
  return res.rows[0] ? mapRowToPartner(res.rows[0]) : null
}

export async function updatePartnerDB(id: string, body: UpdatePartnerRequest): Promise<Partner | null> {
  const sets: string[] = []
  const values: any[] = []

  const add = (col: string, val: any) => {
    values.push(val)
    sets.push(`${col} = $${values.length}`)
  }

  if (body.name !== undefined) add('name', body.name)
  if (body.type !== undefined) add('type', body.type)
  if (body.status !== undefined) add('status', body.status)
  if (body.email !== undefined) add('email', body.email)
  if (body.phone !== undefined) add('phone', body.phone)
  if (body.website !== undefined) add('website', body.website)
  if (body.address !== undefined) add('address', body.address)
  if (body.city !== undefined) add('city', body.city)
  if (body.province !== undefined) add('province', body.province)
  if (body.logo !== undefined) add('logo', body.logo)
  if (body.description !== undefined) add('description', body.description)
  if (body.specialties !== undefined) add('specialties', body.specialties)
  if (body.verified !== undefined) add('verified', body.verified)
  if (body.featured !== undefined) add('featured', body.featured)
  if (body.rating !== undefined) add('rating', body.rating)
  if (body.commission !== undefined) add('commission', body.commission)

  // last_activity when status becomes active
  if (body.status === 'active') {
    sets.push(`last_activity = NOW()`)
  }

  sets.push(`updated_at = NOW()`)
  if (!sets.length) {
    const current = await getPartnerByIdDB(id)
    return current
  }

  const res = await query<any>(
    `UPDATE partners SET ${sets.join(', ')} WHERE id = $${values.length + 1} RETURNING *`,
    [...values, id]
  )
  return res.rows[0] ? mapRowToPartner(res.rows[0]) : null
}

export async function deletePartnerDB(id: string): Promise<Partner | null> {
  const res = await query<any>('DELETE FROM partners WHERE id = $1 RETURNING *', [id])
  return res.rows[0] ? mapRowToPartner(res.rows[0]) : null
}

export async function computeStatsDB() {
  const totalRes = await query<{ count: string }>('SELECT COUNT(*)::text AS count FROM partners')
  const activeRes = await query<{ count: string }>("SELECT COUNT(*)::text AS count FROM partners WHERE status = 'active'")
  const pendingRes = await query<{ count: string }>("SELECT COUNT(*)::text AS count FROM partners WHERE status = 'pending'")
  const inactiveRes = await query<{ count: string }>("SELECT COUNT(*)::text AS count FROM partners WHERE status = 'inactive'")
  const revenueRes = await query<{ sum: string }>('SELECT COALESCE(SUM(revenue),0)::text AS sum FROM partners')
  const ratingRes = await query<{ avg: string }>('SELECT COALESCE(AVG(rating),0)::text AS avg FROM partners')
  const topRes = await query<any>('SELECT * FROM partners ORDER BY revenue DESC NULLS LAST LIMIT 5')

  return {
    total: Number(totalRes.rows[0]?.count || 0),
    active: Number(activeRes.rows[0]?.count || 0),
    pending: Number(pendingRes.rows[0]?.count || 0),
    inactive: Number(inactiveRes.rows[0]?.count || 0),
    totalRevenue: Number(revenueRes.rows[0]?.sum || 0),
    averageRating: Number(ratingRes.rows[0]?.avg || 0),
    topPerformers: topRes.rows.map(mapRowToPartner),
  }
}