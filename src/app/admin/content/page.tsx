'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { useArtigos } from '@/hooks/useArtigos'
import { useNoticias } from '@/hooks/useNoticias'
import { useVideos } from '@/hooks/useVideos'
import { useTestDrives } from '@/hooks/useTestDrives'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  Tag,
  FileText,
  Video,
  Car,
  Newspaper,
  TrendingUp,
  Clock,
  Star,
  MessageSquare,
  Share2,
  Heart,
  BarChart3,
  Download,
  Upload,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import ArticleForm from '@/components/admin/ArticleForm'
import NewsForm from '@/components/admin/NewsForm'
import VideoForm from '@/components/admin/VideoForm'
import TestDriveForm from '@/components/admin/TestDriveForm'
import { slugify } from '@/lib/slugify'

interface ContentItem {
  id: string
  slug?: string
  title: string
  type: 'article' | 'news' | 'video' | 'test-drive'
  status: 'published' | 'draft' | 'scheduled' | 'archived'
  author: string
  category: string
  publishDate: string
  views: number
  likes: number
  comments: number
  thumbnail: string
  featured: boolean
}

const ContentManagementContent = () => {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  
  const [selectedTab, setSelectedTab] = useState(tabParam || 'all')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  
  // Estados para filtros
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [authorFilter, setAuthorFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  
  // Estados para controlar os formulários
  const [isArticleFormOpen, setIsArticleFormOpen] = useState(false)
  const [isNewsFormOpen, setIsNewsFormOpen] = useState(false)
  const [isVideoFormOpen, setIsVideoFormOpen] = useState(false)
  const [isTestDriveFormOpen, setIsTestDriveFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importedItems, setImportedItems] = useState<ContentItem[]>([])

  // Função para mapear ContentItem para ArticleData
  const mapContentItemToArticleData = (item: ContentItem) => {
    return {
      id: item.id,
      categoria: item.category,
      titulo: item.title,
      slug: item.slug || item.title.toLowerCase().replace(/\s+/g, '-'),
      resumo: '', // Será preenchido quando tivermos dados reais
      conteudo: '', // Será preenchido quando tivermos dados reais
      galeria: [],
      autor: item.author,
      status: item.status === 'published' ? 'publicado' : 
              item.status === 'draft' ? 'rascunho' : 
              item.status === 'scheduled' ? 'agendado' : 'rascunho',
      dataPublicacao: item.publishDate,
      destaque: item.featured,
      tags: []
    }
  }

  // Sincronizar aba com parâmetros da URL
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['all', 'article', 'news', 'video', 'test-drive'].includes(tabParam)) {
      setSelectedTab(tabParam)
    }
    const searchParam = searchParams.get('search')
    if (typeof searchParam === 'string') {
      setSearchTerm(searchParam)
    }
  }, [searchParams])

  // Debounce do termo de busca para performance e UX
  useEffect(() => {
    const h = setTimeout(() => setDebouncedSearchTerm(searchTerm), 250)
    return () => clearTimeout(h)
  }, [searchTerm])

  // Reset de seleção ao mudar filtros ou busca
  useEffect(() => {
    setSelectedItems([])
  }, [selectedTab, searchTerm, statusFilter, categoryFilter, authorFilter, dateFilter])

  // Função para formatação consistente de números
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }
  // Carregar dados reais das APIs
  const { artigos, loading: loadingArtigos, error: errorArtigos, refetch: refetchArtigos } = useArtigos({ limit: 50 })
  const { noticias, loading: loadingNoticias, error: errorNoticias, refetch: refetchNoticias } = useNoticias({ limit: 50 })
  const { videos, loading: loadingVideos, error: errorVideos, refetch: refetchVideos } = useVideos({ limit: 50 })
  const { data: testDrivesData, loading: loadingTestDrives, error: errorTestDrives } = useTestDrives({ limit: 50 })
  const testDrives = testDrivesData?.testDrives || []

  // Mapear dados das APIs para ContentItem
  const mapArtigoToContentItem = (a: any): ContentItem => ({
    id: String(a.id || a.slug),
    slug: a.slug,
    title: a.titulo,
    type: 'article',
    status: a.status || 'published',
    author: a.autor,
    category: a.categoria,
    publishDate: a.dataPublicacao || a.data,
    views: 0,
    likes: 0,
    comments: 0,
    thumbnail: a.imagem || '/api/placeholder/300/200',
    featured: false
  })

  // Exportação simples dos itens filtrados em JSON
  const [showExportMenu, setShowExportMenu] = useState(false)

  const downloadFile = (content: string, mimeType: string, extension: string, prefix: string) => {
    const timestamp = new Date().toISOString().split('T')[0]
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

  const generateCSV = (data: ContentItem[]) => {
    const headers = ['ID','Slug','Título','Tipo','Status','Autor','Categoria','Data','Visualizações','Likes','Comentários','Destaque']
    const rows = data.map(item => [
      item.id,
      item.slug || '',
      `"${(item.title || '').replace(/"/g,'""')}"`,
      item.type,
      item.status,
      `"${(item.author || '').replace(/"/g,'""')}"`,
      `"${(item.category || '').replace(/"/g,'""')}"`,
      item.publishDate,
      String(item.views ?? 0),
      String(item.likes ?? 0),
      String(item.comments ?? 0),
      item.featured ? 'sim' : 'não'
    ].join(','))
    return [headers.join(','), ...rows].join('\n')
  }

  const generateExcel = (data: ContentItem[]) => {
    let table = '<table border="1">'
    table += '<tr>' + ['ID','Slug','Título','Tipo','Status','Autor','Categoria','Data','Visualizações','Likes','Comentários','Destaque']
      .map(h => `<th>${h}</th>`).join('') + '</tr>'
    data.forEach(item => {
      table += '<tr>' + [
        item.id,
        item.slug || '',
        item.title || '',
        item.type,
        item.status,
        item.author || '',
        item.category || '',
        item.publishDate || '',
        String(item.views ?? 0),
        String(item.likes ?? 0),
        String(item.comments ?? 0),
        item.featured ? 'sim' : 'não'
      ].map(v => `<td>${v}</td>`).join('') + '</tr>'
    })
    table += '</table>'
    return table
  }

  const generateJSON = (data: ContentItem[]) => JSON.stringify(data, null, 2)

  const dataForExport = () => {
    const base = filteredItems
    if (selectedItems.length > 0) {
      return base.filter(i => selectedItems.includes(i.id))
    }
    return base
  }

  const handleExportFormat = (format: 'csv' | 'excel' | 'json') => {
    try {
      const data = dataForExport()
      if (format === 'csv') {
        const csv = generateCSV(data)
        downloadFile(csv, 'text/csv', 'csv', 'conteudo')
      } else if (format === 'excel') {
        const xls = generateExcel(data)
        downloadFile(xls, 'application/vnd.ms-excel', 'xls', 'conteudo')
      } else {
        const json = generateJSON(data)
        downloadFile(json, 'application/json', 'json', 'conteudo')
      }
      setShowExportMenu(false)
    } catch (err) {
      console.error('Erro ao exportar conteúdo:', err)
      alert('Falha ao exportar conteúdo. Veja o console para detalhes.')
    }
  }

  // Importação básica via arquivo JSON (apenas leitura/preview)
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const items: ContentItem[] = Array.isArray(parsed) ? parsed : []
      setImportedItems(items)
      alert(`Importação carregada: ${items.length} item(s) lido(s). (Pré-visualização)`) 
    } catch (err: any) {
      console.error('Erro ao importar conteúdo:', err)
      alert(`Arquivo inválido: ${err?.message || 'erro desconhecido'}`)
    } finally {
      // reset input para permitir reimportar o mesmo arquivo
      e.target.value = ''
    }
  }

  // Mapear objeto completo de Artigo (da API) para dados do ArticleForm
  const mapArtigoToArticleFormData = (a: any) => {
    const statusPt = a.status === 'published' ? 'publicado'
                    : a.status === 'draft' ? 'rascunho'
                    : a.status === 'scheduled' ? 'agendado'
                    : ''

    const base: any = {
      id: String(a.id || a.slug),
      categoria: a.categoria || '',
      titulo: a.titulo || '',
      slug: a.slug || '',
      resumo: a.resumo || '',
      conteudo: a.conteudo || '',
      galeria: Array.isArray(a.galeria) ? a.galeria.map((g: any) => ({
        id: String(g.id || ''),
        url: g.url || '',
        alt: g.alt || '',
        legenda: g.legenda || ''
      })) : [],
      autor: a.autor || 'Admin',
      status: statusPt,
      dataPublicacao: a.dataPublicacao || a.data || '',
      destaque: !!a.destaque,
      tags: Array.isArray(a.tags) ? a.tags : (a.tags ? [a.tags] : []),
      tempoLeitura: a.tempoLeitura || ''
    }

    // Mapear especificações conforme categoria
    if (a.categoria === 'Ensaio' && a.specs) {
      base.especificacoesEnsaio = {
        tipoMotor: a.specs.tipoMotor || '',
        cilindrada: a.specs.cilindrada || '',
        potencia: a.specs.potencia || '',
        binarioMaximo: a.specs.binarioMaximo || '',
        transmissao: a.specs.transmissao || '',
        velocidadeMaxima: a.specs.velocidadeMaxima || '',
        aceleracao: a.specs.aceleracao || '',
        consumoWLTP: a.specs.consumoWLTP || '',
        emissaoCO2WLTP: a.specs.emissaoCO2WLTP || '',
        dimensoes: a.specs.dimensoes || '',
        pneus: a.specs.pneus || '',
        peso: a.specs.peso || '',
        bagageira: a.specs.bagageira || ''
      }
    }

    if (a.categoria === 'Superdesportivo' && a.specs) {
      base.especificacoesSuperdesportivo = {
        tipoMotor: a.specs.tipoMotor || '',
        cilindrada: a.specs.cilindrada || '',
        potencia: a.specs.potencia || '',
        velocidadeMaxima: a.specs.velocidadeMaxima || '',
        aceleracao: a.specs.aceleracao || '',
        pneus: a.specs.pneus || '',
        bagageira: a.specs.bagageira || '',
        dataLancamento: a.specs.dataLancamento || ''
      }
    }

    return base
  }

  const mapNoticiaToContentItem = (n: any): ContentItem => ({
    id: String(n.id || n.slug),
    slug: n.slug,
    title: n.titulo,
    type: 'news',
    status: n.status || 'published',
    author: n.autor,
    category: n.categoria,
    publishDate: n.dataPublicacao,
    views: n.visualizacoes || 0,
    likes: 0,
    comments: 0,
    thumbnail: n.imagem || '/api/placeholder/300/200',
    featured: !!n.destaque
  })

  const mapVideoToContentItem = (v: any): ContentItem => ({
    id: String(v.id || v.slug),
    slug: v.slug,
    title: v.titulo,
    type: 'video',
    status: v.status || 'published',
    author: v.autor || v.canal || '',
    category: v.categoria,
    publishDate: v.dataPublicacao || v.data,
    views: Number(v.visualizacoes || 0),
    likes: Number(v.likes || 0),
    comments: 0,
    thumbnail: v.thumbnail || '/api/placeholder/300/200',
    featured: !!v.destaque
  })

  // Mapear ContentItem genérico para dados do NewsForm
  const mapContentItemToNewsFormData = (item: ContentItem) => {
    const statusPt = item.status === 'published' ? 'publicado'
                  : item.status === 'draft' ? 'rascunho'
                  : item.status === 'scheduled' ? 'agendado'
                  : 'rascunho'

    return {
      id: item.id,
      titulo: item.title || '',
      slug: item.slug || '',
      conteudo: '',
      resumo: '',
      categoria: item.category || '',
      tags: [],
      autor: item.author || '',
      imagemDestaque: item.thumbnail || '',
      status: statusPt,
      dataPublicacao: item.publishDate || '',
      urgencia: 'media',
      fonte: '',
      localizacao: '',
      destaque: !!item.featured
    }
  }

  // Mapear objeto completo de Notícia (da API) para dados do NewsForm
  const mapNoticiaToNewsFormData = (n: any) => {
    const statusPt = n.status === 'published' ? 'publicado'
                  : n.status === 'draft' ? 'rascunho'
                  : n.status === 'scheduled' ? 'agendado'
                  : 'rascunho'

    return {
      id: String(n.id || n.slug),
      titulo: n.titulo || '',
      slug: n.slug || '',
      conteudo: n.conteudo || '',
      resumo: n.resumo || '',
      categoria: n.categoria || '',
      tags: Array.isArray(n.tags) ? n.tags : (n.tags ? [n.tags] : []),
      autor: n.autor || '',
      imagemDestaque: n.imagem || '',
      status: statusPt,
      dataPublicacao: n.dataPublicacao || '',
      urgencia: 'media',
      fonte: n.fonte || '',
      localizacao: '',
      destaque: !!n.destaque
    }
  }

  // Mapear ContentItem genérico para dados do VideoForm
  const mapContentItemToVideoFormData = (item: ContentItem) => {
    const statusPt = item.status === 'published' ? 'publicado'
                  : item.status === 'draft' ? 'rascunho'
                  : item.status === 'scheduled' ? 'agendado'
                  : 'rascunho'

    return {
      id: item.id,
      titulo: item.title || '',
      slug: item.slug || '',
      descricao: '',
      categoria: item.category || '',
      tags: [],
      autor: item.author || '',
      thumbnail: item.thumbnail || '',
      videoUrl: '',
      duracao: '',
      status: statusPt,
      dataPublicacao: item.publishDate || '',
      destaque: !!item.featured,
      qualidade: '1080p',
      plataforma: 'youtube',
      visualizacoes: Number(item.views || 0),
      likes: Number(item.likes || 0),
      comentarios: Number(item.comments || 0)
    }
  }

  // Mapear objeto completo de Vídeo (da API) para dados do VideoForm
  const mapVideoToVideoFormData = (v: any) => {
    const statusPt = v.status === 'published' ? 'publicado'
                  : v.status === 'draft' ? 'rascunho'
                  : v.status === 'scheduled' ? 'agendado'
                  : 'rascunho'

    const plataforma = typeof v.videoUrl === 'string'
      ? (v.videoUrl.includes('youtube') ? 'youtube'
        : v.videoUrl.includes('vimeo') ? 'vimeo'
        : 'local')
      : 'youtube'

    return {
      id: String(v.id || v.slug),
      titulo: v.titulo || '',
      slug: v.slug || '',
      descricao: v.descricao || '',
      categoria: v.categoria || '',
      tags: Array.isArray(v.tags) ? v.tags : (v.tags ? [v.tags] : []),
      autor: v.autor || v.canal || '',
      thumbnail: v.thumbnail || '',
      videoUrl: v.videoUrl || '',
      duracao: v.duracao || '',
      status: statusPt,
      dataPublicacao: v.dataPublicacao || v.data || '',
      destaque: !!v.destaque,
      qualidade: '1080p',
      plataforma,
      visualizacoes: Number(v.visualizacoes || 0),
      likes: Number(v.likes || 0),
      comentarios: 0
    }
  }

  const mapTestDriveToContentItem = (t: any): ContentItem => ({
    id: String(t.id || t.slug),
    slug: t.slug,
    title: t.veiculo,
    type: 'test-drive',
    status: t.status || 'published',
    author: t.autor || '',
    category: t.categoria || '',
    publishDate: t.data,
    views: 0,
    likes: 0,
    comments: 0,
    thumbnail: t.imagem || '/api/placeholder/300/200',
    featured: !!t.destaque
  })

  const contentItems = useMemo<ContentItem[]>(() => {
    switch (selectedTab) {
      case 'article':
        return (artigos || []).map(mapArtigoToContentItem)
      case 'news':
        return (noticias || []).map(mapNoticiaToContentItem)
      case 'video':
        return (videos || []).map(mapVideoToContentItem)
      case 'test-drive':
        return (testDrives || []).map(mapTestDriveToContentItem)
      default:
        return [
          ...(artigos || []).map(mapArtigoToContentItem),
          ...(noticias || []).map(mapNoticiaToContentItem),
          ...(videos || []).map(mapVideoToContentItem),
          ...(testDrives || []).map(mapTestDriveToContentItem)
        ]
    }
  }, [selectedTab, artigos, noticias, videos, testDrives])

  // Funções para abrir formulários
  const openCreateForm = (type: string) => {
    setFormMode('create')
    setEditingItem(null)
    
    switch (type) {
      case 'article':
        setIsArticleFormOpen(true)
        break
      case 'news':
        setIsNewsFormOpen(true)
        break
      case 'video':
        setIsVideoFormOpen(true)
        break
      case 'test-drive':
        setIsTestDriveFormOpen(true)
        break
    }
  }

  const openEditForm = (item: ContentItem) => {
    setFormMode('edit')
    setEditingItem(item)
    
    switch (item.type) {
      case 'article':
        setIsArticleFormOpen(true)
        break
      case 'news':
        setIsNewsFormOpen(true)
        break
      case 'video':
        setIsVideoFormOpen(true)
        break
      case 'test-drive':
        setIsTestDriveFormOpen(true)
        break
    }
  }

  const closeAllForms = () => {
    setIsArticleFormOpen(false)
    setIsNewsFormOpen(false)
    setIsVideoFormOpen(false)
    setIsTestDriveFormOpen(false)
    setEditingItem(null)
  }

  // Função para atualizar a lista após criar/editar
  const handleFormSuccess = (newItem: any, type: string) => {
    // Após criar/editar, refetch dos dados da aba atual
    switch (type) {
      case 'article':
        refetchArtigos?.()
        break
      case 'news':
        refetchNoticias?.()
        break
      case 'video':
        refetchVideos?.()
        break
      case 'test-drive':
        // useTestDrives não expõe refetch, recarregará ao reabrir página
        break
    }
    closeAllForms()
  }

  // Função para deletar item
  const handleDelete = async (item: ContentItem) => {
    try {
      let endpoint = ''
      switch (item.type) {
        case 'article':
          endpoint = `/api/artigos/${encodeURIComponent(item.slug || item.id)}`
          break
        case 'news':
          endpoint = `/api/noticias/${encodeURIComponent(item.slug || item.id)}`
          break
        case 'video':
          endpoint = `/api/videos/${encodeURIComponent(item.slug || item.id)}`
          break
        case 'test-drive':
          endpoint = `/api/test-drives/${encodeURIComponent(item.slug || item.id)}`
          break
      }

      const res = await fetch(endpoint, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao excluir o item')

      // Atualizar seleção e refetch conforme tipo
      setSelectedItems(prev => prev.filter(i => i !== item.id))
      if (item.type === 'article') refetchArtigos?.()
      if (item.type === 'news') refetchNoticias?.()
      if (item.type === 'video') refetchVideos?.()
      // Test drives serão recarregados ao reabrir a página
    } catch (e) {
      alert('Erro ao excluir. Tente novamente.')
      console.error(e)
    }
  }

  const handleBulkDelete = async () => {
    const itemsToDelete = filteredItems.filter(i => selectedItems.includes(i.id))
    for (const it of itemsToDelete) {
      await handleDelete(it)
    }
  }

  const updateItemStatus = async (item: ContentItem, status: 'published' | 'archived') => {
    try {
      let endpoint = ''
      const payload = { status }
      switch (item.type) {
        case 'article':
          endpoint = `/api/artigos/${encodeURIComponent(item.slug || item.id)}`
          break
        case 'news':
          endpoint = `/api/noticias/${encodeURIComponent(item.slug || item.id)}`
          break
        case 'video':
          endpoint = `/api/videos/${encodeURIComponent(item.slug || item.id)}`
          break
        case 'test-drive':
          endpoint = `/api/test-drives/${encodeURIComponent(item.slug || item.id)}`
          break
      }
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Falha ao atualizar status')
    } catch (e) {
      console.error(e)
      alert('Erro ao atualizar status. Tente novamente.')
    }
  }

  const handleBulkPublish = async () => {
    const itemsToUpdate = filteredItems.filter(i => selectedItems.includes(i.id))
    for (const it of itemsToUpdate) {
      await updateItemStatus(it, 'published')
    }
    // Refetch lists to reflect new status
    refetchArtigos?.()
    refetchNoticias?.()
    refetchVideos?.()
    // Test drives do not expose refetch; will reload on reopen
  }

  const handleBulkArchive = async () => {
    const itemsToUpdate = filteredItems.filter(i => selectedItems.includes(i.id))
    for (const it of itemsToUpdate) {
      await updateItemStatus(it, 'archived')
    }
    // Refetch lists to reflect new status
    refetchArtigos?.()
    refetchNoticias?.()
    refetchVideos?.()
    // Test drives do not expose refetch; will reload on reopen
  }

  const tabs = [
    { id: 'all', label: 'Todos', count: (artigos?.length || 0) + (noticias?.length || 0) + (videos?.length || 0) + (testDrives?.length || 0) },
    { id: 'article', label: 'Artigos', count: artigos?.length || 0 },
    { id: 'news', label: 'Notícias', count: noticias?.length || 0 },
    { id: 'video', label: 'Vídeos', count: videos?.length || 0 },
    { id: 'test-drive', label: 'Test Drives', count: testDrives?.length || 0 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'archived': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-4 h-4" />
      case 'draft': return <Edit className="w-4 h-4" />
      case 'scheduled': return <Clock className="w-4 h-4" />
      case 'archived': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="w-4 h-4" />
      case 'news': return <Newspaper className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'test-drive': return <Car className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const filteredItems = contentItems.filter(item => {
    const matchesTab = selectedTab === 'all' || item.type === selectedTab
    const term = debouncedSearchTerm.toLowerCase()
    const title = (item.title || '').toLowerCase()
    const author = (item.author || '').toLowerCase()
    const category = (item.category || '').toLowerCase()
    const matchesSearch = title.includes(term) || author.includes(term) || category.includes(term)
    const matchesStatus = !statusFilter || item.status === statusFilter
    const matchesCategory = !categoryFilter || item.category === categoryFilter
    const matchesAuthor = !authorFilter || item.author === authorFilter
    const matchesDate = !dateFilter || item.publishDate.startsWith(dateFilter)
    
    return matchesTab && matchesSearch && matchesStatus && matchesCategory && matchesAuthor && matchesDate
  })

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map(item => item.id))
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Conteúdo</h1>
          <p className="text-gray-600 mt-1">Gerencie artigos, notícias, vídeos e test drives da plataforma.</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImportFileChange}
          />
          <button onClick={handleImportClick} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Importar</span>
          </button>
          
          <div className="relative">
            <button onClick={() => setShowExportMenu((v) => !v)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <div className="py-1">
                  <button onClick={() => handleExportFormat('csv')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Exportar CSV</button>
                  <button onClick={() => handleExportFormat('excel')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Exportar Excel</button>
                  <button onClick={() => handleExportFormat('json')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Exportar JSON</button>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              onClick={() => setShowCreateMenu(!showCreateMenu)}
            >
              <Plus className="w-4 h-4" />
              <span>Novo Conteúdo</span>
            </button>
            
            {showCreateMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => { openCreateForm('article'); setShowCreateMenu(false) }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Novo Artigo</span>
                  </button>
                  <button
                    onClick={() => { openCreateForm('news'); setShowCreateMenu(false) }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Newspaper className="w-4 h-4" />
                    <span>Nova Notícia</span>
                  </button>
                  <button
                    onClick={() => { openCreateForm('video'); setShowCreateMenu(false) }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Novo Vídeo</span>
                  </button>
                  <button
                    onClick={() => { openCreateForm('test-drive'); setShowCreateMenu(false) }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Car className="w-4 h-4" />
                    <span>Novo Test Drive</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Removido: Cards de métricas estáticos. Métricas devem vir do módulo Analytics. */}

      {/* Content Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
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
                  placeholder="Buscar conteúdo..."
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

            {selectedItems.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {selectedItems.length} item(s) selecionado(s)
                </span>
                <button onClick={handleBulkPublish} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                  Publicar
                </button>
                <button onClick={handleBulkArchive} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                  Arquivar
                </button>
                <button onClick={handleBulkDelete} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors">
                  Excluir
                </button>
              </div>
            )}
          </div>

          {/* Alerta de erro de dados */}
          {(errorArtigos || errorNoticias || errorVideos || errorTestDrives) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              Ocorreu um erro ao carregar alguns dados: {errorArtigos || errorNoticias || errorVideos || errorTestDrives}
            </div>
          )}

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Todos os Status</option>
                  <option value="published">Publicado</option>
                  <option value="draft">Rascunho</option>
                  <option value="scheduled">Agendado</option>
                  <option value="archived">Arquivado</option>
                </select>
                
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Todas as Categorias</option>
                  <option value="Superdesportivo">Superdesportivo</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Mercado">Mercado</option>
                </select>
                
                <select 
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Todos os Autores</option>
                  <option value="João Silva">João Silva</option>
                  <option value="Maria Santos">Maria Santos</option>
                  <option value="Pedro Costa">Pedro Costa</option>
                  <option value="Ana Ferreira">Ana Ferreira</option>
                </select>
                
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => {
                    setStatusFilter('')
                    setCategoryFilter('')
                    setAuthorFilter('')
                    setDateFilter('')
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conteúdo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Autor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Métricas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Nenhum resultado para "{searchTerm}". Ajuste os filtros ou tente outro termo.
                  </td>
                </tr>
              ) : filteredItems.map((item) => (
                <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                          {item.featured && (
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(item.type)}
                      <span className="text-sm text-gray-900 capitalize">
                        {item.type === 'test-drive' ? 'Test Drive' : item.type}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="capitalize">{item.status}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{item.author}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {new Date(item.publishDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{formatNumber(item.views)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{item.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{item.comments}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        onClick={() => {
                          const url = item.type === 'article'
                            ? `/artigos/${item.slug || item.id}`
                            : item.type === 'news'
                            ? `/noticias/${item.slug || item.id}`
                            : item.type === 'video'
                            ? `/videos/${item.slug || item.id}`
                            : `/test-drives/${item.slug || item.id}`
                          window.open(url, '_blank')
                        }}
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        onClick={() => openEditForm(item)}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                        onClick={() => alert(`Estatísticas para: ${item.title}\nVisualizações: ${item.views}\nLikes: ${item.likes}\nComentários: ${item.comments}`)}
                        title="Analytics"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        onClick={() => handleDelete(item)}
                        title="Deletar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredItems.length}</span> de{' '}
              <span className="font-medium">{filteredItems.length}</span> resultados
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
                3
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Próximo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulários */}
      {isArticleFormOpen && (
        <ArticleForm
          isOpen={isArticleFormOpen}
          onClose={closeAllForms}
          onSave={async (data: any) => {
            try {
              const method = formMode === 'create' ? 'POST' : 'PUT'
              const endpoint = formMode === 'create' 
                ? '/api/artigos' 
                : `/api/artigos/${encodeURIComponent(editingItem?.slug || data.slug)}`
              // Derivar imagem principal da galeria (primeira foto) ou fallback para campo imagem
              const primaryImage = Array.isArray(data.galeria) && data.galeria.length > 0
                ? (data.galeria[0]?.url || '')
                : (data.imagem || '')

              // Montar objeto de especificações conforme a categoria
              const specs =
                data.categoria === 'Ensaio' && data.especificacoesEnsaio
                  ? { tipo: 'ensaio', ...data.especificacoesEnsaio }
                  : data.categoria === 'Superdesportivo' && data.especificacoesSuperdesportivo
                  ? { tipo: 'superdesportivo', ...data.especificacoesSuperdesportivo }
                  : {}
              const normalizedTags = Array.isArray(data.tags)
                ? data.tags
                : (data.tags ? [data.tags] : [])

              const payload = {
                slug: slugify(data.slug || data.titulo),
                titulo: data.titulo,
                resumo: data.resumo,
                conteudo: data.conteudo,
                autor: data.autor,
                dataPublicacao: data.dataPublicacao,
                categoria: data.categoria,
                tempoLeitura: data.tempoLeitura || null,
                imagem: primaryImage,
                tags: normalizedTags,
                specs,
                galeria: Array.isArray(data.galeria)
                  ? data.galeria
                      .filter((g: any) => g && g.url)
                      .map((g: any) => ({ url: g.url, alt: g.alt || '', legenda: g.legenda || '' }))
                  : []
              }
              const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              })
              if (!res.ok) throw new Error('Falha ao salvar artigo')
              refetchArtigos?.()
              closeAllForms()
            } catch (e) {
              console.error(e)
              alert('Erro ao salvar artigo. Tente novamente.')
            }
          }}
          article={(() => {
            if (!editingItem || editingItem.type !== 'article') return undefined
            // Buscar o artigo completo pelos dados carregados
            const full = (artigos || []).find((a: any) => a.slug === editingItem.slug || String(a.id) === editingItem.id)
            return full ? mapArtigoToArticleFormData(full) : mapContentItemToArticleData(editingItem)
          })()}
          mode={formMode}
        />
      )}



      {isNewsFormOpen && (
        <NewsForm
          isOpen={isNewsFormOpen}
          onClose={closeAllForms}
          onSave={(data: any) => handleFormSuccess(data, 'news')}
          news={(() => {
            if (!editingItem || editingItem.type !== 'news') return undefined
            const full = (noticias || []).find((n: any) => n.slug === editingItem.slug || String(n.id) === editingItem.id)
            return full ? mapNoticiaToNewsFormData(full) : mapContentItemToNewsFormData(editingItem)
          })()}
          mode={formMode}
        />
      )}

      {isVideoFormOpen && (
        <VideoForm
          isOpen={isVideoFormOpen}
          onClose={closeAllForms}
          onSave={(data: any) => handleFormSuccess(data, 'video')}
          video={(() => {
            if (!editingItem || editingItem.type !== 'video') return undefined
            const full = (videos || []).find((v: any) => v.slug === editingItem.slug || String(v.id) === editingItem.id)
            return full ? mapVideoToVideoFormData(full) : mapContentItemToVideoFormData(editingItem)
          })()}
          mode={formMode}
        />
      )}

      {isTestDriveFormOpen && (
        <TestDriveForm
          isOpen={isTestDriveFormOpen}
          onClose={closeAllForms}
          onSave={(data: any) => handleFormSuccess(data, 'test-drive')}
          testDrive={(() => {
            if (!editingItem || editingItem.type !== 'test-drive') return undefined
            const full = (testDrives || []).find((t: any) => t.slug === editingItem.slug || String(t.id) === editingItem.id)
            return full || editingItem
          })()}
          mode={formMode}
        />
      )}
    </div>
  )
}

const ContentManagement = () => (
  <Suspense fallback={<div>Carregando conteúdo...</div>}>
    <ContentManagementContent />
  </Suspense>
)

export default ContentManagement