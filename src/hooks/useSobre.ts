import { useState, useEffect, useCallback } from 'react'

// Interfaces para os dados da página sobre
export interface MembroEquipe {
  id: number
  nome: string
  cargo: string
  bio: string
  foto: string
  linkedin: string
  especialidades: string[]
}

export interface Valor {
  titulo: string
  descricao: string
  icone: string
}

export interface Marco {
  ano: string
  evento: string
  descricao: string
}

export interface Estatistica {
  valor: string
  descricao: string
}

export interface DadosSobre {
  equipe: MembroEquipe[]
  valores: Valor[]
  marcos: Marco[]
  estatisticas: Estatistica[]
  historia: {
    titulo: string
    descricao: string[]
  }
  missao: string
  visao: string
  valoresEmpresa: string
}

interface ApiResponse {
  success: boolean
  data: DadosSobre
  message?: string
}

// Hook principal para todos os dados da página sobre
export function useSobre() {
  const [dadosSobre, setDadosSobre] = useState<DadosSobre | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDadosSobre = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/sobre')
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      if (data.success) {
        setDadosSobre(data.data)
      } else {
        throw new Error(data.message || 'Erro ao carregar dados')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      setDadosSobre(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDadosSobre()
  }, [fetchDadosSobre])

  const refetch = useCallback(() => {
    fetchDadosSobre()
  }, [fetchDadosSobre])

  return {
    dadosSobre,
    loading,
    error,
    refetch
  }
}

// Hook específico para dados da equipe
export function useEquipe() {
  const [equipe, setEquipe] = useState<MembroEquipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEquipe = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/sobre?secao=equipe')
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setEquipe(data.data.equipe || [])
      } else {
        throw new Error(data.message || 'Erro ao carregar equipe')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      setEquipe([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEquipe()
  }, [fetchEquipe])

  const refetch = useCallback(() => {
    fetchEquipe()
  }, [fetchEquipe])

  return {
    equipe,
    loading,
    error,
    refetch
  }
}

// Hook específico para valores da empresa
export function useValores() {
  const [valores, setValores] = useState<Valor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchValores = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/sobre?secao=valores')
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setValores(data.data.valores || [])
      } else {
        throw new Error(data.message || 'Erro ao carregar valores')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      setValores([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchValores()
  }, [fetchValores])

  const refetch = useCallback(() => {
    fetchValores()
  }, [fetchValores])

  return {
    valores,
    loading,
    error,
    refetch
  }
}

// Hook específico para marcos históricos
export function useMarcos() {
  const [marcos, setMarcos] = useState<Marco[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMarcos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/sobre?secao=marcos')
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setMarcos(data.data.marcos || [])
      } else {
        throw new Error(data.message || 'Erro ao carregar marcos')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      setMarcos([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMarcos()
  }, [fetchMarcos])

  const refetch = useCallback(() => {
    fetchMarcos()
  }, [fetchMarcos])

  return {
    marcos,
    loading,
    error,
    refetch
  }
}

// Hook específico para estatísticas
export function useEstatisticasSobre() {
  const [estatisticas, setEstatisticas] = useState<Estatistica[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEstatisticas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/sobre?secao=estatisticas')
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setEstatisticas(data.data.estatisticas || [])
      } else {
        throw new Error(data.message || 'Erro ao carregar estatísticas')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      setEstatisticas([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEstatisticas()
  }, [fetchEstatisticas])

  const refetch = useCallback(() => {
    fetchEstatisticas()
  }, [fetchEstatisticas])

  return {
    estatisticas,
    loading,
    error,
    refetch
  }
}

// Hook específico para história da empresa
export function useHistoria() {
  const [historia, setHistoria] = useState<{ titulo: string; descricao: string[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHistoria = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/sobre?secao=historia')
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setHistoria(data.data.historia || null)
      } else {
        throw new Error(data.message || 'Erro ao carregar história')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      setHistoria(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistoria()
  }, [fetchHistoria])

  const refetch = useCallback(() => {
    fetchHistoria()
  }, [fetchHistoria])

  return {
    historia,
    loading,
    error,
    refetch
  }
}