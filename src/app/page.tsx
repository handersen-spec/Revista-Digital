'use client'
import Link from 'next/link'
import { useEffect, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import type { MouseEvent } from 'react'
import type { Video } from '@/types/video'
import type { Noticia } from '@/types/noticia'
import { useHeroCarousel, HeroCarouselItem } from '@/hooks/useHeroCarousel'
import Loading from '@/components/ui/Loading'
import { useArtigosDestaque } from '@/hooks/useArtigos'
import { useVideosDestaque } from '@/hooks/useVideos'
import { useNoticiasDestaque } from '@/hooks/useNoticias'

// Carregamento dinâmico de componentes (melhor compatibilidade com Next)
const Advertisement = dynamic(() => import('@/components/Advertisement'), { ssr: false })

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [artigosTotal, setArtigosTotal] = useState<number | null>(null)
  const [testDrivesTotal, setTestDrivesTotal] = useState<number | null>(null)
  const [hoverActive, setHoverActive] = useState(false)
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({ x: 70, y: 30 })

  // Dados dinâmicos do carrossel (API - administrado no módulo)
  const { items: heroItems } = useHeroCarousel()
  const carouselData: HeroCarouselItem[] = heroItems && heroItems.length ? heroItems : []

  // Conteúdos em destaque vindos da API
  const { artigos: artigosApi, loading: loadingArtigos } = useArtigosDestaque(6)
  const { videos: videosApi, loading: loadingVideos } = useVideosDestaque()
  const { noticias: noticiasApi, loading: loadingNoticias } = useNoticiasDestaque(6)

  // Artigos em destaque (primeiros 3, somente publicados)
  const artigosDestaque = (artigosApi || [])
    .filter(a => a.status === 'published' || a.status === undefined)
    .slice(0, 3)
  
  // Vídeos em destaque (primeiros 2, somente publicados)
  const videosDestaque = ((videosApi || []) as unknown as Video[])
    .filter((v) => v?.status === 'published' || v?.status === undefined)
    .slice(0, 2)
  
  // Notícias em destaque publicadas (primeiros 3)
  const noticiasDestaque = ((noticiasApi || []) as unknown as Noticia[])
    .filter((n) => n?.status === 'published' || n?.status === undefined)
    .slice(0, 3)

  // Função para obter cor da categoria
  const getCategoriaColor = (categoria: string) => {
    const cores = {
      'Test Drive': 'from-blue-500 to-blue-700',
      'Análise': 'from-green-500 to-green-700',
      'Mercado': 'from-purple-500 to-purple-700',
      'Supercar': 'from-red-500 to-red-700',
      'Economia': 'from-yellow-500 to-yellow-700'
    }
    return cores[categoria as keyof typeof cores] || 'from-gray-500 to-gray-700'
  }

  // Função para obter cor do texto da categoria
  const getCategoriaTextColor = (categoria: string) => {
    const cores = {
      'Test Drive': 'text-blue-700',
      'Análise': 'text-green-700',
      'Mercado': 'text-purple-700',
      'Supercar': 'text-red-700',
      'Economia': 'text-yellow-700'
    }
    return cores[categoria as keyof typeof cores] || 'text-gray-700'
  }

  useEffect(() => {
    setIsLoaded(true)
    if (!carouselData.length) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [carouselData.length])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Buscar totais reais de artigos e test drives para estatísticas da Home
  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const [artigosResp, tdResp] = await Promise.all([
          fetch('/api/artigos?limit=1'),
          fetch('/api/test-drives?limit=1')
        ])
        if (artigosResp.ok) {
          const data = await artigosResp.json()
          setArtigosTotal(data?.total ?? null)
        }
        if (tdResp.ok) {
          const data = await tdResp.json()
          setTestDrivesTotal(data?.total ?? null)
        }
      } catch (err) {
        console.error('Erro ao carregar estatísticas da Home:', err)
      }
    }
    fetchTotals()
  }, [])

  const emptyItem: HeroCarouselItem = {
    title: '',
    subtitle: '',
    description: '',
    details: '',
    bgImage: "radial-gradient(ellipse at 70% 30%, rgba(185,28,28,0.35) 0%, rgba(185,28,28,0.10) 40%, rgba(0,0,0,0) 60%), linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #0a0a0a 100%)",
    categoria: 'geral',
    active: true,
    ordem: -1,
  }
  const currentData: HeroCarouselItem = carouselData.length ? carouselData[currentSlide] : emptyItem
  const keyBase = currentData.id ?? currentSlide
  const subtitleText = currentData.subtitle ?? ''
  const descriptionText = currentData.description ?? ''
  const detailsText = currentData.details ?? ''
  const bgStyle = currentData.bgImage ?? "radial-gradient(ellipse at 70% 30%, rgba(185,28,28,0.35) 0%, rgba(185,28,28,0.10) 40%, rgba(0,0,0,0) 60%), linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #0a0a0a 100%)"

  function handleMouseMove(e: MouseEvent<HTMLElement>) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setHoverPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
    setHoverActive(true)
  }
  function handleMouseLeave() {
    setHoverActive(false)
  }

  return (
    <div style={{ background: 'var(--background-secondary)' }}>
      {/* Hero Section */}
      <section 
        id="main-content" 
        className="relative min-h-screen flex items-center justify-center overflow-hidden" 
        aria-label="Seção principal da página"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background dinâmico */}
        <div 
          className="absolute inset-0 transition-all duration-700 ease-out will-change-transform"
          style={{
            backgroundImage: `radial-gradient(ellipse at ${hoverPos.x}% ${hoverPos.y}%, rgba(185,28,28,${hoverActive ? 0.45 : 0.30}) 0%, rgba(185,28,28,${hoverActive ? 0.18 : 0.10}) 40%, rgba(0,0,0,0) 60%), linear-gradient(135deg, rgba(10,10,10,${hoverActive ? 0.68 : 0.55}) 0%, rgba(23,23,23,${hoverActive ? 0.72 : 0.60}) 50%, rgba(10,10,10,${hoverActive ? 0.68 : 0.55}) 100%), ${bgStyle}`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: hoverActive ? 'scale(1.03)' : 'scale(1.00)',
            filter: hoverActive ? 'brightness(1.05)' : 'brightness(1.00)'
          }}
        ></div>
        
        {/* Elementos decorativos */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-10 left-4 sm:top-20 sm:left-20 w-16 h-16 sm:w-32 sm:h-32 border border-red-500 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-8 sm:top-40 sm:right-32 w-12 h-12 sm:w-24 sm:h-24 border border-white rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-8 sm:bottom-32 sm:left-32 w-20 h-20 sm:w-40 sm:h-40 border border-red-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-10 right-4 sm:bottom-20 sm:right-20 w-14 h-14 sm:w-28 sm:h-28 border border-white rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        </div>

        {/* Partículas flutuantes */}
        <div className="absolute inset-0" aria-hidden="true">
          {[
            { size: 3, left: 15, top: 25, delay: 0.5, duration: 12 },
            { size: 2, left: 85, top: 15, delay: 1.2, duration: 15 },
            { size: 4, left: 45, top: 75, delay: 2.1, duration: 18 },
            { size: 3, left: 75, top: 45, delay: 0.8, duration: 14 },
            { size: 2, left: 25, top: 85, delay: 1.8, duration: 16 },
            { size: 5, left: 65, top: 35, delay: 0.3, duration: 13 },
            { size: 3, left: 35, top: 65, delay: 2.5, duration: 17 },
            { size: 2, left: 55, top: 25, delay: 1.5, duration: 19 },
            { size: 4, left: 15, top: 55, delay: 0.9, duration: 11 },
            { size: 3, left: 85, top: 75, delay: 2.2, duration: 14 },
            { size: 2, left: 5, top: 35, delay: 1.1, duration: 16 },
            { size: 4, left: 95, top: 85, delay: 0.6, duration: 12 },
            { size: 3, left: 25, top: 15, delay: 1.9, duration: 18 },
            { size: 2, left: 75, top: 95, delay: 0.4, duration: 15 },
            { size: 5, left: 45, top: 5, delay: 2.3, duration: 13 },
            { size: 3, left: 65, top: 85, delay: 1.4, duration: 17 },
            { size: 2, left: 35, top: 45, delay: 0.7, duration: 19 },
            { size: 4, left: 85, top: 25, delay: 2.0, duration: 11 },
            { size: 3, left: 15, top: 75, delay: 1.3, duration: 14 },
            { size: 2, left: 55, top: 65, delay: 0.2, duration: 16 }
          ].map((particle: { size: number; left: number; top: number; delay: number; duration: number }, i: number) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-float"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`
              }}
            />
          ))}
        </div>

        {/* Conteúdo principal */}
        <div className={`relative z-10 text-center px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Título principal */}
          <div className="mb-6 sm:mb-8">
            <h1 
              key={keyBase}
              className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-wider mb-3 sm:mb-4 animate-fade-in-scale px-2"
            >
              {currentData.title.split('').map((letter: string, index: number) => {
                const middleIndex = isMounted ? Math.floor(currentData.title.length / 2) : 0
                return (
                  <span 
                    key={index}
                    className={`${index === middleIndex ? 'text-red-600 drop-shadow-2xl animate-glow animate-float' : 'text-white'} inline-block`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {letter}
                  </span>
                )
              })}
            </h1>
            <div 
              key={`subtitle-${keyBase}`}
              className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-light tracking-[0.2em] sm:tracking-[0.3em] uppercase animate-fade-in-up px-2" 
              style={{animationDelay: '0.5s'}}
            >
              {subtitleText}
            </div>
          </div>

          {/* Divisor decorativo */}
          <div className="flex items-center justify-center mb-6 sm:mb-8" aria-hidden="true">
            <div className="h-px bg-red-600 w-12 sm:w-16"></div>
            <div className="mx-3 sm:mx-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-600 rounded-full"></div>
            <div className="h-px bg-red-600 w-12 sm:w-16"></div>
          </div>

          {/* Descrição */}
          <h2 
            key={`description-${keyBase}`}
            className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 max-w-4xl mx-auto leading-tight animate-slide-in-up px-4"
          >
            {descriptionText.split(' ').map((word: string, index: number) => (
              <span 
                key={index}
                className={word === 'Angola' || word === 'Movimento' || word === 'Adrenalina' || word === 'Eletrica' || word === 'Rodas' ? 'text-red-500' : ''}
              >
                {word}{' '}
              </span>
            ))}
          </h2>

          <p 
            key={`details-${keyBase}`}
            className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
            style={{animationDelay: '0.3s'}}
          >
            {detailsText}
          </p>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 animate-bounce-in stagger-children" style={{animationDelay: '1s'}}>
            <Link 
              href="/artigos" 
              className="btn-base btn-primary btn-lg text-heading uppercase tracking-wider hover-brightness transition-spring focus-ring group"
              style={{animationDelay: '1.2s'}}
            >
              <span className="transition-smooth">Explorar Edição</span>
              <svg className="w-5 h-5 ml-2 group-hover:animate-slide-in-right transition-smooth" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              href="/test-drives" 
              className="btn-base btn-outline btn-lg text-heading uppercase tracking-wider hover-brightness transition-spring focus-ring group"
              style={{ borderColor: 'white', color: 'white', borderWidth: '1px', animationDelay: '1.4s' }}
            >
              <span>Test Drives</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </Link>
          </div>

          {/* Estatísticas */}
          <div className="flex flex-row justify-center items-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 max-w-4xl mx-auto text-white animate-fade-in-up stagger-children px-4" style={{animationDelay: '1.5s'}} role="region" aria-label="Estatísticas do site">
            <div className="text-center group transition-spring animate-bounce-in flex-1" style={{animationDelay: '0s'}}>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-1 sm:mb-2 transition-all duration-300" style={{ color: 'var(--primary-400)' }}>{artigosTotal !== null ? artigosTotal : '—'}</div>
              <div className="text-xs sm:text-sm md:text-base uppercase tracking-wider">Artigos</div>
            </div>
            <div className="text-center group transition-spring animate-bounce-in flex-1" style={{animationDelay: '0.2s'}}>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-1 sm:mb-2 transition-all duration-300" style={{ color: 'var(--primary-400)' }}>{testDrivesTotal !== null ? testDrivesTotal : '—'}</div>
              <div className="text-xs sm:text-sm md:text-base uppercase tracking-wider">Test Drives</div>
            </div>
            <div className="text-center group transition-spring animate-bounce-in flex-1" style={{animationDelay: '0.4s'}}>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-1 sm:mb-2 transition-all duration-300" style={{ color: 'var(--primary-400)' }}>24/7</div>
              <div className="text-xs sm:text-sm md:text-base uppercase tracking-wider">Atualizado</div>
            </div>
          </div>

          {/* Indicadores do carrossel */}
          <div className="flex justify-center space-x-3 mt-8">
            {carouselData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 focus-ring ${
                  index === currentSlide 
                    ? 'scale-125' 
                    : 'hover:scale-110'
                }`}
                style={{
                  backgroundColor: index === currentSlide 
                    ? 'var(--primary-500)' 
                    : 'rgba(255, 255, 255, 0.5)'
                }}
                onMouseEnter={(e) => {
                  if (index !== currentSlide) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== currentSlide) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'
                  }
                }}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Seta para baixo */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce" aria-hidden="true">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Publicidade superior */}
      <section style={{ backgroundColor: 'var(--background-secondary)' }} className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<Loading size="md" text="Carregando publicidade..." />}>
            <Advertisement 
              format="banner" 
              position="top"
              className="max-w-4xl mx-auto"
            />
          </Suspense>
        </div>
      </section>

      {/* Seção principal de conteúdo */}
      <section style={{ backgroundColor: 'var(--background-primary)' }} className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up text-gray-900">
            Bem-vindo à Experiência Digital
          </h2>
          <p className="text-xl sm:text-2xl lg:text-3xl max-w-4xl mx-auto animate-fade-in-up text-gray-700 leading-relaxed" style={{animationDelay: '0.2s'}}>
            Mergulhe no universo automobilístico angolano com conteúdo exclusivo e análises profissionais.
          </p>
        </div>

        {/* Cards de características */}
        <section className="mt-12 sm:mt-16 md:mt-20 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6" aria-label="Principais características do site" role="list">
          <article className="card-base card-elevated hover-slide-up transition-spring animate-slide-in-rotate p-6 sm:p-8" style={{animationDelay: '0.4s'}} role="listitem">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4 hover-rotate transition-smooth" 
                 style={{ backgroundColor: 'var(--primary-500)', borderRadius: 'var(--radius-lg)' }}>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ color: 'var(--foreground)' }}>
              Test Drives Exclusivos
            </h3>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
              Experiências reais com os carros mais desejados do mercado, testados nas estradas angolanas.
            </p>
          </article>

          <article className="card-base card-elevated hover-slide-up transition-spring animate-slide-in-rotate p-6 sm:p-8" style={{animationDelay: '0.6s'}} role="listitem">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4 hover-rotate transition-smooth" 
                 style={{ backgroundColor: 'var(--accent-orange)', borderRadius: 'var(--radius-lg)' }}>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ color: 'var(--foreground)' }}>
              Análises de Mercado
            </h3>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
              Insights profundos sobre tendências, preços e oportunidades no mercado automobilístico angolano.
            </p>
          </article>

          <article className="card-base card-elevated hover-slide-up transition-spring animate-slide-in-rotate p-6 sm:p-8" style={{animationDelay: '0.8s'}} role="listitem">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4 hover-rotate transition-smooth" 
                 style={{ backgroundColor: 'var(--success)', borderRadius: 'var(--radius-lg)' }}>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ color: 'var(--foreground)' }}>
              Conteúdo Multimídia
            </h3>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
              Vídeos, fotos e conteúdo interativo para uma experiência completa e envolvente.
            </p>
          </article>
        </section>

        {/* Seção de Artigos em Destaque */}
        <section className="mt-16 sm:mt-20 max-w-6xl mx-auto px-4 sm:px-6" aria-label="Artigos em destaque">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-2 sm:gap-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
              Artigos em Destaque
            </h2>
            <Link 
              href="/artigos" 
              className="text-red-600 hover:text-red-700 font-semibold flex items-center group self-start sm:self-auto"
              aria-label="Ver todos os artigos"
            >
              Ver todos
              <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {loadingArtigos && (
            <div className="text-sm text-slate-500">Carregando artigos em destaque...</div>
          )}
          {!loadingArtigos && artigosDestaque.length === 0 && (
            <div className="text-sm text-slate-500">Nenhum artigo em destaque.</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" role="list">
            {artigosDestaque.map((artigo) => (
              <article key={artigo.slug} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group" role="listitem">
                <div className="aspect-video bg-gray-200 relative" aria-hidden="true">
                  {artigo.imagem ? (
                    <img 
                      src={artigo.imagem} 
                      alt={artigo.titulo}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getCategoriaColor(artigo.categoria)}`} />
                  )}
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                    <span className={`bg-white ${getCategoriaTextColor(artigo.categoria)} px-2 py-1 rounded text-xs font-medium`}>
                      {artigo.categoria}
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                    {artigo.titulo}
                  </h3>
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                    {artigo.resumo}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs text-slate-500 gap-1 sm:gap-0" aria-label={`Artigo por ${artigo.autor}, publicado em ${artigo.data}`}>
                    <span>{artigo.autor}</span>
                    <span>{artigo.data}</span>
                  </div>
                  <Link 
                    href={`/artigos/${artigo.slug}`}
                    className="inline-flex items-center mt-3 text-red-600 hover:text-red-700 text-sm font-medium"
                    aria-label={`Ler artigo completo: ${artigo.titulo}`}
                  >
                    Ler mais
                    <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Seção de Vídeos em Destaque */}
        <section className="mt-16 sm:mt-20 max-w-6xl mx-auto px-4 sm:px-6" aria-label="Vídeos em destaque">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-2 sm:gap-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
              Vídeos em Destaque
            </h2>
            <Link 
              href="/videos" 
              className="text-red-600 hover:text-red-700 font-semibold flex items-center group self-start sm:self-auto"
              aria-label="Ver todos os vídeos"
            >
              Ver todos
              <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {loadingVideos && (
            <div className="text-sm text-slate-500">Carregando vídeos em destaque...</div>
          )}
          {!loadingVideos && videosDestaque.length === 0 && (
            <div className="text-sm text-slate-500">Nenhum vídeo em destaque.</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" role="list">
            {videosDestaque.map((video) => (
              <article key={video.slug} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group" role="listitem">
                <div className="relative aspect-video" aria-hidden="true">
                  {video.thumbnail ? (
                    <img 
                      src={video.thumbnail} 
                      alt={video.titulo}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${getCategoriaColor(video.categoria)}`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                    {video.duracao}
                  </div>
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                    <span className={`bg-white ${getCategoriaTextColor(video.categoria)} px-2 py-1 rounded text-xs font-medium`}>
                      {video.categoria}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                    {video.titulo}
                  </h3>
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                    {video.descricao}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs text-slate-500 gap-1 sm:gap-0" aria-label={`Vídeo do canal ${(video as any).canal}, ${video.visualizacoes} visualizações`}>
                    <span>{(video as any).canal}</span>
                    <span>{video.visualizacoes} visualizações</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {video.data}
                  </div>
                  <Link 
                    href={`/videos/${video.slug}`}
                    className="inline-flex items-center mt-3 text-red-600 hover:text-red-700 text-sm font-medium"
                    aria-label={`Assistir vídeo: ${video.titulo}`}
                  >
                    Assistir vídeo
                    <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Publicidade do meio */}
        <div className="mt-16">
          <Suspense fallback={<Loading size="md" text="Carregando publicidade..." />}>
            <Advertisement 
              format="native" 
              position="middle"
              className="max-w-4xl mx-auto"
            />
          </Suspense>
        </div>

        {/* Seção de navegação rápida */}
        <section className="mt-16 sm:mt-20 max-w-4xl mx-auto px-4 sm:px-6" aria-label="Links rápidos para explorar conteúdo">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-6 sm:mb-8">
            Explore Nosso Conteudo
          </h2>
          <nav className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4" role="navigation" aria-label="Navegação rápida">
            <Link href="/videos" className="bg-white p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center" aria-label="Ir para seção de vídeos">
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2" aria-hidden="true">🎥</div>
              <span className="text-xs sm:text-sm font-medium text-slate-700">Videos</span>
            </Link>
            <Link href="/concessionarias" className="bg-white p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center" aria-label="Ir para seção de concessionárias">
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2" aria-hidden="true">🏢</div>
              <span className="text-xs sm:text-sm font-medium text-slate-700">Concessionarias</span>
            </Link>
            <Link href="/ferramentas" className="bg-white p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center" aria-label="Ir para seção de ferramentas">
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2" aria-hidden="true">🔧</div>
              <span className="text-xs sm:text-sm font-medium text-slate-700">Ferramentas</span>
            </Link>
            <Link href="/mercado" className="bg-white p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center" aria-label="Ir para seção de mercado">
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2" aria-hidden="true">📊</div>
              <span className="text-xs sm:text-sm font-medium text-slate-700">Mercado</span>
            </Link>
          </nav>
        </section>

        {/* Seção de Notícias em Destaque */}
        <section className="mt-12 sm:mt-16 lg:mt-20 max-w-6xl mx-auto px-4 sm:px-6" aria-label="Últimas notícias em destaque">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-2 sm:gap-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
              Últimas Notícias
            </h2>
            <Link 
              href="/noticias" 
              className="text-red-600 hover:text-red-700 font-semibold flex items-center group self-start sm:self-auto"
              aria-label="Ver todas as notícias"
            >
              Ver todas
              <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6" role="list">
            {/* Notícia principal */}
            {loadingNoticias && (
              <div className="text-sm text-slate-500">Carregando notícias...</div>
            )}
            {!loadingNoticias && noticiasDestaque.length > 0 && (
              <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group lg:col-span-1" role="listitem">
                <div className={`aspect-video relative`} aria-hidden="true">
                  {noticiasDestaque[0].imagem ? (
                    <img
                      src={noticiasDestaque[0].imagem}
                      alt={noticiasDestaque[0].titulo}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getCategoriaColor(noticiasDestaque[0].categoria)}`} />
                  )}
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                    <span className={`bg-white ${getCategoriaTextColor(noticiasDestaque[0].categoria)} px-2 py-1 rounded text-xs font-medium`}>
                      {noticiasDestaque[0].categoria}
                    </span>
                  </div>
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                    DESTAQUE
                  </div>
                  <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {noticiasDestaque[0].data}
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                    {noticiasDestaque[0].titulo}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4 line-clamp-3">
                    {noticiasDestaque[0].resumo}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4 gap-1 sm:gap-0" aria-label={`Notícia por ${noticiasDestaque[0].autor}, publicada em ${noticiasDestaque[0].data}`}>
                    <span>{noticiasDestaque[0].autor}</span>
                    <span>{noticiasDestaque[0].data}</span>
                  </div>
                  <Link 
                    href={`/noticias/${noticiasDestaque[0].slug}`}
                    className="inline-flex items-center text-red-600 hover:text-red-700 font-medium text-sm sm:text-base"
                    aria-label={`Ler notícia completa: ${noticiasDestaque[0].titulo}`}
                  >
                    Ler notícia completa
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            )}

            {/* Notícias secundárias */}
            <div className="space-y-3 sm:space-y-4">
              {!loadingNoticias && noticiasDestaque.length === 0 && (
                <div className="text-sm text-slate-500">Nenhuma notícia em destaque.</div>
              )}
              {noticiasDestaque.slice(1).map((noticia) => (
                <article key={noticia.slug} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group" role="listitem">
                  <Link href={`/noticias/${noticia.slug}`} className="flex" aria-label={`Ler notícia: ${noticia.titulo}`}>
                    <div className={`w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 relative`} aria-hidden="true">
                      {noticia.imagem ? (
                        <img
                          src={noticia.imagem}
                          alt={noticia.titulo}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${getCategoriaColor(noticia.categoria)}`} />
                      )}
                      <div className="absolute top-1 left-1">
                        <span className={`bg-white ${getCategoriaTextColor(noticia.categoria)} px-1 py-0.5 rounded text-xs font-medium`}>
                          {noticia.categoria}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 flex-1">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors line-clamp-2">
                        {noticia.titulo}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 mb-2 line-clamp-2">
                        {noticia.resumo}
                      </p>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-slate-500 gap-1 sm:gap-0" aria-label={`Notícia por ${noticia.autor}, publicada em ${noticia.data}`}>
                        <span>{noticia.autor}</span>
                <span>{noticia.data}</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Publicidade inferior */}
        <div className="mt-12 sm:mt-16 flex justify-center px-4 sm:px-6">
          <Suspense fallback={<Loading size="md" text="Carregando publicidade..." />}>
            <Advertisement 
              format="square" 
              position="bottom"
              className="max-w-xs sm:max-w-sm"
            />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
