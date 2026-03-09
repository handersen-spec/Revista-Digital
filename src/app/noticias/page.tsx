'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Advertisement from '@/components/Advertisement'
import Newsletter from '@/components/Newsletter'
import { Noticia } from '@/types/noticia'

interface ApiResponse {
  noticias: Noticia[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export default function NoticiasPage() {
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas")
  const [noticiasVisiveis, setNoticiasVisiveis] = useState(6)
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const categorias = ["Todas", "Atualidade", "Opinião", "Desporto"]

  // Buscar notícias da API
  useEffect(() => {
    const abortController = new AbortController()
    const fetchNoticias = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (categoriaFiltro !== "Todas") {
          params.append('categoria', categoriaFiltro)
        }

        const response = await fetch(`/api/noticias?${params.toString()}`, { signal: abortController.signal })
        
        if (!response.ok) {
          throw new Error('Erro ao carregar notícias')
        }
        
        const data: ApiResponse = await response.json()
        const publicados = (data.noticias || []).filter(n => (n as any).status === 'published' || (n as any).status === undefined)
        setNoticias(publicados)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        setError('Erro ao conectar com o servidor')
      } finally {
        setLoading(false)
      }
    }

    fetchNoticias()
    return () => abortController.abort()
  }, [categoriaFiltro])

  const noticiasFiltradas = categoriaFiltro === "Todas" 
    ? noticias 
    : noticias.filter(noticia => noticia.categoria === categoriaFiltro)
  
  const noticiasDestaque = noticiasFiltradas.filter(n => n.destaque).slice(0, 2)
  const outrasNoticias = noticiasFiltradas.filter(n => !n.destaque).slice(0, noticiasVisiveis)
  
  const carregarMaisNoticias = () => {
    setNoticiasVisiveis(prev => prev + 6)
  }

  // Gradiente por categoria para fallback de imagens
  const getCategoriaGradient = (categoria: string) => {
    switch (categoria) {
      case 'Atualidade':
        return 'from-blue-500 to-blue-700'
      case 'Opinião':
        return 'from-purple-500 to-purple-700'
      case 'Desporto':
        return 'from-green-500 to-green-700'
      default:
        return 'from-gray-500 to-gray-700'
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Notícias Automotivas de Angola
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                Fique por dentro das últimas novidades do mercado automobilístico angolano e internacional.
              </p>
            </div>
          </div>
        </section>

        {/* Loading */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Carregando notícias...</p>
          </div>
        </section>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Notícias Automotivas de Angola
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                Fique por dentro das últimas novidades do mercado automobilístico angolano e internacional.
              </p>
            </div>
          </div>
        </section>

        {/* Error */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-red-600 mb-4">Erro ao carregar notícias</h2>
              <p className="text-red-600 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Empty state
  if (noticias.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Notícias Automotivas de Angola
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                Fique por dentro das últimas novidades do mercado automobilístico angolano e internacional.
              </p>
            </div>
          </div>
        </section>

        {/* Filtros */}
        <section className="bg-white py-6 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  onClick={() => {
                    setCategoriaFiltro(categoria)
                    setNoticiasVisiveis(6)
                  }}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    categoria === categoriaFiltro
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Empty */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-gray-600 mb-4">Nenhuma notícia encontrada</h2>
              <p className="text-gray-600 mb-6">
                {categoriaFiltro === "Todas" 
                  ? "Não há notícias disponíveis no momento."
                  : `Não há notícias na categoria "${categoriaFiltro}".`
                }
              </p>
              <p className="text-sm text-gray-500">Conecte com banco de dados para ver as notícias.</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Notícias Automotivas de Angola
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Fique por dentro das últimas novidades do mercado automobilístico angolano e internacional. Notícias em tempo real sobre lançamentos, mercado e tecnologia em Angola.
            </p>
          </div>
        </div>
      </section>

      {/* Publicidade Banner */}
      <section className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Advertisement format="banner" position="top" />
        </div>
      </section>

      {/* Filtros */}
      <section className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => {
                  setCategoriaFiltro(categoria)
                  setNoticiasVisiveis(6)
                }}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoria === categoriaFiltro
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Notícias em Destaque */}
      {noticiasDestaque.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Destaques</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {noticiasDestaque.map((noticia) => (
               <article key={noticia.slug} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-video bg-gray-200 relative">
                    <img 
                      src={noticia.imagem || `/api/placeholder/960/540`} 
                      alt={noticia.titulo}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {noticia.categoria}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-xl font-bold mb-2 line-clamp-2">
                        {noticia.titulo}
                      </h3>
                      <div className="flex items-center text-white/80 text-sm">
                        <span>{noticia.data}</span>
                        <span className="mx-2">•</span>
                        <span>{noticia.autor}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {noticia.resumo}
                    </p>
                    
                    <Link 
                      href={`/noticias/${noticia.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Ler notícia completa
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Publicidade Nativa */}
      <section className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Advertisement format="native" position="middle" />
        </div>
      </section>

      {/* Outras Notícias */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {noticiasDestaque.length > 0 ? "Últimas Notícias" : "Todas as Notícias"}
          </h2>
          
          {outrasNoticias.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {outrasNoticias.map((noticia) => (
                   <article key={noticia.slug} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-200 relative">
                      <img 
                        src={noticia.imagem || `/api/placeholder/640/360`} 
                        alt={noticia.titulo}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                          {noticia.categoria}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {noticia.titulo}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {noticia.resumo}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{noticia.autor}</span>
                        <span>{noticia.data}</span>
                      </div>
                      
                      <Link 
                        href={`/noticias/${noticia.slug}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Ler mais →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              
              {/* Botão Carregar Mais */}
              {outrasNoticias.length < noticiasFiltradas.filter(n => !n.destaque).length && (
                <div className="text-center mt-12">
                  <button 
                    onClick={carregarMaisNoticias}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Carregar mais notícias
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma notícia encontrada</h3>
                <p className="text-gray-500 text-sm">
                  {categoriaFiltro === "Todas" 
                    ? "Não há notícias disponíveis no momento."
                    : `Não há notícias na categoria "${categoriaFiltro}".`
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter 
        title="Receba as últimas notícias"
        description="Assine nossa newsletter e seja o primeiro a saber sobre as novidades do mundo automotivo."
        theme="dark"
      />

      {/* Publicidade Bottom */}
      <section className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Advertisement format="banner" position="bottom" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Auto Prestige</h3>
            <p className="text-gray-400 mb-8">
              Sua revista digital automotiva de confiança
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/sobre" className="text-gray-400 hover:text-white transition-colors">
                Sobre Nós
              </Link>
              <Link href="/contato" className="text-gray-400 hover:text-white transition-colors">
                Contato
              </Link>
              <Link href="/privacidade" className="text-gray-400 hover:text-white transition-colors">
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
