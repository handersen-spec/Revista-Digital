'use client'

import { useState } from 'react'
import { 
  Settings, 
  Database, 
  FileText, 
  Download, 
  Upload, 
  RefreshCw, 
  Shield, 
  BarChart3, 
  Users, 
  Mail, 
  Bell, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  Eye, 
  Copy, 
  ExternalLink,
  Server,
  HardDrive,
  Cpu,
  Network,
  Globe,
  Lock,
  Key,
  FileCheck,
  Archive,
  Zap,
  Code,
  Terminal,
  Bug,
  Activity,
  Wrench
} from 'lucide-react'
import { 
  useFerramentasAdmin, 
  useExecutarFerramenta, 
  useUpdateFerramentaAdmin, 
  useDeleteFerramentaAdmin,
  useEstatisticasFerramentasAdmin,
  type FerramentaAdmin 
} from '@/hooks/useFerramentasAdmin'

const ToolsManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Hooks da API
  const { 
    ferramentas, 
    loading, 
    error 
  } = useFerramentasAdmin({
    categoria: selectedCategory === 'all' ? undefined : selectedCategory,
    busca: searchTerm || undefined,
    status: 'ativa'
  })

  const { estatisticas } = useEstatisticasFerramentasAdmin()
  const { executarFerramenta, loading: executando } = useExecutarFerramenta()
  const { atualizarFerramenta } = useUpdateFerramentaAdmin()
  const { excluirFerramenta } = useDeleteFerramentaAdmin()

  // Funções para manipular filtros
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  // Funções para manipular ferramentas
  const handleExecutarFerramenta = async (id: string, parametros?: any) => {
    try {
      await executarFerramenta(id, parametros)
    } catch (error) {
      console.error('Erro ao executar ferramenta:', error)
    }
  }

  const handleUpdateFerramenta = async (id: string, dados: Partial<FerramentaAdmin>) => {
    try {
      await atualizarFerramenta(id, dados)
    } catch (error) {
      console.error('Erro ao atualizar ferramenta:', error)
    }
  }

  const handleDeleteFerramenta = async (id: string) => {
    try {
      await excluirFerramenta(id)
    } catch (error) {
      console.error('Erro ao excluir ferramenta:', error)
    }
  }

  const categories = [
    { id: 'all', label: 'Todas', count: estatisticas?.total || 0 },
    { id: 'sistema', label: 'Sistema', count: estatisticas?.porCategoria?.sistema || 0 },
    { id: 'backup', label: 'Backup', count: estatisticas?.porCategoria?.backup || 0 },
    { id: 'monitoramento', label: 'Monitoramento', count: estatisticas?.porCategoria?.monitoramento || 0 },
    { id: 'otimizacao', label: 'Otimização', count: estatisticas?.porCategoria?.otimizacao || 0 },
    { id: 'dados', label: 'Dados', count: estatisticas?.porCategoria?.dados || 0 },
    { id: 'manutencao', label: 'Manutenção', count: estatisticas?.porCategoria?.manutencao || 0 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800'
      case 'inativa': return 'bg-gray-100 text-gray-800'
      case 'manutencao': return 'bg-blue-100 text-blue-800'
      case 'erro': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativa': return <CheckCircle className="w-4 h-4" />
      case 'inativa': return <Pause className="w-4 h-4" />
      case 'manutencao': return <Play className="w-4 h-4" />
      case 'erro': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sistema': return 'bg-blue-100 text-blue-800'
      case 'backup': return 'bg-purple-100 text-purple-800'
      case 'monitoramento': return 'bg-green-100 text-green-800'
      case 'otimizacao': return 'bg-orange-100 text-orange-800'
      case 'dados': return 'bg-red-100 text-red-800'
      case 'manutencao': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSelectTool = (id: string) => {
    setSelectedTools(prev => 
      prev.includes(id) 
        ? prev.filter(toolId => toolId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedTools.length === ferramentas.length) {
      setSelectedTools([])
    } else {
      setSelectedTools(ferramentas.map((ferramenta: FerramentaAdmin) => ferramenta.id))
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ferramentas do Sistema</h1>
          <p className="text-gray-600 mt-1">Gerencie e execute ferramentas administrativas e de manutenção.</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Terminal className="w-4 h-4" />
            <span>Console</span>
          </button>
          
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Monitor</span>
          </button>
          
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Configurações</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Ferramentas</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas?.total || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">Disponíveis no sistema</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ferramentas Ativas</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas?.ativas || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">{estatisticas?.total ? ((estatisticas.ativas / estatisticas.total) * 100).toFixed(0) : 0}%</span>
            <span className="text-gray-500 ml-1">do total</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Em Execução</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas?.emManutencao || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-blue-600">Processando agora</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Com Erro</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas?.comErro || 0}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-600">Requer atenção</span>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status do Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Cpu className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">CPU</p>
              <p className="text-lg font-semibold text-gray-900">23%</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HardDrive className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Memória</p>
              <p className="text-lg font-semibold text-gray-900">67%</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <HardDrive className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Disco</p>
              <p className="text-lg font-semibold text-gray-900">45%</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Network className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rede</p>
              <p className="text-lg font-semibold text-gray-900">12 MB/s</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Categories */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {category.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {category.count}
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
                  placeholder="Buscar ferramentas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

            {selectedTools.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {selectedTools.length} ferramenta(s) selecionada(s)
                </span>
                <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors">
                  Executar
                </button>
                <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm hover:bg-yellow-200 transition-colors">
                  Agendar
                </button>
                <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors">
                  Desativar
                </button>
              </div>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option>Todos os Status</option>
                  <option>Ativo</option>
                  <option>Inativo</option>
                  <option>Em Execução</option>
                  <option>Com Erro</option>
                </select>
                
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option>Ordenar por</option>
                  <option>Nome</option>
                  <option>Última Utilização</option>
                  <option>Uso</option>
                  <option>Status</option>
                </select>
                
                <input
                  type="date"
                  placeholder="Última utilização"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option>Uso</option>
                  <option>Alto (&gt;80%)</option>
                  <option>Médio (40-80%)</option>
                  <option>Baixo (&lt;40%)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Tools Grid */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Carregando ferramentas...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-gray-600">Erro ao carregar ferramentas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ferramentas?.map((ferramenta: FerramentaAdmin) => (
                <div key={ferramenta.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Wrench className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{ferramenta.nome}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(ferramenta.categoria)}`}>
                          {ferramenta.categoria}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedTools.includes(ferramenta.id)}
                      onChange={() => handleSelectTool(ferramenta.id)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{ferramenta.descricao}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ferramenta.status)}`}>
                      {getStatusIcon(ferramenta.status)}
                      <span className="ml-1">
                         {ferramenta.status === 'ativa' ? 'Ativo' : 
                          ferramenta.status === 'inativa' ? 'Inativo' :
                          ferramenta.status === 'manutencao' ? 'Manutenção' : 'Erro'}
                       </span>
                     </span>
                     <span className="text-xs text-gray-500">Uso: {ferramenta.uso}%</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                       <span>Última utilização</span>
                       <span>{ferramenta.ultimoUso ? new Date(ferramenta.ultimoUso).toLocaleDateString() : 'Nunca'}</span>
                     </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleExecutarFerramenta(ferramenta.id)}
                      disabled={executando || ferramenta.status !== 'ativa'}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs hover:bg-green-200 transition-colors disabled:opacity-50"
                    >
                      {executando ? 'Executando...' : 'Executar'}
                    </button>
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs hover:bg-blue-200 transition-colors">
                      Configurar
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200 transition-colors">
                      Logs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ToolsManagement