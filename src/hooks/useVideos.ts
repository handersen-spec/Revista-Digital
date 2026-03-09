'use client'

import { useState, useEffect } from 'react'

export interface Video {
  id: number
  slug: string
  titulo: string
  descricao: string
  categoria: string
  duracao: string
  visualizacoes: string
  data: string
  canal: string
  thumbnail: string
  destaque: boolean
}

export interface FiltrosVideos {
  categoria?: string
  limit?: number
  page?: number
}

export interface RespostaVideos {
  success: boolean
  data: Video[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
  message?: string
}

export interface RespostaVideo {
  success: boolean
  data: Video | null
  videosRelacionados?: Video[]
  message?: string
}

// Hook para buscar vídeos com filtros e paginação
export function useVideos(filtros: FiltrosVideos = {}) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10
  })

  const buscarVideos = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filtros.categoria) params.append('categoria', filtros.categoria)
      if (filtros.limit) params.append('limit', filtros.limit.toString())
      if (filtros.page) params.append('page', filtros.page.toString())

      const response = await fetch(`/api/videos?${params.toString()}`)
      const data: RespostaVideos = await response.json()

      if (data.success) {
        setVideos(data.data)
        setPagination(data.pagination)
      } else {
        setError(data.message || 'Erro ao carregar vídeos')
        setVideos([])
      }
    } catch (err) {
      setError('Erro de conexão')
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    buscarVideos()
  }, [filtros.categoria, filtros.limit, filtros.page])

  return {
    videos,
    loading,
    error,
    pagination,
    refetch: buscarVideos
  }
}

// Hook para buscar vídeos em destaque
export function useVideosDestaque() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarVideosDestaque = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/videos?destaque=true&limit=6')
      const data: RespostaVideos = await response.json()

      if (data.success) {
        setVideos(data.data)
      } else {
        setError(data.message || 'Erro ao carregar vídeos em destaque')
        setVideos([])
      }
    } catch (err) {
      setError('Erro de conexão')
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    buscarVideosDestaque()
  }, [])

  return {
    videos,
    loading,
    error,
    refetch: buscarVideosDestaque
  }
}

// Hook para buscar vídeos por categoria
export function useVideosPorCategoria(categoria: string) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarVideosPorCategoria = async () => {
    if (!categoria || categoria === 'Todos') {
      setVideos([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/videos?categoria=${encodeURIComponent(categoria)}&limit=20`)
      const data: RespostaVideos = await response.json()

      if (data.success) {
        setVideos(data.data)
      } else {
        setError(data.message || 'Erro ao carregar vídeos da categoria')
        setVideos([])
      }
    } catch (err) {
      setError('Erro de conexão')
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    buscarVideosPorCategoria()
  }, [categoria])

  return {
    videos,
    loading,
    error,
    refetch: buscarVideosPorCategoria
  }
}

// Hook para buscar um vídeo individual por slug
export function useVideo(slug: string) {
  const [video, setVideo] = useState<Video | null>(null)
  const [videosRelacionados, setVideosRelacionados] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarVideo = async () => {
    if (!slug) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/videos/${slug}`)
      const data: RespostaVideo = await response.json()

      if (data.success && data.data) {
        setVideo(data.data)
        setVideosRelacionados(data.videosRelacionados || [])
      } else {
        setError(data.message || 'Vídeo não encontrado')
        setVideo(null)
        setVideosRelacionados([])
      }
    } catch (err) {
      setError('Erro de conexão')
      setVideo(null)
      setVideosRelacionados([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    buscarVideo()
  }, [slug])

  return {
    video,
    videosRelacionados,
    loading,
    error,
    refetch: buscarVideo
  }
}

// Hook para buscar metadados (categorias disponíveis)
export function useVideosMetadata() {
  const [categorias, setCategorias] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarMetadata = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/videos?metadata=true')
      const data = await response.json()

      if (data.success) {
        setCategorias(data.categorias || [])
      } else {
        setError(data.message || 'Erro ao carregar metadados')
        setCategorias([])
      }
    } catch (err) {
      setError('Erro de conexão')
      setCategorias([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    buscarMetadata()
  }, [])

  return {
    categorias,
    loading,
    error,
    refetch: buscarMetadata
  }
}