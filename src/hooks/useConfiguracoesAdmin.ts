import { useState, useEffect, useCallback } from 'react'

// Interfaces
export interface ConfiguracoesGerais {
  siteName: string
  siteDescription: string
  siteUrl: string
  adminEmail: string
  contactEmail: string
  phone: string
  address: string
  timezone: string
  language: string
  currency: string
}

export interface ConfiguracoesBranding {
  logo: string
  favicon: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  headerStyle: string
  footerStyle: string
}

export interface ConfiguracoesConteudo {
  articlesPerPage: number
  enableComments: boolean
  moderateComments: boolean
  enableRatings: boolean
  enableSharing: boolean
  enableNewsletter: boolean
  enableNotifications: boolean
  defaultImageQuality: number
  maxUploadSize: number
}

export interface ConfiguracoesSocial {
  facebook: string
  instagram: string
  twitter: string
  linkedin: string
  youtube: string
  whatsapp: string
}

export interface ConfiguracoesCompletas {
  general: ConfiguracoesGerais
  branding: ConfiguracoesBranding
  content: ConfiguracoesConteudo
  social: ConfiguracoesSocial
}

// Hook para buscar configurações
export function useConfiguracoes(secao?: string) {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesCompletas | any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarConfiguracoes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const url = secao 
        ? `/api/admin/configuracoes?secao=${secao}`
        : '/api/admin/configuracoes'
      
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar configurações')
      }

      setConfiguracoes(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [secao])

  useEffect(() => {
    buscarConfiguracoes()
  }, [buscarConfiguracoes])

  return {
    configuracoes,
    loading,
    error,
    recarregar: buscarConfiguracoes
  }
}

// Hook para atualizar configurações
export function useUpdateConfiguracoes() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const atualizarConfiguracoes = useCallback(async (
    dados: Partial<ConfiguracoesCompletas> | any,
    secao?: string
  ) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/configuracoes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secao, dados }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao atualizar configurações')
      }

      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    atualizarConfiguracoes,
    loading,
    error
  }
}

// Hook para resetar configurações
export function useResetConfiguracoes() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetarConfiguracoes = useCallback(async (secao?: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/configuracoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secao }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao resetar configurações')
      }

      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    resetarConfiguracoes,
    loading,
    error
  }
}

// Hook para configurações gerais
export function useConfiguracoesGerais() {
  return useConfiguracoes('general')
}

// Hook para configurações de branding
export function useConfiguracoesBranding() {
  return useConfiguracoes('branding')
}

// Hook para configurações de conteúdo
export function useConfiguracoesConteudo() {
  return useConfiguracoes('content')
}

// Hook para configurações sociais
export function useConfiguracoesSocial() {
  return useConfiguracoes('social')
}

// Hook combinado para todas as configurações com funcionalidades completas
export function useConfiguracoesAdmin() {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesCompletas | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const buscarConfiguracoes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/configuracoes')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar configurações')
      }

      setConfiguracoes(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [])

  const salvarConfiguracoes = useCallback(async (
    novasConfiguracoes: Partial<ConfiguracoesCompletas>,
    secao?: string
  ) => {
    try {
      setSaving(true)
      setError(null)

      const response = await fetch('/api/admin/configuracoes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secao, dados: novasConfiguracoes }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao salvar configurações')
      }

      // Atualizar estado local
      if (secao) {
        setConfiguracoes(prev => prev ? {
          ...prev,
          [secao]: result.data
        } : null)
      } else {
        setConfiguracoes(result.data)
      }

      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const resetarConfiguracoes = useCallback(async (secao?: string) => {
    try {
      setSaving(true)
      setError(null)

      const response = await fetch('/api/admin/configuracoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secao }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao resetar configurações')
      }

      // Atualizar estado local
      if (secao) {
        setConfiguracoes(prev => prev ? {
          ...prev,
          [secao]: result.data
        } : null)
      } else {
        setConfiguracoes(result.data)
      }

      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  useEffect(() => {
    buscarConfiguracoes()
  }, [buscarConfiguracoes])

  return {
    configuracoes,
    loading,
    error,
    saving,
    buscarConfiguracoes,
    salvarConfiguracoes,
    resetarConfiguracoes,
    recarregar: buscarConfiguracoes
  }
}