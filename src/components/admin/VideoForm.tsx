'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Save, Calendar, Tag, User, Video, AlertCircle, Play, Clock, Globe, Link, Image } from 'lucide-react'
import MediaUpload from './MediaUpload'

interface VideoFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (video: any) => void
  video?: any
  mode: 'create' | 'edit'
}

interface VideoData {
  id?: string
  titulo: string
  slug: string
  descricao: string
  categoria: string
  tags: string[]
  autor: string
  thumbnail: string
  videoUrl: string
  duracao: string
  status: 'rascunho' | 'publicado' | 'agendado'
  dataPublicacao: string
  destaque: boolean
  qualidade: '720p' | '1080p' | '4K'
  plataforma: 'youtube' | 'vimeo' | 'local'
  visualizacoes: number
  likes: number
  comentarios: number
}

const VideoForm: React.FC<VideoFormProps> = ({ isOpen, onClose, onSave, video, mode }) => {
  const [formData, setFormData] = useState<VideoData>({
    titulo: '',
    slug: '',
    descricao: '',
    categoria: '',
    tags: [],
    autor: '',
    thumbnail: '',
    videoUrl: '',
    duracao: '',
    status: 'rascunho',
    dataPublicacao: new Date().toISOString().split('T')[0],
    destaque: false,
    qualidade: '1080p',
    plataforma: 'youtube',
    visualizacoes: 0,
    likes: 0,
    comentarios: 0
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const [newTag, setNewTag] = useState('')
  const [isMediaUploadOpen, setIsMediaUploadOpen] = useState(false)

  const categorias = [
    'Test Drive',
    'Tutorial',
    'Comparativo',
    'Análise',
    'Motorsport',
    'Dicas',
    'Restauração',
    'Primeiras Impressões'
  ]

  const qualidades = [
    { value: '720p', label: '720p HD' },
    { value: '1080p', label: '1080p Full HD' },
    { value: '4K', label: '4K Ultra HD' }
  ]

  const plataformas = [
    { value: 'youtube', label: 'YouTube', icon: '📺' },
    { value: 'vimeo', label: 'Vimeo', icon: '🎬' },
    { value: 'local', label: 'Upload Local', icon: '💾' }
  ]

  useEffect(() => {
    if (video && mode === 'edit') {
      setFormData(prev => ({
        // Preserva valores padrão já existentes no estado
        ...prev,
        // Espalha os dados recebidos (podem vir de ContentItem ou do objeto completo do vídeo)
        ...video,
        // Garante que tags seja sempre um array para evitar erro em .map
        tags: Array.isArray((video as any).tags)
          ? (video as any).tags
          : (typeof (video as any).tags === 'string' && (video as any).tags.trim() !== ''
              ? [(video as any).tags]
              : prev.tags || []),
        // Normaliza a data para o formato YYYY-MM-DD
        dataPublicacao:
          (video as any)?.dataPublicacao?.split?.('T')?.[0]
            || (video as any)?.publishDate?.split?.('T')?.[0]
            || prev.dataPublicacao
            || new Date().toISOString().split('T')[0]
      }))
    }
  }, [video, mode])

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

  const extractVideoId = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
      return match ? match[1] : null
    }
    if (url.includes('vimeo.com')) {
      const match = url.match(/vimeo\.com\/(\d+)/)
      return match ? match[1] : null
    }
    return null
  }

  const generateThumbnail = (url: string) => {
    const videoId = extractVideoId(url)
    if (!videoId) return ''

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }
    if (url.includes('vimeo.com')) {
      return `https://vumbnail.com/${videoId}.jpg`
    }
    return ''
  }

  useEffect(() => {
    if (formData.videoUrl && formData.plataforma !== 'local') {
      const thumbnail = generateThumbnail(formData.videoUrl)
      if (thumbnail) {
        setFormData(prev => ({ ...prev, thumbnail }))
      }
    }
  }, [formData.videoUrl, formData.plataforma])

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.titulo.trim()) newErrors.titulo = 'Título é obrigatório'
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória'
    if (!formData.categoria) newErrors.categoria = 'Categoria é obrigatória'
    if (!formData.autor.trim()) newErrors.autor = 'Autor é obrigatório'
    if (!formData.videoUrl.trim()) newErrors.videoUrl = 'URL do vídeo é obrigatória'
    if (!formData.thumbnail.trim()) newErrors.thumbnail = 'Thumbnail é obrigatória'
    if (!formData.duracao.trim()) newErrors.duracao = 'Duração é obrigatória'

    // Validar formato da duração (MM:SS ou HH:MM:SS)
    if (formData.duracao && !/^\d{1,2}:\d{2}(:\d{2})?$/.test(formData.duracao)) {
      newErrors.duracao = 'Formato inválido (use MM:SS ou HH:MM:SS)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      // Ao editar, a API espera o slug na rota: /api/videos/[slug]
      const endpoint = mode === 'create'
        ? '/api/videos'
        : `/api/videos/${encodeURIComponent(formData.slug || String(formData.id || ''))}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      // Mapear status PT -> EN para compatibilidade com a API e consumo público
      const statusMap: Record<'rascunho' | 'publicado' | 'agendado', 'draft' | 'published' | 'scheduled'> = {
        rascunho: 'draft',
        publicado: 'published',
        agendado: 'scheduled'
      }
      const payload = { ...formData, status: statusMap[formData.status] }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        // Tentar extrair mensagem detalhada do backend
        let message = 'Erro ao salvar vídeo. Verifique os campos e tente novamente.'
        try {
          const err = await response.json()
          if (err?.message) message = err.message
        } catch {}
        setErrors({ submit: message })
        // Não lançar exceção para evitar erro no console; apenas exibir na UI
        return
      }

      const result = await response.json()
      onSave(result.data)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar vídeo:', error)
      if (!errors.submit) {
        setErrors({ submit: 'Erro ao salvar vídeo. Tente novamente.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const thumbnailUrl = `/api/placeholder/1280/720`
    handleInputChange('thumbnail', thumbnailUrl)
  }

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const videoUrl = `/uploads/videos/${file.name}`
    handleInputChange('videoUrl', videoUrl)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Video className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'create' ? 'Adicionar Novo Vídeo' : 'Editar Vídeo'}
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
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => handleInputChange('titulo', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.titulo ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Digite o título do vídeo..."
            />
            {errors.titulo && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.titulo}
              </p>
            )}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="url-do-video"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.descricao ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Descrição do vídeo..."
            />
            {errors.descricao && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.descricao}
              </p>
            )}
          </div>

          {/* Plataforma e URL do Vídeo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plataforma
              </label>
              <select
                value={formData.plataforma}
                onChange={(e) => handleInputChange('plataforma', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {plataformas.map((plataforma) => (
                  <option key={plataforma.value} value={plataforma.value}>
                    {plataforma.icon} {plataforma.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.plataforma === 'local' ? 'Upload de Vídeo *' : 'URL do Vídeo *'}
              </label>
              {formData.plataforma === 'local' ? (
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.videoUrl ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Caminho do arquivo ou faça upload..."
                    readOnly
                  />
                  <label className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors cursor-pointer flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.videoUrl ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
                  />
                </div>
              )}
              {errors.videoUrl && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.videoUrl}
                </p>
              )}
            </div>
          </div>

          {/* Categoria, Autor, Duração, Qualidade */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => handleInputChange('categoria', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.categoria ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione</option>
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
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.autor}
                  onChange={(e) => handleInputChange('autor', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.autor ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Nome do autor"
                />
              </div>
              {errors.autor && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.autor}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duração *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.duracao}
                  onChange={(e) => handleInputChange('duracao', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.duracao ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="10:30"
                />
              </div>
              {errors.duracao && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.duracao}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualidade
              </label>
              <select
                value={formData.qualidade}
                onChange={(e) => handleInputChange('qualidade', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {qualidades.map((qualidade) => (
                  <option key={qualidade.value} value={qualidade.value}>
                    {qualidade.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Data de Publicação e Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Vídeo em destaque
                </span>
              </label>
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail *
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={formData.thumbnail}
                onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.thumbnail ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="URL da thumbnail ou selecione da biblioteca..."
                readOnly
              />
              <button
                type="button"
                onClick={() => setIsMediaUploadOpen(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Image className="w-4 h-4" />
                <span>Selecionar</span>
              </button>
            </div>
            {formData.thumbnail && (
              <div className="mt-2">
                <img
                  src={formData.thumbnail}
                  alt="Thumbnail Preview"
                  className="w-48 h-27 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
            {errors.thumbnail && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.thumbnail}
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Digite uma tag e pressione Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-purple-400 hover:text-purple-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Preview do Vídeo */}
          {formData.videoUrl && formData.plataforma !== 'local' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview do Vídeo
              </label>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Play className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">{formData.titulo || 'Título do vídeo'}</p>
                    <p className="text-sm text-gray-500">
                      {formData.plataforma === 'youtube' ? 'YouTube' : 'Vimeo'} • {formData.duracao || '00:00'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

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
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Salvando...' : 'Salvar Vídeo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MediaUpload Modal */}
      <MediaUpload
        isOpen={isMediaUploadOpen}
        onClose={() => setIsMediaUploadOpen(false)}
        onSelect={(file) => {
          setFormData(prev => ({ ...prev, thumbnail: file.url }))
          setIsMediaUploadOpen(false)
        }}
        acceptedTypes={['image/*']}
      />
    </div>
  )
}

export default VideoForm