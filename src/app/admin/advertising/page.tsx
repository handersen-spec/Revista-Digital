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
  Play,
  Pause,
  Target,
  TrendingUp,
  Users,
  MousePointer,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Image,
  Video,
  FileText,
  ExternalLink,
  Download,
  Upload,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  Award,
  Megaphone,
  Camera,
  Layout
} from 'lucide-react'
import { 
  useAnuncios, 
  useCampanhas, 
  usePublicidadeStats, 
  useMetricasPublicidade,
  useCriarAnuncio,
  useCriarCampanha,
  type Anuncio,
  type CampanhaPublicitaria,
  type FiltrosPublicidade
} from '@/hooks/usePublicidade'

const AdvertisingManagement = () => {
  const [selectedTab, setSelectedTab] = useState('campanhas')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Anuncio | CampanhaPublicitaria | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [filtros, setFiltros] = useState<FiltrosPublicidade>({
    page: 1,
    limit: 10,
    ordenacao: 'criado_em',
    direcao: 'desc'
  })

  // Hooks da API
  const { anuncios, paginacao: paginacaoAnuncios, loading: loadingAnuncios, refetch: refetchAnuncios } = useAnuncios(
    selectedTab === 'anuncios' ? filtros : {}
  )
  const { campanhas, paginacao: paginacaoCampanhas, loading: loadingCampanhas, refetch: refetchCampanhas } = useCampanhas(
    selectedTab === 'campanhas' ? filtros : {}
  )
  const { stats, loading: loadingStats } = usePublicidadeStats()
  const { metricas, loading: loadingMetricas } = useMetricasPublicidade({
    data_inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    data_fim: new Date().toISOString().split('T')[0]
  })
  const { criarAnuncio, loading: loadingCriarAnuncio } = useCriarAnuncio()
  const { criarCampanha, loading: loadingCriarCampanha } = useCriarCampanha()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Dados baseados na aba selecionada
  const currentData = selectedTab === 'anuncios' ? anuncios : campanhas
  const currentPagination = selectedTab === 'anuncios' ? paginacaoAnuncios : paginacaoCampanhas
  const currentLoading = selectedTab === 'anuncios' ? loadingAnuncios : loadingCampanhas

  // Função para atualizar filtros
  const updateFiltros = (novosFiltros: Partial<FiltrosPublicidade>) => {
    setFiltros(prev => ({ ...prev, ...novosFiltros }))
  }

  // Função para refetch baseado na aba
  const refetchData = () => {
    if (selectedTab === 'anuncios') {
      refetchAnuncios()
    } else {
      refetchCampanhas()
    }
  }

  // Função para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(value)
  }

  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO')
  }

  // Função para obter cor do status
  const getStatusColor = (status: string | boolean) => {
    if (typeof status === 'boolean') {
      return status ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
    }
    switch (status) {
      case 'ativa':
        return 'text-green-600 bg-green-100'
      case 'pausada':
        return 'text-yellow-600 bg-yellow-100'
      case 'finalizada':
        return 'text-gray-600 bg-gray-100'
      case 'rascunho':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  // Função para obter ícone do tipo
  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'banner':
        return <Image className="w-4 h-4" />
      case 'video':
        return <Video className="w-4 h-4" />
      case 'nativo':
        return <FileText className="w-4 h-4" />
      case 'popup':
        return <ExternalLink className="w-4 h-4" />
      case 'sidebar':
        return <Layout className="w-4 h-4" />
      default:
        return <Image className="w-4 h-4" />
    }
  }

  // Função para filtrar dados por busca
  const filteredData = currentData?.filter((item: any) => {
    const searchLower = searchTerm.toLowerCase()
    if (selectedTab === 'anuncios') {
      const anuncio = item as Anuncio
      return anuncio.titulo.toLowerCase().includes(searchLower) ||
             anuncio.campanha.anunciante.toLowerCase().includes(searchLower) ||
             anuncio.categoria.some(cat => cat.toLowerCase().includes(searchLower))
    } else {
      const campanha = item as CampanhaPublicitaria
      return campanha.nome.toLowerCase().includes(searchLower) ||
             campanha.anunciante.empresa.toLowerCase().includes(searchLower)
    }
  }) || []

  // Função para lidar com seleção de itens
  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  // Função para selecionar todos
  const handleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredData.map((item: any) => item.id))
    }
  }

  // Função para criar novo item
  const handleCreateItem = async (dados: any) => {
    try {
      if (selectedTab === 'anuncios') {
        await criarAnuncio(dados)
        refetchAnuncios()
      } else {
        await criarCampanha(dados)
        refetchCampanhas()
      }
      setShowModal(false)
    } catch (error) {
      console.error('Erro ao criar item:', error)
    }
  }

  if (!isMounted) {
    return <div>Carregando...</div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Publicidade</h1>
          <p className="text-gray-600">Gerencie anúncios, campanhas e métricas de publicidade</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {selectedTab === 'anuncios' ? 'Novo Anúncio' : 'Nova Campanha'}
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && !loadingStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Anúncios</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_anuncios || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Megaphone className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Campanhas Ativas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.campanhas_ativas || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.receita_total || 0)}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CTR Médio</p>
                <p className="text-2xl font-bold text-gray-900">{(stats.ctr_medio || 0).toFixed(2)}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Abas */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'campanhas', label: 'Campanhas', icon: Target },
              { id: 'anuncios', label: 'Anúncios', icon: Megaphone },
              { id: 'metricas', label: 'Métricas', icon: BarChart3 },
              { id: 'relatorios', label: 'Relatórios', icon: PieChart }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Conteúdo das abas */}
        <div className="p-6">
          {(selectedTab === 'campanhas' || selectedTab === 'anuncios') && (
            <>
              {/* Barra de pesquisa e filtros */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={`Buscar ${selectedTab}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {selectedItems.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {selectedItems.length} selecionado(s)
                    </span>
                    <button className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Tabela */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {selectedTab === 'anuncios' ? 'Anúncio' : 'Campanha'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Anunciante
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Métricas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Carregando...
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Nenhum item encontrado
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item: any) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => handleSelectItem(item.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                  {selectedTab === 'anuncios' 
                                    ? getTypeIcon((item as Anuncio).tipo)
                                    : <Target className="w-5 h-5 text-gray-600" />
                                  }
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {selectedTab === 'anuncios' 
                                    ? (item as Anuncio).titulo
                                    : (item as CampanhaPublicitaria).nome
                                  }
                                </div>
                                <div className="text-sm text-gray-500">
                                  {selectedTab === 'anuncios' 
                                    ? `${(item as Anuncio).tipo} • ${(item as Anuncio).formato}`
                                    : `${(item as CampanhaPublicitaria).anuncios.length} anúncios`
                                  }
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              selectedTab === 'anuncios'
                                ? getStatusColor((item as Anuncio).configuracao.ativo)
                                : getStatusColor((item as CampanhaPublicitaria).status)
                            }`}>
                              {selectedTab === 'anuncios'
                                ? ((item as Anuncio).configuracao.ativo ? 'Ativo' : 'Inativo')
                                : (item as CampanhaPublicitaria).status
                              }
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {selectedTab === 'anuncios'
                              ? (item as Anuncio).campanha.anunciante
                              : (item as CampanhaPublicitaria).anunciante.empresa
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {selectedTab === 'anuncios' ? (
                              <div>
                                <div>{(item as Anuncio).metricas.impressoes.toLocaleString()} impressões</div>
                                <div>{(item as Anuncio).metricas.cliques} cliques • CTR: {(item as Anuncio).metricas.ctr.toFixed(2)}%</div>
                              </div>
                            ) : (
                              <div>
                                <div>{(item as CampanhaPublicitaria).metricas_campanha.impressoes_total.toLocaleString()} impressões</div>
                                <div>ROI: {(item as CampanhaPublicitaria).metricas_campanha.roi.toFixed(2)}%</div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              {currentPagination && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Mostrando {((currentPagination.pagina_atual - 1) * currentPagination.itens_por_pagina) + 1} a{' '}
                    {Math.min(currentPagination.pagina_atual * currentPagination.itens_por_pagina, currentPagination.total_itens)} de{' '}
                    {currentPagination.total_itens} resultados
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateFiltros({ page: currentPagination.pagina_atual - 1 })}
                      disabled={!currentPagination.tem_anterior}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => updateFiltros({ page: currentPagination.pagina_atual + 1 })}
                      disabled={!currentPagination.tem_proxima}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próximo
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Aba de Métricas */}
          {selectedTab === 'metricas' && metricas && !loadingMetricas && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Impressões</p>
                      <p className="text-2xl font-bold text-gray-900">{metricas.resumo.impressoes.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Cliques</p>
                      <p className="text-2xl font-bold text-gray-900">{metricas.resumo.cliques.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <MousePointer className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Receita</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(metricas.resumo.receita)}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">ROI</p>
                      <p className="text-2xl font-bold text-gray-900">{metricas.resumo.roi.toFixed(2)}%</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba de Relatórios */}
          {selectedTab === 'relatorios' && (
            <div className="text-center py-12">
              <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Relatórios em Desenvolvimento</h3>
              <p className="text-gray-600">Esta funcionalidade estará disponível em breve.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdvertisingManagement