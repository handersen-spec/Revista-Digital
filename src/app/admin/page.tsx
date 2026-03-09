'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  Eye, 
  FileText, 
  Video, 
  Car, 
  Building2, 
  Megaphone,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Star,
  MessageSquare,
  Heart,
  Share2,
  Download,
  DollarSign,
  Target,
  Zap,
  Activity,
  Newspaper
} from 'lucide-react'
import { useAnalyticsTempoReal, useAnalyticsConteudo, useAnalyticsResumo, useAnalyticsDispositivos, useAnalyticsLocalizacao } from '@/hooks/useAnalytics'
import { generateCSV, generateExcel, generateJSON, downloadFile } from '@/lib/export'

// Componente de Métrica
const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color = 'blue',
  subtitle,
  trend
}: {
  title: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease'
  icon: any
  color?: string
  subtitle?: string
  trend?: number[]
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    cyan: 'from-cyan-500 to-cyan-600',
    pink: 'from-pink-500 to-pink-600',
    indigo: 'from-indigo-500 to-indigo-600'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} text-white`}>
          <Icon className="w-6 h-6" />
        </div>
        {change ? (
          <div className={`flex items-center space-x-1 text-sm font-medium ${
            changeType === 'decrease' ? 'text-red-600' : 'text-green-600'
          }`}>
            {changeType === 'decrease' ? (
              <ArrowDownRight className="w-4 h-4" />
            ) : (
              <ArrowUpRight className="w-4 h-4" />
            )}
            <span>{change}</span>
          </div>
        ) : null}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>

      {trend && (
        <div className="mt-4 h-8">
          <div className="flex items-end space-x-1 h-full">
            {trend.map((value, index) => (
              <div
                key={index}
                className={`bg-gradient-to-t ${colorClasses[color as keyof typeof colorClasses]} rounded-sm opacity-60`}
                style={{ height: `${(value / Math.max(...trend)) * 100}%`, width: '8px' }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Componente de Gráfico Simples
const SimpleChart = ({ data, color = 'blue' }: { data: number[], color?: string }) => {
  const max = Math.max(...data)
  const colorClasses = {
    blue: 'stroke-blue-500 fill-blue-100',
    green: 'stroke-green-500 fill-green-100',
    purple: 'stroke-purple-500 fill-purple-100',
    orange: 'stroke-orange-500 fill-orange-100'
  }

  return (
    <div className="h-32 w-full">
      <svg className="w-full h-full" viewBox="0 0 300 100">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" className={`stop-${color}-200`} stopOpacity="0.8"/>
            <stop offset="100%" className={`stop-${color}-200`} stopOpacity="0.1"/>
          </linearGradient>
        </defs>
        <path
          d={`M 0 ${100 - (data[0] / max) * 80} ${data.map((value, index) => 
            `L ${(index * 300) / (data.length - 1)} ${100 - (value / max) * 80}`
          ).join(' ')} L 300 100 L 0 100 Z`}
          fill={`url(#gradient-${color})`}
          className={colorClasses[color as keyof typeof colorClasses]}
          strokeWidth="2"
        />
      </svg>
    </div>
  )
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { metricas: resumo } = useAnalyticsResumo('30d')
  const { metricas: tempoReal } = useAnalyticsTempoReal()
  const { metricas: conteudo } = useAnalyticsConteudo()
  const { metricas: dispositivos } = useAnalyticsDispositivos({ periodo: '30d' })
  const { metricas: localizacao } = useAnalyticsLocalizacao({ periodo: '30d' })

  // Garantir que o componente está montado no cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Removido: simulação de dados em tempo real

  const metrics = [
    {
      title: 'Visitantes Únicos',
      value: resumo?.usuarios ?? '—',
      icon: Users,
      color: 'blue',
      subtitle: 'Últimos 30 dias'
    },
    {
      title: 'Visualizações',
      value: resumo?.pageviews ?? '—',
      icon: Eye,
      color: 'green',
      subtitle: 'Últimos 30 dias'
    },
    {
      title: 'Sessões',
      value: resumo?.sessoes ?? '—',
      icon: Activity,
      color: 'purple',
      subtitle: 'Últimos 30 dias'
    },
    {
      title: 'Taxa de rejeição',
      value: typeof resumo?.taxaRejeicao === 'number' ? `${resumo.taxaRejeicao}%` : '—',
      icon: Target,
      color: 'indigo',
      subtitle: 'Resumo'
    }
  ]

  const topContent: TopContentItem[] = Array.isArray(conteudo?.artigosMaisLidos)
    ? conteudo!.artigosMaisLidos.map((a: { titulo: string; visualizacoes: number }) => ({
        title: a.titulo,
        views: a.visualizacoes,
        type: 'Conteúdo',
        rating: ''
      }))
    : []

  const recentActivity: Array<{action: string; item: string; time: string; type: string}> = []

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Bem-vindo de volta! Aqui está o que está acontecendo na Auto Prestige Angola.</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="24h">Últimas 24h</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
          
          <div className="relative">
            <button
              onClick={() => setShowExportMenu((v) => !v)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Exportar Relatório
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                  onClick={() => {
                    try {
                      const bundle = {
                        periodoSelecionado: timeRange,
                        resumo,
                        tempoReal,
                        dispositivos,
                        localizacao,
                        conteudo
                      }
                      const json = generateJSON(bundle as any)
                      downloadFile(json, 'application/json', 'json', 'dashboard-relatorio')
                      setShowExportMenu(false)
                    } catch (err) {
                      console.error('Erro ao exportar JSON do dashboard:', err)
                      alert('Falha ao exportar JSON. Veja o console para detalhes.')
                    }
                  }}
                >
                  Exportar como JSON
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                  onClick={() => {
                    try {
                      const headers = ['Categoria', 'Chave', 'Valor']
                      const rows: any[][] = []
                      if (resumo) {
                        Object.entries(resumo as any).forEach(([key, val]) => {
                          rows.push(['Resumo', key, String(val ?? '')])
                        })
                      }
                      if (tempoReal) {
                        Object.entries(tempoReal as any).forEach(([key, val]) => {
                          rows.push(['Tempo Real', key, String(val ?? '')])
                        })
                      }
                      if (dispositivos && Array.isArray((dispositivos as any).distribuicao)) {
                        ;((dispositivos as any).distribuicao as any[]).forEach((d: any) => {
                          rows.push(['Dispositivos', d.tipo ?? d.device ?? '', String(d.percentual ?? d.visitas ?? '')])
                        })
                      }
                      if (localizacao && Array.isArray((localizacao as any).topPaises)) {
                        ;((localizacao as any).topPaises as any[]).forEach((p: any) => {
                          rows.push(['Localização', p.pais ?? p.country ?? '', String(p.percentual ?? p.visitas ?? '')])
                        })
                      }
                      if (conteudo && Array.isArray((conteudo as any).artigosMaisLidos)) {
                        ;((conteudo as any).artigosMaisLidos as any[]).forEach((c: any) => {
                          rows.push(['Top Conteúdo', c.titulo ?? '', String(c.visualizacoes ?? '')])
                        })
                      }
                      const csv = generateCSV(headers, rows)
                      downloadFile(csv, 'text/csv', 'csv', 'dashboard-relatorio')
                      setShowExportMenu(false)
                    } catch (err) {
                      console.error('Erro ao exportar CSV do dashboard:', err)
                      alert('Falha ao exportar CSV. Veja o console para detalhes.')
                    }
                  }}
                >
                  Exportar como CSV
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                  onClick={() => {
                    try {
                      const headers = ['Categoria', 'Chave', 'Valor']
                      const rows: any[][] = []
                      if (resumo) {
                        Object.entries(resumo as any).forEach(([key, val]) => {
                          rows.push(['Resumo', key, String(val ?? '')])
                        })
                      }
                      if (tempoReal) {
                        Object.entries(tempoReal as any).forEach(([key, val]) => {
                          rows.push(['Tempo Real', key, String(val ?? '')])
                        })
                      }
                      if (dispositivos && Array.isArray((dispositivos as any).distribuicao)) {
                        ;((dispositivos as any).distribuicao as any[]).forEach((d: any) => {
                          rows.push(['Dispositivos', d.tipo ?? d.device ?? '', String(d.percentual ?? d.visitas ?? '')])
                        })
                      }
                      if (localizacao && Array.isArray((localizacao as any).topPaises)) {
                        ;((localizacao as any).topPaises as any[]).forEach((p: any) => {
                          rows.push(['Localização', p.pais ?? p.country ?? '', String(p.percentual ?? p.visitas ?? '')])
                        })
                      }
                      if (conteudo && Array.isArray((conteudo as any).artigosMaisLidos)) {
                        ;((conteudo as any).artigosMaisLidos as any[]).forEach((c: any) => {
                          rows.push(['Top Conteúdo', c.titulo ?? '', String(c.visualizacoes ?? '')])
                        })
                      }
                      const xls = generateExcel(headers, rows)
                      downloadFile(xls, 'application/vnd.ms-excel', 'xls', 'dashboard-relatorio')
                      setShowExportMenu(false)
                    } catch (err) {
                      console.error('Erro ao exportar Excel do dashboard:', err)
                      alert('Falha ao exportar Excel. Veja o console para detalhes.')
                    }
                  }}
                >
                  Exportar como Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Estatísticas em Tempo Real</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Ao vivo</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">
              {typeof tempoReal?.usuariosAtivos === 'number' ? tempoReal.usuariosAtivos.toLocaleString() : '—'}
            </div>
            <div className="text-red-100">Usuários Online</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {typeof tempoReal?.pageviewsUltimaHora === 'number' ? tempoReal.pageviewsUltimaHora.toLocaleString() : '—'}
            </div>
            <div className="text-red-100">Visualizações Hoje</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {'—'}
            </div>
            <div className="text-red-100">Novos Inscritos</div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tráfego do Site</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Activity className="w-4 h-4" />
              <span>Últimos 30 dias</span>
            </div>
          </div>
          
          {Array.isArray(tempoReal?.eventosPorMinuto) && tempoReal.eventosPorMinuto.length > 0 ? (
            <SimpleChart data={tempoReal.eventosPorMinuto.map(m => Number(m.eventos) || 0)} color="blue" />
          ) : (
            <div className="text-sm text-gray-500">Sem dados de tráfego disponíveis.</div>
          )}
          
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{typeof resumo?.pageviews === 'number' ? resumo.pageviews.toLocaleString() : '—'}</div>
              <div className="text-sm text-gray-600">Total de Visitas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{typeof resumo?.usuarios === 'number' ? resumo.usuarios.toLocaleString() : '—'}</div>
              <div className="text-sm text-gray-600">Visitantes Únicos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">—</div>
              <div className="text-sm text-gray-600">Páginas/Sessão</div>
            </div>
          </div>
        </div>

        {/* Device Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Dispositivos</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Monitor className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">Desktop</span>
              </div>
              <div className="flex items-center space-x-3">
                {typeof dispositivos?.dispositivosDesktop === 'number' || typeof dispositivos?.dispositivosMobile === 'number' ? (
                  (() => {
                    const desktop = Number(dispositivos?.dispositivosDesktop || 0)
                    const mobile = Number(dispositivos?.dispositivosMobile || 0)
                    const total = desktop + mobile
                    const pct = total > 0 ? Math.round((desktop / total) * 100) : 0
                    return (
                      <>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{pct}%</span>
                      </>
                    )
                  })()
                ) : (
                  <span className="text-sm text-gray-500">Sem dados</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Mobile</span>
              </div>
              <div className="flex items-center space-x-3">
                {typeof dispositivos?.dispositivosDesktop === 'number' || typeof dispositivos?.dispositivosMobile === 'number' ? (
                  (() => {
                    const desktop = Number(dispositivos?.dispositivosDesktop || 0)
                    const mobile = Number(dispositivos?.dispositivosMobile || 0)
                    const total = desktop + mobile
                    const pct = total > 0 ? Math.round((mobile / total) * 100) : 0
                    return (
                      <>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{pct}%</span>
                      </>
                    )
                  })()
                ) : (
                  <span className="text-sm text-gray-500">Sem dados</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Tablet className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700">Tablet</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Sem dados</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="font-medium text-gray-900 mb-3">Top Localizações</h4>
            {Array.isArray(localizacao?.localizacoes) && localizacao.localizacoes.length > 0 ? (
              <div className="space-y-2">
                {localizacao.localizacoes.map((loc: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{String(loc?.cidade || loc?.nome || '—')}</span>
                    </div>
                    <span className="font-medium">{typeof loc?.percentual === 'number' ? `${loc.percentual}%` : '—'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Sem dados de localização.</p>
            )}
          </div>
        </div>
      </div>

      {/* Content Performance and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Conteúdo Mais Popular</h3>
            <button className="text-sm text-red-600 hover:text-red-700 font-medium">Ver Todos</button>
          </div>
          
          <div className="space-y-4">
            {topContent.length === 0 ? (
              <p className="text-sm text-gray-500">Sem dados de conteúdo disponíveis.</p>
            ) : topContent.map((content: TopContentItem, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{content.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{content.type}</span>
                    <span className="text-xs text-gray-500">{content.views} visualizações</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900">{content.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
            <button className="text-sm text-red-600 hover:text-red-700 font-medium">Ver Todas</button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-500">Sem atividade recente.</p>
            ) : recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-green-400' :
                  activity.type === 'warning' ? 'bg-yellow-400' :
                  'bg-blue-400'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600 font-medium">{activity.item}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Ações Rápidas</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors group">
            <FileText className="w-8 h-8 text-gray-400 group-hover:text-red-500 mb-2" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">Novo Artigo</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
            <Video className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">Upload Vídeo</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors group">
            <Car className="w-8 h-8 text-gray-400 group-hover:text-green-500 mb-2" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">Test Drive</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors group">
            <Newspaper className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mb-2" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">Nova Notícia</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors group">
            <Building2 className="w-8 h-8 text-gray-400 group-hover:text-orange-500 mb-2" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">Concessionária</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-colors group">
            <Megaphone className="w-8 h-8 text-gray-400 group-hover:text-pink-500 mb-2" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600">Campanha</span>
          </button>
        </div>
      </div>
    </div>
  )
}
type TopContentItem = {
  title: string
  views: number | string
  type: string
  rating: string
}
