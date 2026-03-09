'use client'

import { useState, useEffect, use as useUnwrap } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Noticia } from '@/types/noticia'
import Newsletter from '@/components/Newsletter'
import { sanitizeHtml } from '@/lib/sanitize'
import Advertisement from '@/components/Advertisement'

interface NoticiaPageProps {
  params: { slug: string } | Promise<{ slug: string }>
}

export default function NoticiaPage({ params }: NoticiaPageProps) {
  const [noticia, setNoticia] = useState<Noticia | null>(null)
  const [relatedNoticias, setRelatedNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Compatível com Next 14/15: params pode ser um Promise em client components
  // Normalizamos para Promise para usar o hook use() de forma incondicional
  const paramsPromise = (params instanceof Promise) ? params : Promise.resolve(params)
  const resolvedParams = useUnwrap(paramsPromise)
  const slug = resolvedParams.slug

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        setLoading(true)
        setError(null)

        // Buscar a notícia específica
        const response = await fetch(`/api/noticias?slug=${slug}`)
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error('Erro ao carregar notícia')
        }

        const data = await response.json()
        if (!data.noticias || data.noticias.length === 0) {
          notFound()
        }

        const noticiaData = data.noticias[0]
        // Apenas conteúdo publicado é exibido
        if ((noticiaData as any).status && (noticiaData as any).status !== 'published') {
          notFound()
        }
        setNoticia(noticiaData)

        // Buscar notícias relacionadas da mesma categoria
        if (noticiaData.categoria) {
          const relatedResponse = await fetch(`/api/noticias?categoria=${noticiaData.categoria}&limit=4`)
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json()
            // Filtrar a notícia atual das relacionadas
            const filtered = (relatedData.noticias || [])
              .filter((n: any) => (n.status === 'published' || n.status === undefined) && n.slug !== slug)
            setRelatedNoticias(filtered.slice(0, 3))
          }
        }
      } catch (err) {
        console.error('Erro ao carregar notícia:', err)
        setError('Erro ao carregar notícia')
      } finally {
        setLoading(false)
      }
    }

    fetchNoticia()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-300 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar notícia</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/noticias" 
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Voltar para Notícias
          </Link>
        </div>
      </div>
    )
  }

  if (!noticia) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'Atualidade':
        return 'bg-blue-600'
      case 'Opinião':
        return 'bg-purple-600'
      case 'Desporto':
        return 'bg-green-600'
      default:
        return 'bg-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-red-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/noticias" className="hover:text-red-600">Notícias</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{noticia.titulo}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Categoria */}
              <div className="p-6 pb-0">
                <span className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${getCategoryColor(noticia.categoria)}`}>
                  {noticia.categoria}
                </span>
              </div>

              {/* Título */}
              <div className="p-6 pb-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {noticia.titulo}
                </h1>
              </div>

              {/* Resumo */}
              {noticia.resumo && (
                <div className="px-6 pb-4">
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {noticia.resumo}
                  </p>
                </div>
              )}

              {/* Meta informações */}
              <div className="px-6 pb-6">
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                   <span>Por {noticia.autor}</span>
                   <span>•</span>
                   <time>{formatDate(noticia.data)}</time>
                 </div>
              </div>

              {/* Imagem Principal */}
               {noticia.imagem && (
                 <div className="relative h-64 md:h-96">
                   <Image
                     src={noticia.imagem}
                     alt={noticia.titulo}
                     fill
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1200px, 1200px"
                     unoptimized
                     className="object-cover"
                   />
                 </div>
               )}

              {/* Conteúdo */}
              <div className="p-6">
              <div 
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(noticia.conteudo) }}
                />
              </div>

              {/* Tags */}
              {noticia.tags && noticia.tags.length > 0 && (
                <div className="px-6 pb-6">
                  <div className="flex flex-wrap gap-2">
                    {noticia.tags.map((tag) => (
                      <span
                        key={typeof tag === 'string' ? tag : JSON.stringify(tag)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Publicidade Nativa */}
              <div className="mt-8">
                <Advertisement format="native" position="middle" />
              </div>

             {/* Notícias Relacionadas */}
             {relatedNoticias.length > 0 && (
               <div className="mt-12">
                 <h2 className="text-2xl font-bold text-gray-900 mb-6">Notícias Relacionadas</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {relatedNoticias.map((relacionada) => (
                     <Link
                       key={relacionada.slug}
                       href={`/noticias/${relacionada.slug}`}
                       className="group"
                     >
                       <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                         {relacionada.imagem && (
                           <div className="relative h-48">
                             <Image
                               src={relacionada.imagem}
                               alt={relacionada.titulo}
                               fill
                               sizes="(max-width: 768px) 100vw, 33vw"
                               unoptimized
                               className="object-cover group-hover:scale-105 transition-transform duration-300"
                             />
                           </div>
                         )}
                         <div className="p-4">
                           <span className={`inline-block px-2 py-1 rounded text-white text-xs font-medium mb-2 ${getCategoryColor(relacionada.categoria)}`}>
                             {relacionada.categoria}
                           </span>
                           <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                             {relacionada.titulo}
                           </h3>
                           <p className="text-sm text-gray-500 mt-2">
                             {formatDate(relacionada.data)}
                           </p>
                         </div>
                       </article>
                     </Link>
                   ))}
                 </div>
               </div>
             )}
          </div>

          {/* Sidebar */}
           <div className="space-y-8">
             {/* Banner de Publicidade */}
             <Advertisement format="square" position="sidebar" />

             {/* Newsletter */}
             <Newsletter color="red" />

             {/* Mais Publicidade */}
             <Advertisement format="banner" position="sidebar" />
           </div>
        </div>
      </div>
    </div>
  )
}