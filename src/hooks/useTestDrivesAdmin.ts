import { useCallback, useState } from 'react'

export interface TestDrive {
  id?: number
  slug: string
  veiculo: string
  marca?: string
  categoria?: string
  nota?: number
  preco?: string
  resumo: string
  conteudo_completo?: string
  pontos_favoraveis?: string[]
  pontos_negativos?: string[]
  avaliacoes?: Record<string, unknown>
  especificacoes?: Record<string, unknown>
  data_publicacao?: string
  autor?: string
  imagem?: string
  destaque?: boolean
  status?: string
  created_at?: string
  updated_at?: string
}

// Criar Test Drive (admin)
export function useCriarTestDrive() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const criarTestDrive = useCallback(async (dados: Partial<TestDrive>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/test-drives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      })

      if (!response.ok) {
        const errBody = await response.text()
        throw new Error(errBody || 'Erro ao criar test drive')
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

  return { criarTestDrive, loading, error }
}

// Atualizar Test Drive por slug (admin)
export function useAtualizarTestDrive() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const atualizarTestDrive = useCallback(async (slug: string, dados: Partial<TestDrive>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/test-drives/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      })

      if (!response.ok) {
        const errBody = await response.text()
        throw new Error(errBody || 'Erro ao atualizar test drive')
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

  return { atualizarTestDrive, loading, error }
}

// Excluir Test Drive por slug (admin)
export function useExcluirTestDrive() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const excluirTestDrive = useCallback(async (slug: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/test-drives/${slug}`, { method: 'DELETE' })

      if (!response.ok) {
        const errBody = await response.text()
        throw new Error(errBody || 'Erro ao excluir test drive')
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

  return { excluirTestDrive, loading, error }
}