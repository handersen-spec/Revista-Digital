import { useState, useEffect, useCallback } from 'react'

// Interfaces
export interface Solicitacao {
  id: string
  tipo: 'parceria' | 'suporte' | 'reclamacao' | 'sugestao' | 'outro'
  titulo: string
  descricao: string
  nomeRequerente: string
  emailRequerente: string
  telefoneRequerente: string
  empresa?: string
  status: 'pendente' | 'em_andamento' | 'resolvida' | 'rejeitada'
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  categoria: string
  atribuidoA?: string
  criadoEm: string
  atualizadoEm: string
  dataVencimento?: string
  anexos: string[]
  notas: string[]
  tags: string[]
}

export interface FiltrosSolicitacoes {
  tipo?: string
  status?: string
  prioridade?: string
  categoria?: string
  atribuidoA?: string
  dataInicio?: string
  dataFim?: string
  busca?: string
  page?: number
  limit?: number
  ordenacao?: string
  direcao?: 'asc' | 'desc'
}

export interface EstatisticasSolicitacoes {
  total: number
  pendentes: number
  emAndamento: number
  resolvidas: number
  rejeitadas: number
  porTipo: {
    parceria: number
    suporte: number
    reclamacao: number
    sugestao: number
    outro: number
  }
  porPrioridade: {
    baixa: number
    media: number
    alta: number
    urgente: number
  }
  tempoMedioResolucao: number
  taxaResolucao: number
}

export interface PaginacaoSolicitacoes {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ResponseSolicitacoes {
  success: boolean
  data: Solicitacao[]
  paginacao: PaginacaoSolicitacoes
  estatisticas: EstatisticasSolicitacoes
  filtros: FiltrosSolicitacoes
}

export interface NovasolicitacaoData {
  tipo: string
  titulo: string
  descricao: string
  nomeRequerente: string
  emailRequerente: string
  telefoneRequerente?: string
  empresa?: string
  prioridade?: string
  categoria?: string
  dataVencimento?: string
  anexos?: string[]
  tags?: string[]
}

// Hook principal para solicitações
export function useSolicitacoes(filtrosIniciais: FiltrosSolicitacoes = {}) {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([])
  const [estatisticas, setEstatisticas] = useState<EstatisticasSolicitacoes | null>(null)
  const [paginacao, setPaginacao] = useState<PaginacaoSolicitacoes | null>(null)
  const [filtros, setFiltros] = useState<FiltrosSolicitacoes>(filtrosIniciais)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarSolicitacoes = useCallback(async (novosFiltros?: FiltrosSolicitacoes) => {
    try {
      setLoading(true)
      setError(null)

      const filtrosParaUsar = novosFiltros || filtros
      const params = new URLSearchParams()

      // Adicionar filtros aos parâmetros
      Object.entries(filtrosParaUsar).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/solicitacoes?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar solicitações')
      }

      const data: ResponseSolicitacoes = await response.json()

      if (data.success) {
        setSolicitacoes(data.data)
        setEstatisticas(data.estatisticas)
        setPaginacao(data.paginacao)
        setFiltros(data.filtros)
      } else {
        throw new Error('Erro na resposta da API')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setSolicitacoes([])
      setEstatisticas(null)
      setPaginacao(null)
    } finally {
      setLoading(false)
    }
  }, [filtros])

  const atualizarFiltros = useCallback((novosFiltros: Partial<FiltrosSolicitacoes>) => {
    const filtrosAtualizados = { ...filtros, ...novosFiltros }
    setFiltros(filtrosAtualizados)
    buscarSolicitacoes(filtrosAtualizados)
  }, [filtros, buscarSolicitacoes])

  const limparFiltros = useCallback(() => {
    const filtrosLimpos = { page: 1, limit: 10 }
    setFiltros(filtrosLimpos)
    buscarSolicitacoes(filtrosLimpos)
  }, [buscarSolicitacoes])

  const recarregar = useCallback(() => {
    buscarSolicitacoes()
  }, [buscarSolicitacoes])

  useEffect(() => {
    buscarSolicitacoes()
  }, [])

  return {
    solicitacoes,
    estatisticas,
    paginacao,
    filtros,
    loading,
    error,
    atualizarFiltros,
    limparFiltros,
    recarregar
  }
}

// Hook para buscar uma solicitação específica
export function useSolicitacao(id: string) {
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarSolicitacao = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/solicitacoes/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Solicitação não encontrada')
        }
        throw new Error('Erro ao buscar solicitação')
      }

      const data = await response.json()

      if (data.success) {
        setSolicitacao(data.data)
      } else {
        throw new Error(data.error || 'Erro na resposta da API')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setSolicitacao(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    buscarSolicitacao()
  }, [buscarSolicitacao])

  return {
    solicitacao,
    loading,
    error,
    recarregar: buscarSolicitacao
  }
}

// Hook para criar solicitações
export function useCreateSolicitacao() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const criarSolicitacao = useCallback(async (dados: NovasolicitacaoData): Promise<Solicitacao | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/solicitacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar solicitação')
      }

      if (data.success) {
        return data.data
      } else {
        throw new Error(data.error || 'Erro na resposta da API')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    criarSolicitacao,
    loading,
    error
  }
}

// Hook para atualizar solicitações
export function useUpdateSolicitacao() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const atualizarSolicitacao = useCallback(async (
    id: string, 
    dados: Partial<Solicitacao>
  ): Promise<Solicitacao | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/solicitacoes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar solicitação')
      }

      if (data.success) {
        return data.data
      } else {
        throw new Error(data.error || 'Erro na resposta da API')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    atualizarSolicitacao,
    loading,
    error
  }
}

// Hook para excluir solicitações
export function useDeleteSolicitacao() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const excluirSolicitacao = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/solicitacoes/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao excluir solicitação')
      }

      return data.success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    excluirSolicitacao,
    loading,
    error
  }
}