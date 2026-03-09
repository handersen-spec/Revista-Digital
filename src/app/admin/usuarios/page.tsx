'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Archive
} from 'lucide-react'
import { useContatos, useContatosStats, type MensagemContato, useResponderContato } from '@/hooks/useContatos'
import RichTextEditor from '@/components/ui/RichTextEditor'

export default function UsuariosAdmin() {
  const [isMounted, setIsMounted] = useState(false)
  const [selectedTab, setSelectedTab] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMessage, setSelectedMessage] = useState<MensagemContato | null>(null)
  const [replyHtml, setReplyHtml] = useState('')

  // Hooks para dados da API
  const { 
    mensagens, 
    total, 
    totalPages, 
    hasNext, 
    hasPrev, 
    loading, 
    error, 
    buscarContatos 
  } = useContatos({
    status: selectedTab === 'todos' ? undefined : selectedTab,
    categoria: selectedCategory || undefined,
    prioridade: selectedPriority || undefined,
    page: currentPage,
    limit: 10,
    orderBy: 'dataEnvio',
    order: 'desc'
  })

  const { stats } = useContatosStats()
  const { responderMensagem, loading: replying, error: replyError } = useResponderContato()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    buscarContatos({
      status: selectedTab === 'todos' ? undefined : selectedTab,
      categoria: selectedCategory || undefined,
      prioridade: selectedPriority || undefined,
      page: currentPage
    })
  }, [selectedTab, selectedCategory, selectedPriority, currentPage])

  const handleSearch = () => {
    // A API atual não suporta busca por texto, mas podemos filtrar localmente
    setCurrentPage(1)
    buscarContatos({
      status: selectedTab === 'todos' ? undefined : selectedTab,
      categoria: selectedCategory || undefined,
      prioridade: selectedPriority || undefined,
      page: 1
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'novo':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'lido':
        return <Eye className="h-4 w-4 text-blue-500" />
      case 'respondido':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'arquivado':
        return <Archive className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case 'novo':
        return `${baseClasses} bg-red-100 text-red-800`
      case 'lido':
        return `${baseClasses} bg-blue-100 text-blue-800`
      case 'respondido':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'arquivado':
        return `${baseClasses} bg-gray-100 text-gray-800`
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`
    }
  }

  const getPriorityBadge = (prioridade: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    switch (prioridade) {
      case 'alta':
        return `${baseClasses} bg-red-100 text-red-800`
      case 'media':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case 'baixa':
        return `${baseClasses} bg-green-100 text-green-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const getCategoryLabel = (categoria: string) => {
    const labels = {
      geral: 'Geral',
      suporte: 'Suporte',
      parceria: 'Parceria',
      publicidade: 'Publicidade',
      feedback: 'Feedback'
    }
    return labels[categoria as keyof typeof labels] || categoria
  }

  // Filtrar mensagens localmente por termo de busca se necessário
  const filteredMessages = searchTerm 
    ? mensagens.filter(msg => 
        msg.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.assunto.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mensagens

  if (!isMounted) {
    return <div>Carregando...</div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Contatos</h1>
          <p className="text-gray-600">Gerir mensagens e solicitações de contato</p>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Mensagens</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total ?? 0}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Novas</p>
                <p className="text-2xl font-bold text-red-600">{stats?.porStatus?.novo ?? 0}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Respondidas</p>
                <p className="text-2xl font-bold text-green-600">{stats?.porStatus?.respondido ?? 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alta Prioridade</p>
                <p className="text-2xl font-bold text-orange-600">{stats?.porPrioridade?.alta ?? 0}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      )}

      {/* Abas e Filtros no mesmo container (estilo Ferramentas) */}

      {/* Abas */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'todos', label: 'Todas', count: stats?.total || 0 },
              { id: 'novo', label: 'Novas', count: stats?.porStatus.novo || 0 },
              { id: 'lido', label: 'Lidas', count: stats?.porStatus.lido || 0 },
              { id: 'respondido', label: 'Respondidas', count: stats?.porStatus.respondido || 0 },
              { id: 'arquivado', label: 'Arquivadas', count: stats?.porStatus.arquivado || 0 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedTab(tab.id)
                  setCurrentPage(1)
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Filtros e Busca (estilo Ferramentas) */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou assunto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-64"
                />
              </div>

              <button
                onClick={handleSearch}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filtrar</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Todas as categorias</option>
                <option value="geral">Geral</option>
                <option value="suporte">Suporte</option>
                <option value="parceria">Parceria</option>
                <option value="publicidade">Publicidade</option>
                <option value="feedback">Feedback</option>
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                <option value="">Todas as prioridades</option>
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout estilo email: lista à esquerda + leitor/resposta à direita */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando mensagens...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600">{error}</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Nenhuma mensagem encontrada</p>
            </div>
          ) : (
            <div className="lg:col-span-1 space-y-2">
              {filteredMessages.map((mensagem) => (
                <div
                  key={mensagem.id}
                  className={`rounded-lg p-4 shadow-sm cursor-pointer overflow-hidden bg-white ${selectedMessage?.id === mensagem.id ? 'ring-1 ring-red-200 bg-red-50' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelectedMessage(mensagem)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-2">
                        {getStatusIcon(mensagem.status)}
                        <h3 className="font-medium text-gray-900">{mensagem.nome}</h3>
                        <span className={getStatusBadge(mensagem.status)}>
                          {mensagem.status}
                        </span>
                        <span className={getPriorityBadge(mensagem.prioridade)}>
                          {mensagem.prioridade}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          {getCategoryLabel(mensagem.categoria)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">{mensagem.assunto}</p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-gray-500 break-words">
                        <div className="flex items-center gap-1 min-w-0">
                          <Mail className="h-4 w-4" />
                          <span className="break-all truncate max-w-[12rem]" title={mensagem.email}>{mensagem.email}</span>
                        </div>
                        {mensagem.telefone && (
                          <div className="flex items-center gap-1 min-w-0">
                            <Phone className="h-4 w-4" />
                            <span className="break-all truncate max-w-[10rem]" title={mensagem.telefone}>{mensagem.telefone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 min-w-0">
                          <Calendar className="h-4 w-4" />
                          {new Date(mensagem.dataEnvio).toLocaleDateString('pt-PT')}
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 mt-2 line-clamp-2 break-words max-w-full">{mensagem.mensagem}</p>
                      {mensagem.resposta && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Resposta:</strong> {mensagem.resposta}
                          </p>
                          {mensagem.dataResposta && (
                            <p className="text-xs text-blue-600 mt-1">
                              Respondido em {new Date(mensagem.dataResposta).toLocaleDateString('pt-PT')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Painel de leitura e resposta */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 min-h-[420px]">
              {!selectedMessage ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Selecione uma mensagem na lista para ler e responder.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{selectedMessage.assunto}</h2>
                      <p className="text-sm text-gray-600">De: {selectedMessage.nome} &lt;{selectedMessage.email}&gt;</p>
                      {selectedMessage.telefone && (
                        <p className="text-sm text-gray-600">Telefone: {selectedMessage.telefone}</p>
                      )}
                      <p className="text-xs text-gray-500">Enviado em {new Date(selectedMessage.dataEnvio).toLocaleString('pt-PT')}</p>
                    </div>
                    <span className={getStatusBadge(selectedMessage.status)}>{selectedMessage.status}</span>
                  </div>

                  <div className="prose max-w-none text-sm text-gray-800 bg-gray-50 p-4 rounded whitespace-pre-wrap break-words max-h-[280px] overflow-auto">
                    {selectedMessage.mensagem}
                  </div>

                  {selectedMessage.resposta && (
                    <div className="bg-blue-50 p-4 rounded">
                      <div className="text-sm text-blue-900">
                        <strong>Sua resposta:</strong>
                        <div className="mt-2 prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedMessage.resposta }} />
                      </div>
                      {selectedMessage.dataResposta && (
                        <p className="text-xs text-blue-700 mt-1">Respondido em {new Date(selectedMessage.dataResposta).toLocaleString('pt-PT')}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Responder</label>
                    <RichTextEditor value={replyHtml} onChange={setReplyHtml} />
                    {replyError && <p className="text-sm text-red-600">{replyError}</p>}
                    <div className="flex justify-end">
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        disabled={replying || !replyHtml.replace(/<[^>]*>/g, '').trim() || !selectedMessage}
                        onClick={async () => {
                          if (!selectedMessage) return
                          try {
                            const resp = await responderMensagem(selectedMessage.id, replyHtml.trim())
                            setReplyHtml('')
                            // Atualiza item selecionado com retorno da API
                            if (resp?.data) {
                              setSelectedMessage(resp.data)
                            }
                            // Refresca lista para refletir alterações
                            await buscarContatos({
                              status: selectedTab === 'todos' ? undefined : selectedTab,
                              categoria: selectedCategory || undefined,
                              prioridade: selectedPriority || undefined,
                              page: currentPage
                            })
                          } catch (e) {}
                        }}
                      >
                        {replying ? 'Enviando...' : 'Enviar'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Mostrando {((currentPage - 1) * 10) + 1} a {Math.min(currentPage * 10, total)} de {total} mensagens
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!hasPrev}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-700">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!hasNext}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  )
}