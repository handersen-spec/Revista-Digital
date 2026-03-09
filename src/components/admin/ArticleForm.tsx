'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Image as ImageIcon, Save, Eye, Calendar, Tag, User, FileText, AlertCircle, Settings, Car } from 'lucide-react'
import MediaUpload from './MediaUpload'
import { slugify, ensureUniqueSlug } from '@/lib/slugify'

interface DynamicArticleFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (article: any) => void
  article?: any
  mode: 'create' | 'edit'
}

interface ArticleData {
  id?: string
  categoria: string
  titulo: string
  slug: string
  resumo: string
  conteudo: string
  galeria: Array<{
    id: string
    url: string
    alt: string
    legenda: string
    isDestaque?: boolean
  }>
  // Especificações técnicas para Ensaio
  especificacoesEnsaio?: {
    tipoMotor: string
    cilindrada: string
    potencia: string
    binarioMaximo: string
    transmissao: string
    velocidadeMaxima: string
    aceleracao: string
    consumoWLTP: string
    emissaoCO2WLTP: string
    dimensoes: string
    pneus: string
    peso: string
    bagageira: string
  }
  // Especificações técnicas para Superdesportivo
  especificacoesSuperdesportivo?: {
    tipoMotor: string
    cilindrada: string
    potencia: string
    velocidadeMaxima: string
    aceleracao: string
    pneus: string
    bagageira: string
    dataLancamento: string
  }
  // Configurações
  autor: string
  status: 'rascunho' | 'publicado' | 'agendado' | ''
  dataPublicacao?: string
  destaque: boolean
  tags: string[]
}

const DynamicArticleForm: React.FC<DynamicArticleFormProps> = ({ isOpen, onClose, onSave, article, mode }) => {
  const [activeTab, setActiveTab] = useState('conteudo')
  const [formData, setFormData] = useState<ArticleData>({
    categoria: '',
    titulo: '',
    slug: '',
    resumo: '',
    conteudo: '',
    galeria: [],
    autor: 'Admin',
    status: '', // Inicializar como string vazia para tornar obrigatório
    destaque: false,
    tags: []
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [isMediaUploadOpen, setIsMediaUploadOpen] = useState(false)
  const [mediaIndex, setMediaIndex] = useState<number | null>(null)

  const categorias = ['Antevisão', 'Ensaio', 'Superdesportivo']

  useEffect(() => {
    if (article && mode === 'edit') {
      setFormData(article)
    }
  }, [article, mode])

  // Auto-gerar slug baseado no título
  useEffect(() => {
    if (formData.titulo) {
      const generated = slugify(formData.titulo)
      setFormData(prev => ({ ...prev, slug: generated }))
    }
  }, [formData.titulo])

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const fieldParts = field.split('.')
      setFormData(prev => {
        const newData = { ...prev } as any
        let current = newData
        
        for (let i = 0; i < fieldParts.length - 1; i++) {
          const part = fieldParts[i]
          if (!current[part]) {
            current[part] = {}
          }
          current = current[part]
        }
        
        current[fieldParts[fieldParts.length - 1]] = value
        return newData
      })
    } else {
      setFormData(prev => {
        const newData = {
          ...prev,
          [field]: field === 'slug' ? slugify(String(value)) : value
        } as ArticleData
        
        // Se o status foi alterado para "publicado" e não há data de publicação, definir data atual
        if (field === 'status' && value === 'publicado' && !prev.dataPublicacao) {
          const now = new Date()
          const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
          newData.dataPublicacao = localDateTime.toISOString().slice(0, 16)
        }
        
        return newData
      })
    }
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
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

  const handleImageUpload = async (index: number, file: File) => {
    // Faz upload real para obter URL persistente; cai para URL local se falhar
    let uploadedUrl = ''
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'image')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        if (result?.success && result?.url) {
          uploadedUrl = result.url
        }
      }
    } catch (err) {
      console.error('Falha no upload de imagem, usando URL local:', err)
    }

    const imageUrl = uploadedUrl || '/api/placeholder/1200/600'
    const newImage = {
      id: `img-${Date.now()}-${index}`,
      url: imageUrl,
      alt: `Imagem ${index + 1}`,
      legenda: '',
      isDestaque: index === 0
    }

    setFormData(prev => {
      const newGaleria = [...prev.galeria]
      newGaleria[index] = newImage
      return { ...prev, galeria: newGaleria }
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.categoria) {
      newErrors.categoria = 'Categoria é obrigatória'
    }

    if (formData.categoria && !formData.titulo) {
      newErrors.titulo = 'Título é obrigatório'
    }

    if (formData.categoria && !formData.resumo) {
      newErrors.resumo = 'Resumo é obrigatório'
    }

    if (formData.categoria && !formData.conteudo) {
      newErrors.conteudo = 'Conteúdo é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Normalizar e garantir unicidade do slug antes de salvar
      let finalSlug = slugify(formData.slug || formData.titulo)
      if (mode === 'create' || (article?.slug && article.slug !== finalSlug)) {
        finalSlug = await ensureUniqueSlug(finalSlug)
      }

      const dataToSave = { ...formData, slug: finalSlug }
      await onSave(dataToSave)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar artigo:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderCategoriaSelector = () => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Selecione a categoria *
      </label>
      <select
        value={formData.categoria}
        onChange={(e) => handleInputChange('categoria', e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          errors.categoria ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">Selecione uma categoria</option>
        {categorias.map(categoria => (
          <option key={categoria} value={categoria}>
            {categoria}
          </option>
        ))}
      </select>
      {errors.categoria && (
        <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>
      )}
    </div>
  )

  const renderBasicFields = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título *
        </label>
        <input
          type="text"
          value={formData.titulo}
          onChange={(e) => handleInputChange('titulo', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.titulo ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Digite o título do artigo"
        />
        {errors.titulo && (
          <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL (Slug) *
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => handleInputChange('slug', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="url-do-artigo"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resumo (Breve Descrição) *
        </label>
        <textarea
          value={formData.resumo}
          onChange={(e) => handleInputChange('resumo', e.target.value)}
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.resumo ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Breve descrição do artigo"
        />
        {errors.resumo && (
          <p className="mt-1 text-sm text-red-600">{errors.resumo}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Conteúdo *
        </label>
        <textarea
          value={formData.conteudo}
          onChange={(e) => handleInputChange('conteudo', e.target.value)}
          rows={10}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.conteudo ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Conteúdo completo do artigo"
        />
        {errors.conteudo && (
          <p className="mt-1 text-sm text-red-600">{errors.conteudo}</p>
        )}
      </div>
    </>
  )

  const renderEspecificacoesEnsaio = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Especificações Técnicas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Motor</label>
          <input
            type="text"
            value={formData.especificacoesEnsaio?.tipoMotor || ''}
            onChange={(e) => handleInputChange('especificacoesEnsaio.tipoMotor', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: V8 Biturbo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cilindrada</label>
          <input
            type="text"
            value={formData.especificacoesEnsaio?.cilindrada || ''}
            onChange={(e) => handleInputChange('especificacoesEnsaio.cilindrada', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 4.0L"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Potência</label>
          <input
            type="text"
            value={formData.especificacoesEnsaio?.potencia || ''}
            onChange={(e) => handleInputChange('especificacoesEnsaio.potencia', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 720 cv"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Binário Máximo</label>
          <input
            type="text"
            value={formData.especificacoesEnsaio?.binarioMaximo || ''}
            onChange={(e) => handleInputChange('especificacoesEnsaio.binarioMaximo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 770 Nm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Transmissão</label>
          <input
            type="text"
            value={formData.especificacoesEnsaio?.transmissao || ''}
            onChange={(e) => handleInputChange('especificacoesEnsaio.transmissao', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Automática 7 velocidades"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Velocidade Máxima</label>
          <input
            type="text"
            value={formData.especificacoesEnsaio?.velocidadeMaxima || ''}
            onChange={(e) => handleInputChange('especificacoesEnsaio.velocidadeMaxima', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 341 km/h"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Aceleração (0-100 km/h)</label>
          <input
            type="text"
            value={formData.especificacoesEnsaio?.aceleracao || ''}
            onChange={(e) => handleInputChange('especificacoesEnsaio.aceleracao', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 2.9s"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Consumo (WLTP)</label>
          <input
            type="text"
            value={formData.especificacoesEnsaio?.consumoWLTP || ''}
            onChange={(e) => handleInputChange('especificacoesEnsaio.consumoWLTP', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 13.8L/100km"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Emissão CO₂ (WLTP)</label>
          <input
            type="text"
            value={formData.especificacoesEnsaio?.emissaoCO2WLTP || ''}
            onChange={(e) => handleInputChange('especificacoesEnsaio.emissaoCO2WLTP', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 314 g/km"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dimensões (C/L/A)</label>
          <input
            type="text"
            value={formData.especificacoesEnsaio?.dimensoes || ''}
            onChange={(e) => handleInputChange('especificacoesEnsaio.dimensoes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 4518/1900/1323 mm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pneus</label>
          <input
            type="text"
            value={formData.especificacoesEnsaio?.pneus || ''}
            onChange={(e) => handleInputChange('especificacoesEnsaio.pneus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 265/35 ZR20 (F) | 325/30 ZR21 (R)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Peso</label>
          <input
            type="text"
            value={formData.especificacoesEnsaio?.peso || ''}
            onChange={(e) => handleInputChange('especificacoesEnsaio.peso', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 1450 kg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bagageira</label>
          <input
            type="text"
            value={formData.especificacoesEnsaio?.bagageira || ''}
            onChange={(e) => handleInputChange('especificacoesEnsaio.bagageira', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 132L"
          />
        </div>
      </div>
    </div>
  )

  const renderEspecificacoesSuperdesportivo = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Especificações Técnicas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Motor</label>
          <input
            type="text"
            value={formData.especificacoesSuperdesportivo?.tipoMotor || ''}
            onChange={(e) => handleInputChange('especificacoesSuperdesportivo.tipoMotor', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: V8 Biturbo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cilindrada</label>
          <input
            type="text"
            value={formData.especificacoesSuperdesportivo?.cilindrada || ''}
            onChange={(e) => handleInputChange('especificacoesSuperdesportivo.cilindrada', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 4.0L"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Potência</label>
          <input
            type="text"
            value={formData.especificacoesSuperdesportivo?.potencia || ''}
            onChange={(e) => handleInputChange('especificacoesSuperdesportivo.potencia', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 720 cv"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Velocidade Máxima</label>
          <input
            type="text"
            value={formData.especificacoesSuperdesportivo?.velocidadeMaxima || ''}
            onChange={(e) => handleInputChange('especificacoesSuperdesportivo.velocidadeMaxima', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 341 km/h"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Aceleração (0-100 km/h)</label>
          <input
            type="text"
            value={formData.especificacoesSuperdesportivo?.aceleracao || ''}
            onChange={(e) => handleInputChange('especificacoesSuperdesportivo.aceleracao', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 2.9s"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pneus</label>
          <input
            type="text"
            value={formData.especificacoesSuperdesportivo?.pneus || ''}
            onChange={(e) => handleInputChange('especificacoesSuperdesportivo.pneus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 245/35 ZR19 (F) | 305/30 ZR20 (R)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bagageira</label>
          <input
            type="text"
            value={formData.especificacoesSuperdesportivo?.bagageira || ''}
            onChange={(e) => handleInputChange('especificacoesSuperdesportivo.bagageira', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 150L"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Data de Lançamento</label>
          <input
            type="text"
            value={formData.especificacoesSuperdesportivo?.dataLancamento || ''}
            onChange={(e) => handleInputChange('especificacoesSuperdesportivo.dataLancamento', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Março 2017"
          />
        </div>
      </div>
    </div>
  )

  const renderImageUpload = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Galeria de Fotos</h3>
      <p className="text-sm text-gray-600 mb-4">Selecione 4 fotos da biblioteca. A primeira será a imagem de destaque.</p>
      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="text-center">
              {formData.galeria[index] ? (
                <div>
                  <img
                    src={formData.galeria[index].url}
                    alt={formData.galeria[index].alt}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <p className="text-sm text-gray-600">
                    {index === 0 ? 'Imagem de Destaque' : `Imagem ${index + 1}`}
                  </p>
                  <button
                    type="button"
                    className="mt-2 px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                    onClick={() => { setMediaIndex(index); setIsMediaUploadOpen(true) }}
                  >
                    Selecionar da Biblioteca
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {index === 0 ? 'Imagem de Destaque' : `Imagem ${index + 1}`}
                  </p>
                  <button
                    type="button"
                    className="mt-2 px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                    onClick={() => { setMediaIndex(index); setIsMediaUploadOpen(true) }}
                  >
                    Selecionar da Biblioteca
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderConteudoTab = () => (
    <div className="space-y-6">
      {renderCategoriaSelector()}
      
      {formData.categoria && (
        <>
          {renderBasicFields()}
          
          {formData.categoria === 'Ensaio' && renderEspecificacoesEnsaio()}
          {formData.categoria === 'Superdesportivo' && renderEspecificacoesSuperdesportivo()}
          
          {renderImageUpload()}
        </>
      )}
    </div>
  )

  const renderConfiguracoesTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Autor
        </label>
        <input
          type="text"
          value={formData.autor}
          onChange={(e) => handleInputChange('autor', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Nome do autor"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status *
        </label>
        <select
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Selecione o status</option>
          <option value="rascunho">Rascunho</option>
          <option value="publicado">Publicado</option>
          <option value="agendado">Agendado</option>
        </select>
      </div>

      {(formData.status === 'agendado' || formData.status === 'publicado') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {formData.status === 'agendado' ? 'Data para Publicação' : 'Data de Publicação'}
          </label>
          <input
            type="datetime-local"
            value={formData.dataPublicacao}
            onChange={(e) => handleInputChange('dataPublicacao', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.destaque}
            onChange={(e) => handleInputChange('destaque', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-700">Artigo em destaque na página inicial</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite uma tag e pressione Enter"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === 'create' 
              ? `Criar Novo Artigo${formData.categoria ? ` - ${formData.categoria}` : ''}` 
              : `Editar Artigo${formData.categoria ? ` - ${formData.categoria}` : ''}`
            }
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('conteudo')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'conteudo'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="h-4 w-4 inline-block mr-2" />
            Conteúdo
          </button>
          <button
            onClick={() => setActiveTab('configuracoes')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'configuracoes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="h-4 w-4 inline-block mr-2" />
            Configurações
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'conteudo' && renderConteudoTab()}
          {activeTab === 'configuracoes' && renderConfiguracoesTab()}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.categoria || !formData.status}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {mode === 'create' ? 'Criar Artigo' : 'Salvar Alterações'}
              </>
            )}
          </button>
        </div>
      </div>

      <MediaUpload
        isOpen={isMediaUploadOpen}
        onClose={() => setIsMediaUploadOpen(false)}
        onSelect={(file) => {
          setFormData(prev => {
            const idx = mediaIndex ?? 0
            const newGaleria = [...prev.galeria]
            newGaleria[idx] = {
              id: `img-${Date.now()}-${idx}`,
              url: file.url,
              alt: `Imagem ${idx + 1}`,
              legenda: '',
              isDestaque: idx === 0
            }
            return { ...prev, galeria: newGaleria }
          })
          setIsMediaUploadOpen(false)
          setMediaIndex(null)
        }}
        acceptedTypes={["image/*"]}
      />
    </div>
  )
}

export default DynamicArticleForm