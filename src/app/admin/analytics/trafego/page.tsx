'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Clock, 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet, 
  BarChart3, 
  PieChart, 
  Calendar, 
  Download, 
  Filter, 
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Activity,
  MousePointer,
  Navigation,
  MapPin,
  Search,
  ExternalLink
} from 'lucide-react'
import {
  useAnalyticsResumo,
  useAnalyticsDispositivos,
  useAnalyticsLocalizacao,
  useAnalyticsConteudo
} from '@/hooks/useAnalytics'
import { generateCSV, generateExcel, generateJSON, downloadFile } from '@/lib/export'

const TrafficAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'1d' | '7d' | '30d' | '90d' | '1y'>('7d')
  const [selectedMetric, setSelectedMetric] = useState('visitors')
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

  const handleExportTraffic = (format: 'csv' | 'excel' | 'json') => {
    try {
      if (format === 'json') {
        const bundle = {
          periodo: selectedPeriod,
          resumo, dispositivos, localizacao, conteudo
        }
        const json = generateJSON(bundle as any)
        downloadFile(json, 'application/json', 'json', 'analytics-trafego')
      } else {
        const headers = ['tipo','identificador','valor1','valor2','valor3','percentual']
        const rows: any[][] = []
        if (resumo) {
          rows.push([
            'resumo', selectedPeriod,
            resumo?.usuarios ?? 0,
            resumo?.pageviews ?? 0,
            resumo?.sessoes ?? 0,
            resumo?.taxaRejeicao ?? 0
          ])
        }
        (dispositivos?.dispositivosMaisUsados || []).forEach((d: any) => {
          rows.push(['dispositivo', d.dispositivo, d.usuarios ?? 0, '', '', d.percentual ?? 0])
        })
        (conteudo?.fontesTrafegoConteudo || []).forEach((src: any) => {
          rows.push(['fonte', src.fonte, src.visualizacoes ?? 0, '', '', src.percentual ?? 0])
        })
        (resumo?.paginasMaisVistas || []).forEach((p: any) => {
          rows.push(['pagina', p.pagina, p.visualizacoes ?? 0, '', '', p.percentual ?? 0])
        })
        (localizacao?.cidadesMaisAcessadas || []).forEach((loc: any) => {
          rows.push(['cidade', loc.cidade, loc.usuarios ?? 0, loc.pais || '', '', loc.percentual ?? 0])
        })

        if (format === 'csv') {
          const csv = generateCSV(headers, rows)
          downloadFile(csv, 'text/csv', 'csv', 'analytics-trafego')
        } else {
          const xls = generateExcel(headers, rows)
          downloadFile(xls, 'application/vnd.ms-excel', 'xls', 'analytics-trafego')
        }
      }
      setShowExportMenu(false)
    } catch (err) {
      console.error('Erro ao exportar analytics de tráfego:', err)
      alert('Falha ao exportar analytics. Veja o console para detalhes.')
    }
  }

  // Hooks de analytics
  const { metricas: resumo } = useAnalyticsResumo(selectedPeriod)
  const { metricas: dispositivos } = useAnalyticsDispositivos({ periodo: selectedPeriod })
  const { metricas: localizacao } = useAnalyticsLocalizacao({ periodo: selectedPeriod })
  const { metricas: conteudo } = useAnalyticsConteudo({ periodo: selectedPeriod })

  const periods = [
    { id: '1d', label: 'Últimas 24h' },
    { id: '7d', label: 'Últimos 7 dias' },
    { id: '30d', label: 'Últimos 30 dias' },
    { id: '90d', label: 'Últimos 90 dias' },
    { id: '1y', label: 'Último ano' }
  ]

  const formatNumber = (value?: number | null) => {
    const num = typeof value === 'number' && isFinite(value) ? value : 0
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return `${num}`
  }

  const formatDuration = (seconds: number) => {
    if (!seconds && seconds !== 0) return '-'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics de Tráfego</h1>
          <p className="text-gray-600 mt-1">Análise detalhada do tráfego e comportamento dos visitantes.</p>
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
                  <button onClick={() => handleExportTraffic('csv')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Exportar CSV</button>
                  <button onClick={() => handleExportTraffic('excel')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Exportar Excel</button>
                  <button onClick={() => handleExportTraffic('json')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Exportar JSON</button>
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
              <p className="text-sm text-gray-600">Visitantes</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(resumo?.usuarios || 0)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">{resumo ? 'Dados em tempo real' : 'Aguardando dados'}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Visitantes Únicos</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(resumo?.usuarios || 0)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">{resumo?.usuarios ? 'Contagem de usuários' : 'Sem dados'}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Visualizações</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(resumo?.pageviews || 0)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">{resumo ? 'Dados atuais' : 'Sem dados'}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taxa de Rejeição</p>
              <p className="text-2xl font-bold text-gray-900">{resumo?.taxaRejeicao || 0}%</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">{resumo ? 'Média do período' : 'Sem dados'}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Duração Média</p>
              <p className="text-2xl font-bold text-gray-900">{formatDuration(resumo?.duracaoMediaSessao || 0)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">{resumo ? 'Média por sessão' : 'Sem dados'}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Páginas/Sessão</p>
              <p className="text-2xl font-bold text-gray-900">{resumo?.pageviews && resumo?.sessoes ? (resumo.pageviews / resumo.sessoes).toFixed(2) : '-'}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Navigation className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">Engajamento médio</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tendência de Tráfego</h3>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>Visitantes</option>
              <option>Visualizações</option>
              <option>Sessões</option>
            </select>
          </div>
          
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Gráfico de Tendência</p>
              <p className="text-sm text-gray-400">Evolução do tráfego ao longo do tempo</p>
            </div>
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribuição por Dispositivo</h3>
          
          <div className="space-y-4">
            {(dispositivos?.dispositivosMaisUsados || []).map((device: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${device.dispositivo === 'desktop' ? 'bg-blue-500' : device.dispositivo === 'mobile' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                  <span className="text-sm font-medium text-gray-900">{device.dispositivo === 'desktop' ? 'Desktop' : device.dispositivo === 'mobile' ? 'Mobile' : 'Tablet'}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatNumber(device.usuarios)}</p>
                  <p className="text-xs text-gray-500">{device.percentual}%</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 h-32 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-8 h-8 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">Gráfico de Pizza</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sources and Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Fontes de Tráfego</h3>
          
          <div className="space-y-4">
            {(conteudo?.fontesTrafegoConteudo || []).length === 0 ? (
              <p className="text-sm text-gray-600">Dados de fontes de tráfego não disponíveis</p>
            ) : (
              (conteudo?.fontesTrafegoConteudo || []).map((src: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${index % 2 === 0 ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                    <span className="text-sm font-medium text-gray-900">{src.fonte}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatNumber(src.visualizacoes)}</p>
                    <p className="text-xs text-gray-500">{src.percentual}%</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Páginas Mais Visitadas</h3>
          
          <div className="space-y-4">
            {(resumo?.paginasMaisVistas || []).map((page: any, index: number) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900 truncate flex-1">{page.pagina}</p>
                  <button className="ml-2 text-gray-400 hover:text-gray-600">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                  <div>
                    <p className="font-medium">{formatNumber(page.visualizacoes)}</p>
                    <p>Visualizações</p>
                  </div>
                  <div>
                    <p className="font-medium">{formatNumber(page.visualizacoes)}</p>
                    <p>Total</p>
                  </div>
                  <div>
                    <p className="font-medium">{page.percentual}%</p>
                    <p>Rejeição</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribuição Geográfica</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {(localizacao?.cidadesMaisAcessadas || []).map((location: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{location.cidade}</p>
                    <p className="text-xs text-gray-500">{location.pais || '—'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatNumber(location.usuarios)}</p>
                  <p className="text-xs text-gray-500">{location.percentual}%</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Mapa de Visitantes</p>
              <p className="text-sm text-gray-400">Distribuição geográfica dos acessos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrafficAnalytics