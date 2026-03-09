'use client'

import { useState, useEffect } from 'react'

// Tipos baseados na API de contatos
export interface MensagemContato {
  id: string
  nome: string
  email: string
  telefone?: string
  assunto: string
  mensagem: string
  categoria: 'geral' | 'suporte' | 'parceria' | 'publicidade' | 'feedback'
  dataEnvio: string
  status: 'novo' | 'lido' | 'respondido' | 'arquivado'
  prioridade: 'baixa' | 'media' | 'alta'
  resposta?: string
  dataResposta?: string
}

export interface FiltrosContatos {
  categoria?: string
  status?: string
  prioridade?: string
  page?: number
  limit?: number
  orderBy?: string
  order?: 'asc' | 'desc'
}

export interface EstatisticasContatos {
  total: number
  porStatus: {
    novo: number
    lido: number
    respondido: number
    arquivado: number
  }
  porCategoria: {
    geral: number
    suporte: number
    parceria: number
    publicidade: number
    feedback: number
  }
  porPrioridade: {
    alta: number
    media: number
    baixa: number
  }
}

export interface RespostaContatos {
  mensagens: MensagemContato[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  stats: EstatisticasContatos
}

export function useContatos(filtros: FiltrosContatos = {}) {
  const [dados, setDados] = useState<RespostaContatos | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarContatos = async (novosFiltros?: FiltrosContatos) => {
    try {
      setLoading(true)
      setError(null)

      const filtrosFinais = { ...filtros, ...novosFiltros }
      const params = new URLSearchParams()

      Object.entries(filtrosFinais).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/contato?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setDados(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    buscarContatos()
  }, [])

  const refetch = () => buscarContatos()

  const defaultStats: EstatisticasContatos = {
    total: 0,
    porStatus: { novo: 0, lido: 0, respondido: 0, arquivado: 0 },
    porCategoria: { geral: 0, suporte: 0, parceria: 0, publicidade: 0, feedback: 0 },
    porPrioridade: { alta: 0, media: 0, baixa: 0 }
  }

  const normalizeStats = (s?: Partial<EstatisticasContatos> | null): EstatisticasContatos => ({
    total: Number(s?.total ?? 0),
    porStatus: {
      novo: Number(s?.porStatus?.novo ?? 0),
      lido: Number(s?.porStatus?.lido ?? 0),
      respondido: Number(s?.porStatus?.respondido ?? 0),
      arquivado: Number(s?.porStatus?.arquivado ?? 0)
    },
    porCategoria: {
      geral: Number(s?.porCategoria?.geral ?? 0),
      suporte: Number(s?.porCategoria?.suporte ?? 0),
      parceria: Number(s?.porCategoria?.parceria ?? 0),
      publicidade: Number(s?.porCategoria?.publicidade ?? 0),
      feedback: Number(s?.porCategoria?.feedback ?? 0)
    },
    porPrioridade: {
      alta: Number(s?.porPrioridade?.alta ?? 0),
      media: Number(s?.porPrioridade?.media ?? 0),
      baixa: Number(s?.porPrioridade?.baixa ?? 0)
    }
  })

  return {
    mensagens: dados?.mensagens || [],
    total: dados?.total || 0,
    page: dados?.page || 1,
    limit: dados?.limit || 10,
    totalPages: dados?.totalPages || 0,
    hasNext: dados?.hasNext || false,
    hasPrev: dados?.hasPrev || false,
    stats: dados?.stats ? normalizeStats(dados.stats) : defaultStats,
    loading,
    error,
    refetch,
    buscarContatos
  }
}

export function useContatosStats() {
  const [stats, setStats] = useState<EstatisticasContatos | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarEstatisticas = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/contato?limit=1')
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const defaultStats: EstatisticasContatos = {
        total: 0,
        porStatus: { novo: 0, lido: 0, respondido: 0, arquivado: 0 },
        porCategoria: { geral: 0, suporte: 0, parceria: 0, publicidade: 0, feedback: 0 },
        porPrioridade: { alta: 0, media: 0, baixa: 0 }
      }

      const normalize = (s?: Partial<EstatisticasContatos> | null): EstatisticasContatos => ({
        total: Number(s?.total ?? 0),
        porStatus: {
          novo: Number(s?.porStatus?.novo ?? 0),
          lido: Number(s?.porStatus?.lido ?? 0),
          respondido: Number(s?.porStatus?.respondido ?? 0),
          arquivado: Number(s?.porStatus?.arquivado ?? 0)
        },
        porCategoria: {
          geral: Number(s?.porCategoria?.geral ?? 0),
          suporte: Number(s?.porCategoria?.suporte ?? 0),
          parceria: Number(s?.porCategoria?.parceria ?? 0),
          publicidade: Number(s?.porCategoria?.publicidade ?? 0),
          feedback: Number(s?.porCategoria?.feedback ?? 0)
        },
        porPrioridade: {
          alta: Number(s?.porPrioridade?.alta ?? 0),
          media: Number(s?.porPrioridade?.media ?? 0),
          baixa: Number(s?.porPrioridade?.baixa ?? 0)
        }
      })

      setStats(normalize(data?.stats) ?? defaultStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    buscarEstatisticas()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: buscarEstatisticas
  }
}

// Hook para enviar nova mensagem de contato
export function useEnviarContato() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const enviarMensagem = async (mensagem: Omit<MensagemContato, 'id' | 'dataEnvio' | 'status'>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mensagem),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    enviarMensagem,
    loading,
    error
  }
}

// Hook para responder mensagens de contato
export function useResponderContato() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const responderMensagem = async (id: string, resposta: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/contato', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, resposta })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData?.message || `Erro ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { responderMensagem, loading, error }
}

// Hook para responder uma mensagem de contato existente