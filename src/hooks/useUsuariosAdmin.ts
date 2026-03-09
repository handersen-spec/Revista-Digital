import { useState, useEffect, useCallback } from 'react'

// Interfaces
export interface UsuarioAdmin {
  id: string
  nome: string
  email: string
  telefone?: string
  funcao: 'admin' | 'editor' | 'moderador' | 'analista' | 'suporte'
  status: 'ativo' | 'inativo' | 'suspenso' | 'pendente'
  avatar?: string
  dataIngresso: string
  ultimoLogin?: string
  localizacao?: string
  artigos: number
  permissoes: string[]
  verificado: boolean
  configuracoes?: {
    notificacoes: boolean
    tema: 'claro' | 'escuro' | 'auto'
    idioma: string
    timezone: string
  }
  dadosAdicionais?: {
    departamento?: string
    supervisor?: string
    dataContratacao?: string
    salario?: number
    observacoes?: string
  }
}

export interface FiltrosUsuariosAdmin {
  funcao?: string
  status?: string
  verificado?: boolean
  busca?: string
  page?: number
  limit?: number
  ordenacao?: string
  direcao?: 'asc' | 'desc'
  dataIngressoInicio?: string
  dataIngressoFim?: string
  ultimoLoginInicio?: string
  ultimoLoginFim?: string
}

export interface EstatisticasUsuariosAdmin {
  total: number
  ativos: number
  inativos: number
  suspensos: number
  pendentes: number
  verificados: number
  naoVerificados: number
  porFuncao: {
    admin: number
    editor: number
    moderador: number
    analista: number
    suporte: number
  }
  novosUltimos30Dias: number
  loginUltimos7Dias: number
  totalArtigos: number
  mediaArtigosPorUsuario: number
}

export interface PaginacaoUsuariosAdmin {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ResponseUsuariosAdmin {
  success: boolean
  data: UsuarioAdmin[]
  paginacao: PaginacaoUsuariosAdmin
  estatisticas: EstatisticasUsuariosAdmin
  filtros: FiltrosUsuariosAdmin
}

export interface CreateUsuarioAdmin {
  nome: string
  email: string
  telefone?: string
  funcao: 'admin' | 'editor' | 'moderador' | 'analista' | 'suporte'
  status?: 'ativo' | 'inativo' | 'suspenso' | 'pendente'
  localizacao?: string
  configuracoes?: {
    notificacoes?: boolean
    tema?: 'claro' | 'escuro' | 'auto'
    idioma?: string
    timezone?: string
  }
  dadosAdicionais?: {
    departamento?: string
    supervisor?: string
    dataContratacao?: string
    salario?: number
    observacoes?: string
  }
}

// Hook principal para usuários administrativos
export function useUsuariosAdmin(filtrosIniciais: FiltrosUsuariosAdmin = {}) {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([])
  const [estatisticas, setEstatisticas] = useState<EstatisticasUsuariosAdmin | null>(null)
  const [paginacao, setPaginacao] = useState<PaginacaoUsuariosAdmin | null>(null)
  const [filtros, setFiltros] = useState<FiltrosUsuariosAdmin>(filtrosIniciais)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarUsuarios = useCallback(async (novosFiltros?: FiltrosUsuariosAdmin) => {
    try {
      setLoading(true)
      setError(null)

      const filtrosParaUsar = novosFiltros || filtros
      const params = new URLSearchParams()

      // Adicionar filtros aos parâmetros
      Object.entries(filtrosParaUsar).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/admin/users?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários')
      }

      const data: ResponseUsuariosAdmin = await response.json()

      if (data.success) {
        setUsuarios(data.data)
        setEstatisticas(data.estatisticas)
        setPaginacao(data.paginacao)
        setFiltros(data.filtros)
      } else {
        throw new Error('Erro na resposta da API')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setUsuarios([])
      setEstatisticas(null)
      setPaginacao(null)
    } finally {
      setLoading(false)
    }
  }, [filtros])

  const atualizarFiltros = useCallback((novosFiltros: Partial<FiltrosUsuariosAdmin>) => {
    const filtrosAtualizados = { ...filtros, ...novosFiltros }
    setFiltros(filtrosAtualizados)
    buscarUsuarios(filtrosAtualizados)
  }, [filtros, buscarUsuarios])

  const limparFiltros = useCallback(() => {
    const filtrosLimpos = { page: 1, limit: 10 }
    setFiltros(filtrosLimpos)
    buscarUsuarios(filtrosLimpos)
  }, [buscarUsuarios])

  const recarregar = useCallback(() => {
    buscarUsuarios()
  }, [buscarUsuarios])

  useEffect(() => {
    buscarUsuarios()
  }, [])

  return {
    usuarios,
    estatisticas,
    paginacao,
    filtros,
    loading,
    error,
    atualizarFiltros,
    limparFiltros,
    recarregar
  }
}

// Hook para buscar um usuário específico
export function useUsuarioAdmin(id: string) {
  const [usuario, setUsuario] = useState<UsuarioAdmin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarUsuario = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/users/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Usuário não encontrado')
        }
        throw new Error('Erro ao buscar usuário')
      }

      const data = await response.json()

      if (data.success) {
        setUsuario(data.data)
      } else {
        throw new Error(data.error || 'Erro na resposta da API')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setUsuario(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    buscarUsuario()
  }, [buscarUsuario])

  return {
    usuario,
    loading,
    error,
    recarregar: buscarUsuario
  }
}

// Hook para criar usuários
export function useCreateUsuarioAdmin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const criarUsuario = useCallback(async (dados: CreateUsuarioAdmin): Promise<UsuarioAdmin | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar usuário')
      }

      if (data.success) {
        return data.data
      } else {
        throw new Error(data.error || 'Erro na resposta da API')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    criarUsuario,
    loading,
    error
  }
}

// Hook para atualizar usuários
export function useUpdateUsuarioAdmin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const atualizarUsuario = useCallback(async (
    id: string, 
    dados: Partial<UsuarioAdmin>
  ): Promise<UsuarioAdmin | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar usuário')
      }

      if (data.success) {
        return data.data
      } else {
        throw new Error(data.error || 'Erro na resposta da API')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    atualizarUsuario,
    loading,
    error
  }
}

// Hook para excluir usuários
export function useDeleteUsuarioAdmin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const excluirUsuario = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao excluir usuário')
      }

      return data.success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    excluirUsuario,
    loading,
    error
  }
}

// Hook para estatísticas dos usuários
export function useEstatisticasUsuariosAdmin() {
  const [estatisticas, setEstatisticas] = useState<EstatisticasUsuariosAdmin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscarEstatisticas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/users?limit=1')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas')
      }

      const data: ResponseUsuariosAdmin = await response.json()

      if (data.success) {
        setEstatisticas(data.estatisticas)
      } else {
        throw new Error('Erro na resposta da API')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setEstatisticas(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    buscarEstatisticas()
  }, [buscarEstatisticas])

  return {
    estatisticas,
    loading,
    error,
    recarregar: buscarEstatisticas
  }
}

// Hook para gerenciar permissões de usuários
export function usePermissoesUsuario() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const atualizarPermissoes = useCallback(async (
    id: string, 
    permissoes: string[]
  ): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permissoes }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar permissões')
      }

      return data.success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const alterarStatus = useCallback(async (
    id: string, 
    status: 'ativo' | 'inativo' | 'suspenso' | 'pendente'
  ): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao alterar status')
      }

      return data.success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    atualizarPermissoes,
    alterarStatus,
    loading,
    error
  }
}