'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// Tipos baseados na API de publicidade
export interface Anuncio {
  id: string
  titulo: string
  descricao: string
  imagem: string
  url: string
  tipo: 'banner' | 'video' | 'nativo' | 'popup' | 'sidebar'
  formato: 'horizontal' | 'vertical' | 'quadrado' | 'responsivo'
  dimensoes: {
    largura: number
    altura: number
  }
  posicao: 'header' | 'sidebar' | 'footer' | 'conteudo' | 'popup'
  categoria: string[]
  publico_alvo: {
    idade_min?: number
    idade_max?: number
    genero?: 'M' | 'F' | 'todos'
    interesses: string[]
    localizacao: string[]
    dispositivos: ('desktop' | 'mobile' | 'tablet')[]
  }
  campanha: {
    id: string
    nome: string
    anunciante: string
    orcamento_diario: number
    data_inicio: string
    data_fim: string
    objetivo: 'impressoes' | 'cliques' | 'conversoes' | 'branding'
  }
  metricas: {
    impressoes: number
    cliques: number
    ctr: number
    cpm: number
    cpc: number
    conversoes: number
    receita: number
  }
  configuracao: {
    ativo: boolean
    prioridade: number
    frequencia_maxima: number
    horarios_exibicao?: string[]
    dias_semana?: number[]
  }
  criado_em: string
  atualizado_em: string
}

export interface CampanhaPublicitaria {
  id: string
  nome: string
  anunciante: {
    id: string
    nome: string
    email: string
    telefone: string
    empresa: string
  }
  status: 'ativa' | 'pausada' | 'finalizada' | 'rascunho'
  tipo_pagamento: 'cpm' | 'cpc' | 'cpa' | 'fixo'
  orcamento: {
    total: number
    diario: number
    gasto: number
    restante: number
  }
  periodo: {
    inicio: string
    fim: string
    duracao_dias: number
  }
  anuncios: string[]
  segmentacao: {
    demografica: {
      idade_min?: number
      idade_max?: number
      genero?: 'M' | 'F' | 'todos'
    }
    geografica: {
      paises: string[]
      cidades: string[]
    }
    comportamental: {
      interesses: string[]
      paginas_visitadas: string[]
      dispositivos: string[]
    }
    temporal: {
      horarios: string[]
      dias_semana: number[]
      fusos_horarios: string[]
    }
  }
  metricas_campanha: {
    impressoes_total: number
    cliques_total: number
    conversoes_total: number
    ctr_medio: number
    cpm_medio: number
    cpc_medio: number
    receita_total: number
    roi: number
  }
  criado_em: string
  atualizado_em: string
}

export interface FiltrosPublicidade {
  tipo?: 'anuncios' | 'campanhas' | 'metricas' | 'relatorios'
  posicao?: string
  categoria?: string
  anunciante?: string
  status?: string
  formato?: string
  dispositivo?: string
  data_inicio?: string
  data_fim?: string
  page?: number
  limit?: number
  ordenacao?: string
  direcao?: 'asc' | 'desc'
}

export interface PaginacaoPublicidade {
  pagina_atual: number
  total_paginas: number
  total_itens: number
  itens_por_pagina: number
  tem_proxima: boolean
  tem_anterior: boolean
}

export interface EstatisticasPublicidade {
  total_anuncios: number
  anuncios_ativos: number
  anuncios_pausados: number
  total_campanhas: number
  campanhas_ativas: number
  campanhas_pausadas: number
  receita_total: number
  impressoes_total: number
  cliques_total: number
  ctr_medio: number
}

export interface MetricasPublicidade {
  periodo: {
    inicio: string
    fim: string
  }
  resumo: {
    impressoes: number
    cliques: number
    conversoes: number
    receita: number
    ctr: number
    cpm: number
    cpc: number
    roi: number
  }
  por_anunciante: Array<{
    anunciante: string
    impressoes: number
    cliques: number
    receita: number
  }>
  por_categoria: Array<{
    categoria: string
    impressoes: number
    cliques: number
    receita: number
  }>
  por_dispositivo: Array<{
    dispositivo: string
    impressoes: number
    cliques: number
    receita: number
  }>
}

export interface RespostaAnuncios {
  anuncios: Anuncio[]
  paginacao: PaginacaoPublicidade
  estatisticas: EstatisticasPublicidade
}

export interface RespostaCampanhas {
  campanhas: CampanhaPublicitaria[]
  paginacao: PaginacaoPublicidade
  estatisticas: EstatisticasPublicidade
}

// Sem fallback com dados fictícios: os hooks dependem apenas da API

// Helper seguro para parsear JSON sem quebrar o hook quando a resposta não é JSON
async function jsonOrEmpty(response: Response): Promise<any> {
  if (!response) return {}
  try {
    if (response.ok) {
      return await response.json()
    }
    return {}
  } catch {
    // Algumas respostas podem não ser JSON (erro HTML, etc.)
    return {}
  }
}

// Hook para gerenciar anúncios
export function useAnuncios(filtros: FiltrosPublicidade = {}) {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [paginacao, setPaginacao] = useState<PaginacaoPublicidade | null>(null)
  const [estatisticas, setEstatisticas] = useState<EstatisticasPublicidade | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const controllerRef = useRef<AbortController | null>(null)
  // Evita recriar callbacks quando apenas a identidade do objeto muda
  const filtrosKey = JSON.stringify(filtros)

  const buscarAnuncios = useCallback(async (novosFiltros: FiltrosPublicidade = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        tipo: 'anuncios',
        ...Object.fromEntries(
          Object.entries({ ...filtros, ...novosFiltros })
            .filter(([_, value]) => value !== undefined && value !== '')
            .map(([key, value]) => [key, String(value)])
        )
      })
      // aborta requisição anterior antes de iniciar nova
      controllerRef.current?.abort()
      controllerRef.current = new AbortController()
      const response = await fetch(`/api/publicidade?${params}` , { signal: controllerRef.current.signal, cache: 'no-store' })
      const data = await jsonOrEmpty(response)

      setAnuncios(Array.isArray(data.anuncios) ? data.anuncios : [])
      const total = Array.isArray(data.anuncios) ? data.anuncios.length : 0
      setPaginacao(data.paginacao || null)
      setEstatisticas(data.estatisticas || null)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // navegação ou desmontagem: não tratar como erro
      } else {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      }
      // Em caso de erro, não usar dados fictícios
      setAnuncios([])
      setPaginacao(null)
      setEstatisticas(null)
  } finally {
      setLoading(false)
    }
  }, [filtrosKey])

  useEffect(() => {
    buscarAnuncios()
    return () => {
      controllerRef.current?.abort()
    }
  }, [buscarAnuncios])

  return {
    anuncios,
    paginacao,
    estatisticas,
    loading,
    error,
    refetch: buscarAnuncios
  }
}

// Hook para gerenciar campanhas
export function useCampanhas(filtros: FiltrosPublicidade = {}) {
  const [campanhas, setCampanhas] = useState<CampanhaPublicitaria[]>([])
  const [paginacao, setPaginacao] = useState<PaginacaoPublicidade | null>(null)
  const [estatisticas, setEstatisticas] = useState<EstatisticasPublicidade | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const controllerRef = useRef<AbortController | null>(null)
  // Evita loop de render quando o objeto filtros é recriado a cada render
  const filtrosKey = JSON.stringify(filtros)

  const buscarCampanhas = useCallback(async (novosFiltros: FiltrosPublicidade = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        tipo: 'campanhas',
        ...Object.fromEntries(
          Object.entries({ ...filtros, ...novosFiltros })
            .filter(([_, value]) => value !== undefined && value !== '')
            .map(([key, value]) => [key, String(value)])
        )
      })

      controllerRef.current?.abort()
      controllerRef.current = new AbortController()
      const response = await fetch(`/api/publicidade?${params}`, { signal: controllerRef.current.signal, cache: 'no-store' })
      const data = await jsonOrEmpty(response)

      setCampanhas(Array.isArray(data.campanhas) ? data.campanhas : [])
      const total = Array.isArray(data.campanhas) ? data.campanhas.length : 0
      setPaginacao(data.paginacao || null)
      setEstatisticas(data.estatisticas || null)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // navegação ou desmontagem: não tratar como erro
      } else {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      }
      // Em caso de erro, não usar dados fictícios
      setCampanhas([])
      setPaginacao(null)
      setEstatisticas(null)
  } finally {
      setLoading(false)
    }
  }, [filtrosKey])

  useEffect(() => {
    buscarCampanhas()
    return () => {
      controllerRef.current?.abort()
    }
  }, [buscarCampanhas])

  return {
    campanhas,
    paginacao,
    estatisticas,
    loading,
    error,
    refetch: buscarCampanhas
  }
}

// Hook para métricas de publicidade
export function useMetricasPublicidade(filtros: FiltrosPublicidade = {}) {
  const [metricas, setMetricas] = useState<MetricasPublicidade | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const controllerRef = useRef<AbortController | null>(null)
  // Estabiliza dependências do callback
  const filtrosKey = JSON.stringify(filtros)

  const buscarMetricas = useCallback(async (novosFiltros: FiltrosPublicidade = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        tipo: 'metricas',
        ...Object.fromEntries(
          Object.entries({ ...filtros, ...novosFiltros })
            .filter(([_, value]) => value !== undefined && value !== '')
            .map(([key, value]) => [key, String(value)])
        )
      })

      controllerRef.current?.abort()
      controllerRef.current = new AbortController()
      const response = await fetch(`/api/publicidade?${params}`, { signal: controllerRef.current.signal })
      const data = response.ok ? await response.json() : null

      // A API atual não fornece métricas de publicidade; não criar dados fictícios
      if (data && data.resumo) {
        setMetricas(data as MetricasPublicidade)
      } else {
        setMetricas(null)
        setError('Métricas de publicidade indisponíveis')
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // navegação ou desmontagem
      } else {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      }
    } finally {
      setLoading(false)
    }
  }, [filtrosKey])

  useEffect(() => {
    buscarMetricas()
    return () => {
      controllerRef.current?.abort()
    }
  }, [buscarMetricas])

  return {
    metricas,
    loading,
    error,
    refetch: buscarMetricas
  }
}

// Hook para estatísticas resumidas
export function usePublicidadeStats() {
  const [stats, setStats] = useState<EstatisticasPublicidade | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const controllerRef = useRef<AbortController | null>(null)

  const buscarStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      controllerRef.current?.abort()
      controllerRef.current = new AbortController()
      const response = await fetch('/api/publicidade', { signal: controllerRef.current.signal })
      const data = response.ok ? await response.json() : {}
      setStats(data.estatisticas ?? null)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // navegação ou desmontagem
      } else {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    buscarStats()
    return () => {
      controllerRef.current?.abort()
    }
  }, [buscarStats])

  return {
    stats,
    loading,
    error,
    refetch: buscarStats
  }
}

// Hook para criar anúncio
export function useCriarAnuncio() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const criarAnuncio = useCallback(async (dadosAnuncio: Partial<Anuncio>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/publicidade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: 'anuncio',
          ...dadosAnuncio
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar anúncio')
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    criarAnuncio,
    loading,
    error
  }
}

// Hook para criar campanha
export function useCriarCampanha() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const criarCampanha = useCallback(async (dadosCampanha: Partial<CampanhaPublicitaria>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/publicidade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: 'campanha',
          ...dadosCampanha
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar campanha')
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    criarCampanha,
    loading,
    error
  }
}