'use client'

import { useState, useEffect } from 'react'
import { 
  Zap, 
  Database, 
  Image, 
  Globe, 
  Server, 
  Clock, 
  BarChart3, 
  Settings, 
  RefreshCw, 
  Save, 
  Check, 
  AlertCircle, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  HardDrive, 
  Wifi, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Laptop,
  Download,
  Upload,
  Eye,
  Trash2,
  Plus,
  Edit
} from 'lucide-react'

const PerformanceSettings = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('cache')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const [performanceSettings, setPerformanceSettings] = useState({
    cache: {
      enableBrowserCache: true,
      browserCacheTTL: 86400,
      enableServerCache: true,
      serverCacheTTL: 3600,
      enableDatabaseCache: true,
      databaseCacheTTL: 1800,
      enableCDN: true,
      cdnProvider: 'cloudflare',
      cacheCompression: true,
      cachePreloading: true
    },
    images: {
      enableCompression: true,
      compressionQuality: 85,
      enableWebP: true,
      enableLazyLoading: true,
      enableResponsiveImages: true,
      maxImageSize: 2048,
      thumbnailSizes: [150, 300, 600, 1200],
      enableImageOptimization: true
    },
    minification: {
      enableCSSMinification: true,
      enableJSMinification: true,
      enableHTMLMinification: true,
      removeCSSComments: true,
      removeJSComments: true,
      combineFiles: true,
      enableGzip: true
    },
    database: {
      enableQueryCache: true,
      queryCacheTTL: 3600,
      enableIndexOptimization: true,
      enableSlowQueryLog: true,
      slowQueryThreshold: 2,
      maxConnections: 100,
      connectionTimeout: 30
    }
  })

  const [performanceMetrics, setPerformanceMetrics] = useState({
    pageLoadTime: 2.3,
    firstContentfulPaint: 1.2,
    largestContentfulPaint: 2.8,
    firstInputDelay: 0.1,
    cumulativeLayoutShift: 0.05,
    timeToInteractive: 3.1,
    totalBlockingTime: 0.3,
    speedIndex: 2.5
  })

  const [cacheStats, setCacheStats] = useState({
    hitRate: 85.6,
    missRate: 14.4,
    totalRequests: 15420,
    cachedRequests: 13200,
    cacheSize: '2.4 GB',
    lastCleared: '2024-01-10T08:00:00Z'
  })

  const tabs = [
    { id: 'cache', label: 'Cache', icon: Database },
    { id: 'images', label: 'Imagens', icon: Image },
    { id: 'minification', label: 'Minificação', icon: Zap },
    { id: 'database', label: 'Base de Dados', icon: Server },
    { id: 'monitoring', label: 'Monitoramento', icon: BarChart3 }
  ]

  const cacheTTLOptions = [
    { value: 300, label: '5 minutos' },
    { value: 900, label: '15 minutos' },
    { value: 1800, label: '30 minutos' },
    { value: 3600, label: '1 hora' },
    { value: 7200, label: '2 horas' },
    { value: 14400, label: '4 horas' },
    { value: 28800, label: '8 horas' },
    { value: 86400, label: '24 horas' },
    { value: 604800, label: '7 dias' }
  ]

  const cdnProviders = [
    { value: 'cloudflare', label: 'Cloudflare' },
    { value: 'aws', label: 'Amazon CloudFront' },
    { value: 'google', label: 'Google Cloud CDN' },
    { value: 'azure', label: 'Azure CDN' },
    { value: 'custom', label: 'CDN Personalizado' }
  ]

  const compressionQualities = [
    { value: 60, label: '60% - Baixa qualidade' },
    { value: 70, label: '70% - Qualidade média' },
    { value: 80, label: '80% - Boa qualidade' },
    { value: 85, label: '85% - Alta qualidade' },
    { value: 90, label: '90% - Muito alta qualidade' },
    { value: 95, label: '95% - Qualidade máxima' }
  ]

  const handleSave = async () => {
    setIsLoading(true)
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setShowSuccess(true)
    
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleInputChange = (section: string, field: string, value: any) => {
    setPerformanceSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const clearCache = async (type: string) => {
    // Simular limpeza de cache
    console.log(`Clearing ${type} cache...`)
  }

  const getPerformanceScore = () => {
    const metrics = performanceMetrics
    let score = 100
    
    if (metrics.pageLoadTime > 3) score -= 20
    if (metrics.firstContentfulPaint > 1.8) score -= 15
    if (metrics.largestContentfulPaint > 2.5) score -= 15
    if (metrics.firstInputDelay > 0.1) score -= 10
    if (metrics.cumulativeLayoutShift > 0.1) score -= 10
    
    return Math.max(score, 0)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-50'
    if (score >= 70) return 'bg-yellow-50'
    return 'bg-red-50'
  }

  const renderCacheTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cache do Navegador</h3>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.cache.enableBrowserCache}
                onChange={(e) => handleInputChange('cache', 'enableBrowserCache', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-900">Ativar cache do navegador</span>
            </label>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TTL do Cache (segundos)
              </label>
              <select
                value={performanceSettings.cache.browserCacheTTL}
                onChange={(e) => handleInputChange('cache', 'browserCacheTTL', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {cacheTTLOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cache do Servidor</h3>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.cache.enableServerCache}
                onChange={(e) => handleInputChange('cache', 'enableServerCache', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-900">Ativar cache do servidor</span>
            </label>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TTL do Cache (segundos)
              </label>
              <select
                value={performanceSettings.cache.serverCacheTTL}
                onChange={(e) => handleInputChange('cache', 'serverCacheTTL', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {cacheTTLOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cache da Base de Dados</h3>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.cache.enableDatabaseCache}
                onChange={(e) => handleInputChange('cache', 'enableDatabaseCache', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-900">Ativar cache da base de dados</span>
            </label>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TTL do Cache (segundos)
              </label>
              <select
                value={performanceSettings.cache.databaseCacheTTL}
                onChange={(e) => handleInputChange('cache', 'databaseCacheTTL', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {cacheTTLOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">CDN</h3>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.cache.enableCDN}
                onChange={(e) => handleInputChange('cache', 'enableCDN', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-900">Ativar CDN</span>
            </label>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provedor CDN
              </label>
              <select
                value={performanceSettings.cache.cdnProvider}
                onChange={(e) => handleInputChange('cache', 'cdnProvider', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {cdnProviders.map(provider => (
                  <option key={provider.value} value={provider.value}>{provider.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações Avançadas</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.cache.cacheCompression}
                onChange={(e) => handleInputChange('cache', 'cacheCompression', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Compressão de cache</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.cache.cachePreloading}
                onChange={(e) => handleInputChange('cache', 'cachePreloading', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Pré-carregamento de cache</span>
            </label>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Estatísticas do Cache</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Taxa de acerto:</span>
                <span className="text-sm font-medium text-green-600">{cacheStats.hitRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tamanho do cache:</span>
                <span className="text-sm font-medium text-gray-900">{cacheStats.cacheSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total de requisições:</span>
                <span className="text-sm font-medium text-gray-900">{cacheStats.totalRequests.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ações de Cache</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <button
            onClick={() => clearCache('browser')}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpar Cache do Navegador</span>
          </button>
          
          <button
            onClick={() => clearCache('server')}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpar Cache do Servidor</span>
          </button>
          
          <button
            onClick={() => clearCache('all')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpar Todo o Cache</span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderImagesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Compressão de Imagens</h3>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.images.enableCompression}
                onChange={(e) => handleInputChange('images', 'enableCompression', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-900">Ativar compressão de imagens</span>
            </label>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualidade da compressão
              </label>
              <select
                value={performanceSettings.images.compressionQuality}
                onChange={(e) => handleInputChange('images', 'compressionQuality', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {compressionQualities.map(quality => (
                  <option key={quality.value} value={quality.value}>{quality.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamanho máximo de imagem (KB)
              </label>
              <input
                type="number"
                value={performanceSettings.images.maxImageSize}
                onChange={(e) => handleInputChange('images', 'maxImageSize', parseInt(e.target.value))}
                min="100"
                max="10240"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Formatos e Otimizações</h3>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.images.enableWebP}
                onChange={(e) => handleInputChange('images', 'enableWebP', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Converter para WebP</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.images.enableLazyLoading}
                onChange={(e) => handleInputChange('images', 'enableLazyLoading', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Carregamento preguiçoso (lazy loading)</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.images.enableResponsiveImages}
                onChange={(e) => handleInputChange('images', 'enableResponsiveImages', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Imagens responsivas</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.images.enableImageOptimization}
                onChange={(e) => handleInputChange('images', 'enableImageOptimization', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Otimização automática</span>
            </label>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tamanhos de Miniaturas</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceSettings.images.thumbnailSizes.map((size, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamanho {index + 1} (px)
              </label>
              <input
                type="number"
                value={size}
                onChange={(e) => {
                  const newSizes = [...performanceSettings.images.thumbnailSizes]
                  newSizes[index] = parseInt(e.target.value)
                  handleInputChange('images', 'thumbnailSizes', newSizes)
                }}
                min="50"
                max="2048"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderMinificationTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Minificação de Arquivos</h3>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.minification.enableCSSMinification}
                onChange={(e) => handleInputChange('minification', 'enableCSSMinification', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Minificar CSS</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.minification.enableJSMinification}
                onChange={(e) => handleInputChange('minification', 'enableJSMinification', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Minificar JavaScript</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.minification.enableHTMLMinification}
                onChange={(e) => handleInputChange('minification', 'enableHTMLMinification', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Minificar HTML</span>
            </label>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Otimizações Avançadas</h3>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.minification.removeCSSComments}
                onChange={(e) => handleInputChange('minification', 'removeCSSComments', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Remover comentários CSS</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.minification.removeJSComments}
                onChange={(e) => handleInputChange('minification', 'removeJSComments', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Remover comentários JavaScript</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.minification.combineFiles}
                onChange={(e) => handleInputChange('minification', 'combineFiles', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Combinar arquivos</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.minification.enableGzip}
                onChange={(e) => handleInputChange('minification', 'enableGzip', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Compressão Gzip</span>
            </label>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Informação</p>
              <p className="text-sm text-blue-700">
                A minificação pode reduzir significativamente o tamanho dos arquivos, 
                melhorando o tempo de carregamento. Teste sempre após ativar para 
                garantir que não há problemas de funcionalidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDatabaseTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cache de Consultas</h3>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.database.enableQueryCache}
                onChange={(e) => handleInputChange('database', 'enableQueryCache', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-900">Ativar cache de consultas</span>
            </label>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TTL do Cache de Consultas (segundos)
              </label>
              <select
                value={performanceSettings.database.queryCacheTTL}
                onChange={(e) => handleInputChange('database', 'queryCacheTTL', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {cacheTTLOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Otimizações</h3>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.database.enableIndexOptimization}
                onChange={(e) => handleInputChange('database', 'enableIndexOptimization', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Otimização automática de índices</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={performanceSettings.database.enableSlowQueryLog}
                onChange={(e) => handleInputChange('database', 'enableSlowQueryLog', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Log de consultas lentas</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Limite de consultas lentas (segundos)
          </label>
          <input
            type="number"
            value={performanceSettings.database.slowQueryThreshold}
            onChange={(e) => handleInputChange('database', 'slowQueryThreshold', parseFloat(e.target.value))}
            min="0.1"
            max="10"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Máximo de conexões
          </label>
          <input
            type="number"
            value={performanceSettings.database.maxConnections}
            onChange={(e) => handleInputChange('database', 'maxConnections', parseInt(e.target.value))}
            min="10"
            max="1000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timeout de conexão (segundos)
          </label>
          <input
            type="number"
            value={performanceSettings.database.connectionTimeout}
            onChange={(e) => handleInputChange('database', 'connectionTimeout', parseInt(e.target.value))}
            min="5"
            max="300"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )

  const renderMonitoringTab = () => {
    const performanceScore = getPerformanceScore()
    
    return (
      <div className="space-y-6">
        {/* Performance Score */}
        <div className={`${getScoreBgColor(performanceScore)} rounded-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Pontuação de Performance</h3>
            <div className={`text-3xl font-bold ${getScoreColor(performanceScore)}`}>
              {performanceScore}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${performanceScore >= 90 ? 'bg-green-500' : performanceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${performanceScore}%` }}
            ></div>
          </div>
        </div>

        {/* Core Web Vitals */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Core Web Vitals</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">LCP</h4>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {performanceMetrics.largestContentfulPaint}s
              </div>
              <p className="text-sm text-gray-600">Largest Contentful Paint</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">FID</h4>
                <Zap className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {performanceMetrics.firstInputDelay}s
              </div>
              <p className="text-sm text-gray-600">First Input Delay</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">CLS</h4>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {performanceMetrics.cumulativeLayoutShift}
              </div>
              <p className="text-sm text-gray-600">Cumulative Layout Shift</p>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Métricas Adicionais</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Tempo de carregamento da página</span>
                <span className="text-sm font-bold text-gray-900">{performanceMetrics.pageLoadTime}s</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">First Contentful Paint</span>
                <span className="text-sm font-bold text-gray-900">{performanceMetrics.firstContentfulPaint}s</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Time to Interactive</span>
                <span className="text-sm font-bold text-gray-900">{performanceMetrics.timeToInteractive}s</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total Blocking Time</span>
                <span className="text-sm font-bold text-gray-900">{performanceMetrics.totalBlockingTime}s</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Speed Index</span>
                <span className="text-sm font-bold text-gray-900">{performanceMetrics.speedIndex}s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance by Device */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance por Dispositivo</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Desktop</h4>
                <Monitor className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-2">92</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Tablet</h4>
                <Tablet className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-yellow-600 mb-2">78</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Mobile</h4>
                <Smartphone className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-red-600 mb-2">65</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recomendações</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">Otimizar imagens</p>
                <p className="text-sm text-yellow-700">
                  Algumas imagens podem ser comprimidas para melhorar o tempo de carregamento
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Ativar compressão Gzip</p>
                <p className="text-sm text-blue-700">
                  A compressão Gzip pode reduzir significativamente o tamanho dos arquivos
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <Check className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Cache configurado corretamente</p>
                <p className="text-sm text-green-700">
                  As configurações de cache estão otimizadas para melhor performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações de Performance</h1>
          <p className="text-gray-600 mt-1">Otimize a velocidade e performance do site.</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-green-800">Configurações de performance salvas com sucesso!</span>
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
        {activeTab === 'cache' && renderCacheTab()}
        {activeTab === 'images' && renderImagesTab()}
        {activeTab === 'minification' && renderMinificationTab()}
        {activeTab === 'database' && renderDatabaseTab()}
        {activeTab === 'monitoring' && renderMonitoringTab()}
      </div>
    </div>
  )
}

export default PerformanceSettings