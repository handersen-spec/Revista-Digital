import { useState, useEffect, useCallback } from 'react'
import { Artigo } from '@/types/artigo'

// Interfaces para o hook de artigos
export interface FiltrosArtigos {
  categoria?: string
  autor?: string
  tag?: string
  busca?: string
  page?: number
  limit?: number
}

export interface RespostaArtigos {
  artigos: Artigo[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginacaoArtigos {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Hook principal para buscar artigos
export function useArtigos(filtros: FiltrosArtigos = {}) {
  const [artigos, setArtigos] = useState<Artigo[]>([])
  const [paginacao, setPaginacao] = useState<PaginacaoArtigos | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarArtigos = useCallback(async (novosFiltros: FiltrosArtigos = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      const filtrosFinais = { ...filtros, ...novosFiltros }
      
      if (filtrosFinais.categoria) params.append('categoria', filtrosFinais.categoria)
      if (filtrosFinais.autor) params.append('autor', filtrosFinais.autor)
      if (filtrosFinais.tag) params.append('tag', filtrosFinais.tag)
      if (filtrosFinais.busca) params.append('busca', filtrosFinais.busca)
      if (filtrosFinais.page) params.append('page', filtrosFinais.page.toString())
      if (filtrosFinais.limit) params.append('limit', filtrosFinais.limit.toString())

      const response = await fetch(`/api/artigos?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar artigos')
      }

      const data: RespostaArtigos = await response.json()
      
      setArtigos(data.artigos || [])
      setPaginacao({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
        hasNext: data.hasNext,
        hasPrev: data.hasPrev
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar artigos:', err)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filtros)])

  useEffect(() => {
    buscarArtigos()
  }, [buscarArtigos])

  return {
    artigos,
    paginacao,
    loading,
    error,
    refetch: buscarArtigos
  }
}

// Hook para buscar artigo por slug
export function useArtigo(slug: string) {
  const [artigo, setArtigo] = useState<Artigo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarArtigo = useCallback(async () => {
    if (!slug) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/artigos/${slug}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Artigo não encontrado')
        }
        throw new Error('Erro ao buscar artigo')
      }

      const data = await response.json()
      setArtigo(data.artigo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar artigo:', err)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    buscarArtigo()
  }, [buscarArtigo])

  return {
    artigo,
    loading,
    error,
    refetch: buscarArtigo
  }
}

// Hook para buscar artigos por categoria
export function useArtigosPorCategoria(categoria: string, limit: number = 10) {
  return useArtigos({ categoria, limit })
}

// Hook para buscar artigos relacionados
export function useArtigosRelacionados(categoria: string, slugExcluir?: string, limit: number = 3) {
  const { artigos, loading, error } = useArtigos({ categoria, limit: limit + 1 })
  
  const artigosRelacionados = slugExcluir 
    ? artigos.filter(artigo => artigo.slug !== slugExcluir).slice(0, limit)
    : artigos.slice(0, limit)

  return {
    artigos: artigosRelacionados,
    loading,
    error
  }
}

// Hook para buscar artigos em destaque (mais recentes)
export function useArtigosDestaque(limit: number = 6) {
  // Buscar mais itens para garantir que haja conteúdo suficiente após filtrar destaque
  const { artigos, loading, error, paginacao, refetch } = useArtigos({ limit: Math.max(limit * 2, limit) })

  // Filtrar somente artigos com destaque e publicados (ou sem status definido)
  const destacados = artigos
    .filter((a: any) => !!a?.destaque && (a?.status === 'published' || a?.status === undefined))
    .slice(0, limit)

  // Fallback: se não houver destacados suficientes, retornar os mais recentes publicados
  const fallback = artigos
    .filter((a: any) => a?.status === 'published' || a?.status === undefined)
    .slice(0, limit)

  return {
    artigos: destacados.length > 0 ? destacados : fallback,
    loading,
    error,
    paginacao,
    refetch
  }
}

// Hook para buscar artigos por autor
export function useArtigosPorAutor(autor: string, limit: number = 10) {
  return useArtigos({ autor, limit })
}

// Hook para buscar artigos por tag
export function useArtigosPorTag(tag: string, limit: number = 10) {
  return useArtigos({ tag, limit })
}

// Hook para busca de artigos
export function useBuscarArtigos(termoBusca: string, limit: number = 10) {
  return useArtigos({ busca: termoBusca, limit })
}

// Hook para criar artigo (para admin)
export function useCriarArtigo() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const criarArtigo = useCallback(async (dadosArtigo: Partial<Artigo>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/artigos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosArtigo),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar artigo')
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
    criarArtigo,
    loading,
    error
  }
}

// Hook para atualizar artigo (para admin)
export function useAtualizarArtigo() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const atualizarArtigo = useCallback(async (slug: string, dadosArtigo: Partial<Artigo>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/artigos/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosArtigo),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar artigo')
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
    atualizarArtigo,
    loading,
    error
  }
}

// Hook para excluir artigo (para admin)
export function useExcluirArtigo() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const excluirArtigo = useCallback(async (slug: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/artigos/${slug}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir artigo')
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
    excluirArtigo,
    loading,
    error
  }
}