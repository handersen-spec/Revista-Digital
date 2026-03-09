'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Artigo, Imagem, isEnsaios, isSuperdesportivo } from '@/types/artigo'
import SpecificacoesTecnicas from '@/components/SpecificacoesTecnicas'
import dynamic from 'next/dynamic'
import GaleriaImagens from '@/components/GaleriaImagens'
import Newsletter from '@/components/Newsletter'
import { formatDate } from '@/lib/utils'
// Carregar Advertisement de forma dinâmica apenas no client
const Advertisement = dynamic(() => import('@/components/Advertisement'), { ssr: false })

interface ApiResponseOk {
  success: true
  artigo: Partial<Artigo> & { data?: string; dataPublicacao?: string; status?: string }
}
interface ApiResponseErr {
  success: false
  message?: string
}

// Tipo simplificado para exibir artigos relacionados (apenas campos usados na UI)
type ArtigoRelacionado = {
  slug: string
  titulo: string
  resumo: string
  categoria: string
  data?: string
  imagem?: string
}

export default function ClientArtigoPage({ slug }: { slug: string }) {
  const router = useRouter()
  const [artigo, setArtigo] = useState<Artigo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [artigosRelacionados, setArtigosRelacionados] = useState<ArtigoRelacionado[]>([])

  // Buscar artigo da API
  useEffect(() => {
    if (!slug || typeof slug !== 'string') return

    const fetchArtigo = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/artigos/${slug}`)
        let data: ApiResponseOk | null = null
        if (!response.ok) {
          // Fallback: tentar buscar via listagem por slug
          const errData: ApiResponseErr = await response.json().catch(() => ({ success: false }))
          const fallbackRes = await fetch(`/api/artigos?slug=${encodeURIComponent(slug)}&limit=1`)
          if (fallbackRes.ok) {
            const fb = await fallbackRes.json()
            const item = (fb.artigos || [])[0]
            if (item) {
              data = { success: true, artigo: item }
            } else {
              setError(errData.message || 'Artigo não encontrado')
              return
            }
          } else {
            setError(errData.message || 'Artigo não encontrado')
            return
          }
        } else {
          data = await response.json()
        }

        if (data && data.artigo) {
          // Apenas conteúdo publicado é exibido (se status existir)
          if ((data.artigo as any).status && (data.artigo as any).status !== 'published') {
            setError('Artigo não encontrado')
            // Não navegar para uma rota inexistente; manter estado de erro
            return
          }
          // Normalizar campo de data para o tipo usado na UI
          const normalizado: Artigo = {
            ...(data.artigo as Artigo),
            data: (data.artigo as any).data || (data.artigo as any).dataPublicacao
          }
          setArtigo(normalizado)
          // Buscar artigos relacionados
          if ((data.artigo as any).categoria) {
            fetchArtigosRelacionados((data.artigo as any).categoria as string)
          }
        } else {
          setError('Artigo não encontrado')
        }
      } catch (err) {
        setError('Erro ao carregar artigo')
        console.error('Erro ao buscar artigo:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchArtigo()
  }, [slug])

  // Buscar artigos relacionados
  const fetchArtigosRelacionados = async (categoria?: string) => {
    try {
      if (!categoria) return
      const response = await fetch(`/api/artigos?categoria=${categoria}&limit=3`)
      if (!response.ok) return
      const data = await response.json()
      type ApiArtigo = {
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
      const lista: ApiArtigo[] = data.artigos || []
      const relacionados: ArtigoRelacionado[] = lista
        .filter((a: ApiArtigo) => (a.status === 'published' || a.status === undefined) && a.slug !== slug)
        .map((a: ApiArtigo) => ({
          slug: a.slug,
          titulo: a.titulo,
          resumo: a.resumo,
          categoria: a.categoria,
          data: a.dataPublicacao || a.data,
          imagem: a.imagem,
        }))
      setArtigosRelacionados(relacionados.slice(0, 3))
    } catch (err) {
      console.error('Erro ao buscar artigos relacionados:', err)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
          <p className="text-gray-600">Carregando artigo...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !artigo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Artigo não encontrado</h1>
            <p className="text-red-600 mb-6">{error || 'O artigo solicitado não existe ou foi removido.'}</p>
            <div className="space-y-3">
              <Link 
                href="/artigos"
                className="block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Ver todos os artigos
              </Link>
              <button 
                onClick={() => window.location.reload()}
                className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section do Artigo */}
      <section className="relative bg-gradient-to-r from-slate-900 to-slate-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href="/artigos" className="text-gray-300 hover:text-white transition-colors">
                  Artigos
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-white">{artigo.titulo}</li>
            </ol>
          </nav>

          {/* Categoria */}
          <div className="mb-4">
            <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {artigo.categoria}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {artigo.titulo}
          </h1>

          {/* Resumo */}
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            {artigo.resumo}
          </p>

          {/* Meta informações */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Por {artigo.autor}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {artigo.data ? formatDate(new Date(artigo.data)) : '—'}
            </div>
            {artigo.tempoLeitura && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {artigo.tempoLeitura} de leitura
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article>
            {/* Galeria de Imagens - sempre exibe uma galeria combinando destaque + lista */}
            {(() => {
              const imagensGaleria: Imagem[] = []
              const urls = new Set<string>()
              if (artigo.imagem && !urls.has(artigo.imagem)) {
                imagensGaleria.push({
                  id: 'featured',
                  url: artigo.imagem,
                  alt: artigo.titulo,
                })
                urls.add(artigo.imagem)
              }
              if (artigo.galeria && Array.isArray(artigo.galeria)) {
                for (const img of artigo.galeria) {
                  const url = img?.url || ''
                  if (url && !urls.has(url)) {
                    imagensGaleria.push(img)
                    urls.add(url)
                  }
                }
              }
              return (
                <div className="mb-8">
                  <GaleriaImagens imagens={imagensGaleria} categoria={artigo.categoria} />
                </div>
              )
            })()}

            {/* Conteúdo */}
            <div className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed">
              {artigo.conteudo ? (
                <div dangerouslySetInnerHTML={{ __html: artigo.conteudo }} />
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-600 mb-4">Conteúdo do artigo não disponível.</p>
                  <p className="text-sm text-gray-500">Conecte com banco de dados para ver o conteúdo completo.</p>
                </div>
              )}
            </div>

            {/* Advertisement */}
            <div className="my-8">
              <Advertisement 
                format="banner"
                position="middle"
              />
            </div>

            {/* Especificações Técnicas */}
            {(isEnsaios(artigo) || isSuperdesportivo(artigo)) && artigo.specs && (
              <SpecificacoesTecnicas 
                categoria={artigo.categoria}
                specs={artigo.specs}
              />
            )}

            {/* Tags */}
            {artigo.tags && artigo.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {artigo.tags.map((tag) => (
                    <span 
                      key={typeof tag === 'string' ? tag : JSON.stringify(tag)}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Compartilhar */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Compartilhar:</h3>
              <div className="flex gap-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Facebook
                </button>
                <button className="bg-blue-400 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-500 transition-colors">
                  Twitter
                </button>
                <button className="bg-blue-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-900 transition-colors">
                  LinkedIn
                </button>
              </div>
            </div>
          </article>

          {/* Advertisement Bottom */}
          <div className="mt-12">
            <Advertisement 
              format="banner"
              position="bottom"
            />
          </div>

          {/* Artigos Relacionados */}
          {artigosRelacionados.length > 0 && (
            <div className="mt-12">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-bold mb-6">Artigos Relacionados</h3>
                <div className="space-y-4">
                  {artigosRelacionados.map((artigoRelacionado) => (
                    <Link
                      key={artigoRelacionado.slug}
                      href={`/artigos/${artigoRelacionado.slug}`}
                      className="block group"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                          {artigoRelacionado.imagem ? (
                            <img 
                              src={artigoRelacionado.imagem} 
                              alt={artigoRelacionado.titulo}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">Img</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-orange-600 transition-colors">
                            {artigoRelacionado.titulo}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">{artigoRelacionado.data ? formatDate(new Date(artigoRelacionado.data)) : '—'}</p>
                          <span className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded mt-2">
                            {artigoRelacionado.categoria}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Newsletter */}
           <div className="mt-8">
             <Newsletter 
               title="Newsletter"
               description="Receba as últimas notícias e análises do mundo automóvel diretamente no seu email."
               variant="compact"
               theme="colored"
               color="red"
             />
           </div>

          {/* Navegação Voltar */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <Link
              href="/artigos"
              className="inline-flex items-center gap-3 text-gray-600 hover:text-orange-600 transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div>
                <div className="text-sm text-gray-500">Voltar para</div>
                <div className="font-semibold">Todos os Artigos</div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}