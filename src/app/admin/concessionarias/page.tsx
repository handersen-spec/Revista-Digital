'use client'

import { useState, useEffect } from 'react'
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  TrendingUp, 
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useConcessionarias, useConcessionariasStats, type Concessionaria, type FiltrosConcessionarias } from '@/hooks/useConcessionarias'

const ConcessionariasAdmin = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState('all')
  const [selectedDealerships, setSelectedDealerships] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pendingFilters, setPendingFilters] = useState<FiltrosConcessionarias>({})
  const itemsPerPage = 10

  // Hooks para dados da API
  const { stats, loading: statsLoading } = useConcessionariasStats()
  const { 
    concessionarias: dealerships, 
    paginacao, 
    estatisticas, 
    loading, 
    error, 
    filtros, 
    setFiltros, 
    setPagina, 
    refetch 
  } = useConcessionarias({
    busca: searchTerm || undefined,
    verificada: selectedTab === 'verified' ? true : undefined,
    destaque: selectedTab === 'featured' ? true : undefined
  }, itemsPerPage)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Carregar filtros atuais quando abrir o painel de filtros
  useEffect(() => {
    if (showFilters) {
      setPendingFilters(filtros)
    }
  }, [showFilters, filtros])

  // Atualizar filtros quando searchTerm mudar (com debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      setFiltros({
        busca: searchTerm || undefined,
        verificada: selectedTab === 'verified' ? true : undefined,
        destaque: selectedTab === 'featured' ? true : undefined
      })
      setPagina(1) // Reset para primeira página
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, selectedTab, setFiltros, setPagina])

  // Usar dados da API diretamente (já filtrados)
  const paginatedDealerships = dealerships || []
  const totalPages = paginacao?.totalPaginas || 1

  const getStatusColor = (verificada: boolean) => {
    return verificada ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
  }

  const getStatusText = (verificada: boolean) => {
    return verificada ? 'Verificada' : 'Pendente'
  }

  const handleSelectAll = () => {
    if (selectedDealerships.length === paginatedDealerships.length) {
      setSelectedDealerships([])
    } else {
      setSelectedDealerships(paginatedDealerships.map(d => d.id))
    }
  }

  const handleSelectDealership = (id: string) => {
    setSelectedDealerships(prev => 
      prev.includes(id) 
        ? prev.filter(dealerId => dealerId !== id)
        : [...prev, id]
    )
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setPagina(page)
  }

  // Sincronizar currentPage com a página do hook
  useEffect(() => {
    if (paginacao?.paginaAtual && paginacao.paginaAtual !== currentPage) {
      setCurrentPage(paginacao.paginaAtual)
    }
  }, [paginacao?.paginaAtual, currentPage])

  const handleViewDealership = (id: string) => {
    window.open(`/concessionarias/${id}`, '_blank')
  }

  const handleEditDealership = async (id: string) => {
    try {
      const res = await fetch(`/api/concessionarias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificada: true })
      })
      if (!res.ok) throw new Error('Falha ao atualizar')
      refetch()
    } catch (e) {
      alert('Erro ao atualizar a concessionária')
    }
  }

  const handleDeleteDealership = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta concessionária?')) return
    try {
      const res = await fetch(`/api/concessionarias/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao excluir')
      refetch()
    } catch (e) {
      alert('Erro ao excluir a concessionária')
    }
  }

  const applyFilters = () => {
    const applied: FiltrosConcessionarias = {
      ...pendingFilters,
      busca: searchTerm || undefined,
      verificada: pendingFilters.verificada !== undefined ? pendingFilters.verificada : (selectedTab === 'verified' ? true : undefined),
      destaque: pendingFilters.destaque !== undefined ? pendingFilters.destaque : (selectedTab === 'featured' ? true : undefined)
    }
    setFiltros(applied)
    setPagina(1)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setPendingFilters({})
    setFiltros({
      busca: searchTerm || undefined,
      verificada: selectedTab === 'verified' ? true : undefined,
      destaque: selectedTab === 'featured' ? true : undefined
    })
    setPagina(1)
  }

  // O cadastro de novas concessionárias é realizado via formulário no frontend.

  if (!isMounted) {
    return null
  }

  // Calcular estatísticas baseadas nos dados da API
  const totalConcessionarias = estatisticas?.totalConcessionarias || 0
  const verificadas = dealerships?.filter(d => d.verificada).length || 0
  const destaque = dealerships?.filter(d => d.destaque).length || 0
  const marcas = estatisticas?.marcasDisponiveis?.length || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Concessionárias</h1>
          <p className="mt-2 text-gray-600">Gerencie todas as concessionárias registradas na plataforma</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? '...' : totalConcessionarias}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verificadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {statsLoading ? '...' : verificadas}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Destaque</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {statsLoading ? '...' : destaque}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Marcas</p>
                <p className="text-2xl font-bold text-blue-600">
                  {statsLoading ? '...' : marcas}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar por nome, marca, cidade..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Filtros
                  </button>
                
                  <button
                    onClick={() => refetch()}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Atualizar
                  </button>
                
                  {/* Cadastro é feito via frontend; botão removido */}
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="p-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                    <select
                      value={pendingFilters.marca || ''}
                      onChange={(e) => setPendingFilters({ ...pendingFilters, marca: e.target.value || undefined })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Todas</option>
                      {(estatisticas?.marcasDisponiveis || []).map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                    <select
                      value={pendingFilters.cidade || ''}
                      onChange={(e) => setPendingFilters({ ...pendingFilters, cidade: e.target.value || undefined })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Todas</option>
                      {(estatisticas?.cidadesDisponiveis || []).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Província</label>
                    <select
                      value={pendingFilters.provincia || ''}
                      onChange={(e) => setPendingFilters({ ...pendingFilters, provincia: e.target.value || undefined })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Todas</option>
                      {(estatisticas?.provinciasDisponiveis || []).map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
                    <input
                      type="text"
                      value={pendingFilters.servico || ''}
                      onChange={(e) => setPendingFilters({ ...pendingFilters, servico: e.target.value || undefined })}
                      placeholder="Ex: Vendas, Oficina"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Verificação</label>
                    <select
                      value={pendingFilters.verificada === undefined ? '' : pendingFilters.verificada ? 'true' : 'false'}
                      onChange={(e) => {
                        const v = e.target.value
                        setPendingFilters({ ...pendingFilters, verificada: v === '' ? undefined : v === 'true' })
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Todas</option>
                      <option value="true">Verificadas</option>
                      <option value="false">Pendentes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destaque</label>
                    <select
                      value={pendingFilters.destaque === undefined ? '' : pendingFilters.destaque ? 'true' : 'false'}
                      onChange={(e) => {
                        const v = e.target.value
                        setPendingFilters({ ...pendingFilters, destaque: v === '' ? undefined : v === 'true' })
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Todas</option>
                      <option value="true">Em destaque</option>
                      <option value="false">Sem destaque</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={applyFilters}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Aplicar filtros
                  </button>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Limpar
                  </button>
                </div>
              </div>
            )}

          {/* Tabs */}
          <div className="flex space-x-1 mt-6 px-6">
            {[
              { key: 'all', label: 'Todas', count: totalConcessionarias },
              { key: 'verified', label: 'Verificadas', count: verificadas },
              { key: 'featured', label: 'Em Destaque', count: destaque }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedTab === tab.key
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar concessionárias</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => refetch()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          ) : paginatedDealerships.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma concessionária encontrada</h3>
              <p className="text-gray-600 text-center">
                Cadastros são feitos pelo formulário no site.
                {' '}<a href="/concessionarias" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Acessar página de Concessionárias</a>
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedDealerships.length === paginatedDealerships.length && paginatedDealerships.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Concessionária
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Marca
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Localização
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avaliação
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedDealerships.map((dealership) => (
                      <tr key={dealership.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedDealerships.includes(dealership.id)}
                            onChange={() => handleSelectDealership(dealership.id)}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-gray-500" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center">
                                <div className="text-sm font-medium text-gray-900">{dealership.nome}</div>
                                {dealership.verificada && (
                                  <CheckCircle className="ml-2 w-4 h-4 text-green-500" />
                                )}
                                {dealership.destaque && (
                                  <Star className="ml-1 w-4 h-4 text-yellow-500 fill-current" />
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{dealership.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {dealership.marca}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{dealership.cidade}</div>
                          <div className="text-sm text-gray-500">{dealership.provincia}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{dealership.telefone}</div>
                          {dealership.website && (
                            <div className="text-sm text-blue-600">
                              <a href={dealership.website} target="_blank" rel="noopener noreferrer">
                                Website
                              </a>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(dealership.verificada)}`}>
                            {getStatusText(dealership.verificada)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm text-gray-900">{dealership.avaliacoes.media}</span>
                            <span className="ml-1 text-sm text-gray-500">({dealership.avaliacoes.total})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleViewDealership(dealership.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Visualizar"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditDealership(dealership.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteDealership(dealership.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próximo
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando{' '}
                        <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                        {' '}até{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * itemsPerPage, paginacao?.totalItens || 0)}
                        </span>
                        {' '}de{' '}
                        <span className="font-medium">{paginacao?.totalItens || 0}</span>
                        {' '}resultados
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-red-50 border-red-500 text-red-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConcessionariasAdmin