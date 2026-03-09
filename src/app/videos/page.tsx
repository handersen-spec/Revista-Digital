'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import YouTubeSubscribe from '@/components/YouTubeSubscribe'
import { useVideos, useVideosDestaque, useVideosMetadata } from '@/hooks/useVideos'
import Advertisement from '@/components/Advertisement'

export default function VideosPage() {
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos")
  const [videosVisiveis, setVideosVisiveis] = useState(8)
  
  // Hooks para buscar dados
  const { videos, loading: loadingVideos, error: errorVideos, pagination } = useVideos({
    categoria: categoriaFiltro === "Todos" ? undefined : categoriaFiltro,
    limit: videosVisiveis
  })

  // Apenas vídeos publicados na página pública
  const videosPublicos = videos.filter(v => (v as any).status === 'published' || (v as any).status === undefined)
  
  const { videos: videosDestaqueRaw, loading: loadingDestaque, error: errorDestaque } = useVideosDestaque()
  const videosDestaque = videosDestaqueRaw.filter(v => (v as any).status === 'published' || (v as any).status === undefined)
  
  const { categorias, loading: loadingCategorias, error: errorCategorias } = useVideosMetadata()
  
  // Adicionar "Todos" às categorias
  const categoriasCompletas = ["Todos", ...categorias]
  
  const carregarMaisVideos = () => {
    setVideosVisiveis(prev => prev + 8)
  }

  // Estados de loading e erro
  const isLoading = loadingVideos || loadingDestaque || loadingCategorias
  const hasError = errorVideos || errorDestaque || errorCategorias

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando vídeos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar vídeos</h2>
            <p className="text-gray-600 mb-4">
              {errorVideos || errorDestaque || errorCategorias}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Vídeos
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
              Conteúdo audiovisual de qualidade sobre o universo automotivo angolano. Test drives, tutoriais, análises e cobertura do motorsport nacional.
            </p>
          </div>
        </div>
      </section>

      {/* Publicidade Top */}
      <section className="bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Advertisement format="banner" position="top" className="max-w-4xl mx-auto" />
        </div>
      </section>

      {/* Filtros */}
      <section className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categoriasCompletas.map((categoria) => (
              <button
                key={categoria}
                onClick={() => {
                  setCategoriaFiltro(categoria)
                  setVideosVisiveis(8)
                }}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  categoria === categoriaFiltro
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-600"
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Vídeos em Destaque */}
      {videosDestaque.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Em Destaque</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {videosDestaque.slice(0, 2).map((video) => (
                <article key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                  <div className="relative aspect-video bg-gray-200">
                    <img 
                      src={video.thumbnail || `/api/placeholder/960/540`}
                      alt={video.titulo}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transform group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </button>
                    </div>
                    
                    {/* Duration */}
                    <div className="absolute bottom-3 right-3">
                      <span className="bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                        {video.duracao}
                      </span>
                    </div>
                    
                    {/* Category */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {video.categoria}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {video.titulo}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {video.descricao}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-purple-600">{video.canal}</span>
                        <span>{video.visualizacoes} visualizações</span>
                      </div>
                      <span>{video.data}</span>
                    </div>
                    
                    <Link 
                      href={`/videos/${video.slug}`}
                      className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Assistir vídeo
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-10V7a3 3 0 11-6 0V4" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Outros Vídeos */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {categoriaFiltro === "Todos" ? "Todos os Vídeos" : `Vídeos de ${categoriaFiltro}`}
          </h2>
          
          {videos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📹</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum vídeo encontrado</h3>
              <p className="text-gray-600">
                {categoriaFiltro === "Todos" 
                  ? "Não há vídeos disponíveis no momento."
                  : `Não há vídeos na categoria "${categoriaFiltro}".`
                }
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <article key={video.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="relative aspect-video bg-gray-200">
                      <img 
                        src={video.thumbnail || `/api/placeholder/640/360`}
                        alt={video.titulo}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy" 
                      />
                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </button>
                      </div>
                      
                      {/* Duration */}
                      <div className="absolute bottom-2 right-2">
                        <span className="bg-black/80 text-white px-2 py-1 rounded text-xs">
                          {video.duracao}
                        </span>
                      </div>
                      
                      {/* Category */}
                      <div className="absolute top-2 left-2">
                        <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                          {video.categoria}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {video.titulo}
                      </h3>
                      
                      <div className="text-xs text-gray-500 mb-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-purple-600">{video.canal}</span>
                          <span>{video.data}</span>
                        </div>
                        <div className="mt-1">
                          <span>{video.visualizacoes} visualizações</span>
                        </div>
                      </div>
                      
                      <Link 
                        href={`/videos/${video.slug}`}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        Assistir →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              
              {/* Load More */}
              {pagination.currentPage < pagination.totalPages && (
                <div className="text-center mt-12">
                  <button 
                    onClick={carregarMaisVideos}
                    className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Carregar mais vídeos
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Publicidade Bottom */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Advertisement format="banner" position="bottom" className="max-w-4xl mx-auto" />
        </div>
      </section>

      {/* Canal Auto Prestige */}
      <YouTubeSubscribe 
        variant="banner"
        title="Canal Auto Prestige no YouTube"
        description="Se inscreva no nosso canal e ative as notificações para não perder nenhum vídeo novo!"
        theme="dark"
      />

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
