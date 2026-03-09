'use client'

import { useState, useEffect } from 'react'

// Interfaces para configurações de SEO
export interface ConfiguracoesSEO {
  general: {
    metaTitle: string
    metaDescription: string
    metaKeywords: string
    canonicalUrl: string
    robotsTxt: string
    sitemapEnabled: boolean
    sitemapFrequency: string
    googleAnalyticsId: string
    googleSearchConsole: string
    bingWebmasterTools: string
    facebookPixel: string
  }
  openGraph: {
    enabled: boolean
    title: string
    description: string
    image: string
    type: string
    locale: string
    siteName: string
  }
  twitter: {
    enabled: boolean
    card: string
    site: string
    creator: string
    title: string
    description: string
    image: string
  }
  schema: {
    enabled: boolean
    organizationName: string
    organizationType: string
    logo: string
    contactPoint: string
    address: string
    socialProfiles: string[]
  }
}

export interface RedirecionamentoSEO {
  id: string
  from: string
  to: string
  type: '301' | '302'
  enabled: boolean
  created_at: string
}

export interface MetricasSEO {
  indexedPages: number
  totalBacklinks: number
  organicTraffic: number
  averagePosition: number
  clickThroughRate: number
  impressions: number
  clicks: number
  crawlErrors: number
  pagespeedScore: number
  mobileUsability: number
}

// Hook para buscar configurações de SEO
export const useConfiguracoesSEO = () => {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesSEO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarConfiguracoes = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/seo?type=configurations')
      const data = await response.json()
      
      if (data.success) {
        setConfiguracoes(data.data)
      } else {
        setError(data.error || 'Erro ao buscar configurações')
      }
    } catch (err) {
      setError('Erro de conexão')
      console.error('Erro ao buscar configurações de SEO:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    buscarConfiguracoes()
  }, [])

  return {
    configuracoes,
    loading,
    error,
    refetch: buscarConfiguracoes
  }
}

// Hook para atualizar configurações de SEO
export const useUpdateConfiguracoesSEO = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const atualizarConfiguracoes = async (configuracoes: ConfiguracoesSEO) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'configurations',
          data: configuracoes
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        return data.data
      } else {
        throw new Error(data.error || 'Erro ao atualizar configurações')
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao atualizar configurações de SEO:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    atualizarConfiguracoes,
    loading,
    error
  }
}

// Hook para buscar redirecionamentos
export const useRedirecionamentosSEO = () => {
  const [redirecionamentos, setRedirecionamentos] = useState<RedirecionamentoSEO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paginacao, setPaginacao] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })

  const buscarRedirecionamentos = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/seo?type=redirects')
      const data = await response.json()
      
      if (data.success) {
        setRedirecionamentos(data.data)
        setPaginacao(data.pagination)
      } else {
        setError(data.error || 'Erro ao buscar redirecionamentos')
      }
    } catch (err) {
      setError('Erro de conexão')
      console.error('Erro ao buscar redirecionamentos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    buscarRedirecionamentos()
  }, [])

  return {
    redirecionamentos,
    paginacao,
    loading,
    error,
    refetch: buscarRedirecionamentos
  }
}

// Hook para criar redirecionamento
export const useCreateRedirecionamento = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const criarRedirecionamento = async (redirecionamento: Omit<RedirecionamentoSEO, 'id' | 'created_at'>) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'redirect',
          data: redirecionamento
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        return data.data
      } else {
        throw new Error(data.error || 'Erro ao criar redirecionamento')
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao criar redirecionamento:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    criarRedirecionamento,
    loading,
    error
  }
}

// Hook para atualizar redirecionamento
export const useUpdateRedirecionamento = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const atualizarRedirecionamento = async (redirecionamento: RedirecionamentoSEO) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'redirect',
          data: redirecionamento
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        return data.data
      } else {
        throw new Error(data.error || 'Erro ao atualizar redirecionamento')
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao atualizar redirecionamento:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    atualizarRedirecionamento,
    loading,
    error
  }
}

// Hook para excluir redirecionamento
export const useDeleteRedirecionamento = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const excluirRedirecionamento = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/admin/seo?type=redirect&id=${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        return data.data
      } else {
        throw new Error(data.error || 'Erro ao excluir redirecionamento')
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao excluir redirecionamento:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    excluirRedirecionamento,
    loading,
    error
  }
}

// Hook para buscar métricas de SEO
export const useMetricasSEO = () => {
  const [metricas, setMetricas] = useState<MetricasSEO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarMetricas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/seo?type=metrics')
      const data = await response.json()
      
      if (data.success) {
        setMetricas(data.data)
      } else {
        setError(data.error || 'Erro ao buscar métricas')
      }
    } catch (err) {
      setError('Erro de conexão')
      console.error('Erro ao buscar métricas de SEO:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    buscarMetricas()
  }, [])

  return {
    metricas,
    loading,
    error,
    refetch: buscarMetricas
  }
}

// Hook para gerar sitemap
export const useGerarSitemap = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const gerarSitemap = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'sitemap'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        return data.data
      } else {
        throw new Error(data.error || 'Erro ao gerar sitemap')
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao gerar sitemap:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    gerarSitemap,
    loading,
    error
  }
}