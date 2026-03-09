'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Shield, 
  User, 
  Mail,
  Phone,
  Calendar,
  MapPin,
  Settings,
  UserCheck,
  UserX,
  Crown,
  Star,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Download,
  Upload,
  Key,
  Lock,
  Unlock,
  RefreshCw
} from 'lucide-react'
import { 
  useUsuariosAdmin, 
  useUsuarioAdmin, 
  useCreateUsuarioAdmin, 
  useUpdateUsuarioAdmin, 
  useDeleteUsuarioAdmin,
  useEstatisticasUsuariosAdmin,
  type UsuarioAdmin 
} from '@/hooks/useUsuariosAdmin'

const UserManagement = () => {
  const [selectedTab, setSelectedTab] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UsuarioAdmin | null>(null)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importedUsersPreview, setImportedUsersPreview] = useState<UsuarioAdmin[]>([])
  const exportMenuRef = useRef<HTMLDivElement>(null)

  // Hooks para gerenciar usuários
  const { usuarios, loading, error, atualizarFiltros } = useUsuariosAdmin({
    funcao: selectedTab === 'todos' ? undefined : selectedTab,
    busca: searchTerm
  })
  const { estatisticas } = useEstatisticasUsuariosAdmin()
  const { criarUsuario, loading: criando } = useCreateUsuarioAdmin()
  const { atualizarUsuario, loading: atualizando } = useUpdateUsuarioAdmin()
  const { excluirUsuario, loading: excluindo } = useDeleteUsuarioAdmin()

  // Funções para manipular filtros
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    atualizarFiltros({ busca: value, page: 1 })
  }

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab)
    atualizarFiltros({ 
      funcao: tab === 'todos' ? undefined : tab, 
      page: 1 
    })
  }

  // Funções para manipular usuários
  const handleCreateUsuario = async (dados: any) => {
    try {
      await criarUsuario(dados)
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
    }
  }

  const handleUpdateUsuario = async (id: string, dados: Partial<UsuarioAdmin>) => {
    try {
      await atualizarUsuario(id, dados)
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
    }
  }

  const handleDeleteUsuario = async (id: string) => {
    try {
      await excluirUsuario(id)
    } catch (error) {
      console.error('Erro ao excluir usuário:', error)
    }
  }

  // Fechar menu de exportação ao clicar fora
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!showExportMenu) return
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [showExportMenu])

  // Export helpers
  const usersForExport = (): UsuarioAdmin[] => {
    if (selectedUsers.length > 0) {
      const selectedSet = new Set(selectedUsers)
      return usuarios.filter(u => selectedSet.has(u.id))
    }
    return usuarios
  }

  const generateCSV = (data: UsuarioAdmin[]) => {
    const headers = [
      'id','nome','email','telefone','funcao','status','artigos','dataIngresso','ultimoLogin','verificado','localizacao'
    ]
    const escape = (val: any) => {
      const s = val === undefined || val === null ? '' : String(val)
      const needsQuote = s.includes(',') || s.includes('\n') || s.includes('"')
      const escaped = s.replace(/"/g, '""')
      return needsQuote ? `"${escaped}"` : escaped
    }
    const rows = data.map(u => [
      u.id,
      u.nome,
      u.email,
      u.telefone || '',
      u.funcao,
      u.status,
      String(u.artigos ?? 0),
      u.dataIngresso || '',
      u.ultimoLogin || '',
      u.verificado ? 'sim' : 'não',
      u.localizacao || ''
    ].map(escape).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    return '\ufeff' + csv
  }

  const generateExcel = (data: UsuarioAdmin[]) => {
    let table = '<table><tr>' + [
      'ID','Nome','Email','Telefone','Função','Status','Artigos','Data de Ingresso','Último Login','Verificado','Localização'
    ].map(h => `<th>${h}</th>`).join('') + '</tr>'
    table += data.map(u => {
      const cells = [
        u.id,
        u.nome,
        u.email,
        u.telefone || '',
        u.funcao,
        u.status,
        String(u.artigos ?? 0),
        u.dataIngresso || '',
        u.ultimoLogin || '',
        u.verificado ? 'sim' : 'não',
        u.localizacao || ''
      ]
      return '<tr>' + cells.map(v => `<td>${v}</td>`).join('') + '</tr>'
    }).join('')
    table += '</table>'
    return table
  }

  const generateJSON = (data: UsuarioAdmin[]) => JSON.stringify(data, null, 2)

  const downloadFile = (content: string, mime: string, ext: string, baseName: string) => {
    const blob = new Blob([content], { type: mime + ';charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const date = new Date().toISOString().slice(0,10)
    a.download = `${baseName}-${date}.${ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportUsers = (format: 'csv' | 'excel' | 'json') => {
    try {
      const data = usersForExport()
      if (format === 'csv') {
        const csv = generateCSV(data)
        downloadFile(csv, 'text/csv', 'csv', 'usuarios')
      } else if (format === 'excel') {
        const xls = generateExcel(data)
        downloadFile(xls, 'application/vnd.ms-excel', 'xls', 'usuarios')
      } else {
        const json = generateJSON(data)
        downloadFile(json, 'application/json', 'json', 'usuarios')
      }
      setShowExportMenu(false)
    } catch (err) {
      console.error('Erro ao exportar usuários:', err)
      alert('Falha ao exportar usuários. Veja o console para detalhes.')
    }
  }

  // Importação básica via arquivo JSON (apenas leitura/preview)
  const handleImportUsersClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportUsersFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const items: UsuarioAdmin[] = Array.isArray(parsed) ? parsed : []
      setImportedUsersPreview(items)
      alert(`Importação carregada: ${items.length} usuário(s) lido(s). (Pré-visualização)`) 
    } catch (err: any) {
      console.error('Erro ao importar usuários:', err)
      alert(`Arquivo inválido: ${err?.message || 'erro desconhecido'}`)
    } finally {
      e.target.value = ''
    }
  }

  const tabs = [
    { id: 'todos', label: 'Todos', count: estatisticas?.total || 0 },
    { id: 'admin', label: 'Administradores', count: estatisticas?.porFuncao?.admin || 0 },
    { id: 'editor', label: 'Editores', count: estatisticas?.porFuncao?.editor || 0 },
    { id: 'moderador', label: 'Moderadores', count: estatisticas?.porFuncao?.moderador || 0 },
    { id: 'analista', label: 'Analistas', count: estatisticas?.porFuncao?.analista || 0 },
    { id: 'suporte', label: 'Suporte', count: estatisticas?.porFuncao?.suporte || 0 }
  ]

  const getRoleColor = (funcao: string) => {
    switch (funcao) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'editor': return 'bg-blue-100 text-blue-800'
      case 'moderador': return 'bg-green-100 text-green-800'
      case 'analista': return 'bg-purple-100 text-purple-800'
      case 'suporte': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800'
      case 'inativo': return 'bg-gray-100 text-gray-800'
      case 'suspenso': return 'bg-red-100 text-red-800'
      case 'pendente': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativo': return <CheckCircle className="w-4 h-4" />
      case 'inativo': return <XCircle className="w-4 h-4" />
      case 'suspenso': return <AlertTriangle className="w-4 h-4" />
      case 'pendente': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const handleSelectUser = (id: string) => {
    setSelectedUsers(prev => 
      prev.includes(id) 
        ? prev.filter(userId => userId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === usuarios.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(usuarios.map((usuario: UsuarioAdmin) => usuario.id))
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
          <p className="text-gray-600 mt-1">Gerencie usuários, permissões e controle de acesso da plataforma.</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImportUsersFileChange}
          />
          <button onClick={handleImportUsersClick} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Importar</span>
          </button>
          
          <div className="relative" ref={exportMenuRef}>
            <button onClick={() => setShowExportMenu(v => !v)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <div className="py-1">
                  <button onClick={() => handleExportUsers('csv')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Exportar CSV</button>
                  <button onClick={() => handleExportUsers('excel')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Exportar Excel</button>
                  <button onClick={() => handleExportUsers('json')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Exportar JSON</button>
                </div>
              </div>
            )}
          </div>
          
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Novo Usuário</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Usuários</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas?.total || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">Registrados na plataforma</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Usuários Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas?.ativos || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">{estatisticas?.total ? ((estatisticas.ativos / estatisticas.total) * 100).toFixed(0) : 0}%</span>
            <span className="text-gray-500 ml-1">do total</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Novos (30 dias)</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas?.novosUltimos30Dias || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-purple-600">Últimos 30 dias</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verificados</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas?.verificados || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">Contas verificadas</span>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-64"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {selectedUsers.length > 0 && `${selectedUsers.length} selecionado(s)`}
              </span>
              
              {selectedUsers.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                    Editar em lote
                  </button>
                  <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors">
                    Excluir
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">Todas as funções</option>
                  <option value="admin">Administrador</option>
                  <option value="editor">Editor</option>
                  <option value="moderador">Moderador</option>
                  <option value="analista">Analista</option>
                  <option value="suporte">Suporte</option>
                </select>

                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">Todos os status</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="suspenso">Suspenso</option>
                  <option value="pendente">Pendente</option>
                </select>

                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">Verificação</option>
                  <option value="true">Verificados</option>
                  <option value="false">Não verificados</option>
                </select>

                <input
                  type="date"
                  placeholder="Data de início"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />

                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Aplicar Filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Carregando usuários...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-gray-600">Erro ao carregar usuários</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === usuarios.length && usuarios.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Função
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artigos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios?.map((usuario: UsuarioAdmin) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(usuario.id)}
                        onChange={() => handleSelectUser(usuario.id)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={usuario.avatar || '/api/placeholder/40/40'}
                            alt={usuario.nome}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {usuario.nome}
                            {usuario.verificado && (
                              <Shield className="w-4 h-4 text-green-500 ml-2" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{usuario.email}</div>
                          {usuario.telefone && (
                            <div className="text-xs text-gray-400">{usuario.telefone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(usuario.funcao)}`}>
                        {usuario.funcao === 'admin' && <Crown className="w-3 h-3 mr-1" />}
                        {usuario.funcao === 'editor' && <Edit className="w-3 h-3 mr-1" />}
                        {usuario.funcao === 'moderador' && <Shield className="w-3 h-3 mr-1" />}
                        {usuario.funcao === 'analista' && <Activity className="w-3 h-3 mr-1" />}
                        {usuario.funcao === 'suporte' && <User className="w-3 h-3 mr-1" />}
                        {usuario.funcao}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(usuario.status)}`}>
                        {getStatusIcon(usuario.status)}
                        <span className="ml-1">{usuario.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {usuario.artigos}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {usuario.ultimoLogin ? new Date(usuario.ultimoLogin).toLocaleDateString() : 'Nunca'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-purple-600 hover:text-purple-900">
                          <Key className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUsuario(usuario.id)}
                          disabled={excluindo}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando <span className="font-medium">1</span> a <span className="font-medium">10</span> de{' '}
              <span className="font-medium">{estatisticas?.total || 0}</span> resultados
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Anterior
              </button>
              <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Próximo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManagement