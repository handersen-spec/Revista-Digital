'use client'

import Head from 'next/head'

interface MetaTagsProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  locale?: string
  siteName?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  twitterSite?: string
  twitterCreator?: string
  noindex?: boolean
  nofollow?: boolean
  canonical?: string
  alternateLanguages?: { hreflang: string; href: string }[]
  structuredData?: object
}

const defaultMeta = {
  title: 'Auto Prestige Angola - Portal Automotivo de Angola',
  description: 'O maior portal automotivo de Angola. Notícias, avaliações, calculadoras, concessionárias e tudo sobre carros em Angola.',
  keywords: ['carros angola', 'automóveis luanda', 'concessionárias angola', 'notícias automóveis', 'carros usados angola'],
  image: '/assets/images/auto-prestige-logo.svg',
  siteName: 'Auto Prestige Angola',
  locale: 'pt_AO',
  twitterCard: 'summary_large_image' as const,
  twitterSite: '@autoprestigeangola',
  type: 'website' as const
}

export default function MetaTags({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  locale = 'pt_AO',
  siteName,
  twitterCard = 'summary_large_image',
  twitterSite,
  twitterCreator,
  noindex = false,
  nofollow = false,
  canonical,
  alternateLanguages = [],
  structuredData
}: MetaTagsProps) {
  const meta = {
    title: title || defaultMeta.title,
    description: description || defaultMeta.description,
    keywords: [...defaultMeta.keywords, ...keywords],
    image: image || defaultMeta.image,
    siteName: siteName || defaultMeta.siteName,
    twitterSite: twitterSite || defaultMeta.twitterSite,
    locale: locale || defaultMeta.locale
  }

  const fullTitle = title ? `${title} | ${defaultMeta.siteName}` : defaultMeta.title
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const imageUrl = meta.image.startsWith('http') ? meta.image : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://autoprestige.ao'}${meta.image}`

  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow'
  ].join(', ')

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords.join(', ')} />
      <meta name="robots" content={robotsContent} />
      <meta name="language" content={locale} />
      <meta name="author" content={author || 'Auto Prestige Angola'} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      {!canonical && currentUrl && <link rel="canonical" href={currentUrl} />}

      {/* Alternate Languages */}
      {alternateLanguages.map((alt) => (
        <link key={alt.hreflang} rel="alternate" hrefLang={alt.hreflang} href={alt.href} />
      ))}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={meta.siteName} />
      <meta property="og:locale" content={locale} />

      {/* Article specific Open Graph */}
      {type === 'article' && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={imageUrl} />
      {meta.twitterSite && <meta name="twitter:site" content={meta.twitterSite} />}
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}

      {/* Angola Specific Meta Tags */}
      <meta name="geo.region" content="AO" />
      <meta name="geo.country" content="Angola" />
      <meta name="geo.placename" content="Luanda" />
      <meta name="ICBM" content="-8.8390,13.2894" />

      {/* Mobile and Responsive */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />

      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Theme Color */}
      <meta name="theme-color" content="#ea580c" />
      <meta name="msapplication-TileColor" content="#ea580c" />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </Head>
  )
}
