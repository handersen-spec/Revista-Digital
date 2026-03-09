'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCookies } from '@/contexts/CookieContext'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

interface GoogleAnalyticsProps {
  GA_MEASUREMENT_ID: string
}

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: GoogleAnalyticsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { preferences, hasConsented } = useCookies()
  const [isLoaded, setIsLoaded] = useState(false)

  const isLocalhost = () => {
    if (typeof window === 'undefined') return false
    const host = window.location.hostname
    return host === 'localhost' || host === '127.0.0.1'
  }

  const isNotFoundRoute = () => {
    const path = pathname || ''
    return path === '/404' || path.includes('not-found')
  }

  // Carregar Google Analytics apenas se cookies de análise estiverem habilitados
  useEffect(() => {
    const isProd = process.env.NODE_ENV === 'production'
    const shouldEnable = GA_MEASUREMENT_ID && hasConsented && preferences.analytics && isProd && !isLocalhost() && !isNotFoundRoute()

    if (!shouldEnable) {
      // Se o Analytics já foi carregado e agora não deve mais estar, remover scripts
      if (isLoaded) {
        const scripts = document.querySelectorAll('script[src*="googletagmanager.com"]')
        scripts.forEach(script => script.remove())
        
        // Limpar dataLayer
        if (window.dataLayer) {
          window.dataLayer = []
        }
        
        setIsLoaded(false)
      }
      return
    }

    if (isLoaded) return // Já foi carregado

    // Carregar o script do Google Analytics
    const script1 = document.createElement('script')
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    script1.async = true
    document.head.appendChild(script1)

    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure'
      });
    `
    document.head.appendChild(script2)
    setIsLoaded(true)

  }, [GA_MEASUREMENT_ID, hasConsented, preferences.analytics, isLoaded, pathname])

  // Escutar mudanças nas preferências de cookies
  useEffect(() => {
    const handleCookiePreferencesUpdate = (event: CustomEvent) => {
      const newPreferences = event.detail
      
      if (!newPreferences.analytics && isLoaded) {
        // Desabilitar tracking se cookies de análise foram desabilitados
        if (window.gtag) {
          window.gtag('config', GA_MEASUREMENT_ID, {
            send_page_view: false
          })
        }
      }
    }

    window.addEventListener('cookiePreferencesUpdated', handleCookiePreferencesUpdate as EventListener)
    
    return () => {
      window.removeEventListener('cookiePreferencesUpdated', handleCookiePreferencesUpdate as EventListener)
    }
  }, [GA_MEASUREMENT_ID, isLoaded])

  // Rastrear mudanças de página apenas se Analytics estiver habilitado
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag || !hasConsented || !preferences.analytics) return
    const isProd = process.env.NODE_ENV === 'production'
    if (!isProd || isLocalhost() || isNotFoundRoute()) return

    const url = pathname + searchParams.toString()
    
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    })
  }, [pathname, searchParams, GA_MEASUREMENT_ID, hasConsented, preferences.analytics])

  return null
}

// Hook para eventos customizados
export const useGoogleAnalytics = () => {
  const { preferences, hasConsented } = useCookies()

  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag && hasConsented && preferences.analytics) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }

  const trackPageView = (page_path: string, page_title?: string) => {
    if (typeof window !== 'undefined' && window.gtag && hasConsented && preferences.analytics) {
      window.gtag('event', 'page_view', {
        page_path,
        page_title,
      })
    }
  }

  const trackPurchase = (transaction_id: string, value: number, currency: string = 'AOA') => {
    if (typeof window !== 'undefined' && window.gtag && hasConsented && preferences.analytics) {
      window.gtag('event', 'purchase', {
        transaction_id,
        value,
        currency,
      })
    }
  }

  const trackSearch = (search_term: string) => {
    if (typeof window !== 'undefined' && window.gtag && hasConsented && preferences.analytics) {
      window.gtag('event', 'search', {
        search_term,
      })
    }
  }

  const trackVideoPlay = (video_title: string, video_url?: string) => {
    if (typeof window !== 'undefined' && window.gtag && hasConsented && preferences.analytics) {
      window.gtag('event', 'video_play', {
        event_category: 'engagement',
        event_label: video_title,
        custom_parameters: {
          video_url,
        },
      })
    }
  }

  const trackArticleRead = (article_title: string, article_category: string) => {
    if (typeof window !== 'undefined' && window.gtag && hasConsented && preferences.analytics) {
      window.gtag('event', 'article_read', {
        event_category: 'content',
        event_label: article_title,
        custom_parameters: {
          article_category,
        },
      })
    }
  }

  const trackCalculatorUse = (calculator_type: string, result_value?: number) => {
    if (typeof window !== 'undefined' && window.gtag && hasConsented && preferences.analytics) {
      window.gtag('event', 'calculator_use', {
        event_category: 'tools',
        event_label: calculator_type,
        value: result_value,
      })
    }
  }

  const trackDealershipContact = (dealership_name: string, contact_method: string) => {
    if (typeof window !== 'undefined' && window.gtag && hasConsented && preferences.analytics) {
      window.gtag('event', 'dealership_contact', {
        event_category: 'lead_generation',
        event_label: dealership_name,
        custom_parameters: {
          contact_method,
        },
      })
    }
  }

  const trackNewsletterSignup = (source: string) => {
    if (typeof window !== 'undefined' && window.gtag && hasConsented && preferences.analytics) {
      window.gtag('event', 'newsletter_signup', {
        event_category: 'engagement',
        event_label: source,
      })
    }
  }

  const trackChatbotInteraction = (message_type: string) => {
    if (typeof window !== 'undefined' && window.gtag && hasConsented && preferences.analytics) {
      window.gtag('event', 'chatbot_interaction', {
        event_category: 'engagement',
        event_label: message_type,
      })
    }
  }

  return {
    trackEvent,
    trackPageView,
    trackPurchase,
    trackSearch,
    trackVideoPlay,
    trackArticleRead,
    trackCalculatorUse,
    trackDealershipContact,
    trackNewsletterSignup,
    trackChatbotInteraction,
  }
}