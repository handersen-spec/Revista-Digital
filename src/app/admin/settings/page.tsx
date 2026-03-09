'use client'

import { useState, useEffect, useRef } from 'react'
import { generateCSV, generateExcel, generateJSON, downloadFile } from '@/lib/export'
import { 
  Settings, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Database, 
  Mail, 
  Key, 
  Users, 
  Lock, 
  Eye, 
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
  Monitor,
  Smartphone,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Activity,
  Zap,
  FileText,
  Image,
  Video,
  Music,
  Code,
  Link,
  Share2,
  MessageSquare,
  Heart,
  Star,
  Award,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  MapPin,
  Phone,
  AtSign,
  Building,
  CreditCard,
  DollarSign,
  Percent,
  Tag,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Copy,
  Scissors,
  Clipboard,
  Undo,
  Redo,
  Edit,
  Plus,
  Minus,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Home,
  Folder,
  File,
  Archive,
  Bookmark,
  Flag,
  Layers,
  Package,
  Briefcase,
  ShoppingCart,
  CreditCard as Card,
  Truck,
  MapPin as Location,
  Navigation,
  Compass,
  Route,
  Car,
  Fuel,
  Gauge,
  Wrench,
  Cog,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Radio,
  Bluetooth,
  Headphones,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  PlayCircle,
  PauseCircle,
  StopCircle,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  VolumeX as Mute,
  Volume1,
  Volume2 as VolumeMax,
  Battery,
  BatteryLow,
  Power,
  PowerOff,
  Plug,
  PlugZap,
  Lightbulb,
  Flashlight,
  Thermometer,
  Droplets,
  Wind,
  Cloud,
  CloudRain,
  Sun as Sunny,
  Moon as Lunar,
  Sunrise,
  Sunset,
  Rainbow,
  Umbrella,
  Snowflake,
  Zap as Lightning
} from 'lucide-react'

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [showPassword, setShowPassword] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const exportMenuRef = useRef<HTMLDivElement>(null)
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Auto Prestige Angola',
    siteDescription: 'A maior plataforma automotiva de Angola',
    siteUrl: 'https://autoprestige.ao',
    adminEmail: 'admin@autoprestige.ao',
    timezone: 'Africa/Luanda',
    language: 'pt',
    currency: 'AOA',
    
    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    loginAttempts: 5,
    ipWhitelist: '',
    sslEnabled: true,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    notificationFrequency: 'immediate',
    
    // Appearance Settings
    theme: 'light',
    primaryColor: '#dc2626',
    secondaryColor: '#1f2937',
    fontFamily: 'Inter',
    fontSize: 'medium',
    
    // Content Settings
    autoPublish: false,
    moderationRequired: true,
    allowComments: true,
    allowRatings: true,
    maxFileSize: 10,
    allowedFileTypes: 'jpg,png,gif,pdf,doc,docx',
    
    // SEO Settings
    metaTitle: 'Auto Prestige Angola - Revista Digital Automotiva',
    metaDescription: 'Descubra as últimas novidades do mundo automotivo em Angola',
    metaKeywords: 'carros, automóveis, angola, revista, digital',
    googleAnalytics: '',
    facebookPixel: '',
    
    // API Settings
    apiRateLimit: 1000,
    apiCaching: true,
    apiLogging: true,
    webhookUrl: '',
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30,
    cloudBackup: true,
    
    // Performance Settings
    cacheEnabled: true,
    compressionEnabled: true,
    cdnEnabled: true,
    lazyLoading: true,
    
    // Social Media
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    youtubeUrl: '',
    linkedinUrl: ''
  })

  // Estado para status do sistema de email
  const [emailStatus, setEmailStatus] = useState({
    configurado: false,
    modo: 'simulacao',
    host: 'não configurado',
    usuario: 'não configurado',
    loading: true
  })

  // Carregar status do email ao montar o componente
  useEffect(() => {
    const carregarStatusEmail = async () => {
      try {
        const response = await fetch('/api/notifications/email')
        if (response.ok) {
          const data = await response.json()
          setEmailStatus({
            ...data,
            loading: false
          })
        }
      } catch (error) {
        console.error('Erro ao carregar status do email:', error)
        setEmailStatus(prev => ({ ...prev, loading: false }))
      }
    }

    carregarStatusEmail()
  }, [])

  // Fechar menu de exportação ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const tabs = [
    { id: 'general', label: 'Geral', icon: Settings },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'content', label: 'Conteúdo', icon: FileText },
    { id: 'seo', label: 'SEO', icon: TrendingUp },
    { id: 'api', label: 'API', icon: Code },
    { id: 'backup', label: 'Backup', icon: Database },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'social', label: 'Redes Sociais', icon: Share2 }
  ]

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    // Simulate save
    console.log('Saving settings:', settings)
    // Show success message
  }

  const handleReset = () => {
    // Reset to defaults
    console.log('Resetting settings to defaults')
  }

  const handleExport = () => {
    // Export settings
    const dataStr = JSON.stringify(settings, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'auto-prestige-settings.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleExportSettings = (format: 'csv' | 'excel' | 'json') => {
    const headers = ['Chave', 'Valor']
    const rows = Object.entries(settings).map(([key, value]) => [key, typeof value === 'object' ? JSON.stringify(value) : value])

    if (format === 'csv') {
      const csv = generateCSV(headers, rows)
      downloadFile(csv, 'text/csv', 'csv', 'auto-prestige-settings')
    } else if (format === 'excel') {
      const table = generateExcel(headers, rows)
      downloadFile(table, 'application/vnd.ms-excel', 'xls', 'auto-prestige-settings')
    } else {
      const json = generateJSON([{ ...settings }])
      downloadFile(json, 'application/json', 'json', 'auto-prestige-settings')
    }
    setShowExportMenu(false)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string)
          setSettings(importedSettings)
        } catch (error) {
          console.error('Error importing settings:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Site
          </label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => handleSettingChange('siteName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL do Site
          </label>
          <input
            type="url"
            value={settings.siteUrl}
            onChange={(e) => handleSettingChange('siteUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email do Administrador
          </label>
          <input
            type="email"
            value={settings.adminEmail}
            onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuso Horário
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => handleSettingChange('timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="Africa/Luanda">África/Luanda</option>
            <option value="UTC">UTC</option>
            <option value="Europe/Lisbon">Europa/Lisboa</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Idioma
          </label>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="pt">Português</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Moeda
          </label>
          <select
            value={settings.currency}
            onChange={(e) => handleSettingChange('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="AOA">Kwanza (AOA)</option>
            <option value="USD">Dólar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição do Site
        </label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Autenticação de Dois Fatores</h4>
            <p className="text-sm text-gray-600">Adiciona uma camada extra de segurança</p>
          </div>
          <button
            onClick={() => handleSettingChange('twoFactorAuth', !settings.twoFactorAuth)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.twoFactorAuth ? 'bg-red-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">SSL Habilitado</h4>
            <p className="text-sm text-gray-600">Criptografia de dados em trânsito</p>
          </div>
          <button
            onClick={() => handleSettingChange('sslEnabled', !settings.sslEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.sslEnabled ? 'bg-red-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.sslEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timeout de Sessão (minutos)
          </label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Política de Senha
          </label>
          <select
            value={settings.passwordPolicy}
            onChange={(e) => handleSettingChange('passwordPolicy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="weak">Fraca</option>
            <option value="medium">Média</option>
            <option value="strong">Forte</option>
            <option value="very-strong">Muito Forte</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tentativas de Login Máximas
          </label>
          <input
            type="number"
            value={settings.loginAttempts}
            onChange={(e) => handleSettingChange('loginAttempts', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lista Branca de IPs (um por linha)
        </label>
        <textarea
          value={settings.ipWhitelist}
          onChange={(e) => handleSettingChange('ipWhitelist', e.target.value)}
          rows={4}
          placeholder="192.168.1.1&#10;10.0.0.1"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      {/* Status do Sistema de Email */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-red-600" />
            Sistema de Email
          </h3>
          {emailStatus.loading ? (
            <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
          ) : (
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              emailStatus.configurado 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {emailStatus.configurado ? 'Configurado' : 'Modo Simulação'}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Modo:</span>
            <span className="ml-2 text-gray-600">{emailStatus.modo}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Host SMTP:</span>
            <span className="ml-2 text-gray-600">{emailStatus.host}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Usuário:</span>
            <span className="ml-2 text-gray-600">{emailStatus.usuario}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Status:</span>
            <span className={`ml-2 ${
              emailStatus.configurado ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {emailStatus.configurado ? 'Ativo' : 'Simulação'}
            </span>
          </div>
        </div>
        
        {!emailStatus.configurado && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Modo de Simulação Ativo</p>
                <p className="mt-1">
                  Os emails não estão sendo enviados realmente. Configure as variáveis de ambiente SMTP para ativar o envio real.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Notificações por Email</h4>
            <p className="text-sm text-gray-600">Receber notificações via email</p>
          </div>
          <button
            onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.emailNotifications ? 'bg-red-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Notificações Push</h4>
            <p className="text-sm text-gray-600">Notificações no navegador</p>
          </div>
          <button
            onClick={() => handleSettingChange('pushNotifications', !settings.pushNotifications)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.pushNotifications ? 'bg-red-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Notificações SMS</h4>
            <p className="text-sm text-gray-600">Receber SMS para alertas críticos</p>
          </div>
          <button
            onClick={() => handleSettingChange('smsNotifications', !settings.smsNotifications)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.smsNotifications ? 'bg-red-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frequência de Notificações
          </label>
          <select
            value={settings.notificationFrequency}
            onChange={(e) => handleSettingChange('notificationFrequency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="immediate">Imediata</option>
            <option value="hourly">A cada hora</option>
            <option value="daily">Diária</option>
            <option value="weekly">Semanal</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tema
          </label>
          <select
            value={settings.theme}
            onChange={(e) => handleSettingChange('theme', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
            <option value="auto">Automático</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Família da Fonte
          </label>
          <select
            value={settings.fontFamily}
            onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tamanho da Fonte
          </label>
          <select
            value={settings.fontSize}
            onChange={(e) => handleSettingChange('fontSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="small">Pequena</option>
            <option value="medium">Média</option>
            <option value="large">Grande</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cor Primária
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={settings.primaryColor}
              onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cor Secundária
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={settings.secondaryColor}
              onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={settings.secondaryColor}
              onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderContentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Publicação Automática</h4>
            <p className="text-sm text-gray-600">Publicar conteúdo automaticamente</p>
          </div>
          <button
            onClick={() => handleSettingChange('autoPublish', !settings.autoPublish)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.autoPublish ? 'bg-red-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.autoPublish ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Moderação Obrigatória</h4>
            <p className="text-sm text-gray-600">Revisar conteúdo antes da publicação</p>
          </div>
          <button
            onClick={() => handleSettingChange('moderationRequired', !settings.moderationRequired)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.moderationRequired ? 'bg-red-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.moderationRequired ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Permitir Comentários</h4>
            <p className="text-sm text-gray-600">Usuários podem comentar no conteúdo</p>
          </div>
          <button
            onClick={() => handleSettingChange('allowComments', !settings.allowComments)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.allowComments ? 'bg-red-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.allowComments ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Permitir Avaliações</h4>
            <p className="text-sm text-gray-600">Usuários podem avaliar o conteúdo</p>
          </div>
          <button
            onClick={() => handleSettingChange('allowRatings', !settings.allowRatings)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.allowRatings ? 'bg-red-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.allowRatings ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tamanho Máximo de Arquivo (MB)
          </label>
          <input
            type="number"
            value={settings.maxFileSize}
            onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipos de Arquivo Permitidos
          </label>
          <input
            type="text"
            value={settings.allowedFileTypes}
            onChange={(e) => handleSettingChange('allowedFileTypes', e.target.value)}
            placeholder="jpg,png,gif,pdf,doc,docx"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )

  const renderSEOSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Título
        </label>
        <input
          type="text"
          value={settings.metaTitle}
          onChange={(e) => handleSettingChange('metaTitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Descrição
        </label>
        <textarea
          value={settings.metaDescription}
          onChange={(e) => handleSettingChange('metaDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Palavras-chave
        </label>
        <input
          type="text"
          value={settings.metaKeywords}
          onChange={(e) => handleSettingChange('metaKeywords', e.target.value)}
          placeholder="palavra1, palavra2, palavra3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Analytics ID
          </label>
          <input
            type="text"
            value={settings.googleAnalytics}
            onChange={(e) => handleSettingChange('googleAnalytics', e.target.value)}
            placeholder="GA-XXXXXXXXX-X"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facebook Pixel ID
          </label>
          <input
            type="text"
            value={settings.facebookPixel}
            onChange={(e) => handleSettingChange('facebookPixel', e.target.value)}
            placeholder="XXXXXXXXXXXXXXX"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )

  const renderAPISettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Limite de Taxa da API (por hora)
          </label>
          <input
            type="number"
            value={settings.apiRateLimit}
            onChange={(e) => handleSettingChange('apiRateLimit', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL do Webhook
          </label>
          <input
            type="url"
            value={settings.webhookUrl}
            onChange={(e) => handleSettingChange('webhookUrl', e.target.value)}
            placeholder="https://example.com/webhook"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Cache da API</h4>
            <p className="text-sm text-gray-600">Habilitar cache para melhor performance</p>
          </div>
          <button
            onClick={() => handleSettingChange('apiCaching', !settings.apiCaching)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.apiCaching ? 'bg-red-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.apiCaching ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Log da API</h4>
            <p className="text-sm text-gray-600">Registrar todas as chamadas da API</p>
          </div>
          <button
            onClick={() => handleSettingChange('apiLogging', !settings.apiLogging)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.apiLogging ? 'bg-red-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.apiLogging ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Backup Automático</h4>
            <p className="text-sm text-gray-600">Fazer backup automaticamente</p>
          </div>
          <button
            onClick={() => handleSettingChange('autoBackup', !settings.autoBackup)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.autoBackup ? 'bg-red-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Backup na Nuvem</h4>
            <p className="text-sm text-gray-600">Armazenar backups na nuvem</p>
          </div>
          <button
            onClick={() => handleSettingChange('cloudBackup', !settings.cloudBackup)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.cloudBackup ? 'bg-red-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.cloudBackup ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frequência do Backup
          </label>
          <select
            value={settings.backupFrequency}
            onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="hourly">A cada hora</option>
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Retenção de Backup (dias)
          </label>
          <input
            type="number"
            value={settings.backupRetention}
            onChange={(e) => handleSettingChange('backupRetention', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Fazer Backup Agora</span>
        </button>
        
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <Upload className="w-4 h-4" />
          <span>Restaurar Backup</span>
        </button>
      </div>
    </div>
  )

  const renderPerformanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Cache Habilitado</h4>
            <p className="text-sm text-gray-600">Melhorar velocidade de carregamento</p>
          </div>
          <button
            onClick={() => handleSettingChange('cacheEnabled', !settings.cacheEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.cacheEnabled ? 'bg-red-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.cacheEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Compressão Habilitada</h4>
            <p className="text-sm text-gray-600">Comprimir arquivos para menor tamanho</p>
          </div>
          <button
            onClick={() => handleSettingChange('compressionEnabled', !settings.compressionEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.compressionEnabled ? 'bg-red-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.compressionEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">CDN Habilitado</h4>
            <p className="text-sm text-gray-600">Usar rede de distribuição de conteúdo</p>
          </div>
          <button
            onClick={() => handleSettingChange('cdnEnabled', !settings.cdnEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.cdnEnabled ? 'bg-red-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.cdnEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Lazy Loading</h4>
            <p className="text-sm text-gray-600">Carregar imagens sob demanda</p>
          </div>
          <button
            onClick={() => handleSettingChange('lazyLoading', !settings.lazyLoading)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.lazyLoading ? 'bg-red-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.lazyLoading ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )

  const renderSocialSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facebook URL
          </label>
          <input
            type="url"
            value={settings.facebookUrl}
            onChange={(e) => handleSettingChange('facebookUrl', e.target.value)}
            placeholder="https://facebook.com/autoprestigeangola"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instagram URL
          </label>
          <input
            type="url"
            value={settings.instagramUrl}
            onChange={(e) => handleSettingChange('instagramUrl', e.target.value)}
            placeholder="https://instagram.com/autoprestigeangola"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Twitter URL
          </label>
          <input
            type="url"
            value={settings.twitterUrl}
            onChange={(e) => handleSettingChange('twitterUrl', e.target.value)}
            placeholder="https://twitter.com/autoprestigeangola"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            YouTube URL
          </label>
          <input
            type="url"
            value={settings.youtubeUrl}
            onChange={(e) => handleSettingChange('youtubeUrl', e.target.value)}
            placeholder="https://youtube.com/@autoprestigeangola"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn URL
          </label>
          <input
            type="url"
            value={settings.linkedinUrl}
            onChange={(e) => handleSettingChange('linkedinUrl', e.target.value)}
            placeholder="https://linkedin.com/company/autoprestigeangola"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'security':
        return renderSecuritySettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'appearance':
        return renderAppearanceSettings()
      case 'content':
        return renderContentSettings()
      case 'seo':
        return renderSEOSettings()
      case 'api':
        return renderAPISettings()
      case 'backup':
        return renderBackupSettings()
      case 'performance':
        return renderPerformanceSettings()
      case 'social':
        return renderSocialSettings()
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
          <p className="text-gray-600 mt-1">Gerencie todas as configurações da plataforma Auto Prestige Angola.</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Resetar</span>
          </button>
          
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setShowExportMenu(prev => !prev)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => handleExportSettings('csv')}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  CSV
                </button>
                <button
                  onClick={() => handleExportSettings('excel')}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Excel
                </button>
                <button
                  onClick={() => handleExportSettings('json')}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  JSON
                </button>
              </div>
            )}
          </div>
          
          <label className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Importar</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Salvar</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
