'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Eye, 
  MousePointer, 
  Clock, 
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Target,
  Activity,
  DollarSign,
  Zap,
  Award,
  MapPin,
  PieChart,
  LineChart,
  AreaChart,
  ArrowUp,
  ArrowDown,
  Minus,
  Search,
  Settings,
  Share2,
  FileText,
  Mail,
  Bell,
  Star,
  ThumbsUp,
  MessageSquare,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Heart,
  Bookmark,
  ExternalLink
} from 'lucide-react'
import { 
  useAnalyticsResumo, 
  useAnalyticsTempoReal, 
  useAnalyticsConteudo,
  useAnalyticsDispositivos,
  useAnalyticsLocalizacao
} from '@/hooks/useAnalytics'

const AnalyticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'1d' | '7d' | '30d' | '90d' | '1y'>('30d')
  const [selectedMetric, setSelectedMetric] = useState('visitors')
  const [showFilters, setShowFilters] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Hooks para buscar dados da API
  const { metricas: resumo, loading: loadingResumo, refetch: refetchResumo } = useAnalyticsResumo(selectedPeriod)
  const { metricas: tempoReal, loading: loadingTempoReal } = useAnalyticsTempoReal()
  const { metricas: conteudo, loading: loadingConteudo } = useAnalyticsConteudo({ periodo: selectedPeriod })
  const { metricas: dispositivos, loading: loadingDispositivos } = useAnalyticsDispositivos({ periodo: selectedPeriod })
  const { metricas: localizacao, loading: loadingLocalizacao } = useAnalyticsLocalizacao({ periodo: selectedPeriod })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const periods = [
    { id: '1d', label: 'Últimas 24 horas' },
    { id: '7d', label: 'Últimos 7 dias' },
    { id: '30d', label: 'Últimos 30 dias' },
    { id: '90d', label: 'Últimos 90 dias' },
    { id: '1y', label: 'Último ano' }
  ]

  const metrics = [
    { id: 'visitors', label: 'Visitantes', icon: Users, color: 'blue' },
    { id: 'pageviews', label: 'Visualizações', icon: Eye, color: 'green' },
    { id: 'engagement', label: 'Engajamento', icon: Activity, color: 'purple' },
    { id: 'revenue', label: 'Receita', icon: DollarSign, color: 'yellow' }
  ]

  // Dados da API
  const overviewStats = resumo ? {
    visitors: { current: resumo.usuarios, previous: 0, change: 0 },
    pageviews: { current: resumo.pageviews, previous: 0, change: 0 },
    bounceRate: { current: resumo.taxaRejeicao, previous: 0, change: 0 },
    avgSession: { current: resumo.duracaoMediaSessao, previous: 0, change: 0 },
    revenue: { current: 0, previous: 0, change: 0 },
    conversions: { current: 0, previous: 0, change: 0 }
  } : {
    visitors: { current: 0, previous: 0, change: 0 },
    pageviews: { current: 0, previous: 0, change: 0 },
    bounceRate: { current: 0, previous: 0, change: 0 },
    avgSession: { current: 0, previous: 0, change: 0 },
    revenue: { current: 0, previous: 0, change: 0 },
    conversions: { current: 0, previous: 0, change: 0 }
  }

  const topPages = resumo?.paginasMaisVistas || []


  const deviceStats = dispositivos?.dispositivosMaisUsados?.map((item: any) => ({
    device: item.dispositivo === 'mobile' ? 'Mobile' : item.dispositivo === 'desktop' ? 'Desktop' : 'Tablet',
    visitors: item.usuarios,
    percentage: item.percentual,
    icon: item.dispositivo === 'mobile' ? Smartphone : item.dispositivo === 'desktop' ? Monitor : Tablet
  })) || []

  const locationStats = localizacao?.cidadesMaisAcessadas?.map((item: any) => ({
    location: item.cidade,
    visitors: item.usuarios,
    percentage: item.percentual
  })) || []

  const contentPerformance = conteudo?.artigosMaisLidos || []

  const realtimeData = tempoReal || { usuariosAtivos: 0, pageviewsUltimaHora: 0, paginasAtivasAgora: [] }

  // Loading state
  if (!isMounted) {
    return <div className="p-6">Carregando...</div>
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-green-500" />
    if (change < 0) return <ArrowDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const formatNumber = (value?: number | null) => {
    const num = typeof value === 'number' && isFinite(value) ? value : 0
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return `${num}`
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Relatórios</h1>
          <p className="text-gray-600 mt-1">Insights detalhados sobre performance e engajamento da plataforma.</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as '1d' | '7d' | '30d' | '90d' | '1y')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {periods.map(period => (
              <option key={period.id} value={period.id}>{period.label}</option>
            ))}
          </select>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
          
          <button
            onClick={() => refetchResumo()}
            disabled={loadingResumo}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loadingResumo ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Métricas em Tempo Real */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-500" />
            Tempo Real
          </h2>
          <div className="flex items-center text-green-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm">Ao vivo</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{formatNumber(realtimeData.usuariosAtivos)}</div>
            <div className="text-gray-600">Usuários Ativos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{formatNumber(realtimeData.pageviewsUltimaHora)}</div>
            <div className="text-gray-600">Views na Última Hora</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{realtimeData.paginasAtivasAgora?.length || 0}</div>
            <div className="text-gray-600">Páginas Ativas</div>
          </div>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Visitantes</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(overviewStats.visitors.current)}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <div className="flex items-center mt-2">
            {getChangeIcon(overviewStats.visitors.change)}
            <span className={`ml-1 text-sm ${getChangeColor(overviewStats.visitors.change)}`}>
              {Math.abs(overviewStats.visitors.change)}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Visualizações</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(overviewStats.pageviews.current)}</p>
            </div>
            <Eye className="w-8 h-8 text-green-500" />
          </div>
          <div className="flex items-center mt-2">
            {getChangeIcon(overviewStats.pageviews.change)}
            <span className={`ml-1 text-sm ${getChangeColor(overviewStats.pageviews.change)}`}>
              {Math.abs(overviewStats.pageviews.change)}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Taxa de Rejeição</p>
              <p className="text-2xl font-bold text-gray-900">{overviewStats.bounceRate.current.toFixed(1)}%</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
          <div className="flex items-center mt-2">
            {getChangeIcon(overviewStats.bounceRate.change)}
            <span className={`ml-1 text-sm ${getChangeColor(overviewStats.bounceRate.change)}`}>
              {Math.abs(overviewStats.bounceRate.change)}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Duração Média</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(overviewStats.avgSession.current)}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
          <div className="flex items-center mt-2">
            {getChangeIcon(overviewStats.avgSession.change)}
            <span className={`ml-1 text-sm ${getChangeColor(overviewStats.avgSession.change)}`}>
              {Math.abs(overviewStats.avgSession.change)}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Receita</p>
              <p className="text-2xl font-bold text-gray-900">AOA {formatNumber(overviewStats.revenue.current)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="flex items-center mt-2">
            {getChangeIcon(overviewStats.revenue.change)}
            <span className={`ml-1 text-sm ${getChangeColor(overviewStats.revenue.change)}`}>
              {Math.abs(overviewStats.revenue.change)}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Conversões</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(overviewStats.conversions.current)}</p>
            </div>
            <Target className="w-8 h-8 text-indigo-500" />
          </div>
          <div className="flex items-center mt-2">
            {getChangeIcon(overviewStats.conversions.change)}
            <span className={`ml-1 text-sm ${getChangeColor(overviewStats.conversions.change)}`}>
              {Math.abs(overviewStats.conversions.change)}%
            </span>
          </div>
        </div>
      </div>

      {/* Gráficos e Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Páginas Mais Visitadas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Páginas Mais Visitadas
          </h3>
          <div className="space-y-4">
            {topPages.map((page: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">{page.pagina}</div>
                  <div className="text-xs text-gray-500">{formatNumber(page.visualizacoes)} visualizações</div>
                </div>
                <div className="flex items-center ml-4">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${page.percentual}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{page.percentual}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dispositivos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            Dispositivos
          </h3>
          <div className="space-y-4">
            {deviceStats.map((device: any, index: number) => {
              const IconComponent = device.icon
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <IconComponent className="w-5 h-5 mr-3 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">{device.device}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">{formatNumber(device.visitors)}</span>
                    <span className="text-sm text-gray-500">({device.percentage}%)</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Localização e Performance de Conteúdo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Localização */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Localização dos Visitantes
          </h3>
          <div className="space-y-4">
            {locationStats.map((location: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{location.location}</span>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">{formatNumber(location.visitors)}</span>
                  <span className="text-sm text-gray-500">({location.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance de Conteúdo */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Performance de Conteúdo
          </h3>
          <div className="space-y-4">
            {contentPerformance.map((content: any, index: number) => (
              <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                <div className="text-sm font-medium text-gray-900 mb-1">{content.titulo}</div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatNumber(content.visualizacoes)} views</span>
                  <span>{content.tempoMedioLeitura}min leitura</span>
                  <span>{content.taxaRejeicao}% rejeição</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fontes de Tráfego */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Share2 className="w-5 h-5 mr-2" />
          Fontes de Tráfego
        </h3>
        <div className="space-y-4">
          {(conteudo?.fontesTrafegoConteudo || []).length === 0 ? (
            <p className="text-sm text-gray-600">Dados de fontes de tráfego não disponíveis</p>
          ) : (
            (conteudo?.fontesTrafegoConteudo || []).map((src: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${index % 2 === 0 ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">{src.fonte}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">{formatNumber(src.visualizacoes)}</span>
                  <span className="text-sm text-gray-500">({src.percentual}%)</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage