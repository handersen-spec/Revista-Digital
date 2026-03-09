import { useCallback, useState } from 'react'
import type { HeroCarouselItem } from './useHeroCarousel'

// Criar item do Hero Carousel (admin)
export function useCriarHeroItem() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const criarHeroItem = useCallback(async (dados: Partial<HeroCarouselItem>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/hero-carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      })

      if (!response.ok) {
        const errBody = await response.text()
        throw new Error(errBody || 'Erro ao criar item do carrossel')
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

  return { criarHeroItem, loading, error }
}

// Atualizar item do Hero Carousel por ID (admin)
export function useAtualizarHeroItem() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const atualizarHeroItem = useCallback(async (id: number | string, dados: Partial<HeroCarouselItem>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/hero-carousel/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      })

      if (!response.ok) {
        const errBody = await response.text()
        throw new Error(errBody || 'Erro ao atualizar item do carrossel')
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

  return { atualizarHeroItem, loading, error }
}

// Excluir item do Hero Carousel por ID (admin)
export function useExcluirHeroItem() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const excluirHeroItem = useCallback(async (id: number | string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/hero-carousel/${id}`, { method: 'DELETE' })

      if (!response.ok) {
        const errBody = await response.text()
        throw new Error(errBody || 'Erro ao excluir item do carrossel')
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

  return { excluirHeroItem, loading, error }
}