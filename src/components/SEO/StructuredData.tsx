'use client'

interface StructuredDataProps {
  data: object
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  )
}

// Schemas pré-definidos para diferentes tipos de conteúdo

export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Auto Prestige Angola",
  "description": "O maior portal automotivo de Angola",
  "url": "https://autoprestige.ao",
  "logo": "https://autoprestige.ao/assets/images/auto-prestige-logo.svg",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+244-900-000-000",
    "contactType": "customer service",
    "availableLanguage": ["Portuguese"]
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "AO",
    "addressLocality": "Luanda",
    "addressRegion": "Luanda"
  },
  "sameAs": [
    "https://facebook.com/autoprestigeangola",
    "https://instagram.com/autoprestigeangola",
    "https://twitter.com/autoprestigeangola"
  ]
})

export const createWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Auto Prestige Angola",
  "description": "Portal automotivo de Angola com notícias, avaliações e ferramentas",
  "url": "https://autoprestige.ao",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://autoprestige.ao/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Auto Prestige Angola",
    "logo": {
      "@type": "ImageObject",
      "url": "https://autoprestige.ao/assets/images/auto-prestige-logo.svg"
    }
  }
})

export const createArticleSchema = (article: {
  title: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  author: string
  url: string
  category?: string
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "image": article.image,
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  "author": {
    "@type": "Person",
    "name": article.author
  },
  "publisher": {
    "@type": "Organization",
    "name": "Auto Prestige Angola",
    "logo": {
      "@type": "ImageObject",
      "url": "https://autoprestige.ao/assets/images/auto-prestige-logo.svg"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  },
  "articleSection": article.category,
  "inLanguage": "pt-AO"
})

export const createProductSchema = (product: {
  name: string
  description: string
  image: string
  brand: string
  model: string
  year: number
  price?: number
  currency?: string
  availability?: string
  condition?: string
  url: string
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.image,
  "brand": {
    "@type": "Brand",
    "name": product.brand
  },
  "model": product.model,
  "productionDate": product.year.toString(),
  "url": product.url,
  ...(product.price && {
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": product.currency || "AOA",
      "availability": `https://schema.org/${product.availability || 'InStock'}`,
      "itemCondition": `https://schema.org/${product.condition || 'UsedCondition'}`
    }
  })
})

export const createLocalBusinessSchema = (business: {
  name: string
  description: string
  address: string
  city: string
  phone: string
  website?: string
  image?: string
  latitude?: number
  longitude?: number
  openingHours?: string[]
  priceRange?: string
}) => ({
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  "name": business.name,
  "description": business.description,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": business.address,
    "addressLocality": business.city,
    "addressCountry": "AO"
  },
  "telephone": business.phone,
  ...(business.website && { "url": business.website }),
  ...(business.image && { "image": business.image }),
  ...(business.latitude && business.longitude && {
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": business.latitude,
      "longitude": business.longitude
    }
  }),
  ...(business.openingHours && {
    "openingHours": business.openingHours
  }),
  ...(business.priceRange && { "priceRange": business.priceRange })
})

export const createBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
})

export const createFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
})

export const createCalculatorSchema = (calculator: {
  name: string
  description: string
  url: string
  applicationCategory: string
}) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": calculator.name,
  "description": calculator.description,
  "url": calculator.url,
  "applicationCategory": calculator.applicationCategory,
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "AOA"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Auto Prestige Angola"
  }
})
