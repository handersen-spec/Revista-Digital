"use client"
import { useCallback, useEffect, useState } from 'react'
import type { MediaItem, MediaType } from '@/types/media'

type MediaFilterType = MediaType | 'all'

export function useMidiaList(params?: { type?: MediaFilterType, search?: string }) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = new URL('/api/media', window.location.origin)
      if (params?.type) url.searchParams.set('type', params.type)
      if (params?.search) url.searchParams.set('search', params.search)
      const res = await fetch(url.toString(), { next: { revalidate: 0 } })
      if (!res.ok) throw new Error('Falha ao listar mídia')
      const data = await res.json()
      setItems(Array.isArray(data.items) ? data.items : [])
    } catch (e: any) {
      setError(e?.message || 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [params?.type, params?.search])

  useEffect(() => { fetchItems() }, [fetchItems])
  return { items, loading, error, reload: fetchItems }
}

export function useUploadMidia() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(async (file: File, type?: MediaType) => {
    setLoading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      if (type) fd.append('type', type)
      const res = await fetch('/api/media', { method: 'POST', body: fd })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Falha ao enviar arquivo')
      }
      const data = await res.json()
      return data.item as MediaItem
    } catch (e: any) {
      setError(e?.message || 'Erro desconhecido')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { upload, loading, error }
}

export function useDeleteMidia() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remove = useCallback(async (type: MediaType, name: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/media/${type}/${encodeURIComponent(name)}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Falha ao apagar arquivo')
      }
      return true
    } catch (e: any) {
      setError(e?.message || 'Erro desconhecido')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return { remove, loading, error }
}

export function useRenameMidia() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const rename = useCallback(async (type: MediaType, name: string, newName: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/media/${type}/${encodeURIComponent(name)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Falha ao renomear arquivo')
      }
      const data = await res.json()
      return data.item as MediaItem
    } catch (e: any) {
      setError(e?.message || 'Erro desconhecido')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { rename, loading, error }
}