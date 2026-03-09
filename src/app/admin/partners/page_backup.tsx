'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Building2, 
  MapPin, 
  Phone,
  Mail,
  Globe,
  Star,
  Calendar,
  TrendingUp,
  Users,
  Car,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Award,
  Target,
  BarChart3,
  Download,
  Upload,
  Settings,
  Shield,
  Zap,
  Activity,
  DollarSign,
  Handshake,
  Loader2,
  RefreshCw,
  X
} from 'lucide-react'
import { Partner, PartnerFilters } from '@/types/partner'
import PartnerForm from '@/components/admin/PartnerForm'
import PartnerFiltersComponent from '@/components/admin/PartnerFilters'

const PartnersManagement = () => {
  const [selectedTab, setSelectedTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPartners, setSelectedPartners] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [partners, setPartners] = useState<Partner[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [filters, setFilters] = useState<PartnerFilters>({
    page: 1,
    limit: 10,
    sortBy: 'name',
    sortOrder: 'asc'
  })

  // Funções de API
  const fetchPartners = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString())
        }
      })

      if (searchTerm) {
        queryParams.append('search', searchTerm)
      }

      const response = await fetch(`/api/partners?${queryParams}`)
      const data = await response.json()
      
      setPartners(data.partners || [])
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 })
      setError(null)
    } catch (err) {
      setError('Erro ao carregar parceiros')
      console.error('Erro ao buscar parceiros:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/partners/stats')
      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err)
    }
  }

  const createPartner = async (partnerData: any) => {
    try {
      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partnerData),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar parceiro')
      }

      const newPartner = await response.json()
      setPartners(prev => [newPartner, ...prev])
      setShowCreateModal(false)
      fetchStats() // Atualizar estatísticas
      return newPartner
    } catch (err) {
      console.error('Erro ao criar parceiro:', err)
      throw err
    }
  }

  const updatePartner = async (id: string, partnerData: any) => {
    try {
      const response = await fetch(`/api/partners/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partnerData),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar parceiro')
      }

      const updatedPartner = await response.json()
      setPartners(prev => prev.map(p => p.id === id ? updatedPartner : p))
      setShowEditModal(false)
      setSelectedPartner(null)
      fetchStats() // Atualizar estatísticas
      return updatedPartner
    } catch (err) {
      console.error('Erro ao atualizar parceiro:', err)
      throw err
    }
  }

  const deletePartner = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este parceiro?')) {
      return
    }

    try {
      const response = await fetch(`/api/partners/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao remover parceiro')
      }

      setPartners(prev => prev.filter(p => p.id !== id))
      setSelectedPartners(prev => prev.filter(pId => pId !== id))
      setShowDetailsModal(false)
      setSelectedPartner(null)
      fetchStats() // Atualizar estatísticas
    } catch (err) {
      console.error('Erro ao remover parceiro:', err)
      alert('Erro ao remover parceiro')
    }
  }

  // Effects
  useEffect(() => {
    fetchPartners()
    fetchStats()
  }, [])

  useEffect(() => {
    fetchPartners()
  }, [filters])

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      status: selectedTab !== 'all' ? selectedTab as any : undefined,
      page: 1
    }))
  }, [selectedTab])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: searchTerm || undefined,
        page: 1
      }))
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])


  const tabs = [
    { id: 'all', label: 'Todos', count: stats?.total || 0 },
    { id: 'active', label: 'Ativos', count: stats?.active || 0 },
    { id: 'pending', label: 'Pendentes', count: stats?.pending || 0 },
    { id: 'inactive', label: 'Inativos', count: stats?.inactive || 0 }
  ]

  const currentPartners = partners

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'dealership': return 'bg-blue-100 text-blue-800'
      case 'brand': return 'bg-purple-100 text-purple-800'
      case 'service': return 'bg-green-100 text-green-800'
      case 'insurance': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dealership': return <Car className="w-4 h-4" />
      case 'brand': return <Award className="w-4 h-4" />
      case 'service': return <Settings className="w-4 h-4" />
      case 'insurance': return <Shield className="w-4 h-4" />
      default: return <Building2 className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'inactive': return <XCircle className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const filteredPartners = loading ? [] : currentPartners.filter(partner => {
    if (selectedTab !== 'all' && partner.status !== selectedTab) return false
    if (searchTerm && !partner.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !partner.email.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const handleSelectPartner = (id: string) => {
    setSelectedPartners(prev =>
      prev.includes(id)
        ? prev.filter(pId => pId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedPartners.length === filteredPartners.length) {
      setSelectedPartners([])
    } else {
      setSelectedPartners(filteredPartners.map(p => p.id))
    }
  }

  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Hoje'
    if (diffDays === 2) return 'Ontem'
    if (diffDays <= 7) return `${diffDays} dias atrás`
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} semanas atrás`
    return `${Math.ceil(diffDays / 30)} meses atrás`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parceiros</h1>
          <p className="text-gray-600">Gerencie concessionárias e parceiros comerciais</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchPartners}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
          
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Importar</span>
          </button>
          
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
          
          <button 
            onClick={() => setShowAdvancedFilters(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros Avançados</span>
          </button>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Parceiro</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Parceiros</p>
              {loading ? (
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
              )}
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Parceiros Ativos</p>
              {loading ? (
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stats?.active || 0}</p>
              )}
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aprovações Pendentes</p>
              {loading ? (
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stats?.pending || 0}</p>
              )}
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Receita Total</p>
              {loading ? (
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalRevenue ? `${(stats.totalRevenue / 1000000).toFixed(1)}M AOA` : '0 AOA'}
                </p>
              )}
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar parceiros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-80"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </button>
            </div>

            {selectedPartners.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {selectedPartners.length} selecionado(s)
                </span>
                <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                  Remover Selecionados
                </button>
              </div>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option value="">Todos os tipos</option>
                  <option value="dealership">Concessionária</option>
                  <option value="brand">Marca</option>
                  <option value="service">Serviços</option>
                  <option value="insurance">Seguros</option>
                </select>
                
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option value="">Todas as províncias</option>
                  <option value="Luanda">Luanda</option>
                  <option value="Benguela">Benguela</option>
                  <option value="Huambo">Huambo</option>
                </select>
                
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option value="">Ordenar por</option>
                  <option value="name">Nome</option>
                  <option value="joinDate">Data de Cadastro</option>
                  <option value="rating">Avaliação</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                <span className="text-gray-600">Carregando parceiros...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar parceiros</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchPartners}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum parceiro encontrado</h3>
              <p className="text-gray-600">Tente ajustar os filtros ou adicionar um novo parceiro.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPartners.length === filteredPartners.length && filteredPartners.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parceiro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avaliação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Atividade
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPartners.includes(partner.id)}
                        onChange={() => handleSelectPartner(partner.id)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {partner.logo ? (
                            <img className="h-10 w-10 rounded-full object-cover" src={partner.logo} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center space-x-2">
                            <div className="text-sm font-medium text-gray-900">{partner.name}</div>
                            {partner.verified && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                            {partner.featured && (
                              <Star className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{partner.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(partner.type)}`}>
                        {getTypeIcon(partner.type)}
                        <span className="ml-1">
                          {partner.type === 'dealership' ? 'Concessionária' :
                           partner.type === 'brand' ? 'Marca' :
                           partner.type === 'service' ? 'Serviços' :
                           partner.type === 'insurance' ? 'Seguros' : partner.type}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(partner.status)}`}>
                        {getStatusIcon(partner.status)}
                        <span className="ml-1">
                          {partner.status === 'active' ? 'Ativo' :
                           partner.status === 'pending' ? 'Pendente' :
                           partner.status === 'inactive' ? 'Inativo' : partner.status}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        {partner.province}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(partner.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{partner.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {partner.totalSales}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatLastActivity(partner.lastActivity)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPartner(partner)
                            setShowDetailsModal(true)
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPartner(partner)
                            setShowEditModal(true)
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePartner(partner.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} resultados
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                <div className="flex items-center space-x-1">
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const page = i + 1
                    if (page === pagination.page ||
                        page === 1 || page === pagination.totalPages ||
                        (page >= pagination.page - 1 && page <= pagination.page + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => setFilters(prev => ({ ...prev, page }))}
                          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                            page === pagination.page
                              ? 'bg-red-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    } else if (page === pagination.page - 2 || page === pagination.page + 2) {
                      return <span key={page} className="px-2 text-gray-400">...</span>
                    }
                    return null
                  })}
                </div>
                
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {showDetailsModal && selectedPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Detalhes do Parceiro</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {selectedPartner.logo ? (
                    <img className="h-16 w-16 rounded-full object-cover" src={selectedPartner.logo} alt="" />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-gray-900">{selectedPartner.name}</h3>
                    {selectedPartner.verified && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {selectedPartner.featured && (
                      <Star className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPartner.status)}`}>
                    {getStatusIcon(selectedPartner.status)}
                    <span className="ml-1">
                      {selectedPartner.status === 'active' ? 'Ativo' :
                       selectedPartner.status === 'pending' ? 'Pendente' :
                       selectedPartner.status === 'inactive' ? 'Inativo' : selectedPartner.status}
                    </span>
                  </span>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(selectedPartner.type)}`}>
                      {getTypeIcon(selectedPartner.type)}
                      <span className="ml-1">
                        {selectedPartner.type === 'dealership' ? 'Concessionária' :
                         selectedPartner.type === 'brand' ? 'Marca' :
                         selectedPartner.type === 'service' ? 'Serviços' :
                         selectedPartner.type === 'insurance' ? 'Seguros' : selectedPartner.type}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{selectedPartner.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{selectedPartner.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{selectedPartner.address}, {selectedPartner.province}</span>
                  </div>
                  {selectedPartner.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <a href={selectedPartner.website} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">
                        {selectedPartner.website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">Avaliação: {selectedPartner.rating}/5</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">Vendas: {selectedPartner.totalSales}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">Receita: {(selectedPartner.revenue / 1000000).toFixed(1)}M AOA</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">Cadastro: {new Date(selectedPartner.joinDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              {selectedPartner.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Descrição</h4>
                  <p className="text-gray-600">{selectedPartner.description}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Especialidades</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPartner.specialties.map((specialty, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDetailsModal(false)
                  setShowEditModal(true)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false)
                  deletePartner(selectedPartner.id)
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remover</span>
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criação */}
      <PartnerForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createPartner}
        title="Adicionar Novo Parceiro"
      />

      {/* Modal de Edição */}
      <PartnerForm
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedPartner(null)
        }}
        onSubmit={(data) => updatePartner(selectedPartner!.id, data)}
        partner={selectedPartner}
        title="Editar Parceiro"
      />

      {/* Modal de Filtros Avançados */}
      <PartnerFiltersComponent
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  )
}

export default PartnersManagement