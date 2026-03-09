'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Globe, 
  Target, 
  TrendingUp, 
  FileText, 
  Image, 
  Link, 
  Code, 
  Save, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  Info, 
  Eye, 
  BarChart3, 
  Zap, 
  Shield, 
  Clock, 
  Users, 
  Activity,
  ExternalLink,
  Copy,
  Plus,
  Trash2,
  Edit,
  Loader2
} from 'lucide-react'

// Importar hooks da API
import {
  useConfiguracoesSEO,
  useUpdateConfiguracoesSEO,
  useRedirecionamentosSEO,
  useCreateRedirecionamento,
  useUpdateRedirecionamento,
  useDeleteRedirecionamento,
  useMetricasSEO,
  useGerarSitemap,
  type ConfiguracoesSEO,
  type RedirecionamentoSEO
} from '@/hooks/useSEOAdmin'

const SEOSettings = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [showSuccess, setShowSuccess] = useState(false)
  const [editingRedirect, setEditingRedirect] = useState<RedirecionamentoSEO | null>(null)
  const [showRedirectModal, setShowRedirectModal] = useState(false)

  // Hooks da API
  const { configuracoes, loading: loadingConfiguracoes, error: errorConfiguracoes, refetch: refetchConfiguracoes } = useConfiguracoesSEO()
  const { atualizarConfiguracoes, loading: salvandoConfiguracoes } = useUpdateConfiguracoesSEO()
  const { redirecionamentos, loading: loadingRedirecionamentos, refetch: refetchRedirecionamentos } = useRedirecionamentosSEO()
  const { criarRedirecionamento, loading: criandoRedirecionamento } = useCreateRedirecionamento()
  const { atualizarRedirecionamento, loading: atualizandoRedirecionamento } = useUpdateRedirecionamento()
  const { excluirRedirecionamento, loading: excluindoRedirecionamento } = useDeleteRedirecionamento()
  const { metricas, loading: loadingMetricas } = useMetricasSEO()
  const { gerarSitemap, loading: gerandoSitemap } = useGerarSitemap()

  // Estado local para edição
  const [seoSettings, setSeoSettings] = useState<ConfiguracoesSEO | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Sincronizar configurações quando carregadas
  useEffect(() => {
    if (configuracoes) {
      setSeoSettings(configuracoes)
    }
  }, [configuracoes])

  const tabs = [
    { id: 'general', label: 'Geral', icon: Search },
    { id: 'social', label: 'Redes Sociais', icon: Globe },
    { id: 'schema', label: 'Schema Markup', icon: Code },
    { id: 'redirects', label: 'Redirecionamentos', icon: Link },
    { id: 'performance', label: 'Performance', icon: Zap }
  ]

  const sitemapFrequencies = [
    { value: 'always', label: 'Sempre' },
    { value: 'hourly', label: 'A cada hora' },
    { value: 'daily', label: 'Diariamente' },
    { value: 'weekly', label: 'Semanalmente' },
    { value: 'monthly', label: 'Mensalmente' },
    { value: 'yearly', label: 'Anualmente' },
    { value: 'never', label: 'Nunca' }
  ]

  const twitterCardTypes = [
    { value: 'summary', label: 'Resumo' },
    { value: 'summary_large_image', label: 'Resumo com Imagem Grande' },
    { value: 'app', label: 'App' },
    { value: 'player', label: 'Player' }
  ]

  const redirectTypes = [
    { value: '301', label: '301 - Permanente' },
    { value: '302', label: '302 - Temporário' }
  ]

  const handleSave = async () => {
    if (!seoSettings) return

    try {
      await atualizarConfiguracoes(seoSettings)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      refetchConfiguracoes()
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
    }
  }

  const handleInputChange = (section: keyof ConfiguracoesSEO, field: string, value: any) => {
    if (!seoSettings) return

    setSeoSettings(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [field]: value
      }
    }))
  }

  const handleCreateRedirect = async (redirect: Omit<RedirecionamentoSEO, 'id' | 'created_at'>) => {
    try {
      await criarRedirecionamento(redirect)
      setShowRedirectModal(false)
      refetchRedirecionamentos()
    } catch (error) {
      console.error('Erro ao criar redirecionamento:', error)
    }
  }

  const handleUpdateRedirect = async (redirect: RedirecionamentoSEO) => {
    try {
      await atualizarRedirecionamento(redirect)
      setEditingRedirect(null)
      setShowRedirectModal(false)
      refetchRedirecionamentos()
    } catch (error) {
      console.error('Erro ao atualizar redirecionamento:', error)
    }
  }

  const handleDeleteRedirect = async (id: string) => {
    try {
      await excluirRedirecionamento(id)
      refetchRedirecionamentos()
    } catch (error) {
      console.error('Erro ao excluir redirecionamento:', error)
    }
  }

  const handleGenerateSitemap = async () => {
    try {
      await gerarSitemap()
      // Mostrar mensagem de sucesso
    } catch (error) {
      console.error('Erro ao gerar sitemap:', error)
    }
  }

  const renderGeneralTab = () => {
    if (!seoSettings) return null

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Título
          </label>
          <input
            type="text"
            value={seoSettings.general.metaTitle}
            onChange={(e) => handleInputChange('general', 'metaTitle', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            maxLength={60}
          />
          <p className="text-xs text-gray-500 mt-1">
            {seoSettings.general.metaTitle.length}/60 caracteres
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Descrição
          </label>
          <textarea
            value={seoSettings.general.metaDescription}
            onChange={(e) => handleInputChange('general', 'metaDescription', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            maxLength={160}
          />
          <p className="text-xs text-gray-500 mt-1">
            {seoSettings.general.metaDescription.length}/160 caracteres
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Palavras-chave (separadas por vírgula)
          </label>
          <input
            type="text"
            value={seoSettings.general.metaKeywords}
            onChange={(e) => handleInputChange('general', 'metaKeywords', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Canônica
          </label>
          <input
            type="url"
            value={seoSettings.general.canonicalUrl}
            onChange={(e) => handleInputChange('general', 'canonicalUrl', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Analytics ID
            </label>
            <input
              type="text"
              value={seoSettings.general.googleAnalyticsId}
              onChange={(e) => handleInputChange('general', 'googleAnalyticsId', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="GA-XXXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Search Console
            </label>
            <input
              type="text"
              value={seoSettings.general.googleSearchConsole}
              onChange={(e) => handleInputChange('general', 'googleSearchConsole', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="google-site-verification=XXXXXXXXX"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="sitemapEnabled"
            checked={seoSettings.general.sitemapEnabled}
            onChange={(e) => handleInputChange('general', 'sitemapEnabled', e.target.checked)}
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          <label htmlFor="sitemapEnabled" className="text-sm font-medium text-gray-700">
            Gerar Sitemap Automaticamente
          </label>
        </div>

        {seoSettings.general.sitemapEnabled && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequência de Atualização do Sitemap
            </label>
            <select
              value={seoSettings.general.sitemapFrequency}
              onChange={(e) => handleInputChange('general', 'sitemapFrequency', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {sitemapFrequencies.map(freq => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    )
  }

  const renderSocialTab = () => {
    if (!seoSettings) return null

    return (
      <div className="space-y-8">
        {/* Open Graph */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Open Graph (Facebook)</h3>
            <input
              type="checkbox"
              checked={seoSettings.openGraph.enabled}
              onChange={(e) => handleInputChange('openGraph', 'enabled', e.target.checked)}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
          </div>

          {seoSettings.openGraph.enabled && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={seoSettings.openGraph.title}
                  onChange={(e) => handleInputChange('openGraph', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={seoSettings.openGraph.description}
                  onChange={(e) => handleInputChange('openGraph', 'description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagem
                </label>
                <input
                  type="url"
                  value={seoSettings.openGraph.image}
                  onChange={(e) => handleInputChange('openGraph', 'image', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="/images/og-image.jpg"
                />
              </div>
            </div>
          )}
        </div>

        {/* Twitter Cards */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Twitter Cards</h3>
            <input
              type="checkbox"
              checked={seoSettings.twitter.enabled}
              onChange={(e) => handleInputChange('twitter', 'enabled', e.target.checked)}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
          </div>

          {seoSettings.twitter.enabled && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Card
                </label>
                <select
                  value={seoSettings.twitter.card}
                  onChange={(e) => handleInputChange('twitter', 'card', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {twitterCardTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site (@username)
                  </label>
                  <input
                    type="text"
                    value={seoSettings.twitter.site}
                    onChange={(e) => handleInputChange('twitter', 'site', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="@autoprestigeangola"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Criador (@username)
                  </label>
                  <input
                    type="text"
                    value={seoSettings.twitter.creator}
                    onChange={(e) => handleInputChange('twitter', 'creator', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="@autoprestigeangola"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderSchemaTab = () => {
    if (!seoSettings) return null

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Schema Markup</h3>
          <input
            type="checkbox"
            checked={seoSettings.schema.enabled}
            onChange={(e) => handleInputChange('schema', 'enabled', e.target.checked)}
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
        </div>

        {seoSettings.schema.enabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Organização
              </label>
              <input
                type="text"
                value={seoSettings.schema.organizationName}
                onChange={(e) => handleInputChange('schema', 'organizationName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço
              </label>
              <input
                type="text"
                value={seoSettings.schema.address}
                onChange={(e) => handleInputChange('schema', 'address', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone de Contato
              </label>
              <input
                type="tel"
                value={seoSettings.schema.contactPoint}
                onChange={(e) => handleInputChange('schema', 'contactPoint', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderRedirectsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Redirecionamentos</h3>
        <button
          onClick={() => setShowRedirectModal(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Redirecionamento</span>
        </button>
      </div>

      {loadingRedirecionamentos ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-red-600" />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  De
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Para
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {redirecionamentos.map((redirect) => (
                <tr key={redirect.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {redirect.from}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {redirect.to}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {redirect.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      redirect.enabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {redirect.enabled ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setEditingRedirect(redirect)
                        setShowRedirectModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRedirect(redirect.id)}
                      disabled={excluindoRedirecionamento}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Métricas de Performance SEO</h3>
      
      {loadingMetricas ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-red-600" />
        </div>
      ) : metricas ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Páginas Indexadas</p>
                <p className="text-2xl font-bold text-gray-900">{metricas.indexedPages.toLocaleString()}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Backlinks</p>
                <p className="text-2xl font-bold text-gray-900">{metricas.totalBacklinks.toLocaleString()}</p>
              </div>
              <Link className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tráfego Orgânico</p>
                <p className="text-2xl font-bold text-gray-900">{metricas.organicTraffic.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Posição Média</p>
                <p className="text-2xl font-bold text-gray-900">{metricas.averagePosition}</p>
              </div>
              <Target className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CTR (%)</p>
                <p className="text-2xl font-bold text-gray-900">{metricas.clickThroughRate}%</p>
              </div>
              <Eye className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">PageSpeed Score</p>
                <p className="text-2xl font-bold text-gray-900">{metricas.pagespeedScore}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      ) : null}

      <div className="bg-white p-6 border border-gray-200 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Ações</h4>
        <div className="space-y-3">
          <button
            onClick={handleGenerateSitemap}
            disabled={gerandoSitemap}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {gerandoSitemap ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span>{gerandoSitemap ? 'Gerando...' : 'Gerar Sitemap'}</span>
          </button>
        </div>
      </div>
    </div>
  )

  if (!isMounted) {
    return null
  }

  if (loadingConfiguracoes) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    )
  }

  if (errorConfiguracoes) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">Erro ao carregar configurações: {errorConfiguracoes}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações de SEO</h1>
          <p className="text-gray-600 mt-1">Otimize seu site para mecanismos de busca.</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button 
            onClick={handleSave}
            disabled={salvandoConfiguracoes}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {salvandoConfiguracoes ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{salvandoConfiguracoes ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-green-800">Configurações de SEO salvas com sucesso!</span>
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
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'general' && renderGeneralTab()}
        {activeTab === 'social' && renderSocialTab()}
        {activeTab === 'schema' && renderSchemaTab()}
        {activeTab === 'redirects' && renderRedirectsTab()}
        {activeTab === 'performance' && renderPerformanceTab()}
      </div>
    </div>
  )
}

export default SEOSettings
