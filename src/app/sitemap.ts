import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoprestige.ao'
  const currentDate = new Date().toISOString()

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/noticias`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/concessionarias`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ferramentas`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacidade`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/termos`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    }
  ]

  // Tool pages
  const toolPages = [
    {
      url: `${baseUrl}/ferramentas/calculadora-impostos`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ferramentas/calculadora-financiamento`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ferramentas/avaliador-veiculos`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ferramentas/conversor-moedas`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ferramentas/planejador-manutencao`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ferramentas/simulador-troca`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ferramentas/calculadora-seguro`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  ]

  // News categories
  const newsCategories = [
    'lancamentos',
    'testes',
    'mercado',
    'tecnologia',
    'eventos',
    'opiniao'
  ]

  const newsCategoryPages = newsCategories.map(category => ({
    url: `${baseUrl}/noticias/${category}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Dealership locations
  const dealershipLocations = [
    'luanda',
    'benguela',
    'huambo',
    'lobito',
    'lubango',
    'malanje',
    'namibe',
    'soyo',
    'cabinda',
    'kuito'
  ]

  const dealershipPages = dealershipLocations.map(location => ({
    url: `${baseUrl}/concessionarias/${location}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Car brands (popular ones in Angola)
  const carBrands = [
    'toyota',
    'nissan',
    'hyundai',
    'kia',
    'volkswagen',
    'ford',
    'chevrolet',
    'honda',
    'mitsubishi',
    'suzuki',
    'isuzu',
    'mercedes-benz',
    'bmw',
    'audi',
    'land-rover',
    'jeep'
  ]

  const brandPages = carBrands.map(brand => ({
    url: `${baseUrl}/marcas/${brand}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Combine all pages
  const allPages = [
    ...staticPages,
    ...toolPages,
    ...newsCategoryPages,
    ...dealershipPages,
    ...brandPages
  ]

  return allPages
}

// Generate robots.txt
export function generateRobotsTxt(): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoprestige.ao'
  
  return `User-agent: *
Allow: /

# Disallow admin pages
Disallow: /admin/
Disallow: /api/

# Disallow search pages with parameters
Disallow: /search?*
Disallow: /*?*

# Allow specific search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay
Crawl-delay: 1`
}
