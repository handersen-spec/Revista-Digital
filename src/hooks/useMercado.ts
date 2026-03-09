'use client'

import { useState, useEffect } from 'react'

// Tipos para dados de mercado
export interface DadosVendas {
  mes: string
  vendas: number
  variacao: number
}

export interface MarcaLider {
  marca: string
  participacao: number
  vendas: number
  variacao: number
}

export interface Segmento {
  nome: string
  participacao: number
  vendas: number
  variacao: number
}

export interface EstatisticasMercado {
  vendasTotais: number
  variacaoMensal: number
  veiculosImportados: number
  financiamentos: number
  veiculos4x4: number
}

export interface DadosMercado {
  estatisticas: EstatisticasMercado
  dadosVendas: DadosVendas[]
  marcasLideres: MarcaLider[]
  segmentos: Segmento[]
}

interface UseMercadoReturn {
  dadosMercado: DadosMercado | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useMercado(): UseMercadoReturn {
  const [dadosMercado, setDadosMercado] = useState<DadosMercado | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDadosMercado = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/mercado')
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao buscar dados de mercado')
      }

      setDadosMercado(result.data)
    } catch (err) {
      console.error('Erro ao buscar dados de mercado:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDadosMercado()
  }, [])

  const refetch = () => {
    fetchDadosMercado()
  }

  return {
    dadosMercado,
    loading,
    error,
    refetch
  }
}