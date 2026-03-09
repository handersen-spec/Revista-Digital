'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Save, Calendar, Tag, User, Newspaper, AlertCircle, Clock, Globe, Image } from 'lucide-react'
import MediaUpload from './MediaUpload'

interface NewsFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (news: any) => void
  news?: any
  mode: 'create' | 'edit'
}

interface NewsData {
  id?: string
  titulo: string
  slug: string
  conteudo: string
  resumo: string
  categoria: string
  tags: string[]
  autor: string
  imagemDestaque: string
  status: 'rascunho' | 'publicado' | 'agendado'
  dataPublicacao: string
  urgencia: 'baixa' | 'media' | 'alta' | 'urgente'
  fonte: string
  localizacao: string
  destaque: boolean
}

const NewsForm: React.FC<NewsFormProps> = ({ isOpen, onClose, onSave, news, mode }) => {
  const [formData, setFormData] = useState<NewsData>({
    titulo: '',
    slug: '',
    conteudo: '',
    resumo: '',
    categoria: '',
    tags: [],
    autor: '',
    imagemDestaque: '',
    status: 'rascunho',
    dataPublicacao: new Date().toISOString().split('T')[0],
    urgencia: 'media',
    fonte: '',
    localizacao: '',
    destaque: false
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const [newTag, setNewTag] = useState('')
  const [isMediaUploadOpen, setIsMediaUploadOpen] = useState(false)

  const categorias = [
    'Atualidade',
    'Opinião',
    'Desporto'
  ]

  const urgencias = [
    { value: 'baixa', label: 'Baixa', color: 'bg-gray-100 text-gray-800' },
    { value: 'media', label: 'Média', color: 'bg-blue-100 text-blue-800' },
    { value: 'alta', label: 'Alta', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'urgente', label: 'Urgente', color: 'bg-red-100 text-red-800' }
  ]

  useEffect(() => {
    if (news && mode === 'edit') {
      // Normalizar campos recebidos para evitar quebraz no formulário
      const normalizeStatusToPt = (s: string | undefined) => {
        switch (s) {
          case 'draft':
            return 'rascunho'
          case 'published':
            return 'publicado'
          case 'scheduled':
            return 'agendado'
          default:
            return s || 'rascunho'
        }
      }

      const normalizedTags = Array.isArray((news as any).tags)
        ? (news as any).tags
        : (news as any).tags
        ? [String((news as any).tags)]
        : []

      const normalizedDate = (news as any).dataPublicacao?.split('T')[0]
        || (news as any).publishDate?.split?.('T')[0]
        || new Date().toISOString().split('T')[0]

      setFormData(prev => ({
        ...prev,
        ...news,
        tags: normalizedTags.length ? normalizedTags : prev.tags,
        dataPublicacao: normalizedDate,
        imagemDestaque: (news as any).imagemDestaque || (news as any).imagem || prev.imagemDestaque || '',
        status: normalizeStatusToPt((news as any).status) as any,
        destaque: typeof (news as any).destaque === 'boolean' ? (news as any).destaque : prev.destaque
      }))
    }
  }, [news, mode])

  useEffect(() => {
    if (formData.titulo) {
      const slug = formData.titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.titulo])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    if (errors[field]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.titulo.trim()) newErrors.titulo = 'Título é obrigatório'
    if (!formData.conteudo.trim()) newErrors.conteudo = 'Conteúdo é obrigatório'
    if (!formData.resumo.trim()) newErrors.resumo = 'Resumo é obrigatório'
    if (!formData.categoria) newErrors.categoria = 'Categoria é obrigatória'
    if (!formData.autor.trim()) newErrors.autor = 'Autor é obrigatório'
    // Aceita imagem já existente (em modo edição) ou imagemDestaque
    const imagemAtual = (formData as any).imagem
    if (!(formData.imagemDestaque?.trim() || imagemAtual?.trim())) {
      newErrors.imagemDestaque = 'Imagem de destaque é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const endpoint = mode === 'create' ? '/api/noticias' : `/api/noticias/${formData.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      // Mapear para os campos esperados pela API
      const mapStatus = (s: string) => {
        switch (s) {
          case 'rascunho': return 'draft'
          case 'publicado': return 'published'
          case 'agendado': return 'scheduled'
          default: return s
        }
      }

      const payload = {
        slug: formData.slug,
        titulo: formData.titulo,
        resumo: formData.resumo,
        conteudo: formData.conteudo,
        categoria: formData.categoria,
        autor: formData.autor,
        dataPublicacao: formData.dataPublicacao,
        imagem: formData.imagemDestaque || (formData as any).imagem || null,
        destaque: formData.destaque,
        fonte: formData.fonte,
        tags: formData.tags,
        status: mapStatus(formData.status)
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        // Tentar obter mensagem detalhada da API
        let msg = 'Erro ao salvar notícia'
        try {
          const errData = await response.json()
          if (errData?.message) msg = errData.message
        } catch {}
        throw new Error(msg)
      }

      const result = await response.json()
      onSave(result.data)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar notícia:', error)
      setErrors({ submit: error instanceof Error ? error.message : 'Erro ao salvar notícia. Tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const imageUrl = `/api/placeholder/800/400`
    handleInputChange('imagemDestaque', imageUrl)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Newspaper className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'create' ? 'Criar Nova Notícia' : 'Editar Notícia'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
          {/* Título e Urgência */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.titulo ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Digite o título da notícia..."
              />
              {errors.titulo && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.titulo}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgência
              </label>
              <select
                value={formData.urgencia}
                onChange={(e) => handleInputChange('urgencia', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {urgencias.map((urgencia) => (
                  <option key={urgencia.value} value={urgencia.value}>
                    {urgencia.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL (Slug)
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="url-da-noticia"
            />
          </div>

          {/* Resumo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resumo *
            </label>
            <textarea
              value={formData.resumo}
              onChange={(e) => handleInputChange('resumo', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.resumo ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Breve descrição da notícia..."
            />
            {errors.resumo && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.resumo}
              </p>
            )}
          </div>

          {/* Conteúdo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo *
            </label>
            <textarea
              value={formData.conteudo}
              onChange={(e) => handleInputChange('conteudo', e.target.value)}
              rows={10}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.conteudo ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Escreva o conteúdo da notícia..."
            />
            {errors.conteudo && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.conteudo}
              </p>
            )}
          </div>

          {/* Categoria, Autor, Fonte */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => handleInputChange('categoria', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.categoria ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
              {errors.categoria && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.categoria}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Autor *
              </label>
              <input
                type="text"
                value={formData.autor}
                onChange={(e) => handleInputChange('autor', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.autor ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nome do autor"
              />
              {errors.autor && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.autor}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fonte
              </label>
              <input
                type="text"
                value={formData.fonte}
                onChange={(e) => handleInputChange('fonte', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Fonte da notícia"
              />
            </div>
          </div>

          {/* Localização e Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localização
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.localizacao}
                  onChange={(e) => handleInputChange('localizacao', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Cidade, País"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Publicação
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={formData.dataPublicacao}
                  onChange={(e) => handleInputChange('dataPublicacao', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Status e Destaque */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="rascunho">Rascunho</option>
                <option value="publicado">Publicado</option>
                <option value="agendado">Agendado</option>
              </select>
            </div>

            <div className="flex items-center justify-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.destaque}
                  onChange={(e) => handleInputChange('destaque', e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Notícia em destaque
                </span>
              </label>
            </div>
          </div>

          {/* Imagem de Destaque */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem de Destaque *
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={formData.imagemDestaque}
                onChange={(e) => handleInputChange('imagemDestaque', e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.imagemDestaque ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="URL da imagem ou selecione da biblioteca..."
                readOnly
              />
              <button
                type="button"
                onClick={() => setIsMediaUploadOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Image className="w-4 h-4" />
                <span>Selecionar</span>
              </button>
            </div>
            {formData.imagemDestaque && (
              <div className="mt-2">
                <img
                  src={formData.imagemDestaque}
                  alt="Preview"
                  className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
            {errors.imagemDestaque && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.imagemDestaque}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Digite uma tag e pressione Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {errors.submit}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleInputChange('status', 'rascunho')}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Salvar como Rascunho
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Salvando...' : 'Salvar Notícia'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MediaUpload Modal */}
      <MediaUpload
        isOpen={isMediaUploadOpen}
        onClose={() => setIsMediaUploadOpen(false)}
        onSelect={(file) => {
          setFormData(prev => ({ ...prev, imagemDestaque: file.url }))
          setIsMediaUploadOpen(false)
        }}
        acceptedTypes={['image/*']}
      />
    </div>
  )
}

export default NewsForm