'use client'

import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  FileText, 
  MapPin, 
  Phone,
  Mail,
  Globe,
  Star,
  Calendar,
  TrendingUp,
  Users,
  Car,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Award,
  Target,
  BarChart3,
  Download,
  Upload,
  Settings,
  Shield,
  Zap,
  Activity,
  DollarSign,
  Handshake,
  Loader2,
  RefreshCw,
  X,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  UserCheck,
  Building2,
  Send,
  Archive,
  Flag
} from 'lucide-react'
import { 
  useSolicitacoes, 
  useUpdateSolicitacao, 
  useDeleteSolicitacao,
  type Solicitacao 
} from '@/hooks/useSolicitacoes'

const RequestsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState('all')
  const [selectedRequests, setSelectedRequests] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportOptions, setExportOptions] = useState({
    format: 'csv',
    includeFields: {
      id: true,
      titulo: true,
      tipo: true,
      status: true,
      prioridade: true,
      solicitante: true,
      email: true,
      telefone: true,
      empresa: true,
      dataCreacao: true,
      descricao: true,
      observacoes: false
    },
    dateRange: {
      start: '',
      end: ''
    },
    statusFilter: 'all'
  })
  const [filtrosLocais, setFiltrosLocais] = useState({
    prioridade: '',
    categoria: '',
    atribuidoA: '',
    dataInicio: '',
    dataFim: ''
  })

  // Hooks para gerenciar solicitações
  const { 
    solicitacoes: requests, 
    estatisticas, 
    paginacao, 
    filtros, 
    loading, 
    error, 
    atualizarFiltros, 
    limparFiltros, 
    recarregar 
  } = useSolicitacoes({
    busca: searchTerm,
    tipo: selectedTab !== 'all' && ['partnership', 'support', 'complaint', 'suggestion'].includes(selectedTab) ? selectedTab as any : undefined,
    status: selectedTab !== 'all' && ['pending', 'in_progress', 'resolved', 'rejected'].includes(selectedTab) ? selectedTab as any : undefined,
    page: 1,
    limit: 10
  })

  const { atualizarSolicitacao, loading: updating } = useUpdateSolicitacao()
  const { excluirSolicitacao, loading: deleting } = useDeleteSolicitacao()

  // Atualizar filtros quando searchTerm ou selectedTab mudarem
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    atualizarFiltros({ busca: value, page: 1 })
  }

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab)
    const filtrosNovos: any = { page: 1 }
    
    if (tab !== 'all') {
      if (['partnership', 'support', 'complaint', 'suggestion', 'other'].includes(tab)) {
        filtrosNovos.tipo = tab
        filtrosNovos.status = undefined
      } else if (['pendente', 'em_andamento', 'resolvida', 'rejeitada'].includes(tab)) {
        filtrosNovos.status = tab
        filtrosNovos.tipo = undefined
      }
    } else {
      filtrosNovos.tipo = undefined
      filtrosNovos.status = undefined
    }
    
    atualizarFiltros(filtrosNovos)
  }

  // Função para atualizar status de uma solicitação
  const handleUpdateStatus = async (id: string, status: 'pendente' | 'em_andamento' | 'resolvida' | 'rejeitada') => {
    // Encontrar a solicitação atual para obter dados do solicitante
    const solicitacaoAtual = requests.find((s: Solicitacao) => s.id === id)
    if (!solicitacaoAtual) {
      alert('Solicitação não encontrada')
      return
    }

    const statusAnterior = solicitacaoAtual.status
    
    // Atualizar status na base de dados
    const resultado = await atualizarSolicitacao(id, { status })
    if (resultado) {
      // Enviar notificação por email
        try {
          const response = await fetch('/api/notifications/email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              solicitanteNome: solicitacaoAtual.nomeRequerente,
              solicitanteEmail: solicitacaoAtual.emailRequerente,
              tipoSolicitacao: solicitacaoAtual.tipo,
              statusAnterior: statusAnterior,
              novoStatus: status,
              observacoes: status === 'rejeitada' ? 'Solicitação rejeitada pela administração' : undefined
            })
          })

        if (response.ok) {
          console.log('✅ Notificação por email enviada com sucesso')
        } else {
          console.warn('⚠️ Falha ao enviar notificação por email')
        }
      } catch (error) {
        console.error('❌ Erro ao enviar notificação por email:', error)
      }

      // Recarregar dados
      recarregar()
    }
  }

  // Função para excluir uma solicitação
  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta solicitação?')) {
      const sucesso = await excluirSolicitacao(id)
      if (sucesso) {
        recarregar()
      }
    }
  }

  const handleViewRequest = (request: Solicitacao) => {
    // Implementar modal ou página de visualização
    alert(`Visualizando solicitação: ${request.titulo}\n\nDescrição: ${request.descricao}\n\nStatus: ${getStatusText(request.status)}\nPrioridade: ${getPriorityText(request.prioridade)}`)
  }

  const handleEditRequest = (request: Solicitacao) => {
    // Implementar modal ou página de edição
    const novoStatus = prompt(`Alterar status da solicitação "${request.titulo}":\n\nStatus atual: ${getStatusText(request.status)}\n\nNovo status (pendente/em_andamento/resolvida/rejeitada):`, request.status)
    
    if (novoStatus && ['pendente', 'em_andamento', 'resolvida', 'rejeitada'].includes(novoStatus)) {
      handleUpdateStatus(request.id, novoStatus as 'pendente' | 'em_andamento' | 'resolvida' | 'rejeitada')
    } else if (novoStatus) {
      alert('Status inválido. Use: pendente, em_andamento, resolvida ou rejeitada')
    }
  }

  const handleBulkStatusUpdate = async (novoStatus: 'pendente' | 'em_andamento' | 'resolvida' | 'rejeitada') => {
    if (selectedRequests.length === 0) {
      alert('Selecione pelo menos uma solicitação')
      return
    }

    if (confirm(`Tem certeza que deseja alterar o status de ${selectedRequests.length} solicitação(ões) para "${getStatusText(novoStatus)}"?`)) {
      for (const id of selectedRequests) {
        await atualizarSolicitacao(id, { status: novoStatus })
      }
      setSelectedRequests([])
      recarregar()
    }
  }

  const handleBulkDelete = async () => {
    if (selectedRequests.length === 0) {
      alert('Selecione pelo menos uma solicitação')
      return
    }

    if (confirm(`Tem certeza que deseja excluir ${selectedRequests.length} solicitação(ões)? Esta ação não pode ser desfeita.`)) {
      for (const id of selectedRequests) {
        await excluirSolicitacao(id)
      }
      setSelectedRequests([])
      recarregar()
    }
  }

  // Funções de exportação melhoradas
  const handleExportSelected = () => {
    if (selectedRequests.length === 0) {
      alert('Selecione pelo menos uma solicitação para exportar.')
      return
    }
    setShowExportModal(true)
  }

  const handleExportAll = () => {
    setShowExportModal(true)
  }

  const processExport = () => {
    const dataToExport = selectedRequests.length > 0 
      ? requests.filter(request => selectedRequests.includes(request.id))
      : getFilteredData()

    if (exportOptions.format === 'csv') {
      const csvContent = generateCSV(dataToExport)
      downloadFile(csvContent, 'text/csv', 'csv')
    } else if (exportOptions.format === 'json') {
      const jsonContent = generateJSON(dataToExport)
      downloadFile(jsonContent, 'application/json', 'json')
    } else if (exportOptions.format === 'excel') {
      const excelContent = generateExcel(dataToExport)
      downloadFile(excelContent, 'application/vnd.ms-excel', 'xls')
    }

    setShowExportModal(false)
    setSelectedRequests([])
  }

  const getFilteredData = () => {
    let filtered = [...requests]

    // Filtrar por data
    if (exportOptions.dateRange.start) {
      filtered = filtered.filter(r => new Date(r.criadoEm) >= new Date(exportOptions.dateRange.start))
    }
    if (exportOptions.dateRange.end) {
      filtered = filtered.filter(r => new Date(r.criadoEm) <= new Date(exportOptions.dateRange.end))
    }

    // Filtrar por status
    if (exportOptions.statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === exportOptions.statusFilter)
    }

    return filtered
  }

  const generateCSV = (data: Solicitacao[]) => {
    const fieldMap = {
      id: 'ID',
      titulo: 'Título',
      tipo: 'Tipo',
      status: 'Status',
      prioridade: 'Prioridade',
      solicitante: 'Solicitante',
      email: 'Email',
      telefone: 'Telefone',
      empresa: 'Empresa',
      dataCreacao: 'Data de Criação',
      descricao: 'Descrição',
      observacoes: 'Observações'
    }

    const selectedFields = Object.keys(exportOptions.includeFields).filter(
      field => exportOptions.includeFields[field as keyof typeof exportOptions.includeFields]
    )

    const headers = selectedFields.map(field => fieldMap[field as keyof typeof fieldMap])
    const csvRows = [headers.join(',')]
    
    data.forEach(request => {
      const row = selectedFields.map(field => {
        switch (field) {
          case 'id': return request.id
          case 'titulo': return `"${request.titulo}"`
          case 'tipo': return request.tipo
          case 'status': return request.status
          case 'prioridade': return request.prioridade
          case 'solicitante': return `"${request.nomeRequerente}"`
          case 'email': return request.emailRequerente
          case 'telefone': return request.telefoneRequerente || ''
          case 'empresa': return `"${request.empresa || ''}"`
          case 'dataCreacao': return new Date(request.criadoEm).toLocaleDateString('pt-BR')
          case 'descricao': return `"${request.descricao.replace(/"/g, '""')}"`
          case 'observacoes': return `"${(request.notas || []).join('; ').replace(/"/g, '""')}"`
          default: return ''
        }
      })
      csvRows.push(row.join(','))
    })
    
    return csvRows.join('\n')
  }

  const generateJSON = (data: Solicitacao[]) => {
    const selectedFields = Object.keys(exportOptions.includeFields).filter(
      field => exportOptions.includeFields[field as keyof typeof exportOptions.includeFields]
    )

    const filteredData = data.map(request => {
      const filtered: any = {}
      selectedFields.forEach(field => {
        switch (field) {
          case 'id': filtered.id = request.id; break
          case 'titulo': filtered.titulo = request.titulo; break
          case 'tipo': filtered.tipo = request.tipo; break
          case 'status': filtered.status = request.status; break
          case 'prioridade': filtered.prioridade = request.prioridade; break
          case 'solicitante': filtered.solicitante = request.nomeRequerente; break
          case 'email': filtered.email = request.emailRequerente; break
          case 'telefone': filtered.telefone = request.telefoneRequerente; break
          case 'empresa': filtered.empresa = request.empresa; break
          case 'dataCreacao': filtered.dataCreacao = request.criadoEm; break
          case 'descricao': filtered.descricao = request.descricao; break
          case 'observacoes': filtered.observacoes = request.notas || []; break
        }
      })
      return filtered
    })

    return JSON.stringify(filteredData, null, 2)
  }

  const generateExcel = (data: Solicitacao[]) => {
    const selectedFields = Object.keys(exportOptions.includeFields).filter(
      field => exportOptions.includeFields[field as keyof typeof exportOptions.includeFields]
    )

    const fieldMap = {
      id: 'ID',
      titulo: 'Título',
      tipo: 'Tipo',
      status: 'Status',
      prioridade: 'Prioridade',
      solicitante: 'Solicitante',
      email: 'Email',
      telefone: 'Telefone',
      empresa: 'Empresa',
      dataCreacao: 'Data de Criação',
      descricao: 'Descrição',
      observacoes: 'Observações'
    }

    let content = '<table border="1">'
    
    // Cabeçalho
    content += '<tr>'
    selectedFields.forEach(field => {
      content += `<th>${fieldMap[field as keyof typeof fieldMap]}</th>`
    })
    content += '</tr>'
    
    // Dados
    data.forEach(request => {
      content += '<tr>'
      selectedFields.forEach(field => {
        let value = ''
        switch (field) {
          case 'id': value = request.id; break
          case 'titulo': value = request.titulo; break
          case 'tipo': value = request.tipo; break
          case 'status': value = request.status; break
          case 'prioridade': value = request.prioridade; break
          case 'solicitante': value = request.nomeRequerente; break
          case 'email': value = request.emailRequerente; break
          case 'telefone': value = request.telefoneRequerente || ''; break
          case 'empresa': value = request.empresa || ''; break
          case 'dataCreacao': value = new Date(request.criadoEm).toLocaleDateString('pt-BR'); break
          case 'descricao': value = request.descricao; break
          case 'observacoes': value = (request.notas || []).join('; '); break
        }
        content += `<td>${value}</td>`
      })
      content += '</tr>'
    })
    
    content += '</table>'
    return content
  }

  const downloadFile = (content: string, mimeType: string, extension: string) => {
    const timestamp = new Date().toISOString().split('T')[0]
    const prefix = selectedRequests.length > 0 ? 'solicitacoes_selecionadas' : 'solicitacoes_exportacao'
    const filename = `${prefix}_${timestamp}.${extension}`
    
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800'
      case 'em_andamento': return 'bg-blue-100 text-blue-800'
      case 'resolvida': return 'bg-green-100 text-green-800'
      case 'rejeitada': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente'
      case 'em_andamento': return 'Em Andamento'
      case 'resolvida': return 'Resolvida'
      case 'rejeitada': return 'Rejeitada'
      default: return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'bg-red-100 text-red-800'
      case 'alta': return 'bg-orange-100 text-orange-800'
      case 'media': return 'bg-yellow-100 text-yellow-800'
      case 'baixa': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'Urgente'
      case 'alta': return 'Alta'
      case 'media': return 'Média'
      case 'baixa': return 'Baixa'
      default: return priority
    }
  }

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'parceria': return <Handshake className="w-4 h-4" />
      case 'suporte': return <MessageSquare className="w-4 h-4" />
      case 'reclamacao': return <Flag className="w-4 h-4" />
      case 'sugestao': return <Target className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getTypeText = (tipo: string) => {
    switch (tipo) {
      case 'parceria': return 'Parceria'
      case 'suporte': return 'Suporte'
      case 'reclamacao': return 'Reclamação'
      case 'sugestao': return 'Sugestão'
      case 'outros': return 'Outros'
      default: return tipo
    }
  }

  const handleSelectRequest = (id: string) => {
    setSelectedRequests(prev =>
      prev.includes(id)
        ? prev.filter(rId => rId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedRequests.length === requests.length) {
      setSelectedRequests([])
    } else {
      setSelectedRequests(requests.map(r => r.id))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-red-600" />
          <span className="text-gray-600">Carregando solicitações...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FileText className="w-8 h-8 text-red-600 mr-3" />
              Solicitações
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie todas as solicitações, reclamações e sugestões dos usuários
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleExportAll}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Todas</span>
            </button>

          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {estatisticas?.pendentes || 0}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Em Andamento</p>
              <p className="text-2xl font-bold text-blue-600">
                {estatisticas?.emAndamento || 0}
              </p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolvidas</p>
              <p className="text-2xl font-bold text-green-600">
                {estatisticas?.resolvidas || 0}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Parcerias</p>
              <p className="text-2xl font-bold text-purple-600">
                {estatisticas?.porTipo?.parceria || 0}
              </p>
            </div>
            <Handshake className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar solicitações..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Painel de Filtros Expandido */}
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg mt-6 border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                  <select
                    value={filtrosLocais.prioridade || ''}
                    onChange={(e) => setFiltrosLocais({...filtrosLocais, prioridade: e.target.value || ''})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Todas</option>
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    value={filtrosLocais.categoria || ''}
                    onChange={(e) => setFiltrosLocais({...filtrosLocais, categoria: e.target.value || ''})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Todas</option>
                    <option value="parceria">Parcerias</option>
                    <option value="suporte">Suporte</option>
                    <option value="reclamacao">Reclamação</option>
                    <option value="sugestao">Sugestão</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Atribuído a</label>
                  <input
                    type="text"
                    placeholder="Email do responsável"
                    value={filtrosLocais.atribuidoA || ''}
                    onChange={(e) => setFiltrosLocais({...filtrosLocais, atribuidoA: e.target.value || ''})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                  <input
                    type="date"
                    value={filtrosLocais.dataInicio || ''}
                    onChange={(e) => setFiltrosLocais({...filtrosLocais, dataInicio: e.target.value || ''})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setFiltrosLocais({
                    prioridade: '',
                    categoria: '',
                    atribuidoA: '',
                    dataInicio: '',
                    dataFim: ''
                  })}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Limpar Filtros
                </button>
                <button
                  onClick={() => {
                    setShowFilters(false)
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-1 mt-6">
            {[
              { key: 'all', label: 'Todas', count: estatisticas?.total || 0 },
              { key: 'pendente', label: 'Pendentes', count: estatisticas?.pendentes || 0 },
              { key: 'em_andamento', label: 'Em Andamento', count: estatisticas?.emAndamento || 0 },
              { key: 'resolvida', label: 'Resolvidas', count: estatisticas?.resolvidas || 0 },
              { key: 'parceria', label: 'Parcerias', count: estatisticas?.porTipo?.parceria || 0 },
              { key: 'suporte', label: 'Suporte', count: estatisticas?.porTipo?.suporte || 0 },
              { key: 'reclamacao', label: 'Reclamações', count: estatisticas?.porTipo?.reclamacao || 0 }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTab === tab.key
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedRequests.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedRequests.length} solicitação(ões) selecionada(s)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkStatusUpdate('em_andamento')}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Marcar Em Andamento
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('resolvida')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
              >
                Marcar Resolvida
              </button>
              <button
                onClick={handleExportSelected}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors flex items-center space-x-1"
              >
                <Download className="w-3 h-3" />
                <span>Exportar</span>
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar solicitações</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Tentar Novamente
              </button>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma solicitação encontrada</h3>
              <p className="text-gray-600">Tente ajustar os filtros ou aguarde novas solicitações.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRequests.length === requests.length && requests.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solicitação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solicitante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRequests.includes(request.id)}
                        onChange={() => handleSelectRequest(request.id)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900 truncate">{request.titulo}</div>
                        <div className="text-sm text-gray-500 truncate">{request.descricao}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(request.tipo)}
                        <span className="text-sm text-gray-900">{getTypeText(request.tipo)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {['pendente', 'em_andamento', 'resolvida', 'rejeitada'].map((status) => {
                          const isActive = request.status === status
                          let buttonClass = 'px-2 py-1 text-xs font-medium rounded-full transition-colors '
                          
                          if (isActive) {
                            switch (status) {
                              case 'pendente':
                                buttonClass += 'bg-yellow-500 text-white'
                                break
                              case 'em_andamento':
                                buttonClass += 'bg-blue-500 text-white'
                                break
                              case 'resolvida':
                                buttonClass += 'bg-green-500 text-white'
                                break
                              case 'rejeitada':
                                buttonClass += 'bg-red-500 text-white'
                                break
                            }
                          } else {
                            buttonClass += 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }
                          
                          return (
                            <button
                              key={status}
                              onClick={() => handleUpdateStatus(request.id, status as 'pendente' | 'em_andamento' | 'resolvida' | 'rejeitada')}
                              className={buttonClass}
                              title={`Alterar para ${getStatusText(status)}`}
                            >
                              {getStatusText(status)}
                            </button>
                          )
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.prioridade)}`}>
                        {getPriorityText(request.prioridade)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <div>
                         <div className="text-sm font-medium text-gray-900">{request.nomeRequerente}</div>
                         <div className="text-sm text-gray-500">{request.emailRequerente}</div>
                         {request.empresa && (
                           <div className="text-sm text-gray-500">{request.empresa}</div>
                         )}
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <div className="text-sm text-gray-900">
                         {new Date(request.criadoEm).toLocaleDateString('pt-BR')}
                       </div>
                       <div className="text-sm text-gray-500">
                         {new Date(request.criadoEm).toLocaleTimeString('pt-BR', { 
                           hour: '2-digit', 
                           minute: '2-digit' 
                         })}
                       </div>
                     </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleViewRequest(request)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditRequest(request)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(request.id, 'em_andamento')}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Marcar como Em Andamento"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(request.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Excluir"
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
      </div>

      {/* Modal de Exportação */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Exportar Solicitações
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Formato de Exportação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formato de Exportação
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'csv', label: 'CSV', icon: FileText },
                    { value: 'json', label: 'JSON', icon: Settings },
                    { value: 'excel', label: 'Excel', icon: Download }
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setExportOptions(prev => ({ ...prev, format: value }))}
                      className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                        exportOptions.format === value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Campos para Incluir */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campos para Incluir
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries({
                    id: 'ID',
                    titulo: 'Título',
                    tipo: 'Tipo',
                    status: 'Status',
                    prioridade: 'Prioridade',
                    solicitante: 'Solicitante',
                    email: 'Email',
                    telefone: 'Telefone',
                    empresa: 'Empresa',
                    dataCreacao: 'Data de Criação',
                    descricao: 'Descrição',
                    observacoes: 'Observações'
                  }).map(([key, label]) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeFields[key as keyof typeof exportOptions.includeFields]}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          includeFields: {
                            ...prev.includeFields,
                            [key]: e.target.checked
                          }
                        }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtros de Data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período (Opcional)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Data Início</label>
                    <input
                      type="date"
                      value={exportOptions.dateRange.start}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Data Fim</label>
                    <input
                      type="date"
                      value={exportOptions.dateRange.end}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Filtro de Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por Status
                </label>
                <select
                  value={exportOptions.statusFilter}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, statusFilter: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos os Status</option>
                  <option value="pendente">Pendente</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="resolvida">Resolvida</option>
                  <option value="rejeitada">Rejeitada</option>
                </select>
              </div>

              {/* Resumo */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Resumo da Exportação</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Formato: {exportOptions.format.toUpperCase()}</p>
                  <p>• Campos selecionados: {Object.values(exportOptions.includeFields).filter(Boolean).length}</p>
                  <p>• Registros: {selectedRequests.length > 0 ? `${selectedRequests.length} selecionados` : 'Todos os registros'}</p>
                  {exportOptions.dateRange.start && (
                    <p>• Período: {new Date(exportOptions.dateRange.start).toLocaleDateString('pt-BR')} - {exportOptions.dateRange.end ? new Date(exportOptions.dateRange.end).toLocaleDateString('pt-BR') : 'Hoje'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={processExport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RequestsManagement