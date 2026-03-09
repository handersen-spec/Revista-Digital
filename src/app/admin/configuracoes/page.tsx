'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Image, 
  Palette, 
  Type, 
  Layout, 
  Save, 
  RefreshCw, 
  Upload, 
  Eye, 
  EyeOff,
  Check,
  X,
  AlertCircle,
  Info,
  Camera,
  FileText,
  Link,
  Monitor,
  Smartphone,
  Tablet,
  Loader2,
  Download,
  CheckCircle,
  Cookie
} from 'lucide-react'


// Importar hooks da API
import {
  useConfiguracoesAdmin,
  type ConfiguracoesCompletas
} from '@/hooks/useConfiguracoesAdmin'

const GeneralSettings = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [backupData, setBackupData] = useState<string>('')
  const [restoreData, setRestoreData] = useState<string>('')

  // Hooks da API
  const {
    configuracoes,
    loading,
    error,
    saving,
    salvarConfiguracoes,
    resetarConfiguracoes,
    recarregar
  } = useConfiguracoesAdmin()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Detectar mudanças não salvas
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const tabs = [
    { id: 'general', label: 'Geral', icon: Settings },
    { id: 'branding', label: 'Marca', icon: Palette },
    { id: 'content', label: 'Conteúdo', icon: FileText },
    { id: 'social', label: 'Redes Sociais', icon: Globe },
    { id: 'cookies', label: 'Cookies', icon: Cookie }
  ]

  const timezones = [
    { value: 'Africa/Luanda', label: 'Luanda (GMT+1)' },
    { value: 'Africa/Lagos', label: 'Lagos (GMT+1)' },
    { value: 'Europe/Lisbon', label: 'Lisboa (GMT+0)' },
    { value: 'America/Sao_Paulo', label: 'São Paulo (GMT-3)' }
  ]

  const languages = [
    { value: 'pt-AO', label: 'Português (Angola)' },
    { value: 'pt-PT', label: 'Português (Portugal)' },
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'en-US', label: 'English (US)' }
  ]

  const currencies = [
    { value: 'AOA', label: 'Kwanza Angolano (AOA)' },
    { value: 'USD', label: 'Dólar Americano (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' }
  ]

  const fontFamilies = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Montserrat', label: 'Montserrat' }
  ]

  // Função de validação
  const validateField = (section: string, field: string, value: any): string | null => {
    const errors: Record<string, Record<string, (value: any) => string | null>> = {
      general: {
        siteName: (v) => !v || v.length < 3 ? 'Nome do site deve ter pelo menos 3 caracteres' : null,
        siteUrl: (v) => !v || !/^https?:\/\/.+/.test(v) ? 'URL deve ser válida (http/https)' : null,
        adminEmail: (v) => !v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Email inválido' : null,
        contactEmail: (v) => !v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Email inválido' : null,
        phone: (v) => !v || !/^\+?[\d\s\-\(\)]+$/.test(v) ? 'Telefone inválido' : null
      },
      branding: {
        primaryColor: (v) => !v || !/^#[0-9A-F]{6}$/i.test(v) ? 'Cor deve estar no formato #RRGGBB' : null,
        secondaryColor: (v) => !v || !/^#[0-9A-F]{6}$/i.test(v) ? 'Cor deve estar no formato #RRGGBB' : null,
        accentColor: (v) => !v || !/^#[0-9A-F]{6}$/i.test(v) ? 'Cor deve estar no formato #RRGGBB' : null
      },
      content: {
        articlesPerPage: (v) => !v || v < 1 || v > 50 ? 'Deve estar entre 1 e 50' : null,
        defaultImageQuality: (v) => !v || v < 1 || v > 100 ? 'Deve estar entre 1 e 100' : null,
        maxUploadSize: (v) => !v || v < 1 || v > 100 ? 'Deve estar entre 1 e 100 MB' : null
      },
      social: {
        facebook: (v) => v && !/^https?:\/\/(www\.)?facebook\.com\/.+/.test(v) ? 'URL do Facebook inválida' : null,
        instagram: (v) => v && !/^https?:\/\/(www\.)?instagram\.com\/.+/.test(v) ? 'URL do Instagram inválida' : null,
        twitter: (v) => v && !/^https?:\/\/(www\.)?(twitter|x)\.com\/.+/.test(v) ? 'URL do Twitter/X inválida' : null,
        linkedin: (v) => v && !/^https?:\/\/(www\.)?linkedin\.com\/.+/.test(v) ? 'URL do LinkedIn inválida' : null,
        youtube: (v) => v && !/^https?:\/\/(www\.)?youtube\.com\/.+/.test(v) ? 'URL do YouTube inválida' : null,
        whatsapp: (v) => v && !/^\+?[\d\s\-\(\)]+$/.test(v) ? 'Número do WhatsApp inválido' : null
      }
    }

    const validator = errors[section]?.[field]
    return validator ? validator(value) : null
  }

  const handleSave = async () => {
    if (!configuracoes) return
    
    // Validar todos os campos antes de salvar
    const errors: Record<string, string> = {}
    Object.entries(configuracoes).forEach(([section, sectionData]) => {
      Object.entries(sectionData).forEach(([field, value]) => {
        const error = validateField(section, field, value)
        if (error) {
          errors[`${section}.${field}`] = error
        }
      })
    })

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    try {
      await salvarConfiguracoes(configuracoes)
      setHasUnsavedChanges(false)
      setValidationErrors({})
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
    }
  }

  const handleInputChange = (section: string, field: string, value: any) => {
    if (!configuracoes) return
    
    // Validar campo em tempo real
    const error = validateField(section, field, value)
    const errorKey = `${section}.${field}`
    
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      if (error) {
        newErrors[errorKey] = error
      } else {
        delete newErrors[errorKey]
      }
      return newErrors
    })
    
    const novasConfiguracoes = {
      ...configuracoes,
      [section]: {
        ...configuracoes[section as keyof ConfiguracoesCompletas],
        [field]: value
      }
    }
    
    setHasUnsavedChanges(true)
    
    // Atualizar localmente para feedback imediato
    salvarConfiguracoes(novasConfiguracoes)
  }

  const handleReset = async () => {
    if (!confirm('Tem certeza que deseja resetar todas as configurações? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      await resetarConfiguracoes()
      setHasUnsavedChanges(false)
      setValidationErrors({})
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Erro ao resetar configurações:', error)
    }
  }

  // Funções de backup e restore
  const handleBackup = () => {
    if (!configuracoes) return
    const backup = JSON.stringify(configuracoes, null, 2)
    setBackupData(backup)
    setShowBackupModal(true)
  }

  const downloadBackup = () => {
    const blob = new Blob([backupData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `configuracoes-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setShowBackupModal(false)
  }

  const handleRestore = async () => {
    try {
      const parsedData = JSON.parse(restoreData)
      
      // Validar estrutura do backup
      const requiredSections = ['general', 'branding', 'content', 'social']
      const hasValidStructure = requiredSections.every(section => 
        parsedData[section] && typeof parsedData[section] === 'object'
      )

      if (!hasValidStructure) {
        alert('Arquivo de backup inválido. Verifique a estrutura do arquivo.')
        return
      }

      await salvarConfiguracoes(parsedData)
      setHasUnsavedChanges(false)
      setValidationErrors({})
      setShowRestoreModal(false)
      setRestoreData('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      alert('Erro ao restaurar configurações. Verifique se o arquivo está no formato correto.')
      console.error('Erro ao restaurar:', error)
    }
  }

  // Componente para campo com validação
  const renderField = (
    label: string,
    section: string,
    field: string,
    type: string = 'text',
    options?: { value: string; label: string }[],
    placeholder?: string,
    description?: string
  ) => {
    const sectionData = configuracoes?.[section as keyof ConfiguracoesCompletas] as any
    const value = sectionData?.[field] || ''
    const errorKey = `${section}.${field}`
    const hasError = validationErrors[errorKey]
    const isPreview = showPreview && section === 'branding' && (field.includes('Color') || field === 'fontFamily')

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {description && (
            <span className="text-xs text-gray-500 block font-normal mt-1">
              {description}
            </span>
          )}
        </label>
        
        <div className="relative">
          {type === 'select' ? (
            <select
              value={value}
              onChange={(e) => handleInputChange(section, field, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                hasError 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              {options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : type === 'textarea' ? (
            <textarea
              value={value}
              onChange={(e) => handleInputChange(section, field, e.target.value)}
              placeholder={placeholder}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-none ${
                hasError 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
          ) : type === 'color' ? (
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={value}
                onChange={(e) => handleInputChange(section, field, e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => handleInputChange(section, field, e.target.value)}
                placeholder="#000000"
                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  hasError 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {isPreview && (
                <div 
                  className="w-10 h-10 rounded border border-gray-300"
                  style={{ backgroundColor: value }}
                  title="Preview da cor"
                />
              )}
            </div>
          ) : type === 'number' ? (
            <input
              type="number"
              value={value}
              onChange={(e) => handleInputChange(section, field, parseInt(e.target.value) || 0)}
              placeholder={placeholder}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                hasError 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
          ) : type === 'checkbox' ? (
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleInputChange(section, field, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Ativado</span>
            </label>
          ) : (
            <input
              type={type}
              value={value}
              onChange={(e) => handleInputChange(section, field, e.target.value)}
              placeholder={placeholder}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                hasError 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
          )}
        </div>

        {hasError && (
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {hasError}
          </p>
        )}
      </div>
    )
  }

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderField(
          'Nome do Site',
          'general',
          'siteName',
          'text',
          undefined,
          'Digite o nome do seu site',
          'Nome que aparecerá no título e cabeçalho do site'
        )}
        
        {renderField(
          'URL do Site',
          'general',
          'siteUrl',
          'url',
          undefined,
          'https://meusite.com',
          'URL principal do seu site'
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição do Site
        </label>
        <textarea
          value={configuracoes?.general.siteDescription || ''}
          onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderField(
          'Email do Administrador',
          'general',
          'adminEmail',
          'email',
          undefined,
          'admin@meusite.com',
          'Email para notificações administrativas'
        )}
        
        {renderField(
          'Email de Contato',
          'general',
          'contactEmail',
          'email',
          undefined,
          'contato@meusite.com',
          'Email público para contato'
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderField(
          'Telefone',
          'general',
          'phone',
          'tel',
          undefined,
          '+55 (11) 99999-9999',
          'Telefone de contato público'
        )}
        
        {renderField(
          'Endereço',
          'general',
          'address',
          'textarea',
          undefined,
          'Digite o endereço completo',
          'Endereço físico da empresa'
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderField(
          'Fuso Horário',
          'general',
          'timezone',
          'select',
          timezones,
          undefined,
          'Fuso horário para exibição de datas'
        )}
        
        {renderField(
          'Idioma',
          'general',
          'language',
          'select',
          languages,
          undefined,
          'Idioma padrão do site'
        )}
        
        {renderField(
          'Moeda',
          'general',
          'currency',
          'select',
          currencies,
          undefined,
          'Moeda para exibição de preços'
        )}
      </div>
    </div>
  )

  const renderBrandingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderField(
          'Cor Primária',
          'branding',
          'primaryColor',
          'color',
          undefined,
          '#DC2626',
          'Cor principal da marca'
        )}

        {renderField(
          'Cor Secundária',
          'branding',
          'secondaryColor',
          'color',
          undefined,
          '#1F2937',
          'Cor secundária da marca'
        )}

        {renderField(
          'Cor de Destaque',
          'branding',
          'accentColor',
          'color',
          undefined,
          '#F59E0B',
          'Cor para elementos de destaque'
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderField(
          'Família da Fonte',
          'branding',
          'fontFamily',
          'select',
          fontFamilies,
          undefined,
          'Fonte principal do site'
        )}

        {renderField(
          'Estilo do Cabeçalho',
          'branding',
          'headerStyle',
          'select',
          [
            { value: 'modern', label: 'Moderno' },
            { value: 'classic', label: 'Clássico' },
            { value: 'minimal', label: 'Minimalista' }
          ],
          undefined,
          'Estilo visual do cabeçalho'
        )}

        {renderField(
          'Estilo do Rodapé',
          'branding',
          'footerStyle',
          'select',
          [
            { value: 'minimal', label: 'Minimalista' },
            { value: 'detailed', label: 'Detalhado' },
            { value: 'compact', label: 'Compacto' }
          ],
          undefined,
          'Estilo visual do rodapé'
        )}
      </div>
    </div>
  )

  const renderContentTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderField(
          'Artigos por Página',
          'content',
          'articlesPerPage',
          'number',
          undefined,
          '12',
          'Número de artigos exibidos por página'
        )}

        {renderField(
          'Qualidade da Imagem (%)',
          'content',
          'defaultImageQuality',
          'number',
          undefined,
          '85',
          'Qualidade de compressão das imagens (1-100)'
        )}

        {renderField(
          'Tamanho Máximo de Upload (MB)',
          'content',
          'maxUploadSize',
          'number',
          undefined,
          '10',
          'Tamanho máximo para upload de arquivos'
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          Funcionalidades
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderField(
            'Habilitar Comentários',
            'content',
            'enableComments',
            'checkbox',
            undefined,
            undefined,
            'Permite que usuários comentem nos artigos'
          )}

          {renderField(
            'Moderar Comentários',
            'content',
            'moderateComments',
            'checkbox',
            undefined,
            undefined,
            'Comentários precisam de aprovação antes de serem publicados'
          )}

          {renderField(
            'Habilitar Avaliações',
            'content',
            'enableRatings',
            'checkbox',
            undefined,
            undefined,
            'Permite que usuários avaliem os artigos'
          )}

          {renderField(
            'Habilitar Compartilhamento',
            'content',
            'enableSharing',
            'checkbox',
            undefined,
            undefined,
            'Exibe botões de compartilhamento social'
          )}

          {renderField(
            'Habilitar Newsletter',
            'content',
            'enableNewsletter',
            'checkbox',
            undefined,
            undefined,
            'Ativa funcionalidade de newsletter'
          )}

          {renderField(
            'Habilitar Notificações',
            'content',
            'enableNotifications',
            'checkbox',
            undefined,
            undefined,
            'Permite envio de notificações push'
          )}
        </div>
      </div>
    </div>
  )

  const renderSocialTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderField(
          'Facebook',
          'social',
          'facebook',
          'url',
          undefined,
          'https://facebook.com/suapagina',
          'URL da página no Facebook'
        )}

        {renderField(
          'Instagram',
          'social',
          'instagram',
          'url',
          undefined,
          'https://instagram.com/seuperfil',
          'URL do perfil no Instagram'
        )}

        {renderField(
          'Twitter',
          'social',
          'twitter',
          'url',
          undefined,
          'https://twitter.com/seuperfil',
          'URL do perfil no Twitter/X'
        )}

        {renderField(
          'LinkedIn',
          'social',
          'linkedin',
          'url',
          undefined,
          'https://linkedin.com/company/suaempresa',
          'URL da empresa no LinkedIn'
        )}

        {renderField(
          'YouTube',
          'social',
          'youtube',
          'url',
          undefined,
          'https://youtube.com/c/seucanal',
          'URL do canal no YouTube'
        )}

        {renderField(
          'WhatsApp',
          'social',
          'whatsapp',
          'tel',
          undefined,
          '+244 900 000 000',
          'Número do WhatsApp para contato'
        )}
      </div>
    </div>
  )

  const renderCookiesTab = () => (
    <div className="space-y-6">
      {/* Configurações Gerais de Cookies */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">Sistema de Cookies</h3>
            <p className="text-sm text-blue-700 mt-1">
              Configure as políticas de cookies para conformidade com LGPD e GDPR. 
              As configurações aqui definidas afetam o comportamento do banner de cookies e as preferências dos usuários.
            </p>
          </div>
        </div>
      </div>

      {/* Banner de Cookies */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Cookie className="w-5 h-5 mr-2 text-red-600" />
          Banner de Cookies
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked={true}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Exibir banner de cookies para novos visitantes</span>
            </label>
            <p className="text-xs text-gray-500 ml-7">Banner será exibido automaticamente para usuários que ainda não deram consentimento</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texto do Banner
            </label>
            <textarea
              defaultValue="Este site utiliza cookies para melhorar sua experiência de navegação, analisar o tráfego e personalizar o conteúdo. Ao continuar navegando, você concorda com nossa política de cookies."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto do Botão "Aceitar"
              </label>
              <input
                type="text"
                defaultValue="Aceitar Todos"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto do Botão "Personalizar"
              </label>
              <input
                type="text"
                defaultValue="Personalizar"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categorias de Cookies */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorias de Cookies</h3>
        
        <div className="space-y-6">
          {/* Cookies Necessários */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Cookies Necessários</h4>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Sempre Ativo</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Estes cookies são essenciais para o funcionamento básico do site e não podem ser desabilitados.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição para o usuário
              </label>
              <textarea
                defaultValue="Cookies essenciais para o funcionamento do site, incluindo autenticação, segurança e preferências básicas."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Cookies Funcionais */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Cookies Funcionais</h4>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-600">Habilitado por padrão</span>
              </label>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Melhoram a funcionalidade do site, como lembrar preferências e configurações.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição para o usuário
              </label>
              <textarea
                defaultValue="Cookies que melhoram a experiência do usuário, lembrando preferências como idioma, tema e configurações personalizadas."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Cookies de Análise */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Cookies de Análise</h4>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked={false}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-600">Habilitado por padrão</span>
              </label>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Ajudam a entender como os visitantes interagem com o site através de dados estatísticos.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição para o usuário
                </label>
                <textarea
                  defaultValue="Cookies que coletam informações sobre como você usa o site, ajudando-nos a melhorar o desempenho e a experiência do usuário."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  defaultValue={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Cookies de Marketing */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Cookies de Marketing</h4>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked={false}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-600">Habilitado por padrão</span>
              </label>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Utilizados para rastrear visitantes e exibir anúncios relevantes e personalizados.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição para o usuário
              </label>
              <textarea
                defaultValue="Cookies utilizados para personalizar anúncios e medir a eficácia de campanhas publicitárias."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Configurações Avançadas */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações Avançadas</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duração do Consentimento (dias)
              </label>
              <input
                type="number"
                defaultValue={365}
                min={1}
                max={730}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Por quanto tempo lembrar das preferências do usuário</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posição do Banner
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                <option value="bottom">Parte Inferior</option>
                <option value="top">Parte Superior</option>
                <option value="center">Centro da Tela</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked={true}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Permitir que usuários alterem preferências a qualquer momento</span>
            </label>
            <p className="text-xs text-gray-500 ml-7">Adiciona link "Configurações de Cookies" no rodapé</p>
          </div>

          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked={true}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Registrar logs de consentimento</span>
            </label>
            <p className="text-xs text-gray-500 ml-7">Manter histórico de quando usuários deram/alteraram consentimento</p>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Testar Banner
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            Resetar Consentimentos
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            Exportar Configurações
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            Ver Logs de Consentimento
          </button>
        </div>
      </div>
    </div>
  )

  if (!isMounted) {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-red-600" />
          <span className="text-gray-600">Carregando configurações...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar configurações</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={recarregar}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações Gerais</h1>
          <p className="text-gray-600 mt-1">Gerencie as configurações básicas do sistema.</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
          
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Resetar</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-green-800">Configurações salvas com sucesso!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {activeTab === 'general' && renderGeneralTab()}
          {activeTab === 'branding' && renderBrandingTab()}
          {activeTab === 'content' && renderContentTab()}
          {activeTab === 'social' && renderSocialTab()}
          {activeTab === 'cookies' && renderCookiesTab()}
        </div>

      {/* Barra de Ações Avançada */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          {/* Indicadores de Status */}
          <div className="flex items-center space-x-4">
            {hasUnsavedChanges && (
              <div className="flex items-center text-amber-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">Alterações não salvas</span>
              </div>
            )}
            
            {Object.keys(validationErrors).length > 0 && (
              <div className="flex items-center text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{Object.keys(validationErrors).length} erro(s) de validação</span>
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-4 py-2 border rounded-lg transition-colors flex items-center ${
                showPreview 
                  ? 'bg-blue-50 border-blue-300 text-blue-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Ocultar Preview' : 'Mostrar Preview'}
            </button>

            <button
              onClick={handleBackup}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Backup
            </button>

            <button
              onClick={() => setShowRestoreModal(true)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <Upload className="w-4 h-4 mr-2" />
              Restaurar
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Resetar
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving || Object.keys(validationErrors).length > 0}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Backup */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Backup das Configurações</h3>
              <button
                onClick={() => setShowBackupModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Copie o conteúdo abaixo ou faça o download do arquivo de backup:
              </p>
              
              <textarea
                value={backupData}
                readOnly
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs"
              />
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowBackupModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(backupData)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Copiar
                </button>
                <button
                  onClick={downloadBackup}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Restore */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Restaurar Configurações</h3>
              <button
                onClick={() => setShowRestoreModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Cole o conteúdo do backup ou carregue um arquivo:
              </p>
              
              <textarea
                value={restoreData}
                onChange={(e) => setRestoreData(e.target.value)}
                placeholder="Cole aqui o JSON do backup..."
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs"
              />
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRestoreModal(false)
                    setRestoreData('')
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRestore}
                  disabled={!restoreData.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Restaurar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeneralSettings