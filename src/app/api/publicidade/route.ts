import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Interfaces para dados de publicidade
interface FormatoPublicidade {
  id: number
  nome: string
  descricao: string
  dimensoes: string
  posicao: string
  impressoes: string
  preco: string
  destaque: boolean
}

interface MetricaAudiencia {
  metrica: string
  valor: string
  icone: string
}

interface DadoDemografico {
  faixa: string
  percentual: number
}

interface Demografico {
  categoria: string
  dados: DadoDemografico[]
}

interface CaseSuccess {
  id: number
  cliente: string
  campanha: string
  resultado: string
  formato: string
  duracao: string
}

interface Anuncio {
  id: string
  titulo: string
  url: string
  formato?: string
  posicao?: 'top' | 'middle' | 'bottom' | 'sidebar'
  ativo?: boolean
  imagem?: string
}

interface DadosPublicidade {
  formatos: FormatoPublicidade[]
  audiencia: MetricaAudiencia[]
  demograficos: Demografico[]
  cases: CaseSuccess[]
}

// Sem dados fictícios: a API retorna estruturas vazias até a integração com dados reais
const emptyData: DadosPublicidade = {
  formatos: [],
  audiencia: [],
  demograficos: [],
  cases: []
}

// Armazenamento simples em memória para desenvolvimento
const anunciosMem: Anuncio[] = [
  { id: 'ad-top-1', titulo: 'Anuncie no topo', url: '/publicidade', formato: 'banner', posicao: 'top', ativo: true },
  { id: 'ad-middle-1', titulo: 'Promoções de Concessionárias', url: '/publicidade', formato: 'square', posicao: 'middle', ativo: true },
  { id: 'ad-bottom-1', titulo: 'Seguro Automóvel com desconto', url: '/publicidade', formato: 'banner', posicao: 'bottom', ativo: true },
  { id: 'ad-sidebar-1', titulo: 'Financiamento de veículos', url: '/publicidade', formato: 'vertical', posicao: 'sidebar', ativo: true },
  { id: 'ad-middle-2', titulo: 'Peças originais e acessórios', url: '/publicidade', formato: 'square', posicao: 'middle', ativo: true },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo') // 'anuncios', 'formatos', 'audiencia', 'demograficos', 'cases'
    const allowedPos: Anuncio['posicao'][] = ['top', 'middle', 'bottom', 'sidebar']
    const posicaoParam = searchParams.get('posicao') as Anuncio['posicao'] | null
    const posicao = posicaoParam && allowedPos.includes(posicaoParam) ? posicaoParam : null
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limitRaw = searchParams.get('limit')
    const limit = limitRaw ? Math.max(1, Math.min(50, parseInt(limitRaw))) : 10

    // Helpers de paginação
    const buildPagination = (total: number) => {
      const totalPaginas = Math.max(1, Math.ceil(total / limit))
      const paginaAtual = Math.min(page, totalPaginas)
      return {
        pagina_atual: paginaAtual,
        total_paginas: totalPaginas,
        total_itens: total,
        itens_por_pagina: limit,
        tem_proxima: paginaAtual < totalPaginas,
        tem_anterior: paginaAtual > 1,
      }
    }

    // Estatísticas agregadas (DB-first, com fallback)
    async function getStats() {
      try {
        const [adsCount, adsActive, adsInactive, campCount, campActive, campPaused, impCount, clickCount] = await Promise.all([
          query<{ count: string }>('SELECT COUNT(*)::text AS count FROM advertising_ads'),
          query<{ count: string }>("SELECT COUNT(*)::text AS count FROM advertising_ads WHERE ativo = TRUE"),
          query<{ count: string }>("SELECT COUNT(*)::text AS count FROM advertising_ads WHERE ativo = FALSE"),
          query<{ count: string }>('SELECT COUNT(*)::text AS count FROM advertising_campaigns'),
          query<{ count: string }>("SELECT COUNT(*)::text AS count FROM advertising_campaigns WHERE status = 'active'"),
          query<{ count: string }>("SELECT COUNT(*)::text AS count FROM advertising_campaigns WHERE status = 'paused'"),
          query<{ count: string }>("SELECT COUNT(*)::text AS count FROM advertising_events WHERE event_type = 'impression'"),
          query<{ count: string }>("SELECT COUNT(*)::text AS count FROM advertising_events WHERE event_type = 'click'"),
        ])
        const imp = parseInt(impCount.rows[0]?.count || '0')
        const clk = parseInt(clickCount.rows[0]?.count || '0')
        return {
          total_anuncios: parseInt(adsCount.rows[0]?.count || '0'),
          anuncios_ativos: parseInt(adsActive.rows[0]?.count || '0'),
          anuncios_pausados: parseInt(adsInactive.rows[0]?.count || '0'),
          total_campanhas: parseInt(campCount.rows[0]?.count || '0'),
          campanhas_ativas: parseInt(campActive.rows[0]?.count || '0'),
          campanhas_pausadas: parseInt(campPaused.rows[0]?.count || '0'),
          receita_total: 0,
          impressoes_total: imp,
          cliques_total: clk,
          ctr_medio: imp > 0 ? +(clk / imp).toFixed(4) : 0,
        }
      } catch {
        const ativos = anunciosMem.filter(a => a.ativo).length
        const total = anunciosMem.length
        return {
          total_anuncios: total,
          anuncios_ativos: ativos,
          anuncios_pausados: Math.max(0, total - ativos),
          total_campanhas: 0,
          campanhas_ativas: 0,
          campanhas_pausadas: 0,
          receita_total: 0,
          impressoes_total: 0,
          cliques_total: 0,
          ctr_medio: 0,
        }
      }
    }

    if (tipo === 'anuncios') {
      try {
        const params: any[] = []
        let where = 'WHERE ativo = TRUE'
        if (posicao) { params.push(posicao); where += ` AND posicao = $${params.length}` }
        const countSql = `SELECT COUNT(*) AS total FROM advertising_ads ${where}`
        const totalRes = await query<{ total: string }>(countSql, params)
        const total = parseInt(totalRes.rows[0]?.total || '0')

        const offset = (page - 1) * limit
        params.push(limit)
        params.push(offset)
        const sql = `SELECT id, titulo, url, formato, posicao, ativo, imagem FROM advertising_ads ${where} ORDER BY id DESC LIMIT $${params.length-1} OFFSET $${params.length}`
        const result = await query(sql, params)
        const anuncios = result.rows.map(r => ({
          id: String(r.id),
          titulo: r.titulo,
          url: r.url,
          formato: r.formato,
          posicao: r.posicao,
          ativo: r.ativo,
          imagem: r.imagem,
        }))
        const estatisticas = await getStats()
        const paginacao = buildPagination(total)
        return NextResponse.json({ anuncios, paginacao, estatisticas }, { headers: { 'Cache-Control': 'no-store' } })
      } catch {
        // Fallback memória com paginação
        let lista = anunciosMem.filter(a => a.ativo)
        if (posicao) { lista = lista.filter(a => a.posicao === posicao) }
        const total = lista.length
        const start = (page - 1) * limit
        const anuncios = lista.slice(start, start + limit)
        const estatisticas = await getStats()
        const paginacao = buildPagination(total)
        return NextResponse.json({ anuncios, paginacao, estatisticas }, { headers: { 'Cache-Control': 'no-store' } })
      }
    }

    // Outros tipos retornam estruturas vazias, mas com estatísticas
    const estatisticas = await getStats()
    switch (tipo) {
      case 'formatos':
        return NextResponse.json({ formatos: emptyData.formatos, estatisticas }, { headers: { 'Cache-Control': 'public, max-age=300' } })
      case 'audiencia':
        return NextResponse.json({ audiencia: emptyData.audiencia, estatisticas }, { headers: { 'Cache-Control': 'public, max-age=300' } })
      case 'demograficos':
        return NextResponse.json({ demograficos: emptyData.demograficos, estatisticas }, { headers: { 'Cache-Control': 'public, max-age=300' } })
      case 'cases':
        return NextResponse.json({ cases: emptyData.cases, estatisticas }, { headers: { 'Cache-Control': 'public, max-age=300' } })
      default:
        // Retorna estrutura completa com arrays vazios para manter compatibilidade com o frontend
        return NextResponse.json({
          formatos: emptyData.formatos,
          audiencia: emptyData.audiencia,
          demograficos: emptyData.demograficos,
          cases: emptyData.cases,
          estatisticas,
        }, { headers: { 'Cache-Control': 'no-store' } })
    }

  } catch (error) {
    console.error('Erro ao buscar dados de publicidade:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminToken = process.env.ADS_ADMIN_TOKEN
    const headerToken = request.headers.get('x-admin-token')
    if (!adminToken || headerToken !== adminToken) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }
    const body = await request.json()
    const titulo = typeof body?.titulo === 'string' && body.titulo.trim().length >= 3 ? body.titulo.trim() : null
    const url = typeof body?.url === 'string' ? body.url.trim() : null
    const formato = typeof body?.formato === 'string' ? body.formato.trim() : null
    const posicao = body?.posicao as Anuncio['posicao'] | undefined
    const ativo = body?.ativo ?? true
    const imagem = typeof body?.imagem === 'string' ? body.imagem.trim() : undefined

    function isSafeUrl(u?: string | null) {
      if (!u) return false
      try { const parsed = new URL(u, 'http://localhost'); const proto = parsed.protocol.replace(':',''); return ['http','https','data'].includes(proto) && !u.toLowerCase().startsWith('javascript:') } catch { return !u.toLowerCase().startsWith('javascript:') }
    }
    const allowedPos = ['top','middle','bottom','sidebar']
    if (!titulo || !url || !isSafeUrl(url) || (posicao && !allowedPos.includes(posicao))) {
      return NextResponse.json({ success: false, message: 'Payload inválido' }, { status: 400 })
    }

    const novo: Anuncio = {
      id: '',
      titulo,
      url,
      formato: formato || 'banner',
      posicao: posicao || 'top',
      ativo,
      imagem: imagem || '',
    }
    try {
      const result = await query<{ id: number }>(
        'INSERT INTO advertising_ads (campaign_id, titulo, url, formato, posicao, ativo, imagem) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
        [body?.campaign_id || null, novo.titulo, novo.url, novo.formato, novo.posicao, novo.ativo, novo.imagem]
      )
      novo.id = String(result.rows[0].id)
      return NextResponse.json(
        { success: true, message: 'Anúncio criado com sucesso', data: novo },
        { status: 201 }
      )
    } catch (e) {
      novo.id = body?.id || `ad-${Date.now()}`
      anunciosMem.unshift(novo)
      return NextResponse.json(
        { success: true, message: 'Anúncio criado (memória) com sucesso', data: novo },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('Erro ao criar anúncio:', error)
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