'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

declare global {
  interface Window {
    SwaggerUIBundle: any
  }
}

export default function ApiDocsPage() {
  const swaggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Carregar Swagger UI dinamicamente
    const loadSwaggerUI = async () => {
      // Carregar CSS do Swagger UI
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui.css'
      document.head.appendChild(link)

      // Carregar JS do Swagger UI
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-bundle.js'
      script.onload = () => {
        if (window.SwaggerUIBundle && swaggerRef.current) {
          window.SwaggerUIBundle({
            url: '/api/docs',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              window.SwaggerUIBundle.presets.apis,
              window.SwaggerUIBundle.presets.standalone
            ],
            plugins: [
              window.SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: 'StandaloneLayout',
            tryItOutEnabled: true,
            requestInterceptor: (request: any) => {
              // Adicionar headers customizados se necessário
              request.headers['Accept'] = 'application/json'
              return request
            },
            responseInterceptor: (response: any) => {
              // Processar respostas se necessário
              return response
            }
          })
        }
      }
      document.head.appendChild(script)
    }

    loadSwaggerUI()

    // Cleanup
    return () => {
      const existingLink = document.querySelector('link[href*="swagger-ui.css"]')
      const existingScript = document.querySelector('script[src*="swagger-ui-bundle.js"]')
      if (existingLink) existingLink.remove()
      if (existingScript) existingScript.remove()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  API Documentation
                </h1>
                <p className="mt-2 text-gray-600">
                  Documentação completa da API REST da Auto Prestige
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  v1.0.0
                </span>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  ← Voltar ao Site
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Sobre a API
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Base URL
              </h3>
              <p className="mt-1 text-sm text-gray-900 font-mono">
                {typeof window !== 'undefined' ? window.location.origin : ''}/api
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Formato
              </h3>
              <p className="mt-1 text-sm text-gray-900">
                JSON
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Autenticação
              </h3>
              <p className="mt-1 text-sm text-gray-900">
                API Key (futura)
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Rate Limit
              </h3>
              <p className="mt-1 text-sm text-gray-900">
                1000 req/hora
              </p>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Start
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                1. Verificar status da API
              </h3>
              <div className="bg-gray-900 rounded-md p-4">
                <code className="text-green-400 text-sm">
                  curl -X GET "{typeof window !== 'undefined' ? window.location.origin : ''}/api/health"
                </code>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                2. Listar notícias
              </h3>
              <div className="bg-gray-900 rounded-md p-4">
                <code className="text-green-400 text-sm">
                  curl -X GET "{typeof window !== 'undefined' ? window.location.origin : ''}/api/noticias?limite=5"
                </code>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                3. Buscar carros
              </h3>
              <div className="bg-gray-900 rounded-md p-4">
                <code className="text-green-400 text-sm">
                  curl -X GET "{typeof window !== 'undefined' ? window.location.origin : ''}/api/carros?marca=Toyota&estado=novo"
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Endpoints Overview */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Endpoints Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">Sistema</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  1 endpoint
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Health check e status da API
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">Notícias</h3>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  4 endpoints
                </span>
              </div>
              <p className="text-sm text-gray-600">
                CRUD completo para notícias automotivas
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">Carros</h3>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  4 endpoints
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Catálogo de veículos com filtros avançados
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">Concessionárias</h3>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                  1 endpoint
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Diretório com busca por proximidade
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Swagger UI Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div id="swagger-ui" ref={swaggerRef}></div>
        </div>
      </div>
    </div>
  )
}
