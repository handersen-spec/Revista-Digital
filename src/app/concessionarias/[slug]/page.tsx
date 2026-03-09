'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Advertisement from '@/components/Advertisement'
import GaleriaImagens from '@/components/GaleriaImagens'
import { Concessionaria } from '@/hooks/useConcessionarias'

// Estados de loading
interface PageState {
  concessionaria: Concessionaria | null
  loading: boolean
  error: string | null
  notFound: boolean
}

function renderStars(rating: number) {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    )
  }

  if (hasHalfStar) {
    stars.push(
      <svg key="half" className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    )
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    )
  }

  return stars
}

export default function ConcessionariaDetalhePage() {
  const params = useParams()
  const slug = params?.slug as string
  
  const [state, setState] = useState<PageState>({
    concessionaria: null,
    loading: true,
    error: null,
    notFound: false
  })

  useEffect(() => {
    const fetchConcessionaria = async () => {
      if (!slug) return

      try {
        setState(prev => ({ ...prev, loading: true, error: null }))

        // Buscar concessionária por slug/id
        const response = await fetch(`/api/concessionarias/${slug}`)
        
        if (response.status === 404) {
          setState(prev => ({ ...prev, notFound: true, loading: false }))
          return
        }

        if (!response.ok) {
          throw new Error('Erro ao carregar concessionária')
        }

        const data = await response.json()
        setState(prev => ({ 
          ...prev, 
          concessionaria: data, 
          loading: false 
        }))
      } catch (err) {
        setState(prev => ({ 
          ...prev, 
          error: err instanceof Error ? err.message : 'Erro desconhecido',
          loading: false 
        }))
      }
    }

    fetchConcessionaria()
  }, [slug])

  // Estado de loading
  if (state.loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            {/* Hero Section Skeleton */}
            <div className="bg-gray-300 h-64 rounded-lg mb-8"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Content Skeleton */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg p-6">
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-32 bg-gray-300 rounded"></div>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
              
              {/* Sidebar Skeleton */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6">
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Estado de erro
  if (state.error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Erro ao carregar concessionária</h3>
            <p className="mt-1 text-sm text-gray-500">{state.error}</p>
            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Estado de não encontrado
  if (state.notFound) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Concessionária não encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">A concessionária que você está procurando não existe ou foi removida.</p>
            <div className="mt-6">
              <Link
                href="/concessionarias"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Ver todas as concessionárias
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { concessionaria } = state

  if (!concessionaria) {
    return null
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-2/3">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold">
                  {concessionaria.nome}
                </h1>
                {concessionaria.destaque && (
                  <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Destaque
                  </span>
                )}
              </div>
              <p className="text-xl text-orange-100 mb-4">
                {concessionaria.marca} • {concessionaria.cidade}, {concessionaria.provincia}
              </p>
              <div className="flex items-center mb-6">
                <div className="flex items-center mr-4">
                  {renderStars(concessionaria.avaliacoes.media)}
                </div>
                <span className="text-orange-100">
                  {concessionaria.avaliacoes.media} ({concessionaria.avaliacoes.total} avaliações)
                </span>
              </div>
              <p className="text-lg text-gray-100 leading-relaxed">
                Concessionária {concessionaria.marca} em {concessionaria.cidade}
              </p>
            </div>
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações de Contato</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{concessionaria.endereco}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm">{concessionaria.telefone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">
                      {Object.entries(concessionaria.horarioFuncionamento).map(([dia, horario]) => (
                        <div key={dia} className="capitalize">
                          {dia}: {horario}
                        </div>
                      ))}
                    </span>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <a 
                    href={`tel:${concessionaria.telefone}`}
                    className="w-full border border-orange-600 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors text-sm text-center block"
                  >
                    Ligar Agora
                  </a>
                  {concessionaria.email && (
                    <a 
                      href={`mailto:${concessionaria.email}`}
                      className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm text-center block"
                    >
                      Enviar Email
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galeria de Imagens */}
            <section className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeria</h2>
                {concessionaria.imagens && concessionaria.imagens.length > 0 ? (
                  <GaleriaImagens 
                    imagens={concessionaria.imagens.map((url, index) => ({
                      id: index.toString(),
                      url,
                      alt: `Imagem da ${concessionaria.nome}`,
                      legenda: `Instalações da ${concessionaria.nome}`
                    }))} 
                  />
                ) : (
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Imagens da {concessionaria.marca}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Informações Gerais */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre a Concessionária</h2>
              <p className="text-gray-700 leading-relaxed">
                A {concessionaria.nome} é uma concessionária {concessionaria.verificada ? 'verificada' : ''} 
                especializada na marca {concessionaria.marca}, localizada em {concessionaria.cidade}, {concessionaria.provincia}.
                {concessionaria.website && (
                  <>
                    {' '}Visite nosso site: {' '}
                    <a 
                      href={concessionaria.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 underline"
                    >
                      {concessionaria.website}
                    </a>
                  </>
                )}
              </p>
            </section>

            {/* Publicidade */}
            <Advertisement 
              format="banner"
              position="middle"
              className="my-8"
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Serviços */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Serviços Oferecidos</h3>
              <div className="space-y-2">
                {concessionaria.servicos.map((servico: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 text-sm">{servico}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <svg className={`w-4 h-4 mr-2 ${concessionaria.verificada ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700 text-sm">
                    {concessionaria.verificada ? 'Verificada' : 'Não verificada'}
                  </span>
                </div>
                <div className="flex items-center">
                  <svg className={`w-4 h-4 mr-2 ${concessionaria.destaque ? 'text-yellow-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span className="text-gray-700 text-sm">
                    {concessionaria.destaque ? 'Em destaque' : 'Padrão'}
                  </span>
                </div>
              </div>
            </div>

            {/* Localização */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Localização</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div>Latitude: {concessionaria.coordenadas.latitude}</div>
                <div>Longitude: {concessionaria.coordenadas.longitude}</div>
                <div className="text-xs text-gray-500 mt-2">
                  Atualizado em: {new Date(concessionaria.dataAtualizacao).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>

            {/* Publicidade Sidebar */}
            <Advertisement 
              format="square"
              position="sidebar"
              className="sticky top-4"
            />
          </div>
        </div>
      </div>

      {/* Navegação */}
      <section className="bg-white border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link 
              href="/concessionarias"
              className="flex items-center text-orange-600 hover:text-orange-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar às Concessionárias
            </Link>
            <div className="text-sm text-gray-500">
              Concessionária #{concessionaria.id}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}