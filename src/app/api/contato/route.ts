import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Armazenamento simples em memória (por instância) para desenvolvimento
type Status = 'novo' | 'lido' | 'respondido' | 'arquivado'
type Prioridade = 'baixa' | 'media' | 'alta'
type Categoria = 'geral' | 'suporte' | 'parceria' | 'publicidade' | 'feedback'
interface MensagemContato {
  id: string
  nome: string
  email: string
  telefone?: string
  assunto: string
  mensagem: string
  categoria: Categoria
  dataEnvio: string
  status: Status
  prioridade: Prioridade
  resposta?: string
  dataResposta?: string
}

function getStore() {
  const g = global as any
  if (!g.__mensagensContatoStore) {
    g.__mensagensContatoStore = {
      mensagens: [] as MensagemContato[],
    }
  }
  return g.__mensagensContatoStore as { mensagens: MensagemContato[] }
}

function calcularStats(mensagens: MensagemContato[]) {
  const total = mensagens.length
  const porStatus = {
    novo: mensagens.filter(m => m.status === 'novo').length,
    lido: mensagens.filter(m => m.status === 'lido').length,
    respondido: mensagens.filter(m => m.status === 'respondido').length,
    arquivado: mensagens.filter(m => m.status === 'arquivado').length,
  }
  const porCategoria = {
    geral: mensagens.filter(m => m.categoria === 'geral').length,
    suporte: mensagens.filter(m => m.categoria === 'suporte').length,
    parceria: mensagens.filter(m => m.categoria === 'parceria').length,
    publicidade: mensagens.filter(m => m.categoria === 'publicidade').length,
    feedback: mensagens.filter(m => m.categoria === 'feedback').length,
  }
  const porPrioridade = {
    alta: mensagens.filter(m => m.prioridade === 'alta').length,
    media: mensagens.filter(m => m.prioridade === 'media').length,
    baixa: mensagens.filter(m => m.prioridade === 'baixa').length,
  }
  return { total, porStatus, porCategoria, porPrioridade }
}

export async function GET(request: NextRequest) {
  try {
    const store = getStore()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as Status | null
    const categoria = searchParams.get('categoria') as Categoria | null
    const prioridade = searchParams.get('prioridade') as Prioridade | null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const orderBy = (searchParams.get('orderBy') || 'dataEnvio') as keyof MensagemContato
    const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc'

    let lista = [...store.mensagens]

    if (status) lista = lista.filter(m => m.status === status)
    if (categoria) lista = lista.filter(m => m.categoria === categoria)
    if (prioridade) lista = lista.filter(m => m.prioridade === prioridade)

    lista.sort((a, b) => {
      const va = a[orderBy]
      const vb = b[orderBy]
      if (orderBy === 'dataEnvio') {
        const da = new Date(String(va)).getTime()
        const db = new Date(String(vb)).getTime()
        return order === 'asc' ? da - db : db - da
      }
      const sa = String(va).toLowerCase()
      const sb = String(vb).toLowerCase()
      if (sa < sb) return order === 'asc' ? -1 : 1
      if (sa > sb) return order === 'asc' ? 1 : -1
      return 0
    })

    const total = lista.length
    const totalPages = Math.ceil(total / Math.max(limit, 1)) || 0
    const currentPage = Math.min(Math.max(page, 1), Math.max(totalPages, 1))
    const start = (currentPage - 1) * limit
    const end = start + limit
    const pageItems = lista.slice(start, end)

    const stats = calcularStats(store.mensagens)

    return NextResponse.json({
      mensagens: pageItems,
      total,
      page: currentPage,
      limit,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
      stats,
    })
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error)
    return NextResponse.json(
      { 
        mensagens: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
        stats: { total: 0, porStatus: { novo: 0, lido: 0, respondido: 0, arquivado: 0 }, porCategoria: { geral: 0, suporte: 0, parceria: 0, publicidade: 0, feedback: 0 }, porPrioridade: { alta: 0, media: 0, baixa: 0 } }
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting simples por IP: 10/min
    const RATE_LIMIT_WINDOW_MS = 60_000
    const RATE_LIMIT_MAX = 10
    // map local em memória por instância
    const rateMap: Map<string, { count: number; resetAt: number }> = (global as any).__contactRateMap || new Map()
    ;(global as any).__contactRateMap = rateMap

    function getClientIp(req: NextRequest) {
      const candidates = ['x-forwarded-for', 'x-real-ip', 'cf-connecting-ip', 'x-vercel-forwarded-for', 'fly-client-ip']
      for (const h of candidates) {
        const v = req.headers.get(h)
        if (v && v.length) return v.split(',')[0].trim()
      }
      const ua = req.headers.get('user-agent') || 'unknown'
      return `local-${ua.slice(0, 30)}`
    }

    const ip = getClientIp(request)
    const now = Date.now()
    const entry = rateMap.get(ip)
    if (!entry || now > entry.resetAt) {
      rateMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    } else {
      entry.count += 1
      if (entry.count > RATE_LIMIT_MAX) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
        return NextResponse.json(
          { success: false, message: 'Muitas solicitações. Tente novamente mais tarde.' },
          { status: 429, headers: { 'Retry-After': String(retryAfter) } }
        )
      }
    }

    const store = getStore()
    const body = await request.json()
    // Validação básica
    const errors: string[] = []
    const nome = typeof body?.nome === 'string' ? body.nome.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const telefone = typeof body?.telefone === 'string' ? body.telefone.trim() : ''
    const assuntoSel = typeof body?.assunto === 'string' ? body.assunto.trim() : ''
    const mensagem = typeof body?.mensagem === 'string' ? body.mensagem.trim() : ''
    if (nome.length < 2 || nome.length > 120) errors.push('nome inválido')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('email inválido')
    if (assuntoSel && assuntoSel.length > 200) errors.push('assunto muito longo')
    if (mensagem.length < 10 || mensagem.length > 5000) errors.push('mensagem inválida (10-5000 chars)')
    if (errors.length) {
      return NextResponse.json({ success: false, message: 'Dados inválidos', errors }, { status: 400 })
    }

    // Mapear assunto selecionado para categoria suportada
    const mapAssuntoToCategoria = (assunto: string): Categoria => {
      const a = assunto.toLowerCase()
      if (a === 'geral' || a.includes('geral')) return 'geral'
      if (a === 'publicidade' || a.includes('publicidade')) return 'publicidade'
      if (a === 'parceria' || a.includes('parceria')) return 'parceria'
      if (a === 'tecnico' || a.includes('suporte')) return 'suporte'
      if (a === 'sugestao' || a.includes('sugest') || a === 'reclamacao' || a.includes('reclam')) return 'feedback'
      return 'geral'
    }

    const categoria = mapAssuntoToCategoria(assuntoSel)
    const prioridade: Prioridade = categoria === 'suporte' ? 'alta' : categoria === 'publicidade' || categoria === 'parceria' ? 'media' : 'baixa'

    const nova: MensagemContato = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nome,
      email,
      telefone,
      assunto: assuntoSel || 'Contato',
      mensagem,
      categoria,
      dataEnvio: new Date().toISOString(),
      status: 'novo',
      prioridade,
    }

    store.mensagens.unshift(nova)

    return NextResponse.json({ success: true, data: nova })
  } catch (error) {
    console.error('Erro ao criar mensagem:', error)
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

// Reativar atualização de resposta e marcar como respondida
export async function PATCH(request: NextRequest) {
  try {
    const store = getStore()
    const body = await request.json()

    const id = typeof body?.id === 'string' ? body.id.trim() : ''
    const resposta = typeof body?.resposta === 'string' ? body.resposta.trim() : ''

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID da mensagem é obrigatório' }, { status: 400 })
    }
    if (resposta.length < 2 || resposta.length > 5000) {
      return NextResponse.json({ success: false, message: 'Resposta inválida (2-5000 caracteres)' }, { status: 400 })
    }

    const idx = store.mensagens.findIndex(m => m.id === id)
    if (idx === -1) {
      return NextResponse.json({ success: false, message: 'Mensagem não encontrada' }, { status: 404 })
    }

    const atual = store.mensagens[idx]
    const atualizado: MensagemContato = {
      ...atual,
      resposta,
      dataResposta: new Date().toISOString(),
      status: 'respondido'
    }

    store.mensagens[idx] = atualizado

    return NextResponse.json({ success: true, data: atualizado })
  } catch (error) {
    console.error('Erro ao responder mensagem:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor', data: null },
      { status: 500 }
    )
  }
}

// Atualiza uma mensagem existente com resposta e marca como respondida