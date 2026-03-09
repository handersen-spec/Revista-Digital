export interface Partner {
  id: string
  name: string
  type: 'dealership' | 'brand' | 'service' | 'insurance'
  status: 'active' | 'pending' | 'suspended' | 'inactive'
  email: string
  phone: string
  website: string
  address: string
  city: string
  province: string
  logo: string
  joinDate: string
  lastActivity: string
  rating: number
  reviewsCount: number
  vehiclesListed: number
  salesCount: number
  totalSales: number
  revenue: number
  commission: number
  verified: boolean
  featured: boolean
  description: string
  specialties: string[]
  createdAt?: string
  updatedAt?: string
}

export interface CreatePartnerRequest {
  name: string
  type: 'dealership' | 'brand' | 'service' | 'insurance'
  email: string
  phone: string
  website: string
  address: string
  city: string
  province: string
  description: string
  specialties: string[]
  logo?: string
}

export interface UpdatePartnerRequest extends Partial<CreatePartnerRequest> {
  id: string
  status?: 'active' | 'pending' | 'suspended' | 'inactive'
  verified?: boolean
  featured?: boolean
  rating?: number
  commission?: number
}

export interface PartnerFilters {
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

export interface PartnerStats {
  totalPartners: number
  activePartners: number
  pendingApprovals: number
  totalRevenue: number
  averageRating: number
  topPerformers: Partner[]
}