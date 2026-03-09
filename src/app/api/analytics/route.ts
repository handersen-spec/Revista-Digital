import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const periodo = (searchParams.get('periodo') || '30d') as '1d' | '7d' | '30d' | '90d' | '1y'
    const tipo = searchParams.get('tipo') || 'geral'
    const metrica = searchParams.get('metrica') || 'resumo'

    // API neutralizada: retornar estruturas vazias sem consultar banco
    {
      let data: any = {}

      if (metrica === 'resumo') {
        data = {
          visitantes: 0,
          pageviews: 0,
          sessoes: 0,
          tempoMedio: 0,
          taxaRejeicao: 0,
          dispositivosMobile: 0,
          dispositivosDesktop: 0,
          paginasPopulares: [],
          navegadores: []
        }
      } else if (metrica === 'conteudo') {
        data = {
          artigosMaisLidos: [],
          categoriasMaisPopulares: [],
          fontesTrafico: []
        }
      } else if (metrica === 'dispositivos') {
        data = { dispositivosMobile: 0, dispositivosDesktop: 0 }
      } else if (metrica === 'localizacao') {
        data = { localizacoes: [] }
      } else if (metrica === 'tempo_real') {
        data = {
          usuariosAtivos: 0,
          pageviewsUltimaHora: 0,
          eventosPorMinuto: [],
          paginasAtivasAgora: []
        }
      } else if (metrica === 'engajamento') {
        data = {
          overview: {
            totalLikes: 0,
            totalComments: 0,
            totalShares: 0,
            avgEngagementRate: 0
          },
          trends: {
            interactions: { current: 0, previous: 0, change: 0 },
            engagementRate: { current: 0, previous: 0, change: 0 },
            comments: { current: 0, previous: 0, change: 0 },
            shares: { current: 0, previous: 0, change: 0 },
            likes: { current: 0, previous: 0, change: 0 }
          },
          contentTypes: [],
          topContent: [],
          userBehavior: { scrollDepth: [], clickHeatmap: [] },
          socialEngagement: []
        }
      }

      return NextResponse.json({ success: true, data, periodo, tipo })
    }

  } catch (error) {
    console.error('Erro ao buscar analytics:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor', data: null },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Coleta de analytics desativada: não persistir dados
    const headers = request.headers
    const userAgent = headers.get('user-agent') || ''
    const forwardedFor = headers.get('x-forwarded-for') || ''
    const realIp = headers.get('x-real-ip') || ''
    const ip = (forwardedFor.split(',')[0] || realIp || '127.0.0.1').trim()

    let device: 'mobile' | 'desktop' | 'tablet' = 'desktop'
    const ua = userAgent.toLowerCase()
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) device = 'mobile'
    if (ua.includes('ipad') || ua.includes('tablet')) device = 'tablet'

    return NextResponse.json(
      {
        success: true,
        message: 'Coleta de analytics desativada. Nenhum dado foi persistido.',
        data: {
          persisted: false,
          device,
          ip,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao registrar evento de analytics:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro interno do servidor',
        data: null
      },
      { status: 500 }
    )
  }
}