'use client'

import { useState, useEffect } from 'react'

// Tipos para Analytics
export interface EventoAnalytics {
  id: string
  tipo: 'pageview' | 'click' | 'download' | 'video_play' | 'form_submit' | 'search' | 'share'
  pagina: string
  usuario?: string
  sessao: string
  timestamp: string
  dados: Record<string, any>
  dispositivo: {
    tipo: 'desktop' | 'mobile' | 'tablet'
    navegador: string
    os: string
    resolucao?: string
  }
  localizacao?: {
    pais: string
    cidade: string
    ip: string
  }
}

export interface MetricasResumo {
  periodo: string
  pageviews: number
  usuarios: number
  sessoes: number
  duracaoMediaSessao: number
  taxaRejeicao: number
  paginasMaisVistas: Array<{
    pagina: string
    visualizacoes: number
    percentual: number
  }>
  dispositivosMaisUsados: Array<{
    dispositivo: string
    usuarios: number
    percentual: number
  }>
  navegadoresMaisUsados: Array<{
    navegador: string
    usuarios: number
    percentual: number
  }>
}

export interface FiltrosAnalytics {
  periodo?: '1d' | '7d' | '30d' | '90d' | '1y'
  tipo?: string
  pagina?: string
  dispositivo?: string
  dataInicio?: string
  dataFim?: string
  metrica?: 'resumo' | 'tempo_real' | 'conteudo' | 'usuarios' | 'dispositivos' | 'localizacao' | 'conversao' | 'engajamento'
}

export interface MetricasTempoReal {
  usuariosAtivos: number
  pageviewsUltimaHora: number
  eventosPorMinuto: Array<{
    minuto: string
    eventos: number
  }>
  paginasAtivasAgora: Array<{
    pagina: string
    usuarios: number
  }>
}

export interface MetricasConteudo {
  artigosMaisLidos: Array<{
    titulo: string
    visualizacoes: number
    tempoMedioLeitura: number
    taxaRejeicao: number
  }>
  categoriasMaisPopulares: Array<{
    categoria: string
    visualizacoes: number
    percentual: number
  }>
  fontesTrafegoConteudo: Array<{
    fonte: string
    visualizacoes: number
    percentual: number
  }>
}

// Hook principal para analytics
export function useAnalytics(filtros: FiltrosAnalytics = {}) {
  const [metricas, setMetricas] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      if (filtros.periodo) params.append('periodo', filtros.periodo)
      if (filtros.tipo) params.append('tipo', filtros.tipo)
      if (filtros.pagina) params.append('pagina', filtros.pagina)
      if (filtros.dispositivo) params.append('dispositivo', filtros.dispositivo)
      if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio)
      if (filtros.dataFim) params.append('dataFim', filtros.dataFim)
      if (filtros.metrica) params.append('metrica', filtros.metrica)

      const response = await fetch(`/api/analytics?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar analytics')
      }

      const resp = await response.json()
      // Algumas APIs retornam { success, data, ... }; outras retornam diretamente o objeto
      const raw = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp

      let mapped: any = raw || {}

      // Normalizar estrutura conforme metrica solicitada
      switch (filtros.metrica) {
        case 'resumo': {
          const visitantes = Number(raw?.visitantes || 0)
          const pageviews = Number(raw?.pageviews || 0)
          const sessoes = Number(raw?.sessoes || 0)
          const duracaoMediaSessao = Number(raw?.tempoMedio || 0)
          const taxaRejeicao = Number(raw?.taxaRejeicao || 0)

          const paginasPopulares = Array.isArray(raw?.paginasPopulares) ? raw.paginasPopulares : []
          const totalViews = paginasPopulares.reduce((sum: number, p: any) => sum + Number(p?.visualizacoes || 0), 0)
          const paginasMaisVistas = paginasPopulares.map((p: any) => ({
            pagina: String(p?.pagina || ''),
            visualizacoes: Number(p?.visualizacoes || 0),
            percentual: totalViews > 0 ? Number(((Number(p?.visualizacoes || 0) / totalViews) * 100).toFixed(1)) : 0
          }))

          const dispositivosMobile = Number(raw?.dispositivosMobile || 0)
          const dispositivosDesktop = Number(raw?.dispositivosDesktop || 0)
          const totalDispositivos = dispositivosMobile + dispositivosDesktop
          const dispositivosMaisUsados = [
            {
              dispositivo: 'mobile',
              usuarios: dispositivosMobile,
              percentual: totalDispositivos > 0 ? Number(((dispositivosMobile / totalDispositivos) * 100).toFixed(1)) : 0
            },
            {
              dispositivo: 'desktop',
              usuarios: dispositivosDesktop,
              percentual: totalDispositivos > 0 ? Number(((dispositivosDesktop / totalDispositivos) * 100).toFixed(1)) : 0
            }
          ]

          const navegadoresRaw = Array.isArray(raw?.navegadores) ? raw.navegadores : []
          const totalNavegadoresUsuarios = navegadoresRaw.reduce((sum: number, n: any) => sum + Number(n?.usuarios || 0), 0)
          const navegadoresMaisUsados = navegadoresRaw.map((n: any) => ({
            navegador: String(n?.navegador || ''),
            usuarios: Number(n?.usuarios || 0),
            percentual: totalNavegadoresUsuarios > 0 ? Number(((Number(n?.usuarios || 0) / totalNavegadoresUsuarios) * 100).toFixed(1)) : 0
          }))

          mapped = {
            periodo: String(filtros.periodo || '30d'),
            pageviews,
            usuarios: visitantes,
            sessoes,
            duracaoMediaSessao,
            taxaRejeicao,
            paginasMaisVistas,
            dispositivosMaisUsados,
            navegadoresMaisUsados
          }
          break
        }
        case 'conteudo': {
          const fontesTrafico = Array.isArray(raw?.fontesTrafico) ? raw.fontesTrafico : []
          const totalFontesViews = fontesTrafico.reduce((sum: number, f: any) => sum + Number(f?.visualizacoes || 0), 0)
          const fontesTrafegoConteudo = fontesTrafico.map((f: any) => ({
            fonte: String(f?.fonte || ''),
            visualizacoes: Number(f?.visualizacoes || 0),
            percentual: typeof f?.percentual === 'number' ? f.percentual : (totalFontesViews > 0 ? Number(((Number(f?.visualizacoes || 0) / totalFontesViews) * 100).toFixed(1)) : 0)
          }))

          mapped = {
            artigosMaisLidos: Array.isArray(raw?.artigosMaisLidos) ? raw.artigosMaisLidos : [],
            categoriasMaisPopulares: Array.isArray(raw?.categoriasMaisPopulares) ? raw.categoriasMaisPopulares : [],
            fontesTrafegoConteudo
          }
          break
        }
        case 'dispositivos': {
          const dispositivosMobile = Number(raw?.dispositivosMobile || 0)
          const dispositivosDesktop = Number(raw?.dispositivosDesktop || 0)
          const totalDispositivos = dispositivosMobile + dispositivosDesktop
          mapped = {
            dispositivosMaisUsados: [
              {
                dispositivo: 'mobile',
                usuarios: dispositivosMobile,
                percentual: totalDispositivos > 0 ? Number(((dispositivosMobile / totalDispositivos) * 100).toFixed(1)) : 0
              },
              {
                dispositivo: 'desktop',
                usuarios: dispositivosDesktop,
                percentual: totalDispositivos > 0 ? Number(((dispositivosDesktop / totalDispositivos) * 100).toFixed(1)) : 0
              }
            ]
          }
          break
        }
        case 'localizacao': {
          const locs = Array.isArray(raw?.localizacoes) ? raw.localizacoes : []
          const totalUsuarios = locs.reduce((sum: number, l: any) => sum + Number(l?.usuarios || 0), 0)
          mapped = {
            cidadesMaisAcessadas: locs.map((l: any) => ({
              cidade: String(l?.cidade || ''),
              usuarios: Number(l?.usuarios || 0),
              percentual: totalUsuarios > 0 ? Number(((Number(l?.usuarios || 0) / totalUsuarios) * 100).toFixed(1)) : 0
            }))
          }
          break
        }
        case 'engajamento': {
          const overview = {
            totalLikes: Number(raw?.overview?.totalLikes ?? 0),
            totalComments: Number(raw?.overview?.totalComments ?? 0),
            totalShares: Number(raw?.overview?.totalShares ?? 0),
            avgEngagementRate: Number(raw?.overview?.avgEngagementRate ?? 0)
          }

          const trends = {
            interactions: {
              current: Number(raw?.trends?.interactions?.current ?? 0),
              previous: Number(raw?.trends?.interactions?.previous ?? 0),
              change: Number(raw?.trends?.interactions?.change ?? 0)
            },
            engagementRate: {
              current: Number(raw?.trends?.engagementRate?.current ?? 0),
              previous: Number(raw?.trends?.engagementRate?.previous ?? 0),
              change: Number(raw?.trends?.engagementRate?.change ?? 0)
            },
            comments: {
              current: Number(raw?.trends?.comments?.current ?? 0),
              previous: Number(raw?.trends?.comments?.previous ?? 0),
              change: Number(raw?.trends?.comments?.change ?? 0)
            },
            shares: {
              current: Number(raw?.trends?.shares?.current ?? 0),
              previous: Number(raw?.trends?.shares?.previous ?? 0),
              change: Number(raw?.trends?.shares?.change ?? 0)
            },
            likes: {
              current: Number(raw?.trends?.likes?.current ?? 0),
              previous: Number(raw?.trends?.likes?.previous ?? 0),
              change: Number(raw?.trends?.likes?.change ?? 0)
            }
          }

          const contentTypes = Array.isArray(raw?.contentTypes) ? raw.contentTypes.map((c: any) => ({
            type: String(c?.tipo ?? ''),
            interactions: Number(c?.interacoes ?? 0),
            engagementRate: Number(c?.taxaEngajamento ?? 0)
          })) : []

          const topContent = Array.isArray(raw?.topContent) ? raw.topContent.map((t: any) => ({
            title: String(t?.titulo ?? ''),
            type: String(t?.tipo ?? ''),
            views: Number(t?.visualizacoes ?? 0),
            likes: Number(t?.curtidas ?? 0),
            comments: Number(t?.comentarios ?? 0),
            shares: Number(t?.compartilhamentos ?? 0),
            engagementRate: Number(t?.taxaEngajamento ?? 0),
            timeOnPage: typeof t?.tempoNaPagina === 'number' ? `${Math.floor(Number(t.tempoNaPagina) / 60)}:${String(Math.floor(Number(t.tempoNaPagina) % 60)).padStart(2, '0')}` : String(t?.tempoNaPagina ?? '')
          })) : []

          const userBehavior = {
            scrollDepth: Array.isArray(raw?.userBehavior?.scrollDepth) ? raw.userBehavior.scrollDepth.map((s: any) => ({
              range: String(s?.range ?? ''),
              users: Number(s?.users ?? 0),
              percentage: Number(s?.percentage ?? 0)
            })) : [],
            clickHeatmap: Array.isArray(raw?.userBehavior?.clickHeatmap) ? raw.userBehavior.clickHeatmap.map((c: any) => ({
              element: String(c?.element ?? ''),
              clicks: Number(c?.clicks ?? 0),
              percentage: Number(c?.percentage ?? 0)
            })) : []
          }

          const socialEngagement = Array.isArray(raw?.socialEngagement) ? raw.socialEngagement.map((s: any) => ({
            platform: String(s?.platform ?? ''),
            shares: Number(s?.shares ?? 0),
            likes: Number(s?.likes ?? 0),
            comments: Number(s?.comments ?? 0),
            reach: Number(s?.reach ?? 0)
          })) : []

          mapped = {
            overview,
            trends,
            contentTypes,
            topContent,
            userBehavior,
            socialEngagement
          }
          break
        }
        default: {
          mapped = raw
        }
      }

      setMetricas(mapped)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [JSON.stringify(filtros)])

  return {
    metricas,
    loading,
    error,
    refetch: fetchAnalytics
  }
}

// Hook para métricas resumidas
export function useAnalyticsResumo(periodo: '1d' | '7d' | '30d' | '90d' | '1y' = '7d') {
  return useAnalytics({ periodo, metrica: 'resumo' })
}

// Hook para métricas em tempo real
export function useAnalyticsTempoReal() {
  const [metricas, setMetricas] = useState<MetricasTempoReal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTempoReal = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/analytics?metrica=tempo_real')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar métricas em tempo real')
      }

      const resp = await response.json()
      const raw = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp
      setMetricas(raw)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTempoReal()
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchTempoReal, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    metricas,
    loading,
    error,
    refetch: fetchTempoReal
  }
}

// Hook para métricas de conteúdo
export function useAnalyticsConteudo(filtros: Omit<FiltrosAnalytics, 'metrica'> = {}) {
  return useAnalytics({ ...filtros, metrica: 'conteudo' })
}

// Hook para métricas de usuários
export function useAnalyticsUsuarios(filtros: Omit<FiltrosAnalytics, 'metrica'> = {}) {
  return useAnalytics({ ...filtros, metrica: 'usuarios' })
}

// Hook para métricas de dispositivos
export function useAnalyticsDispositivos(filtros: Omit<FiltrosAnalytics, 'metrica'> = {}) {
  return useAnalytics({ ...filtros, metrica: 'dispositivos' })
}

// Hook para métricas de localização
export function useAnalyticsLocalizacao(filtros: Omit<FiltrosAnalytics, 'metrica'> = {}) {
  return useAnalytics({ ...filtros, metrica: 'localizacao' })
}

// Hook para métricas de conversão
export function useAnalyticsConversao(filtros: Omit<FiltrosAnalytics, 'metrica'> = {}) {
  return useAnalytics({ ...filtros, metrica: 'conversao' })
}

// Hook para métricas de engajamento
export function useAnalyticsEngajamento(filtros: Omit<FiltrosAnalytics, 'metrica'> = {}) {
  return useAnalytics({ ...filtros, metrica: 'engajamento' })
}

// Hook para registrar eventos
export function useRegistrarEvento() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const registrarEvento = async (evento: Omit<EventoAnalytics, 'id' | 'timestamp' | 'dispositivo' | 'localizacao'>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evento),
      })

      if (!response.ok) {
        throw new Error('Erro ao registrar evento')
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    registrarEvento,
    loading,
    error
  }
}