'use client'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import Advertisement from '@/components/Advertisement'
import VideoPlayer from '@/components/VideoPlayer'
import { useVideo, useVideos } from '@/hooks/useVideos'

export default function ClientVideoContent({ slug }: { slug: string }) {
  const { video, loading: videoLoading, error: videoError } = useVideo(slug)
  const { videos: videosRelacionados, loading: relacionadosLoading } = useVideos({
    categoria: video?.categoria,
    limit: 3
  })

  if (videoLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando vídeo...</p>
        </div>
      </div>
    )
  }

  const isPublished = (() => {
    const st = (video as any)?.status
    return !st || st === 'published' || st === 'publicado'
  })()
  if (videoError || !video || !isPublished) {
    return notFound()
  }

  // Filtrar vídeos relacionados para não incluir o vídeo atual e manter apenas publicados
  const videosRelacionadosFiltrados = (videosRelacionados || [])
    .filter((v: any) => (v.status === 'published' || v.status === 'publicado' || v.status === undefined) && v.slug !== slug)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Video Player Section */}
      <section className="bg-black">
        <div className="max-w-6xl mx-auto">
          <VideoPlayer 
            videoUrl={(video as any).videoUrl || ''}
            thumbnail={(video as any).thumbnail}
            titulo={(video as any).titulo}
          />
        </div>
      </section>

      {/* Video Info Section */}
      <section className="py-6 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Video Details */}
            <div className="lg:col-span-3">
              {/* Breadcrumb */}
              <nav className="mb-4">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  <li>
                    <Link href="/" className="hover:text-gray-700 transition-colors">
                      Início
                    </Link>
                  </li>
                  <li>/</li>
                  <li>
                    <Link href="/videos" className="hover:text-gray-700 transition-colors">
                      Vídeos
                    </Link>
                  </li>
                  <li>/</li>
                  <li className="text-gray-900">{(video as any).titulo}</li>
                </ol>
              </nav>

              {/* Título e Categoria */}
              <div className="mb-4">
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium mb-3 inline-block">
                  {(video as any).categoria}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                  {(video as any).titulo}
                </h1>
                <p className="text-gray-600 text-lg">
                  {(video as any).descricao}
                </p>
              </div>

              {/* Stats e Ações */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-200">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {(video as any).visualizacoes} visualizações
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {(video as any).canal}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {(video as any).data}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Curtir
                  </button>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Compartilhar
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Salvar
                  </button>
                </div>
              </div>

              {/* Conteúdo Detalhado */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Sobre este vídeo</h2>
                <p className="text-gray-600">{(video as any).descricao}</p>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              {/* Publicidade */}
              <div className="mb-6">
                <Advertisement 
                  format="square" 
                  position="sidebar"
                  className="w-full"
                />
              </div>

              {/* Vídeos Relacionados */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Vídeos Relacionados
                </h3>
                {relacionadosLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-300 aspect-video rounded-lg mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {videosRelacionadosFiltrados.slice(0, 3).map((relacionado: any) => (
                      <Link 
                        key={relacionado.slug}
                        href={`/videos/${relacionado.slug}`}
                        className="block group"
                      >
                        <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-2 flex items-center justify-center">
                          <span className="text-white text-xs">{relacionado.categoria}</span>
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
                            {relacionado.duracao}
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-red-600 rounded-full p-2">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-1">
                          {relacionado.titulo}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {relacionado.visualizacoes} • {relacionado.data}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Canal Info */}
              <div className="bg-red-50 rounded-lg p-4 mt-6">
                <h3 className="text-lg font-bold text-red-900 mb-2">
                  Canal Auto Prestige
                </h3>
                <p className="text-sm text-red-700 mb-3">
                  Conteúdo especializado sobre o mundo automóvel em Angola.
                </p>
                <button className="w-full bg-red-600 text-white py-2 rounded text-sm hover:bg-red-700 transition-colors">
                  Subscrever Canal
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Publicidade Bottom */}
      <section className="py-6 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Advertisement 
            format="banner" 
            position="bottom"
            className="max-w-4xl mx-auto"
          />
        </div>
      </section>

      {/* Mais Vídeos */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Mais Vídeos
            </h2>
            <p className="text-gray-600">
              Continue assistindo nosso conteúdo especializado
            </p>
          </div>
          
          {relacionadosLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 aspect-video rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {videosRelacionadosFiltrados.slice(0, 3).map((relacionado: any) => (
                <Link 
                  key={relacionado.slug}
                  href={`/videos/${relacionado.slug}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-white">{relacionado.categoria}</span>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {relacionado.duracao}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-red-600 rounded-full p-3">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium mb-2 inline-block">
                      {relacionado.categoria}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                      {relacionado.titulo}
                    </h3>
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                      {relacionado.descricao}
                    </p>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>{relacionado.visualizacoes} visualizações</span>
                      <span>{relacionado.data}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link 
              href="/videos"
              className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Ver Todos os Vídeos
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
