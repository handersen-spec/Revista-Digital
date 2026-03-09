"use client"
import { useEffect, useState, useCallback } from 'react'

export type HeroCarouselItem = {
  id?: number
  title: string
  subtitle?: string
  description?: string
  details?: string
  bgImage?: string
  categoria?: string
  active?: boolean
  ordem?: number
}

export function useHeroCarousel() {
  const [items, setItems] = useState<HeroCarouselItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/hero-carousel?t=${Date.now()}` , {
        cache: 'no-store'
      })
      if (!res.ok) throw new Error('Falha ao carregar carrossel')
      const data = await res.json()
      setItems(Array.isArray(data.items) ? data.items : [])
    } catch (e: any) {
      setError(e?.message || 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  // Escuta atualizações em tempo real vindas do admin via BroadcastChannel
  useEffect(() => {
    // Evita rodar no SSR
    if (typeof window === 'undefined') return
    const bc = new BroadcastChannel('hero-carousel')
    bc.onmessage = (ev) => {
      const data = ev?.data
      if (data && data.type === 'reload') {
        fetchItems()
      }
    }
    return () => bc.close()
  }, [fetchItems])

  return { items, loading, error, reload: fetchItems }
}