'use client'

import { useState } from 'react'
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X, 
  Eye, 
  EyeOff,
  Filter,
  Search,
  Calendar,
  Clock,
  User,
  Settings,
  Send,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Star,
  StarOff,
  Archive,

  RotateCcw,
  Download,
  Upload,
  Mail,
  MessageSquare,
  Smartphone,
  Globe,
  Zap,
  Shield,
  TrendingUp,
  Users,
  FileText,
  Image,
  Video,
  DollarSign,
  Car,
  Wrench,
  BarChart3
} from 'lucide-react'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: string
  read: boolean
  starred: boolean
  archived: boolean
  category: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  source: string
  actions?: Array<{
    label: string
    action: string
    variant: 'primary' | 'secondary' | 'danger'
  }>
}

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [expandedNotification, setExpandedNotification] = useState<string | null>(null)

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'error',
      title: 'Falha no Sistema de Backup',
      message: 'O backup automático falhou às 02:00. Verifique a configuração do servidor.',
      timestamp: '2024-01-15T02:00:00Z',
      read: false,
      starred: true,
      archived: false,
      category: 'Sistema',
      priority: 'critical',
      source: 'Sistema de Backup',
      actions: [
        { label: 'Verificar Logs', action: 'view_logs', variant: 'primary' },
        { label: 'Tentar Novamente', action: 'retry_backup', variant: 'secondary' }
      ]
    },
    {
      id: '2',
      type: 'warning',
      title: 'Limite de Armazenamento',
      message: 'O armazenamento está 85% cheio. Considere limpar arquivos antigos.',
      timestamp: '2024-01-15T08:30:00Z',
      read: false,
      starred: false,
      archived: false,
      category: 'Sistema',
      priority: 'high',
      source: 'Monitor de Recursos'
    },
    {
      id: '3',
      type: 'success',
      title: 'Nova Concessionária Aprovada',
      message: 'Toyota Luanda foi aprovada e adicionada à plataforma.',
      timestamp: '2024-01-15T10:15:00Z',
      read: true,
      starred: false,
      archived: false,
      category: 'Parceiros',
      priority: 'medium',
      source: 'Sistema de Aprovação'
    },
    {
      id: '4',
      type: 'info',
      title: 'Relatório Mensal Disponível',
      message: 'O relatório de analytics de dezembro está pronto para download.',
      timestamp: '2024-01-15T09:00:00Z',
      read: true,
      starred: true,
      archived: false,
      category: 'Relatórios',
      priority: 'low',
      source: 'Sistema de Relatórios'
    },
    {
      id: '5',
      type: 'warning',
      title: 'Campanha Publicitária Expirada',
      message: 'A campanha "Promoção Verão 2024" expirou ontem.',
      timestamp: '2024-01-14T23:59:00Z',
      read: false,
      starred: false,
      archived: false,
      category: 'Publicidade',
      priority: 'medium',
      source: 'Sistema de Campanhas'
    }
  ])

  const [newNotification, setNewNotification] = useState({
    type: 'info' as const,
    title: '',
    message: '',
    category: 'Sistema',
    priority: 'medium' as const,
    recipients: 'all'
  })

  const tabs = [
    { id: 'all', label: 'Todas', count: notifications.length },
    { id: 'unread', label: 'Não Lidas', count: notifications.filter(n => !n.read).length },
    { id: 'starred', label: 'Favoritas', count: notifications.filter(n => n.starred).length },
    { id: 'archived', label: 'Arquivadas', count: notifications.filter(n => n.archived).length }
  ]

  const categories = [
    { id: 'all', label: 'Todas as Categorias', icon: Bell },
    { id: 'Sistema', label: 'Sistema', icon: Settings },
    { id: 'Parceiros', label: 'Parceiros', icon: Users },
    { id: 'Publicidade', label: 'Publicidade', icon: DollarSign },
    { id: 'Conteúdo', label: 'Conteúdo', icon: FileText },
    { id: 'Usuários', label: 'Usuários', icon: User },
    { id: 'Relatórios', label: 'Relatórios', icon: BarChart3 }
  ]

  const priorities = [
    { id: 'all', label: 'Todas as Prioridades' },
    { id: 'critical', label: 'Crítica', color: 'text-red-600' },
    { id: 'high', label: 'Alta', color: 'text-orange-600' },
    { id: 'medium', label: 'Média', color: 'text-yellow-600' },
    { id: 'low', label: 'Baixa', color: 'text-green-600' }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes}m atrás`
    } else if (hours < 24) {
      return `${hours}h atrás`
    } else {
      const days = Math.floor(hours / 24)
      return `${days}d atrás`
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    // Tab filter
    if (activeTab === 'unread' && notification.read) return false
    if (activeTab === 'starred' && !notification.starred) return false
    if (activeTab === 'archived' && !notification.archived) return false
    if (activeTab !== 'archived' && notification.archived) return false

    // Search filter
    if (searchTerm && !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // Type filter
    if (filterType !== 'all' && notification.type !== filterType) return false

    // Priority filter
    if (filterPriority !== 'all' && notification.priority !== filterPriority) return false

    return true
  })

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const handleToggleStar = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, starred: !n.starred } : n
    ))
  }

  const handleArchive = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, archived: !n.archived } : n
    ))
  }

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'mark_read':
        setNotifications(prev => prev.map(n => 
          selectedNotifications.includes(n.id) ? { ...n, read: true } : n
        ))
        break
      case 'star':
        setNotifications(prev => prev.map(n => 
          selectedNotifications.includes(n.id) ? { ...n, starred: true } : n
        ))
        break
      case 'archive':
        setNotifications(prev => prev.map(n => 
          selectedNotifications.includes(n.id) ? { ...n, archived: true } : n
        ))
        break
      case 'delete':
        setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)))
        break
    }
    setSelectedNotifications([])
  }

  const handleCreateNotification = () => {
    const notification: Notification = {
      id: Date.now().toString(),
      type: newNotification.type,
      title: newNotification.title,
      message: newNotification.message,
      timestamp: new Date().toISOString(),
      read: false,
      starred: false,
      archived: false,
      category: newNotification.category,
      priority: newNotification.priority,
      source: 'Administrador'
    }

    setNotifications(prev => [notification, ...prev])
    setNewNotification({
      type: 'info',
      title: '',
      message: '',
      category: 'Sistema',
      priority: 'medium',
      recipients: 'all'
    })
    setShowCreateModal(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notificações e Alertas</h1>
          <p className="text-gray-600 mt-1">Gerencie todas as notificações do sistema e alertas importantes.</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Notificação</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Não Lidas</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.filter(n => !n.read).length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <EyeOff className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Críticas</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.filter(n => n.priority === 'critical').length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Favoritas</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.filter(n => n.starred).length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Star className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar notificações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Todos os Tipos</option>
                <option value="error">Erro</option>
                <option value="warning">Aviso</option>
                <option value="success">Sucesso</option>
                <option value="info">Informação</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {priorities.map((priority) => (
                  <option key={priority.id} value={priority.id}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedNotifications.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedNotifications.length} selecionadas
                </span>
                <button
                  onClick={() => handleBulkAction('mark_read')}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Marcar como Lida
                </button>
                <button
                  onClick={() => handleBulkAction('star')}
                  className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                >
                  Favoritar
                </button>
                <button
                  onClick={() => handleBulkAction('archive')}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Arquivar
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-200">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 hover:bg-gray-50 transition-colors ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes(notification.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedNotifications(prev => [...prev, notification.id])
                    } else {
                      setSelectedNotifications(prev => prev.filter(id => id !== notification.id))
                    }
                  }}
                  className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />

                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full border ${
                          getPriorityColor(notification.priority)
                        }`}>
                          {notification.priority}
                        </span>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        <span>{notification.category}</span>
                        <span>•</span>
                        <span>{notification.source}</span>
                        <span>•</span>
                        <span>{formatTimestamp(notification.timestamp)}</span>
                      </div>

                      {notification.actions && (
                        <div className="mt-3 flex items-center space-x-2">
                          {notification.actions.map((action, index) => (
                            <button
                              key={index}
                              className={`px-3 py-1 text-xs rounded transition-colors ${
                                action.variant === 'primary'
                                  ? 'bg-red-600 text-white hover:bg-red-700'
                                  : action.variant === 'danger'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleToggleStar(notification.id)}
                        className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        {notification.starred ? (
                          <Star className="w-4 h-4 fill-current text-yellow-500" />
                        ) : (
                          <StarOff className="w-4 h-4" />
                        )}
                      </button>

                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                          title="Marcar como lida"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleArchive(notification.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title={notification.archived ? "Desarquivar" : "Arquivar"}
                      >
                        {notification.archived ? (
                          <RotateCcw className="w-4 h-4" />
                        ) : (
                          <Archive className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notificação encontrada</h3>
              <p className="text-gray-600">Não há notificações que correspondam aos filtros selecionados.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Nova Notificação</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="info">Informação</option>
                  <option value="success">Sucesso</option>
                  <option value="warning">Aviso</option>
                  <option value="error">Erro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Digite o título da notificação"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem
                </label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Digite a mensagem da notificação"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={newNotification.category}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="Sistema">Sistema</option>
                    <option value="Parceiros">Parceiros</option>
                    <option value="Publicidade">Publicidade</option>
                    <option value="Conteúdo">Conteúdo</option>
                    <option value="Usuários">Usuários</option>
                    <option value="Relatórios">Relatórios</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridade
                  </label>
                  <select
                    value={newNotification.priority}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="critical">Crítica</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateNotification}
                disabled={!newNotification.title || !newNotification.message}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationsPage