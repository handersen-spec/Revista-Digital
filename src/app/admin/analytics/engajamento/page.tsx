'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Star, 
  ThumbsUp, 
  Bookmark, 
  Download, 
  Play, 
  Calendar, 
  Filter, 
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Activity,
  MousePointer,
  Target,
  Zap,
  Award,
  BarChart3,
  PieChart
} from 'lucide-react'
import { useAnalyticsResumo, useAnalyticsConteudo, useAnalyticsEngajamento } from '@/hooks/useAnalytics'
import { generateCSV, generateExcel, generateJSON, downloadFile } from '@/lib/export'

const EngagementAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isMounted, setIsMounted] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const exportMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Fechar menu de exportação ao clicar fora
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!showExportMenu) return
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [showExportMenu])
  // Mapear período selecionado para o formato esperado pela API
  const periodMap: Record<string, '1d' | '7d' | '30d' | '90d' | '1y'> = {
    '24h': '1d',
    '7d': '7d',
    '30d': '30d',
    '90d': '90d',
  }
  const apiPeriod: '1d' | '7d' | '30d' | '90d' | '1y' = periodMap[selectedPeriod] || '7d'

  // Hooks de analytics para substituir dados mockados
  const { metricas: resumo } = useAnalyticsResumo(apiPeriod)
  const { metricas: conteudo } = useAnalyticsConteudo({ periodo: apiPeriod })
  const { metricas: engajamento } = useAnalyticsEngajamento({ periodo: apiPeriod })

  const periods = [
    { id: '24h', label: 'Últimas 24h' },
    { id: '7d', label: 'Últimos 7 dias' },
    { id: '30d', label: 'Últimos 30 dias' },
    { id: '90d', label: 'Últimos 90 dias' },
    { id: 'custom', label: 'Personalizado' }
  ]

  const categories = [
    { id: 'all', label: 'Todos os Conteúdos' },
    { id: 'articles', label: 'Artigos' },
    { id: 'test-drives', label: 'Test Drives' },
    { id: 'news', label: 'Notícias' },
    { id: 'videos', label: 'Vídeos' }
  ]

  const handleExportEngagement = (format: 'csv' | 'excel' | 'json') => {
    try {
      if (format === 'json') {
        const bundle = {
          periodo: apiPeriod,
          categoria: selectedCategory,
          engagementData
        }
        const json = generateJSON(bundle)
        downloadFile(json, 'application/json', 'json', 'analytics-engajamento')
      } else {
        const headers = ['tipo','identificador','valor1','valor2','valor3','percentual']
        const rows: any[][] = []
        rows.push(['overview','total', engagementData.overview.totalInteractions, engagementData.overview.totalComments, engagementData.overview.totalShares, engagementData.overview.avgEngagementRate]);
        (engagementData.contentTypes || []).forEach((ct: any) => {
          rows.push(['tipo_conteudo', ct.type, ct.interactions ?? 0, '', '', ct.engagementRate ?? 0])
        });
        (engagementData.topContent || []).forEach((tc: any) => {
          rows.push(['conteudo_top', tc.title, tc.views ?? 0, tc.likes ?? 0, tc.comments ?? 0, tc.engagementRate ?? 0])
        });
        (engagementData.userBehavior?.scrollDepth || []).forEach((sd: any) => {
          rows.push(['scroll', sd.range, sd.users ?? 0, '', '', sd.percentage ?? 0])
        });
        (engagementData.userBehavior?.clickHeatmap || []).forEach((ch: any) => {
          rows.push(['click', ch.element, ch.clicks ?? 0, '', '', ch.percentage ?? 0])
        });
        (engagementData.socialEngagement || []).forEach((se: any) => {
          rows.push(['social', se.platform, se.shares ?? 0, se.likes ?? 0, se.comments ?? 0, se.reach ?? 0])
        })

        if (format === 'csv') {
          const csv = generateCSV(headers, rows)
          downloadFile(csv, 'text/csv', 'csv', 'analytics-engajamento')
        } else {
          const xls = generateExcel(headers, rows)
          downloadFile(xls, 'application/vnd.ms-excel', 'xls', 'analytics-engajamento')
        }
      }
      setShowExportMenu(false)
    } catch (err) {
      console.error('Erro ao exportar analytics de engajamento:', err)
      alert('Falha ao exportar analytics. Veja o console para detalhes.')
    }
  }

  const formatNumber = (value?: number | null) => {
    const num = typeof value === 'number' && Number.isFinite(value) ? value : 0
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return `${num}`
  }

  const formatDuration = (duration: string) => {
    return duration
  }

  const formatDurationSeconds = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const colorPalette = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-orange-500']

  // Tipos para itens renderizados (evitar implicit any nos maps)
  type EngagementContentTypeItem = {
    type: string
    interactions: number
    engagementRate: number
    color: string
  }

  type EngagementTopContentItem = {
    title: string
    type: string
    views: number
    likes: number
    comments: number
    shares: number
    engagementRate: number
    timeOnPage: string
  }

  type EngagementScrollDepthItem = {
    range: string
    users: number
    percentage: number
  }

  type EngagementClickHeatmapItem = {
    element: string
    clicks: number
    percentage: number
  }

  type EngagementSocialItem = {
    platform: string
    shares: number
    likes: number
    comments: number
    reach: number
  }

  // Dados de engajamento derivados dos hooks
  const engagementData = {
    overview: {
      totalInteractions: resumo?.pageviews || 0,
      avgEngagementRate: engajamento?.overview?.avgEngagementRate ?? 0,
      totalComments: engajamento?.overview?.totalComments ?? 0,
      totalShares: engajamento?.overview?.totalShares ?? 0,
      totalLikes: engajamento?.overview?.totalLikes ?? 0,
      avgTimeOnPage: formatDurationSeconds(resumo?.duracaoMediaSessao || 0)
    },
    trends: {
      interactions: { current: resumo?.pageviews || 0, previous: engajamento?.trends?.interactions?.previous ?? 0, change: engajamento?.trends?.interactions?.change ?? 0 },
      engagementRate: { current: engajamento?.trends?.engagementRate?.current ?? 0, previous: engajamento?.trends?.engagementRate?.previous ?? 0, change: engajamento?.trends?.engagementRate?.change ?? 0 },
      comments: { current: engajamento?.trends?.comments?.current ?? 0, previous: engajamento?.trends?.comments?.previous ?? 0, change: engajamento?.trends?.comments?.change ?? 0 },
      shares: { current: engajamento?.trends?.shares?.current ?? 0, previous: engajamento?.trends?.shares?.previous ?? 0, change: engajamento?.trends?.shares?.change ?? 0 }
    },
    contentTypes: (engajamento?.contentTypes && engajamento.contentTypes.length > 0
      ? engajamento.contentTypes
      : (conteudo?.categoriasMaisPopulares || []).map((item: any, idx: number) => ({
          type: item.categoria,
          interactions: item.visualizacoes,
          engagementRate: item.percentual,
          color: colorPalette[idx % colorPalette.length]
        }))
    ).map((item: any, idx: number) => ({
      ...item,
      color: colorPalette[idx % colorPalette.length]
    })),
    topContent: (engajamento?.topContent && engajamento.topContent.length > 0
      ? engajamento.topContent
      : (conteudo?.artigosMaisLidos || []).map((item: any) => ({
          title: item.titulo,
          type: 'Artigo',
          views: item.visualizacoes,
          likes: 0,
          comments: 0,
          shares: 0,
          engagementRate: 0,
          timeOnPage: `${item.tempoMedioLeitura}min`
        }))
    ),
    userBehavior: {
      scrollDepth: engajamento?.userBehavior?.scrollDepth ?? [],
      clickHeatmap: engajamento?.userBehavior?.clickHeatmap ?? []
    },
    socialEngagement: engajamento?.socialEngagement ?? []
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics de Engajamento</h1>
          <p className="text-gray-600 mt-1">Análise detalhada do engajamento e interação dos usuários.</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {periods.map(period => (
              <option key={period.id} value={period.id}>{period.label}</option>
            ))}
          </select>
          
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.label}</option>
            ))}
          </select>
          
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Atualizar</span>
          </button>
          
          <div className="relative" ref={exportMenuRef}>
            <button onClick={() => setShowExportMenu(v => !v)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <div className="py-1">
                  <button onClick={() => handleExportEngagement('csv')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Exportar CSV</button>
                  <button onClick={() => handleExportEngagement('excel')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Exportar Excel</button>
                  <button onClick={() => handleExportEngagement('json')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Exportar JSON</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Interações</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(engagementData.overview.totalInteractions)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+{engagementData.trends.interactions.change}%</span>
            <span className="text-gray-500 ml-1">vs período anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taxa Engajamento</p>
              <p className="text-2xl font-bold text-gray-900">{engagementData.overview.avgEngagementRate}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+{engagementData.trends.engagementRate.change}%</span>
            <span className="text-gray-500 ml-1">melhoria</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Comentários</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(engagementData.overview.totalComments)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+{engagementData.trends.comments.change}%</span>
            <span className="text-gray-500 ml-1">vs período anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compartilhamentos</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(engagementData.overview.totalShares)}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Share2 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+{engagementData.trends.shares.change}%</span>
            <span className="text-gray-500 ml-1">vs período anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Curtidas</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(engagementData.overview.totalLikes)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">Reações positivas</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tempo na Página</p>
              <p className="text-2xl font-bold text-gray-900">{engagementData.overview.avgTimeOnPage}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">Tempo médio</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tendência de Engajamento</h3>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>Interações</option>
              <option>Taxa de Engajamento</option>
              <option>Tempo na Página</option>
            </select>
          </div>
          
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Gráfico de Engajamento</p>
              <p className="text-sm text-gray-400">Evolução das interações ao longo do tempo</p>
            </div>
          </div>
        </div>

        {/* Content Type Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance por Tipo de Conteúdo</h3>
          
      <div className="space-y-4">
            {engagementData.contentTypes.map((content: EngagementContentTypeItem, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${content.color}`}></div>
                  <span className="text-sm font-medium text-gray-900">{content.type}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatNumber(content.interactions)}</p>
                  <p className="text-xs text-gray-500">{content.engagementRate}% engajamento</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Conteúdo com Maior Engajamento</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Conteúdo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Tipo</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Visualizações</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Curtidas</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Comentários</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Compartilhamentos</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Taxa Engajamento</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Tempo na Página</th>
              </tr>
            </thead>
            <tbody>
              {engagementData.topContent.map((content: EngagementTopContentItem, index: number) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900 truncate max-w-xs">{content.title}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {content.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{formatNumber(content.views)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-sm">{formatNumber(content.likes)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <MessageCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">{content.comments}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Share2 className="w-4 h-4 text-green-400" />
                      <span className="text-sm">{content.shares}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      {content.engagementRate}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{content.timeOnPage}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Behavior and Social Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scroll Depth */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Profundidade de Scroll</h3>
          
          <div className="space-y-4">
            {engagementData.userBehavior.scrollDepth.map((depth: EngagementScrollDepthItem, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${depth.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{depth.range}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatNumber(depth.users)}</p>
                  <p className="text-xs text-gray-500">{depth.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Click Heatmap */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Mapa de Cliques</h3>
          
          <div className="space-y-4">
            {engagementData.userBehavior.clickHeatmap.map((click: EngagementClickHeatmapItem, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MousePointer className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{click.element}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatNumber(click.clicks)}</p>
                  <p className="text-xs text-gray-500">{click.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Media Engagement */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Engajamento nas Redes Sociais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {engagementData.socialEngagement.map((social: EngagementSocialItem, index: number) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">{social.platform}</h4>
                <Award className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Compartilhamentos</span>
                  <span className="text-sm font-medium">{formatNumber(social.shares)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Curtidas</span>
                  <span className="text-sm font-medium">{formatNumber(social.likes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Comentários</span>
                  <span className="text-sm font-medium">{social.comments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Alcance</span>
                  <span className="text-sm font-medium">{formatNumber(social.reach)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EngagementAnalytics