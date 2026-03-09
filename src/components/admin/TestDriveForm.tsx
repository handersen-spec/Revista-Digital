'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Save, Calendar, Tag, User, Car, AlertCircle, Star, MapPin, Gauge, Fuel, Settings, Image } from 'lucide-react'
import MediaUpload from './MediaUpload'

interface TestDriveFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (testDrive: any) => void
  testDrive?: any
  mode: 'create' | 'edit'
}

interface TestDriveData {
  id?: string
  titulo: string
  slug: string
  veiculo: {
    marca: string
    modelo: string
    ano: number
    versao: string
    preco: number
    combustivel: string
    transmissao: string
    potencia: string
    torque: string
    aceleracao: string
    velocidadeMaxima: string
    consumo: string
  }
  avaliacao: {
    notaGeral: number
    design: number
    conforto: number
    performance: number
    tecnologia: number
    custoBeneficio: number
  }
  conteudo: string
  resumo: string
  pontosFavoraveis: string[]
  pontosNegativos: string[]
  autor: string
  imagemDestaque: string
  galeria: string[]
  status: 'rascunho' | 'publicado' | 'agendado'
  dataPublicacao: string
  localTeste: string
  distanciaPercorrida: string
  condicoesClimaticas: string
  tipoPercurso: string
  destaque: boolean
  tags: string[]
}

const TestDriveForm: React.FC<TestDriveFormProps> = ({ isOpen, onClose, onSave, testDrive, mode }) => {
  const normalizeStatus = (status: any): 'rascunho' | 'publicado' | 'agendado' => {
    if (status === 'published') return 'publicado'
    if (status === 'draft') return 'rascunho'
    if (status === 'scheduled') return 'agendado'
    if (status === 'publicado' || status === 'rascunho' || status === 'agendado') return status
    return 'rascunho'
  }

  const toDateInput = (dateStr: any) => {
    if (!dateStr || typeof dateStr !== 'string') {
      return new Date().toISOString().split('T')[0]
    }
    const parts = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.split(' ')[0]
    // Basic YYYY-MM-DD fallback if parts is empty
    return parts || new Date().toISOString().split('T')[0]
  }

  const mapIncomingTestDriveToFormData = (incoming: any): TestDriveData => {
    const galeriaArray = Array.isArray(incoming?.galeria)
      ? incoming.galeria.map((g: any) => (typeof g === 'string' ? g : g?.url)).filter(Boolean)
      : []

    return {
      id: incoming?.id ?? undefined,
      titulo: incoming?.titulo ?? `Test Drive: ${(incoming?.marca || '').toString()} ${(incoming?.veiculo || '').toString()}`.trim(),
      slug: incoming?.slug ?? '',
      veiculo: {
        marca: incoming?.veiculo?.marca ?? incoming?.marca ?? '',
        modelo: incoming?.veiculo?.modelo ?? incoming?.veiculo ?? '',
        ano: incoming?.veiculo?.ano ?? new Date().getFullYear(),
        versao: incoming?.veiculo?.versao ?? '',
        preco: typeof incoming?.preco === 'number' ? incoming.preco : 0,
        combustivel: incoming?.veiculo?.combustivel ?? '',
        transmissao: incoming?.veiculo?.transmissao ?? '',
        potencia: incoming?.veiculo?.potencia ?? '',
        torque: incoming?.veiculo?.torque ?? '',
        aceleracao: incoming?.veiculo?.aceleracao ?? '',
        velocidadeMaxima: incoming?.veiculo?.velocidadeMaxima ?? '',
        consumo: incoming?.veiculo?.consumo ?? ''
      },
      avaliacao: {
        notaGeral:
          incoming?.avaliacao?.notaGeral ??
          (typeof incoming?.nota === 'number' ? Math.max(1, Math.min(5, Math.round(incoming.nota / 2))) : 0),
        design: incoming?.avaliacoes?.design ?? incoming?.avaliacao?.design ?? 0,
        conforto: incoming?.avaliacoes?.conforto ?? incoming?.avaliacao?.conforto ?? 0,
        performance: incoming?.avaliacoes?.performance ?? incoming?.avaliacao?.performance ?? 0,
        tecnologia: incoming?.avaliacoes?.tecnologia ?? incoming?.avaliacao?.tecnologia ?? 0,
        custoBeneficio: incoming?.avaliacoes?.custoBeneficio ?? incoming?.avaliacao?.custoBeneficio ?? 0
      },
      conteudo: incoming?.conteudo ?? incoming?.conteudoCompleto ?? '',
      resumo: incoming?.resumo ?? '',
      pontosFavoraveis: Array.isArray(incoming?.pontosFavoraveis) ? incoming.pontosFavoraveis : [],
      pontosNegativos: Array.isArray(incoming?.pontosNegativos) ? incoming.pontosNegativos : [],
      autor: incoming?.autor ?? '',
      imagemDestaque: incoming?.imagemDestaque ?? incoming?.imagem ?? '',
      galeria: galeriaArray,
      status: normalizeStatus(incoming?.status),
      dataPublicacao: toDateInput(incoming?.dataPublicacao ?? incoming?.data),
      localTeste: incoming?.localTeste ?? '',
      distanciaPercorrida: incoming?.distanciaPercorrida ?? '',
      condicoesClimaticas: incoming?.condicoesClimaticas ?? '',
      tipoPercurso: incoming?.tipoPercurso ?? '',
      destaque: Boolean(incoming?.destaque),
      tags: Array.isArray(incoming?.tags) ? incoming.tags : []
    }
  }

  const [formData, setFormData] = useState<TestDriveData>({
    titulo: '',
    slug: '',
    veiculo: {
      marca: '',
      modelo: '',
      ano: new Date().getFullYear(),
      versao: '',
      preco: 0,
      combustivel: '',
      transmissao: '',
      potencia: '',
      torque: '',
      aceleracao: '',
      velocidadeMaxima: '',
      consumo: ''
    },
    avaliacao: {
      notaGeral: 0,
      design: 0,
      conforto: 0,
      performance: 0,
      tecnologia: 0,
      custoBeneficio: 0
    },
    conteudo: '',
    resumo: '',
    pontosFavoraveis: [],
    pontosNegativos: [],
    autor: '',
    imagemDestaque: '',
    galeria: [],
    status: 'rascunho',
    dataPublicacao: new Date().toISOString().split('T')[0],
    localTeste: '',
    distanciaPercorrida: '',
    condicoesClimaticas: '',
    tipoPercurso: '',
    destaque: false,
    tags: []
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const [newTag, setNewTag] = useState('')
  const [newPontoFavoravel, setNewPontoFavoravel] = useState('')
  const [newPontoNegativo, setNewPontoNegativo] = useState('')
  const [isMediaUploadOpen, setIsMediaUploadOpen] = useState(false)

  const marcas = [
    'Toyota', 'Honda', 'Volkswagen', 'Ford', 'Chevrolet', 'Nissan', 'Hyundai',
    'BMW', 'Mercedes-Benz', 'Audi', 'Peugeot', 'Renault', 'Fiat', 'Jeep',
    'Mitsubishi', 'Mazda', 'Subaru', 'Kia', 'Volvo', 'Land Rover'
  ]

  const combustiveis = ['Gasolina', 'Etanol', 'Flex', 'Diesel', 'Híbrido', 'Elétrico', 'GNV']
  const transmissoes = ['Manual', 'Automática', 'CVT', 'Automatizada']
  const tiposPercurso = ['Urbano', 'Rodoviário', 'Misto', 'Off-road', 'Pista']
  const condicoesClimaticas = ['Ensolarado', 'Nublado', 'Chuvoso', 'Neblina', 'Vento forte']

  useEffect(() => {
    if (testDrive && mode === 'edit') {
      const mapped = mapIncomingTestDriveToFormData(testDrive)
      setFormData(prev => ({
        ...prev,
        ...mapped
      }))
    }
  }, [testDrive, mode])

  useEffect(() => {
    if (formData.veiculo.marca && formData.veiculo.modelo) {
      const titulo = `Test Drive: ${formData.veiculo.marca} ${formData.veiculo.modelo} ${formData.veiculo.ano}`
      const slug = titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      setFormData(prev => ({ ...prev, titulo, slug }))
    }
  }, [formData.veiculo.marca, formData.veiculo.modelo, formData.veiculo.ano])

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof TestDriveData] as any),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
    
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

  const addPontoFavoravel = () => {
    if (newPontoFavoravel.trim() && !formData.pontosFavoraveis.includes(newPontoFavoravel.trim())) {
      setFormData(prev => ({
        ...prev,
        pontosFavoraveis: [...prev.pontosFavoraveis, newPontoFavoravel.trim()]
      }))
      setNewPontoFavoravel('')
    }
  }

  const removePontoFavoravel = (ponto: string) => {
    setFormData(prev => ({
      ...prev,
      pontosFavoraveis: prev.pontosFavoraveis.filter(p => p !== ponto)
    }))
  }

  const addPontoNegativo = () => {
    if (newPontoNegativo.trim() && !formData.pontosNegativos.includes(newPontoNegativo.trim())) {
      setFormData(prev => ({
        ...prev,
        pontosNegativos: [...prev.pontosNegativos, newPontoNegativo.trim()]
      }))
      setNewPontoNegativo('')
    }
  }

  const removePontoNegativo = (ponto: string) => {
    setFormData(prev => ({
      ...prev,
      pontosNegativos: prev.pontosNegativos.filter(p => p !== ponto)
    }))
  }

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.veiculo.marca) newErrors['veiculo.marca'] = 'Marca é obrigatória'
    if (!formData.veiculo.modelo.trim()) newErrors['veiculo.modelo'] = 'Modelo é obrigatório'
    if (!formData.conteudo.trim()) newErrors.conteudo = 'Conteúdo é obrigatório'
    if (!formData.resumo.trim()) newErrors.resumo = 'Resumo é obrigatório'
    if (!formData.autor.trim()) newErrors.autor = 'Autor é obrigatório'
    if (!formData.imagemDestaque.trim()) newErrors.imagemDestaque = 'Imagem de destaque é obrigatória'
    if (!formData.localTeste.trim()) newErrors.localTeste = 'Local do teste é obrigatório'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const endpoint = mode === 'create' ? '/api/test-drives' : `/api/test-drives/${formData.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar test drive')
      }

      const result = await response.json()
      onSave(result.data)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar test drive:', error)
      setErrors({ submit: 'Erro ao salvar test drive. Tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const imageUrl = `/api/placeholder/1200/600`
    handleInputChange('imagemDestaque', imageUrl)
  }

  const renderStarRating = (field: string, value: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleInputChange(field, star)}
            className={`w-6 h-6 ${
              star <= value ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-400 transition-colors`}
          >
            <Star className="w-full h-full fill-current" />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">{value}/5</span>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Car className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'create' ? 'Novo Test Drive' : 'Editar Test Drive'}
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-8">
          {/* Informações do Veículo */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Car className="w-5 h-5 mr-2" />
              Informações do Veículo
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca *
                </label>
                <select
                  value={formData.veiculo.marca}
                  onChange={(e) => handleInputChange('veiculo.marca', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors['veiculo.marca'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione</option>
                  {marcas.map((marca) => (
                    <option key={marca} value={marca}>
                      {marca}
                    </option>
                  ))}
                </select>
                {errors['veiculo.marca'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['veiculo.marca']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo *
                </label>
                <input
                  type="text"
                  value={formData.veiculo.modelo}
                  onChange={(e) => handleInputChange('veiculo.modelo', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors['veiculo.modelo'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Corolla"
                />
                {errors['veiculo.modelo'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['veiculo.modelo']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ano
                </label>
                <input
                  type="number"
                  value={formData.veiculo.ano}
                  onChange={(e) => handleInputChange('veiculo.ano', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Versão
                </label>
                <input
                  type="text"
                  value={formData.veiculo.versao}
                  onChange={(e) => handleInputChange('veiculo.versao', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: XEi 2.0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço (AOA)
                </label>
                <input
                  type="number"
                  value={formData.veiculo.preco}
                  onChange={(e) => handleInputChange('veiculo.preco', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Combustível
                </label>
                <select
                  value={formData.veiculo.combustivel}
                  onChange={(e) => handleInputChange('veiculo.combustivel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  {combustiveis.map((combustivel) => (
                    <option key={combustivel} value={combustivel}>
                      {combustivel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmissão
                </label>
                <select
                  value={formData.veiculo.transmissao}
                  onChange={(e) => handleInputChange('veiculo.transmissao', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  {transmissoes.map((transmissao) => (
                    <option key={transmissao} value={transmissao}>
                      {transmissao}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Potência
                </label>
                <input
                  type="text"
                  value={formData.veiculo.potencia}
                  onChange={(e) => handleInputChange('veiculo.potencia', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 150 cv"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Torque
                </label>
                <input
                  type="text"
                  value={formData.veiculo.torque}
                  onChange={(e) => handleInputChange('veiculo.torque', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 19,4 kgfm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  0-100 km/h
                </label>
                <input
                  type="text"
                  value={formData.veiculo.aceleracao}
                  onChange={(e) => handleInputChange('veiculo.aceleracao', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 9,5s"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vel. Máxima
                </label>
                <input
                  type="text"
                  value={formData.veiculo.velocidadeMaxima}
                  onChange={(e) => handleInputChange('veiculo.velocidadeMaxima', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 190 km/h"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consumo
                </label>
                <input
                  type="text"
                  value={formData.veiculo.consumo}
                  onChange={(e) => handleInputChange('veiculo.consumo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 12 km/l"
                />
              </div>
            </div>
          </div>

          {/* Avaliação */}
          <div className="bg-yellow-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Avaliação
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nota Geral
                </label>
                {renderStarRating('avaliacao.notaGeral', formData.avaliacao.notaGeral)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Design
                </label>
                {renderStarRating('avaliacao.design', formData.avaliacao.design)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conforto
                </label>
                {renderStarRating('avaliacao.conforto', formData.avaliacao.conforto)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Performance
                </label>
                {renderStarRating('avaliacao.performance', formData.avaliacao.performance)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tecnologia
                </label>
                {renderStarRating('avaliacao.tecnologia', formData.avaliacao.tecnologia)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custo-Benefício
                </label>
                {renderStarRating('avaliacao.custoBeneficio', formData.avaliacao.custoBeneficio)}
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resumo *
              </label>
              <textarea
                value={formData.resumo}
                onChange={(e) => handleInputChange('resumo', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.resumo ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Breve resumo do test drive..."
              />
              {errors.resumo && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.resumo}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conteúdo Completo *
              </label>
              <textarea
                value={formData.conteudo}
                onChange={(e) => handleInputChange('conteudo', e.target.value)}
                rows={12}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.conteudo ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Escreva o conteúdo completo do test drive..."
              />
              {errors.conteudo && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.conteudo}
                </p>
              )}
            </div>
          </div>

          {/* Pontos Favoráveis e Negativos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pontos Favoráveis
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={newPontoFavoravel}
                  onChange={(e) => setNewPontoFavoravel(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPontoFavoravel())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite um ponto favorável"
                />
                <button
                  type="button"
                  onClick={addPontoFavoravel}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Adicionar
                </button>
              </div>
              <div className="space-y-2">
                {formData.pontosFavoraveis.map((ponto, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <span className="text-green-800">{ponto}</span>
                    <button
                      type="button"
                      onClick={() => removePontoFavoravel(ponto)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pontos Negativos
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={newPontoNegativo}
                  onChange={(e) => setNewPontoNegativo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPontoNegativo())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite um ponto negativo"
                />
                <button
                  type="button"
                  onClick={addPontoNegativo}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Adicionar
                </button>
              </div>
              <div className="space-y-2">
                {formData.pontosNegativos.map((ponto, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <span className="text-red-800">{ponto}</span>
                    <button
                      type="button"
                      onClick={() => removePontoNegativo(ponto)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Informações do Teste */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Local do Teste *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.localTeste}
                  onChange={(e) => handleInputChange('localTeste', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.localTeste ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Luanda, Angola"
                />
              </div>
              {errors.localTeste && (
                <p className="mt-1 text-sm text-red-600">{errors.localTeste}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distância Percorrida
              </label>
              <div className="relative">
                <Gauge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.distanciaPercorrida}
                  onChange={(e) => handleInputChange('distanciaPercorrida', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 150 km"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condições Climáticas
              </label>
              <select
                value={formData.condicoesClimaticas}
                onChange={(e) => handleInputChange('condicoesClimaticas', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                {condicoesClimaticas.map((condicao) => (
                  <option key={condicao} value={condicao}>
                    {condicao}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Percurso
              </label>
              <select
                value={formData.tipoPercurso}
                onChange={(e) => handleInputChange('tipoPercurso', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                {tiposPercurso.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Autor, Data e Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.autor ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Nome do autor"
                />
              </div>
              {errors.autor && (
                <p className="mt-1 text-sm text-red-600">{errors.autor}</p>
              )}
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
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="rascunho">Rascunho</option>
                <option value="publicado">Publicado</option>
                <option value="agendado">Agendado</option>
              </select>
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
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.imagemDestaque ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="URL da imagem ou selecione da biblioteca..."
                readOnly
              />
              <button
                type="button"
                onClick={() => setIsMediaUploadOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
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
                  className="w-48 h-32 object-cover rounded-lg border border-gray-200"
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite uma tag e pressione Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-400 hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Destaque */}
          <div className="flex items-center justify-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.destaque}
                onChange={(e) => handleInputChange('destaque', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Test Drive em destaque
              </span>
            </label>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Salvando...' : 'Salvar Test Drive'}</span>
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

export default TestDriveForm