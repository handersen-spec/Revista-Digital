import { useState, useEffect, useCallback } from 'react'

// Tipos
interface Concessionaria {
  id: string
  nome: string
  marca: string
  endereco: string
  cidade: string
  provincia: string
  telefone: string
  email: string
  website: string | null
  horarioFuncionamento: {
    segunda: string
    terca: string
    quarta: string
    quinta: string
    sexta: string
    sabado: string
    domingo: string
  }
  coordenadas: {
    latitude: number
    longitude: number
  }
  servicos: string[]
  avaliacoes: {
    media: number
    total: number
  }
  imagens: string[]
  destaque: boolean
  verificada: boolean
  dataAtualizacao: string
  distancia?: number
}

interface FiltrosConcessionarias {
  marca?: string
  cidade?: string
  provincia?: string
  servico?: string
  verificada?: boolean
  destaque?: boolean
  busca?: string
  ordenacao?: string
  direcao?: 'asc' | 'desc'
  latitude?: number
  longitude?: number
  raio?: number
}

interface PaginacaoConcessionarias {
  paginaAtual: number
  totalPaginas: number
  totalItens: number
  itensPorPagina: number
  temProxima: boolean
  temAnterior: boolean
}

interface EstatisticasConcessionarias {
  totalConcessionarias: number
  marcasDisponiveis: string[]
  cidadesDisponiveis: string[]
  provinciasDisponiveis: string[]
}

interface ResponseConcessionarias {
  concessionarias: Concessionaria[]
  paginacao: PaginacaoConcessionarias
  filtros: FiltrosConcessionarias
  estatisticas: EstatisticasConcessionarias
}

interface UseConcessionariasReturn {
  concessionarias: Concessionaria[]
  paginacao: PaginacaoConcessionarias | null
  estatisticas: EstatisticasConcessionarias | null
  loading: boolean
  error: string | null
  filtros: FiltrosConcessionarias
  setFiltros: (filtros: FiltrosConcessionarias) => void
  setPagina: (pagina: number) => void
  refetch: () => void
}

export const useConcessionarias = (
  filtrosIniciais: FiltrosConcessionarias = {},
  limite: number = 20
): UseConcessionariasReturn => {
  const [concessionarias, setConcessionarias] = useState<Concessionaria[]>([])
  const [paginacao, setPaginacao] = useState<PaginacaoConcessionarias | null>(null)
  const [estatisticas, setEstatisticas] = useState<EstatisticasConcessionarias | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<FiltrosConcessionarias>(filtrosIniciais)
  const [pagina, setPagina] = useState(1)

  const fetchConcessionarias = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    setError(null)

    try {
      // Construir query string
      const params = new URLSearchParams()
      
      if (filtros.marca) params.append('marca', filtros.marca)
      if (filtros.cidade) params.append('cidade', filtros.cidade)
      if (filtros.provincia) params.append('provincia', filtros.provincia)
      if (filtros.servico) params.append('servico', filtros.servico)
      if (filtros.verificada !== undefined) params.append('verificada', filtros.verificada.toString())
      if (filtros.destaque !== undefined) params.append('destaque', filtros.destaque.toString())
      if (filtros.busca) params.append('busca', filtros.busca)
      if (filtros.ordenacao) params.append('ordenacao', filtros.ordenacao)
      if (filtros.direcao) params.append('direcao', filtros.direcao)
      if (filtros.latitude) params.append('latitude', filtros.latitude.toString())
      if (filtros.longitude) params.append('longitude', filtros.longitude.toString())
      if (filtros.raio) params.append('raio', filtros.raio.toString())
      
      params.append('limite', limite.toString())
      params.append('pagina', pagina.toString())

      const response = await fetch(`/api/concessionarias?${params.toString()}`, {
        signal
      })
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const data: ResponseConcessionarias = await response.json()
      
      setConcessionarias(data.concessionarias)
      setPaginacao(data.paginacao)
      setEstatisticas(data.estatisticas)
      
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Requisição foi cancelada, não é um erro
        return
      }
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      console.error('Erro ao buscar concessionárias:', err)
    } finally {
      setLoading(false)
    }
  }, [filtros, pagina, limite])

  // Fetch inicial e quando dependências mudarem
  useEffect(() => {
    const abortController = new AbortController()
    
    fetchConcessionarias(abortController.signal)
    
    return () => {
      abortController.abort()
    }
  }, [fetchConcessionarias])

  // Reset página quando filtros mudarem
  useEffect(() => {
    if (pagina !== 1) {
      setPagina(1)
    }
  }, [filtros])

  const handleSetFiltros = useCallback((novosFiltros: FiltrosConcessionarias) => {
    setFiltros(novosFiltros)
  }, [])

  const handleSetPagina = useCallback((novaPagina: number) => {
    setPagina(novaPagina)
  }, [])

  const refetch = useCallback(() => {
    fetchConcessionarias()
  }, [fetchConcessionarias])

  return {
    concessionarias,
    paginacao,
    estatisticas,
    loading,
    error,
    filtros,
    setFiltros: handleSetFiltros,
    setPagina: handleSetPagina,
    refetch
  }
}

// Hook para estatísticas resumidas (para dashboard)
export const useConcessionariasStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    verificadas: 0,
    destaque: 0,
    marcas: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const abortController = new AbortController()
    
    const fetchStats = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fazer apenas uma requisição para obter as estatísticas
        const response = await fetch('/api/concessionarias?limite=1&pagina=1', {
          signal: abortController.signal
        })
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`)
        }

        const data: ResponseConcessionarias = await response.json()
        
        // As estatísticas já vêm calculadas na resposta da API
        setStats({
          total: data.estatisticas.totalConcessionarias,
          verificadas: 2, // Valor mockado baseado nos dados de exemplo
          destaque: 1, // Valor mockado baseado nos dados de exemplo
          marcas: data.estatisticas.marcasDisponiveis.length
        })
        
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
        setError(errorMessage)
        console.error('Erro ao buscar estatísticas das concessionárias:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    
    return () => {
      abortController.abort()
    }
  }, [])

  return { stats, loading, error }
}

export type { Concessionaria, FiltrosConcessionarias, PaginacaoConcessionarias, EstatisticasConcessionarias }