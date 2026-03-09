'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Newsletter from '@/components/Newsletter'
import { formatDate } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

import type { Artigo as ArtigoType } from '@/types/artigo'

type ApiArtigo = {
  id?: number
  slug: string
  titulo: string
  resumo: string
  categoria: string
  data?: string
  dataPublicacao?: string
  autor: string
  imagem?: string
  status?: string
}

type UIArtigo = Pick<ArtigoType, 'slug' | 'titulo' | 'resumo' | 'categoria' | 'autor' | 'imagem'> & {
  id?: number
  data?: string
}

interface ApiResponseOk {
  artigos: ApiArtigo[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}
interface ApiResponseErr {
  success: false
  message?: string
}

// Carregar Advertisement de forma dinâmica apenas no client
const Advertisement = dynamic(() => import('@/components/Advertisement'), { ssr: false })

export default function ArtigosPage() {
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas")
  const [artigos, setArtigos] = useState<UIArtigo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Categorias disponíveis (mesmas do formulário de cadastro)
  const categorias = ["Todas", "Antevisão", "Ensaio", "Superdesportivo"]

  // Função para buscar artigos da API
  const fetchArtigos = async (page: number = 1, categoria?: string) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      })
      
      if (categoria && categoria !== "Todas") {
        params.append('categoria', categoria)
      }

      const response = await fetch(`/api/artigos?${params.toString()}`)
      if (!response.ok) {
        const errData: ApiResponseErr = await response.json().catch(() => ({ success: false }))
        setError(errData.message || 'Erro ao carregar artigos')
        return
      }
      const data: ApiResponseOk = await response.json()

      // Filtrar publicados e normalizar campos para a UI
      const publicados = (data.artigos || []).filter((a: ApiArtigo) => a.status === 'published' || a.status === undefined)
      const normalizados: UIArtigo[] = publicados.map((a: ApiArtigo) => ({
        id: a.id,
        slug: a.slug,
        titulo: a.titulo,
        resumo: a.resumo,
        categoria: (
          ['Antevisão', 'Ensaio', 'Superdesportivo'].includes(a.categoria as any)
            ? a.categoria
            : 'Ensaio'
        ) as ArtigoType['categoria'],
        data: a.dataPublicacao || a.data,
        autor: a.autor,
        imagem: a.imagem ?? '/api/placeholder/640/360'
      }))
      setArtigos(normalizados)
      setTotalPages(data.totalPages || 1)
      setCurrentPage(data.page || page)
    } catch (err) {
      setError('Erro ao conectar com a API')
      console.error('Erro ao buscar artigos:', err)
    } finally {
      setLoading(false)
    }
  }

  // Carregar artigos ao montar o componente
  useEffect(() => {
    fetchArtigos(1, categoriaFiltro)
  }, [categoriaFiltro])

  // Função para mudar categoria
  const handleCategoriaChange = (categoria: string) => {
    setCategoriaFiltro(categoria)
    setCurrentPage(1)
  }

  // Função para carregar mais artigos (próxima página)
  const carregarMaisArtigos = () => {
    if (currentPage < totalPages) {
      fetchArtigos(currentPage + 1, categoriaFiltro)
    }
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Artigos Automotivos
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
              Ensaios detalhados, antevisões exclusivas e análises dos melhores superdesportivos. Conteúdo especializado sobre o mundo automobilístico em Angola.
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
                onClick={() => handleCategoriaChange(categoria)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoria === categoriaFiltro
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Artigos */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {categoriaFiltro === "Todas" ? "Todos os Artigos" : `Artigos - ${categoriaFiltro}`}
          </h2>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <p className="mt-4 text-gray-600">Carregando artigos...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={() => fetchArtigos(1, categoriaFiltro)}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && artigos.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                <p className="text-gray-600 mb-4">
                  {categoriaFiltro === "Todas" 
                    ? "Nenhum artigo encontrado." 
                    : `Nenhum artigo encontrado na categoria "${categoriaFiltro}".`
                  }
                </p>
                <p className="text-sm text-gray-500">
                  Conecte com banco de dados para ver os artigos.
                </p>
              </div>
            </div>
          )}

          {/* Artigos Grid */}
          {!loading && !error && artigos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artigos.map((artigo) => (
                <article key={artigo.slug} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-200 relative">
                    <img 
                      src={artigo.imagem || `/api/placeholder/640/360`} 
                      alt={artigo.titulo}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-medium">
                        {artigo.categoria}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {artigo.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {artigo.resumo}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{artigo.autor}</span>
                      <span>{artigo.data ? formatDate(new Date(artigo.data)) : '—'}</span>
                    </div>
                    
                    <Link 
                      href={`/artigos/${artigo.slug}`}
                      className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                    >
                      Ler mais →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => fetchArtigos(Math.max(1, currentPage - 1), categoriaFiltro)}
                disabled={loading || currentPage <= 1 || !!error}
                className={`px-4 py-2 rounded border text-sm flex items-center ${loading || currentPage <= 1 || !!error ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                {loading && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Anterior
              </button>
              <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => fetchArtigos(Math.min(totalPages, currentPage + 1), categoriaFiltro)}
                disabled={loading || currentPage >= totalPages || !!error}
                className={`px-4 py-2 rounded border text-sm flex items-center ${loading || currentPage >= totalPages || !!error ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                {loading && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Próxima
              </button>
            </div>
          )}
          
          {/* Botão Carregar Mais */}
          {!loading && !error && artigos.length > 0 && currentPage < totalPages && (
            <div className="text-center mt-12">
              <button 
                onClick={carregarMaisArtigos}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Carregar mais artigos
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Publicidade Nativa */}
      <section className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Advertisement format="native" position="middle" />
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter 
        title="Receba os últimos artigos"
        description="Assine nossa newsletter e seja o primeiro a ler nossos ensaios e análises exclusivas."
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
