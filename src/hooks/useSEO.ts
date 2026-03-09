'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface SEOConfig {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  type?: 'website' | 'article' | 'product'
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  noindex?: boolean
  nofollow?: boolean
  canonical?: string
  structuredData?: object
}

export const useSEO = (config: SEOConfig = {}) => {
  const pathname = usePathname()

  useEffect(() => {
    // Update page title
    if (config.title) {
      document.title = `${config.title} | Auto Prestige Angola`
    }

    // Update meta description
    if (config.description) {
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', config.description)
      }
    }

    // Update canonical URL
    const canonical = config.canonical || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://autoprestige.ao'}${pathname}`
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', canonical)

    // Update robots meta
    if (config.noindex !== undefined || config.nofollow !== undefined) {
      const robotsContent = [
        config.noindex ? 'noindex' : 'index',
        config.nofollow ? 'nofollow' : 'follow'
      ].join(', ')
      
      let robotsMeta = document.querySelector('meta[name="robots"]')
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta')
        robotsMeta.setAttribute('name', 'robots')
        document.head.appendChild(robotsMeta)
      }
      robotsMeta.setAttribute('content', robotsContent)
    }

    // Add structured data
    if (config.structuredData) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(config.structuredData)
      document.head.appendChild(script)

      // Cleanup function
      return () => {
        document.head.removeChild(script)
      }
    }
  }, [config, pathname])

  return {
    pathname,
    canonical: config.canonical || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://autoprestige.ao'}${pathname}`
  }
}

// Predefined SEO configurations for common pages
export const seoConfigs = {
  home: {
    title: 'Portal Automotivo de Angola',
    description: 'O maior portal automotivo de Angola. Notícias, avaliações, calculadoras, concessionárias e tudo sobre carros em Angola.',
    keywords: ['carros angola', 'automóveis luanda', 'portal automotivo', 'notícias carros', 'concessionárias angola'],
    type: 'website' as const
  },
  
  noticias: {
    title: 'Notícias Automotivas',
    description: 'Últimas notícias do mundo automotivo em Angola. Lançamentos, testes, mercado e tendências.',
    keywords: ['notícias automóveis', 'lançamentos carros', 'mercado automotivo angola'],
    type: 'website' as const,
    section: 'Notícias'
  },

  concessionarias: {
    title: 'Concessionárias em Angola',
    description: 'Encontre as melhores concessionárias de carros em Angola. Endereços, contatos e informações completas.',
    keywords: ['concessionárias angola', 'revendedoras carros', 'stands automóveis luanda'],
    type: 'website' as const
  },

  ferramentas: {
    title: 'Ferramentas Automotivas',
    description: 'Calculadoras e ferramentas úteis para proprietários de veículos em Angola. Impostos, financiamento, avaliação e mais.',
    keywords: ['calculadora impostos', 'financiamento carros', 'avaliação veículos', 'ferramentas automóveis'],
    type: 'website' as const
  },

  calculadoraImpostos: {
    title: 'Calculadora de Impostos Automotivos',
    description: 'Calcule impostos de importação, matrícula e transferência de veículos em Angola. Ferramenta gratuita e atualizada.',
    keywords: ['impostos veículos angola', 'direitos aduaneiros', 'iva carros', 'calculadora impostos'],
    type: 'website' as const
  },

  calculadoraFinanciamento: {
    title: 'Simulador de Financiamento Automotivo',
    description: 'Simule o financiamento do seu carro em Angola. Compare taxas de juros e calcule prestações.',
    keywords: ['financiamento carros', 'crédito automóvel', 'simulador prestações', 'bancos angola'],
    type: 'website' as const
  },

  avaliadorVeiculos: {
    title: 'Avaliador de Veículos',
    description: 'Descubra o valor do seu carro no mercado angolano. Avaliação gratuita e baseada em dados reais.',
    keywords: ['valor carro', 'avaliação veículo', 'preço carros usados', 'tabela fipe angola'],
    type: 'website' as const
  },

  conversorMoedas: {
    title: 'Conversor de Moedas Automotivo',
    description: 'Converta preços de veículos entre diferentes moedas. USD, EUR, AOA e outras moedas.',
    keywords: ['conversor moedas', 'preço carros usd', 'câmbio automóvel', 'cotação kwanza'],
    type: 'website' as const
  }
}

// Utility functions for generating structured data
export const generatePageStructuredData = (pageType: string, data?: any) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoprestige.ao'
  
  switch (pageType) {
    case 'home':
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Auto Prestige Angola",
        "description": "Portal automotivo de Angola",
        "url": baseUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${baseUrl}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      }
    
    case 'article':
      return data ? {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": data.title,
        "description": data.description,
        "image": data.image,
        "datePublished": data.publishedTime,
        "dateModified": data.modifiedTime || data.publishedTime,
        "author": {
          "@type": "Person",
          "name": data.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "Auto Prestige Angola",
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/images/logo.png`
          }
        }
      } : null
    
    case 'calculator':
      return data ? {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": data.name,
        "description": data.description,
        "url": data.url,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "AOA"
        }
      } : null
    
    default:
      return null
  }
}
