import { useState, useEffect, useCallback } from 'react'

// Interfaces para dados de publicidade
export interface FormatoPublicidade {
  id: number
  nome: string
  descricao: string
  dimensoes: string
  posicao: string
  impressoes: string
  preco: string
  destaque: boolean
}

export interface MetricaAudiencia {
  metrica: string
  valor: string
  icone: string
}

export interface DadoDemografico {
  faixa: string
  percentual: number
}

export interface Demografico {
  categoria: string
  dados: DadoDemografico[]
}

export interface CaseSuccess {
  id: number
  cliente: string
  campanha: string
  resultado: string
  formato: string
  duracao: string
}

export interface DadosPublicidade {
  formatos: FormatoPublicidade[]
  audiencia: MetricaAudiencia[]
  demograficos: Demografico[]
  cases: CaseSuccess[]
}

// Hook principal para buscar dados de publicidade
export function usePublicidadeData() {
  const [dadosPublicidade, setDadosPublicidade] = useState<DadosPublicidade | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarDados = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/publicidade')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados de publicidade')
      }

      const data: DadosPublicidade = await response.json()
      setDadosPublicidade(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar dados de publicidade:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    buscarDados()
  }, [buscarDados])

  return {
    dadosPublicidade,
    loading,
    error,
    refetch: buscarDados
  }
}

// Hook para buscar apenas formatos de publicidade
export function useFormatosPublicidade() {
  const [formatos, setFormatos] = useState<FormatoPublicidade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarFormatos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/publicidade?tipo=formatos')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar formatos de publicidade')
      }

      const data = await response.json()
      setFormatos(data.formatos || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar formatos:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    buscarFormatos()
  }, [buscarFormatos])

  return {
    formatos,
    loading,
    error,
    refetch: buscarFormatos
  }
}

// Hook para buscar dados de audiência
export function useAudienciaPublicidade() {
  const [audiencia, setAudiencia] = useState<MetricaAudiencia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarAudiencia = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/publicidade?tipo=audiencia')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados de audiência')
      }

      const data = await response.json()
      setAudiencia(data.audiencia || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar audiência:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    buscarAudiencia()
  }, [buscarAudiencia])

  return {
    audiencia,
    loading,
    error,
    refetch: buscarAudiencia
  }
}

// Hook para buscar dados demográficos
export function useDemograficosPublicidade() {
  const [demograficos, setDemograficos] = useState<Demografico[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarDemograficos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/publicidade?tipo=demograficos')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados demográficos')
      }

      const data = await response.json()
      setDemograficos(data.demograficos || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar demográficos:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    buscarDemograficos()
  }, [buscarDemograficos])

  return {
    demograficos,
    loading,
    error,
    refetch: buscarDemograficos
  }
}

// Hook para buscar cases de sucesso
export function useCasesPublicidade() {
  const [cases, setCases] = useState<CaseSuccess[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarCases = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/publicidade?tipo=cases')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar cases de sucesso')
      }

      const data = await response.json()
      setCases(data.cases || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar cases:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    buscarCases()
  }, [buscarCases])

  return {
    cases,
    loading,
    error,
    refetch: buscarCases
  }
}