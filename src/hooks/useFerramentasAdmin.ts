import { useState, useEffect, useCallback } from 'react'

// Interfaces
export interface FerramentaAdmin {
  id: string
  nome: string
  descricao: string
  categoria: 'sistema' | 'manutencao' | 'backup' | 'monitoramento' | 'otimizacao' | 'dados'
  status: 'ativa' | 'inativa' | 'manutencao' | 'erro'
  ultimoUso: string
  uso: number
  icone: string
  configuracoes?: Record<string, any>
  permissoesNecessarias: string[]
  tempoExecucao?: number
  resultadoUltimaExecucao?: {
    sucesso: boolean
    mensagem: string
    detalhes?: any
    timestamp: string
  }
}

export interface FiltrosFerramentasAdmin {
  categoria?: string
  status?: string
  busca?: string
  page?: number
  limit?: number
  ordenacao?: string
  direcao?: 'asc' | 'desc'
}

export interface EstatisticasFerramentasAdmin {
  total: number
  ativas: number
  inativas: number
  emManutencao: number
  comErro: number
  porCategoria: {
    sistema: number
    manutencao: number
    backup: number
    monitoramento: number
    otimizacao: number
    dados: number
  }
  usoTotal: number
  tempoMedioExecucao: number
}

export interface PaginacaoFerramentasAdmin {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ResponseFerramentasAdmin {
  success: boolean
  data: FerramentaAdmin[]
  paginacao: PaginacaoFerramentasAdmin
  estatisticas: EstatisticasFerramentasAdmin
  filtros: FiltrosFerramentasAdmin
}

export interface ExecucaoFerramenta {
  ferramenta: FerramentaAdmin
  execucao: {
    sucesso: boolean
    mensagem: string
    detalhes?: any
    timestamp: string
  }
}

// Hook principal para ferramentas administrativas
export function useFerramentasAdmin(filtrosIniciais: FiltrosFerramentasAdmin = {}) {
  const [ferramentas, setFerramentas] = useState<FerramentaAdmin[]>([])
  const [estatisticas, setEstatisticas] = useState<EstatisticasFerramentasAdmin | null>(null)
  const [paginacao, setPaginacao] = useState<PaginacaoFerramentasAdmin | null>(null)
  const [filtros, setFiltros] = useState<FiltrosFerramentasAdmin>(filtrosIniciais)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarFerramentas = useCallback(async (novosFiltros?: FiltrosFerramentasAdmin) => {
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

      const response = await fetch(`/api/admin/ferramentas?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar ferramentas')
      }

      const data: ResponseFerramentasAdmin = await response.json()

      if (data.success) {
        setFerramentas(data.data)
        setEstatisticas(data.estatisticas)
        setPaginacao(data.paginacao)
        setFiltros(data.filtros)
      } else {
        throw new Error('Erro na resposta da API')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setFerramentas([])
      setEstatisticas(null)
      setPaginacao(null)
    } finally {
      setLoading(false)
    }
  }, [filtros])

  const atualizarFiltros = useCallback((novosFiltros: Partial<FiltrosFerramentasAdmin>) => {
    const filtrosAtualizados = { ...filtros, ...novosFiltros }
    setFiltros(filtrosAtualizados)
    buscarFerramentas(filtrosAtualizados)
  }, [filtros, buscarFerramentas])

  const limparFiltros = useCallback(() => {
    const filtrosLimpos = { page: 1, limit: 10 }
    setFiltros(filtrosLimpos)
    buscarFerramentas(filtrosLimpos)
  }, [buscarFerramentas])

  const recarregar = useCallback(() => {
    buscarFerramentas()
  }, [buscarFerramentas])

  useEffect(() => {
    buscarFerramentas()
  }, [])

  return {
    ferramentas,
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

// Hook para buscar uma ferramenta específica
export function useFerramentaAdmin(id: string) {
  const [ferramenta, setFerramenta] = useState<FerramentaAdmin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarFerramenta = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/ferramentas/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Ferramenta não encontrada')
        }
        throw new Error('Erro ao buscar ferramenta')
      }

      const data = await response.json()

      if (data.success) {
        setFerramenta(data.data)
      } else {
        throw new Error(data.error || 'Erro na resposta da API')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setFerramenta(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    buscarFerramenta()
  }, [buscarFerramenta])

  return {
    ferramenta,
    loading,
    error,
    recarregar: buscarFerramenta
  }
}

// Hook para executar ferramentas
export function useExecutarFerramenta() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executarFerramenta = useCallback(async (
    id: string, 
    parametros?: Record<string, any>
  ): Promise<ExecucaoFerramenta | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/ferramentas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, parametros }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao executar ferramenta')
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
    executarFerramenta,
    loading,
    error
  }
}

// Hook para atualizar ferramentas
export function useUpdateFerramentaAdmin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const atualizarFerramenta = useCallback(async (
    id: string, 
    dados: Partial<FerramentaAdmin>
  ): Promise<FerramentaAdmin | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/ferramentas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar ferramenta')
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
    atualizarFerramenta,
    loading,
    error
  }
}

// Hook para excluir ferramentas
export function useDeleteFerramentaAdmin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const excluirFerramenta = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/ferramentas/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao excluir ferramenta')
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
    excluirFerramenta,
    loading,
    error
  }
}

// Hook para estatísticas das ferramentas
export function useEstatisticasFerramentasAdmin() {
  const [estatisticas, setEstatisticas] = useState<EstatisticasFerramentasAdmin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarEstatisticas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/ferramentas?limit=1')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas')
      }

      const data: ResponseFerramentasAdmin = await response.json()

      if (data.success) {
        setEstatisticas(data.estatisticas)
      } else {
        throw new Error('Erro na resposta da API')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setEstatisticas(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    buscarEstatisticas()
  }, [buscarEstatisticas])

  return {
    estatisticas,
    loading,
    error,
    recarregar: buscarEstatisticas
  }
}