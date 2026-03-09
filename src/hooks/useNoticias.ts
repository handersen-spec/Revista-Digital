import { useState, useEffect, useCallback } from 'react'

// Interface para notícia
export interface Noticia {
  id: string
  titulo: string
  resumo: string
  conteudo: string
  categoria: string
  autor: string
  dataPublicacao: string
  imagem: string
  slug: string
  tags: string[]
  destaque: boolean
  visualizacoes: number
  fonte?: string
  link?: string
}

// Interface para filtros de notícias
export interface FiltrosNoticias {
  categoria?: string
  autor?: string
  tag?: string
  busca?: string
  destaque?: boolean
  page?: number
  limit?: number
}

// Interface para resposta da API
export interface RespostaNoticias {
  noticias: Noticia[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Interface para paginação
export interface PaginacaoNoticias {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Hook principal para buscar notícias
export function useNoticias(filtros: FiltrosNoticias = {}) {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [paginacao, setPaginacao] = useState<PaginacaoNoticias | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarNoticias = useCallback(async (novosFiltros: FiltrosNoticias = {}, signal?: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      const filtrosFinais = { ...filtros, ...novosFiltros }
      
      if (filtrosFinais.categoria) params.append('categoria', filtrosFinais.categoria)
      if (filtrosFinais.autor) params.append('autor', filtrosFinais.autor)
      if (filtrosFinais.tag) params.append('tag', filtrosFinais.tag)
      if (filtrosFinais.busca) params.append('busca', filtrosFinais.busca)
      if (filtrosFinais.destaque !== undefined) params.append('destaque', filtrosFinais.destaque.toString())
      if (filtrosFinais.page) params.append('page', filtrosFinais.page.toString())
      if (filtrosFinais.limit) params.append('limit', filtrosFinais.limit.toString())

      const response = await fetch(`/api/noticias?${params.toString()}`, { signal })
      
      if (!response.ok) {
        throw new Error('Erro ao buscar notícias')
      }

      const data: RespostaNoticias = await response.json()
      
      setNoticias(data.noticias || [])
      setPaginacao({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
        hasNext: data.hasNext,
        hasPrev: data.hasPrev
      })
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Requisição cancelada intencionalmente; não é um erro
        return
      }
      setError('Não foi possível carregar notícias')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filtros)])

  useEffect(() => {
    const abortController = new AbortController()
    buscarNoticias({}, abortController.signal)
    return () => abortController.abort()
  }, [buscarNoticias])

  return {
    noticias,
    paginacao,
    loading,
    error,
    refetch: buscarNoticias
  }
}

// Hook para buscar notícia por slug
export function useNoticia(slug: string) {
  const [noticia, setNoticia] = useState<Noticia | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarNoticia = useCallback(async () => {
    if (!slug) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/noticias/${slug}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Notícia não encontrada')
        }
        throw new Error('Erro ao buscar notícia')
      }

      const data = await response.json()
      setNoticia(data.noticia)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar notícia:', err)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    buscarNoticia()
  }, [buscarNoticia])

  return {
    noticia,
    loading,
    error,
    refetch: buscarNoticia
  }
}

// Hook para buscar notícias por categoria
export function useNoticiasPorCategoria(categoria: string, limit: number = 10) {
  return useNoticias({ categoria, limit })
}

// Hook para buscar notícias em destaque
export function useNoticiasDestaque(limit: number = 6) {
  return useNoticias({ destaque: true, limit })
}

// Hook para buscar notícias relacionadas
export function useNoticiasRelacionadas(categoria: string, slugExcluir?: string, limit: number = 3) {
  const { noticias, loading, error } = useNoticias({ categoria, limit: limit + 1 })
  
  const noticiasRelacionadas = slugExcluir 
    ? noticias.filter(noticia => noticia.slug !== slugExcluir).slice(0, limit)
    : noticias.slice(0, limit)

  return {
    noticias: noticiasRelacionadas,
    loading,
    error
  }
}

// Hook para buscar notícias por autor
export function useNoticiasPorAutor(autor: string, limit: number = 10) {
  return useNoticias({ autor, limit })
}

// Hook para buscar notícias por tag
export function useNoticiasPorTag(tag: string, limit: number = 10) {
  return useNoticias({ tag, limit })
}

// Hook para busca de notícias
export function useBuscarNoticias(termoBusca: string, limit: number = 10) {
  return useNoticias({ busca: termoBusca, limit })
}