import { useState, useEffect } from 'react'

// Interface para Test Drive
interface TestDrive {
  id: number
  slug: string
  veiculo: string
  marca: string
  categoria: string
  nota: number
  preco: string
  resumo: string
  conteudoCompleto: string
  pontosFavoraveis: string[]
  pontosNegativos: string[]
  avaliacoes: {
    design: number
    performance: number
    conforto: number
    tecnologia: number
    custoBeneficio: number
  }
  especificacoes: {
    motor: string
    potencia: string
    torque: string
    transmissao: string
    tracao: string
    consumo: string
    velocidadeMaxima: string
    aceleracao: string
    dimensoes: string
    peso: string
    capacidadeTanque: string
    bagageira: string
  }
  galeria: {
    id: string
    url: string
    alt: string
    legenda?: string
  }[]
  data: string
  autor: string
  imagem: string
  destaque: boolean
  testDrivesRelacionados?: TestDrive[]
}

// Interface para filtros
export interface FiltrosTestDrives {
  categoria?: string
  marca?: string
  destaque?: boolean
  limit?: number
  page?: number
}

// Interface para resposta da API
export interface RespostaTestDrives {
  testDrives: TestDrive[]
  total: number
  page: number
  limit: number
  totalPages: number
  categorias: string[]
  marcas: string[]
}

// Hook principal para buscar test drives
export function useTestDrives(filtros: FiltrosTestDrives = {}) {
  const [data, setData] = useState<RespostaTestDrives | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTestDrives = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      if (filtros.categoria) params.append('categoria', filtros.categoria)
      if (filtros.marca) params.append('marca', filtros.marca)
      if (filtros.destaque !== undefined) params.append('destaque', filtros.destaque.toString())
      if (filtros.limit) params.append('limit', filtros.limit.toString())
      if (filtros.page) params.append('page', filtros.page.toString())

      const response = await fetch(`/api/test-drives?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar test drives')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestDrives()
  }, [
    filtros.categoria,
    filtros.marca,
    filtros.destaque,
    filtros.limit,
    filtros.page
  ])

  return {
    data,
    loading,
    error,
    refetch: fetchTestDrives
  }
}

// Hook para buscar test drives em destaque
export function useTestDrivesDestaque() {
  return useTestDrives({ destaque: true })
}

// Hook para buscar test drives por categoria
export function useTestDrivesPorCategoria(categoria: string) {
  return useTestDrives({ categoria })
}

// Hook para buscar test drives por marca
export function useTestDrivesPorMarca(marca: string) {
  return useTestDrives({ marca })
}

// Hook para buscar categorias e marcas disponíveis
export function useTestDrivesMetadata() {
  const [categorias, setCategorias] = useState<string[]>([])
  const [marcas, setMarcas] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/test-drives?limit=1')
        
        if (!response.ok) {
          throw new Error('Erro ao buscar metadados')
        }

        const result = await response.json()
        setCategorias(result.categorias || [])
        setMarcas(result.marcas || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchMetadata()
  }, [])

  return {
    categorias,
    marcas,
    loading,
    error
  }
}

// Hook para buscar test drive individual por slug
export function useTestDrive(slug: string) {
  const [testDrive, setTestDrive] = useState<TestDrive | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTestDrive = async () => {
      if (!slug) return

      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/test-drives/${slug}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Test drive não encontrado')
          }
          throw new Error('Erro ao buscar test drive')
        }
        
        const data = await response.json()
        setTestDrive(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        setTestDrive(null)
      } finally {
        setLoading(false)
      }
    }

    fetchTestDrive()
  }, [slug])

  return {
    testDrive,
    loading,
    error
  }
}