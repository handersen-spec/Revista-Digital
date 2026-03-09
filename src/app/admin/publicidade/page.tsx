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
  type Anuncio,
  type CampanhaPublicitaria,
  type FiltrosPublicidade
} from '@/hooks/usePublicidade'

const PublicidadeAdmin = () => {
  const [selectedTab, setSelectedTab] = useState('anuncios')
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
      const matchTitulo = anuncio?.titulo?.toLowerCase().includes(searchLower)
      const matchAnunciante = anuncio?.campanha?.anunciante?.toLowerCase().includes(searchLower)
      const matchCategoria = Array.isArray(anuncio?.categoria)
        ? anuncio.categoria.some(cat => cat?.toLowerCase().includes(searchLower))
        : false
      return Boolean(matchTitulo || matchAnunciante || matchCategoria)
    } else {
      const campanha = item as CampanhaPublicitaria
      const matchNome = campanha?.nome?.toLowerCase().includes(searchLower)
      const matchEmpresa = campanha?.anunciante?.empresa?.toLowerCase().includes(searchLower)
      return Boolean(matchNome || matchEmpresa)
    }
  }) || []

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
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {selectedTab === 'anuncios' ? 'Novo Anúncio' : 'Nova Campanha'}
        </button>
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
            <div className="mt-2 text-sm text-gray-600">
              {stats.anuncios_ativos || 0} ativos, {stats.anuncios_pausados || 0} pausados
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Campanhas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_campanhas || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {stats.campanhas_ativas || 0} ativas, {stats.campanhas_pausadas || 0} pausadas
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
            <div className="mt-2 text-sm text-gray-600">
              CTR médio: {(stats.ctr_medio || 0).toFixed(2)}%
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Impressões</p>
                <p className="text-2xl font-bold text-gray-900">{(stats.impressoes_total || 0).toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {(stats.cliques_total || 0).toLocaleString()} cliques
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'anuncios', label: 'Anúncios', icon: Image },
              { id: 'campanhas', label: 'Campanhas', icon: Target },
              { id: 'metricas', label: 'Métricas', icon: BarChart3 },
              { id: 'relatorios', label: 'Relatórios', icon: FileText }
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

        {/* Filtros e Busca */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={`Buscar ${selectedTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtros
              </button>
              <button
                onClick={refetchData}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Activity className="w-4 h-4" />
                Atualizar
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="p-6">
          {selectedTab === 'anuncios' && (
            <div className="space-y-4">
              {currentLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando anúncios...</p>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="text-center py-8">
                  <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum anúncio encontrado</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Anúncio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo/Posição
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Anunciante
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Métricas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Receita
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                       {(filteredData as Anuncio[]).map((anuncio: Anuncio) => (
                         <tr key={anuncio.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-lg object-cover"
                                  src={anuncio?.imagem || ''}
                                  alt={anuncio?.titulo || 'Anúncio'}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {anuncio?.titulo || '—'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {anuncio?.descricao?.substring ? `${anuncio.descricao.substring(0, 50)}...` : '—'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(anuncio?.tipo || anuncio?.formato || 'banner')}
                              <div>
                                <div className="text-sm font-medium text-gray-900 capitalize">
                                  {anuncio?.tipo || anuncio?.formato || 'banner'}
                                </div>
                                <div className="text-sm text-gray-500 capitalize">
                                  {anuncio?.posicao || 'top'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{anuncio?.campanha?.anunciante || '—'}</div>
                            <div className="text-sm text-gray-500">{anuncio?.campanha?.nome || '—'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {(() => { const ativo = anuncio?.configuracao?.ativo ?? false; return (
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ativo)}`}>
                                {ativo ? 'Ativo' : 'Pausado'}
                              </span>
                            )})()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>{Number(anuncio?.metricas?.impressoes ?? 0).toLocaleString()} impressões</div>
                            <div>{Number(anuncio?.metricas?.cliques ?? 0).toLocaleString()} cliques</div>
                            <div>CTR: {Number(anuncio?.metricas?.ctr ?? 0).toFixed(2)}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="font-medium">{formatCurrency(Number(anuncio?.metricas?.receita ?? 0))}</div>
                            <div className="text-gray-500">CPC: {formatCurrency(Number(anuncio?.metricas?.cpc ?? 0))}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedItem(anuncio)
                                  setShowModal(true)
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
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
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'campanhas' && (
            <div className="space-y-4">
              {currentLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando campanhas...</p>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhuma campanha encontrada</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Campanha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Anunciante
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Orçamento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Período
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Performance
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                       {(filteredData as CampanhaPublicitaria[]).map((campanha: CampanhaPublicitaria) => (
                         <tr key={campanha?.id || Math.random().toString(36).slice(2)} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {campanha?.nome || '—'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {(Array.isArray(campanha?.anuncios) ? campanha.anuncios.length : 0)} anúncios
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {campanha?.anunciante?.empresa || '—'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {campanha?.anunciante?.nome || '—'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campanha?.status || 'rascunho')}`}>
                              {campanha?.status || 'rascunho'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="font-medium">{formatCurrency(Number(campanha?.orcamento?.total ?? 0))}</div>
                            <div className="text-gray-500">
                              Gasto: {formatCurrency(Number(campanha?.orcamento?.gasto ?? 0))}
                            </div>
                            <div className="text-gray-500">
                              Restante: {formatCurrency(Number(campanha?.orcamento?.restante ?? 0))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>{campanha?.periodo?.inicio ? formatDate(campanha.periodo.inicio) : '—'}</div>
                            <div className="text-gray-500">até {campanha?.periodo?.fim ? formatDate(campanha.periodo.fim) : '—'}</div>
                            <div className="text-gray-500">{Number(campanha?.periodo?.duracao_dias ?? 0)} dias</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>{Number(campanha?.metricas_campanha?.impressoes_total ?? 0).toLocaleString()} impressões</div>
                            <div>{Number(campanha?.metricas_campanha?.cliques_total ?? 0).toLocaleString()} cliques</div>
                            <div>ROI: {Number(campanha?.metricas_campanha?.roi ?? 0).toFixed(1)}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedItem(campanha)
                                  setShowModal(true)
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
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
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'metricas' && (
            <div className="space-y-6">
              {loadingMetricas ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando métricas...</p>
                </div>
              ) : metricas ? (
                <div className="space-y-6">
                  {/* Resumo das Métricas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Impressões</p>
                          <p className="text-xl font-bold">{Number(metricas?.resumo?.impressoes ?? 0).toLocaleString()}</p>
                        </div>
                        <Eye className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Cliques</p>
                          <p className="text-xl font-bold">{Number(metricas?.resumo?.cliques ?? 0).toLocaleString()}</p>
                        </div>
                        <MousePointer className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">CTR</p>
                          <p className="text-xl font-bold">{Number(metricas?.resumo?.ctr ?? 0).toFixed(2)}%</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-purple-600" />
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Receita</p>
                          <p className="text-xl font-bold">{formatCurrency(Number(metricas?.resumo?.receita ?? 0))}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-yellow-600" />
                      </div>
                    </div>
                  </div>

                  {/* Métricas por Anunciante */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Performance por Anunciante</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Anunciante
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Impressões
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Cliques
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Receita
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {metricas?.por_anunciante?.map((item, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item?.anunciante || '—'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {Number(item?.impressoes ?? 0).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {Number(item?.cliques ?? 0).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(Number(item?.receita ?? 0))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhuma métrica disponível</p>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'relatorios' && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Relatórios em desenvolvimento</p>
            </div>
          )}
        </div>

        {/* Paginação */}
        {currentPagination && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {((currentPagination.pagina_atual - 1) * currentPagination.itens_por_pagina) + 1} a{' '}
                {Math.min(currentPagination.pagina_atual * currentPagination.itens_por_pagina, currentPagination.total_itens)} de{' '}
                {currentPagination.total_itens} resultados
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateFiltros({ page: currentPagination.pagina_atual - 1 })}
                  disabled={!currentPagination.tem_anterior}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Anterior
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Página {currentPagination.pagina_atual} de {currentPagination.total_paginas}
                </span>
                <button
                  onClick={() => updateFiltros({ page: currentPagination.pagina_atual + 1 })}
                  disabled={!currentPagination.tem_proxima}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicidadeAdmin