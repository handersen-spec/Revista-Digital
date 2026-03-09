import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Dados simulados para configurações de SEO
const seoData = {
  configurations: {
    general: {
      metaTitle: 'Auto Prestige - Automóveis em Angola',
      metaDescription: 'A sua revista digital de automóveis em Angola. Notícias, test drives, análises e tudo sobre o mundo automóvel angolano.',
      metaKeywords: 'automóveis, carros, Angola, test drive, notícias, revista, digital',
      canonicalUrl: 'https://autoprestige.ao',
      robotsTxt: 'User-agent: *\nAllow: /',
      sitemapEnabled: true,
      sitemapFrequency: 'daily',
      googleAnalyticsId: 'GA-XXXXXXXXX',
      googleSearchConsole: 'google-site-verification=XXXXXXXXX',
      bingWebmasterTools: '',
      facebookPixel: ''
    },
    openGraph: {
      enabled: true,
      title: 'Auto Prestige',
      description: 'A sua revista digital de automóveis em Angola',
      image: '/images/og-image.jpg',
      type: 'website',
      locale: 'pt_AO',
      siteName: 'Auto Prestige'
    },
    twitter: {
      enabled: true,
      card: 'summary_large_image',
      site: '@autoprestigeangola',
      creator: '@autoprestigeangola',
      title: 'Auto Prestige',
      description: 'A sua revista digital de automóveis em Angola',
      image: '/images/twitter-card.jpg'
    },
    schema: {
      enabled: true,
      organizationName: 'Auto Prestige',
      organizationType: 'Organization',
      logo: '/images/logo.png',
      contactPoint: '+244923456789',
      address: 'Luanda, Angola',
      socialProfiles: [
        'https://facebook.com/autoprestigeangola',
        'https://instagram.com/autoprestigeangola',
        'https://twitter.com/autoprestigeangola'
      ]
    }
  },
  redirects: [
    { id: '1', from: '/old-page', to: '/new-page', type: '301', enabled: true, created_at: '2024-01-15' },
    { id: '2', from: '/test-drive-old', to: '/test-drives', type: '301', enabled: true, created_at: '2024-01-10' },
    { id: '3', from: '/noticias-antigas', to: '/noticias', type: '301', enabled: false, created_at: '2024-01-05' }
  ],
  metrics: {
    indexedPages: 1247,
    totalBacklinks: 3456,
    organicTraffic: 12890,
    averagePosition: 15.7,
    clickThroughRate: 3.2,
    impressions: 45670,
    clicks: 1456,
    crawlErrors: 12,
    pagespeedScore: 87,
    mobileUsability: 95
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    switch (type) {
      case 'configurations':
        return NextResponse.json({
          success: true,
          data: seoData.configurations
        })

      case 'redirects':
        return NextResponse.json({
          success: true,
          data: seoData.redirects,
          pagination: {
            total: seoData.redirects.length,
            page: 1,
            limit: 10,
            totalPages: 1
          }
        })

      case 'metrics':
        return NextResponse.json({
          success: true,
          data: seoData.metrics
        })

      default:
        return NextResponse.json({
          success: true,
          data: seoData
        })
    }
  } catch (error) {
    console.error('Erro na API de SEO:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (type === 'configurations') {
      // Simular atualização das configurações
      if (data) {
        Object.assign(seoData.configurations, data)
      }
      
      return NextResponse.json({
        success: true,
        message: 'Configurações de SEO atualizadas com sucesso',
        data: seoData.configurations
      })
    }

    if (type === 'redirects') {
      // Simular atualização de redirecionamentos
      if (data && Array.isArray(data)) {
        seoData.redirects = data
      }
      
      return NextResponse.json({
        success: true,
        message: 'Redirecionamentos atualizados com sucesso',
        data: seoData.redirects
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Tipo de operação não suportado'
    }, { status: 400 })

  } catch (error) {
    console.error('Erro ao atualizar configurações de SEO:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'redirect') {
      const newRedirect = {
        id: String(Date.now()),
        ...body,
        created_at: new Date().toISOString().split('T')[0]
      }
      
      seoData.redirects.push(newRedirect)
      
      return NextResponse.json({
        success: true,
        message: 'Redirecionamento criado com sucesso',
        data: newRedirect
      })
    }

    if (type === 'sitemap') {
      return NextResponse.json({
        success: true,
        message: 'Sitemap gerado com sucesso',
        data: {
          url: '/sitemap.xml',
          lastGenerated: new Date().toISOString(),
          pages: 1247
        }
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Tipo de operação não suportado'
    }, { status: 400 })

  } catch (error) {
    console.error('Erro na operação POST:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type')

    if (type === 'redirect' && id) {
      const index = seoData.redirects.findIndex(redirect => redirect.id === id)
      
      if (index === -1) {
        return NextResponse.json({
          success: false,
          error: 'Redirecionamento não encontrado'
        }, { status: 404 })
      }

      seoData.redirects.splice(index, 1)
      
      return NextResponse.json({
        success: true,
        message: 'Redirecionamento removido com sucesso'
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Parâmetros inválidos'
    }, { status: 400 })

  } catch (error) {
    console.error('Erro ao deletar:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
