'use client'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackAngolanEvent, AnalyticsEvents, AnalyticsCategories } from '@/lib/analytics'

interface AdData {
  id: string
  title: string
  brand: string
  image: string
  link: string
  description?: string
  cta?: string
}

interface AdvertisementProps {
  format: 'banner' | 'square' | 'vertical' | 'native'
  position: 'top' | 'middle' | 'bottom' | 'sidebar'
  className?: string
  ads?: AdData[]
}

// TODO: Conectar com API de publicidade real
// Dados removidos - implementar busca real de anúncios

export default function Advertisement({ format, position, className = '', ads = [] }: AdvertisementProps) {
  const [currentAd, setCurrentAd] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [fetchedAds, setFetchedAds] = useState<AdData[]>([])
  const [loadingAds, setLoadingAds] = useState(false)
  const [errorAds, setErrorAds] = useState<string | null>(null)
  const adRef = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)
  const pathname = usePathname()
  const isBlockedRoute = !!pathname && (
    pathname === '/404' ||
    pathname.includes('not-found') ||
    pathname.startsWith('/admin')
  )

  // Fallback de anúncio quando não há dados/imagens
  const defaultAd: AdData = {
    id: 'fallback',
    title: 'Anuncie Aqui',
    brand: 'Auto Prestige',
    image: '',
    link: '/publicidade',
    description: 'Exiba sua marca para milhares de leitores em Angola.',
    cta: 'Saiba Mais'
  }

  // Observar visibilidade do componente (só busca quando está no viewport)
  useEffect(() => {
    const el = adRef.current
    if (!el) return
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry && entry.isIntersecting) {
        setInView(true)
        observer.unobserve(el)
      }
    }, { threshold: 0.1 })
    observer.observe(el)
    return () => {
      try { observer.disconnect() } catch {}
    }
  }, [])

  // Buscar anúncios da API se não vierem via props
  useEffect(() => {
    if (ads && ads.length > 0) return
    if (isBlockedRoute) return
    if (!inView) return
    let cancelled = false
    const controller = new AbortController()
    const { signal } = controller
    async function loadAds() {
      try {
        setLoadingAds(true)
        setErrorAds(null)
        const res = await fetch(`/api/publicidade?tipo=anuncios&posicao=${position}&limit=5`, { cache: 'no-store', signal })
        if (!res.ok) throw new Error('Falha ao carregar anúncios')
        const data = await res.json()
        const mapped: AdData[] = (data?.anuncios || []).map((a: any) => ({
          id: a.id,
          title: a.titulo || 'Anuncie Aqui',
          brand: 'Auto Prestige Ads',
          image: '',
          link: a.url || '/publicidade',
          description: 'Exiba sua marca para milhares de leitores em Angola.',
          cta: 'Saiba Mais',
        }))
        if (!cancelled) setFetchedAds(mapped)
      } catch (err: any) {
        // Ignora aborts durante navegação/HMR
        if (err?.name === 'AbortError') return
        if (!cancelled) setErrorAds(err?.message || 'Erro ao buscar anúncios')
      } finally {
        if (!cancelled) setLoadingAds(false)
      }
    }
    loadAds()
    return () => { cancelled = true; controller.abort() }
  }, [ads, position, isBlockedRoute, inView])
  const adList = (ads && ads.length > 0) ? ads : (fetchedAds.length > 0 ? fetchedAds : [defaultAd])

  // Rotação automática de anúncios
  useEffect(() => {
    if (adList.length > 1 && inView && !isBlockedRoute) {
      const interval = setInterval(() => {
        setCurrentAd((prev) => (prev + 1) % adList.length)
      }, 8000) // Muda a cada 8 segundos
      return () => clearInterval(interval)
    }
  }, [adList.length, inView, isBlockedRoute])

  // Animação de entrada
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const ad = adList[currentAd]

  // Tracking de impressão quando anúncio é exibido/rotacionado
  useEffect(() => {
    if (!ad || isBlockedRoute || !inView) return
    // Client-side analytics
    trackAngolanEvent(
      'ad_impression',
      AnalyticsCategories.ENGAGEMENT,
      {
        ad_id: ad.id,
        ad_format: format,
        ad_position: position,
        brand: ad.brand || 'Auto Prestige',
        title: ad.title || 'Anuncie Aqui',
      }
    )
    // Server-side tracking com AbortController para evitar ERR_ABORTED
    const controller = new AbortController()
    ;(async () => {
      try {
        await fetch('/api/publicidade/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'impression',
            ad_id: ad.id,
            format,
            position,
          }),
          cache: 'no-store',
          signal: controller.signal,
        })
      } catch (err: any) {
        if (err?.name === 'AbortError') return
      }
    })()
    return () => controller.abort()
  }, [ad?.id, format, position, isBlockedRoute, inView])
  const getFormatClasses = () => {
    switch (format) {
      case 'banner':
        return 'w-full h-24 md:h-32 lg:h-40'
      case 'square':
        return 'w-full aspect-square max-w-sm'
      case 'vertical':
        return 'w-full h-96 max-w-xs'
      case 'native':
        return 'w-full'
      default:
        return 'w-full h-32'
    }
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'mb-8'
      case 'middle':
        return 'my-8'
      case 'bottom':
        return 'mt-8'
      case 'sidebar':
        return 'sticky top-4'
      default:
        return 'my-4'
    }
  }

  if (format === 'native') {
    return (
      <div ref={adRef} className={`${getPositionClasses()} ${className} ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="bg-gradient-to-r from-slate-50 to-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 relative h-48 md:h-auto">
              <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🚗</div>
                  <div className="text-sm font-medium text-red-700">{ad.brand}</div>
                </div>
              </div>
            </div>
            <div className="md:w-2/3 p-6">
              <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900">{ad.title || 'Anuncie Aqui'}</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Publicidade</span>
              </div>
              <p className="text-gray-600 mb-4">{ad.description || 'Exiba sua marca para milhares de leitores em Angola.'}</p>
              <a 
                href={ad.link || '/publicidade'}
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
                onClick={() => {
                  if (isBlockedRoute) return
                  trackAngolanEvent(
                    AnalyticsEvents.EXTERNAL_LINK_CLICK,
                    AnalyticsCategories.NAVIGATION,
                    {
                      ad_id: ad.id,
                      ad_format: format,
                      ad_position: position,
                      destination: ad.link || '/publicidade',
                    }
                  )
                  // Preferir sendBeacon para evitar aborts durante navegação
                  try {
                    const payload = {
                      type: 'click',
                      ad_id: ad.id,
                      format,
                      position,
                    }
                    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
                      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
                      navigator.sendBeacon('/api/publicidade/track', blob)
                    } else {
                      fetch('/api/publicidade/track', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                        cache: 'no-store',
                      }).catch(() => {})
                    }
                  } catch {}
                }}
              >
                {ad.cta || 'Saiba Mais'}
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={adRef} className={`${getFormatClasses()} ${getPositionClasses()} ${className} ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
      <div className="relative w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
        {/* Label de publicidade */}
        <div className="absolute top-2 right-2 z-10">
          <span className="text-xs text-gray-600 bg-white/80 px-2 py-1 rounded text-center">
            Publicidade
          </span>
        </div>

        {/* Conteúdo do anúncio */}
        <a
          href={ad.link || '/publicidade'}
          className="block w-full h-full"
          onClick={() => {
            if (isBlockedRoute) return
            // Client-side analytics
            trackAngolanEvent(
              AnalyticsEvents.EXTERNAL_LINK_CLICK,
              AnalyticsCategories.NAVIGATION,
              {
                ad_id: ad.id,
                ad_format: format,
                ad_position: position,
                destination: ad.link || '/publicidade',
              }
            )
            // Preferir sendBeacon para evitar aborts
            try {
              const payload = {
                type: 'click',
                ad_id: ad.id,
                format,
                position,
              }
              if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
                const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
                navigator.sendBeacon('/api/publicidade/track', blob)
              } else {
                fetch('/api/publicidade/track', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                  cache: 'no-store',
                }).catch(() => {})
              }
            } catch {}
          }}
        >
          <div className="relative w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex flex-col justify-center items-center p-4 group-hover:from-red-100 group-hover:to-red-150 transition-all duration-300">
            {/* Ícone/Logo */}
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
              🚗
            </div>
            
            {/* Título */}
            <h3 className="text-sm md:text-base font-bold text-slate-900 text-center mb-1">
              {ad.title || 'Anuncie Aqui'}
            </h3>
            
            {/* Marca */}
            <p className="text-xs md:text-sm text-red-700 font-medium text-center mb-2">
              {ad.brand || 'Auto Prestige'}
            </p>
            
            {/* CTA para formatos maiores */}
            {(format === 'square' || format === 'vertical') && (
              <div className="mt-auto">
                <span className="text-xs bg-red-600 text-white px-3 py-1 rounded-full group-hover:bg-red-700 transition-colors duration-300">
                  {ad.cta || 'Saiba Mais'}
                </span>
              </div>
            )}
          </div>
        </a>

        {/* Indicadores para múltiplos anúncios */}
        {adList.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {adList.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAd(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentAd ? 'bg-red-600' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
