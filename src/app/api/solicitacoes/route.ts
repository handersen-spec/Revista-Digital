import { NextRequest, NextResponse } from 'next/server'
import { loadSolicitacoes, addSolicitacao, computeStats } from '@/lib/solicitacoesStore'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')
    const status = searchParams.get('status')
    const prioridade = searchParams.get('prioridade')
    const categoria = searchParams.get('categoria')
    const atribuidoA = searchParams.get('atribuidoA')
    const busca = searchParams.get('busca')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '10')))

    let list = loadSolicitacoes()

    // Filtros
    if (tipo) list = list.filter(s => s.tipo === tipo)
    if (status) list = list.filter(s => s.status === status)
    if (prioridade) list = list.filter(s => s.prioridade === prioridade)
    if (categoria) list = list.filter(s => (s.categoria || '') === categoria)
    if (atribuidoA) list = list.filter(s => (s.atribuidoA || '') === atribuidoA)
    if (busca) {
      const term = busca.toLowerCase()
      list = list.filter(s => (
        s.titulo.toLowerCase().includes(term) ||
        s.descricao.toLowerCase().includes(term) ||
        s.nomeRequerente.toLowerCase().includes(term) ||
        s.emailRequerente.toLowerCase().includes(term) ||
        (s.empresa || '').toLowerCase().includes(term)
      ))
    }

    // Paginação
    const total = list.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const end = start + limit
    const paginated = list.slice(start, end)

    const stats = computeStats(loadSolicitacoes())

    return NextResponse.json({
      success: true,
      data: paginated,
      paginacao: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      estatisticas: stats,
      filtros: {
        tipo, status, prioridade, categoria, atribuidoA, busca, page, limit
      }
    })
  } catch (error) {
    console.error('Erro ao buscar solicitações:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor', data: [] },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const required = ['tipo', 'titulo', 'descricao', 'nomeRequerente', 'emailRequerente']
    for (const f of required) {
      if (!body[f]) {
        return NextResponse.json({ success: false, error: `Campo obrigatório faltando: ${f}` }, { status: 400 })
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.emailRequerente)) {
      return NextResponse.json({ success: false, error: 'Email inválido' }, { status: 400 })
    }

    const nova = addSolicitacao({
      tipo: body.tipo,
      titulo: body.titulo,
      descricao: body.descricao,
      nomeRequerente: body.nomeRequerente,
      emailRequerente: body.emailRequerente,
      telefoneRequerente: body.telefoneRequerente,
      empresa: body.empresa,
      prioridade: body.prioridade || 'media',
      categoria: body.categoria,
      atribuidoA: body.atribuidoA,
      dataVencimento: body.dataVencimento,
      anexos: body.anexos || [],
      notas: body.notas || [],
      tags: body.tags || ['cadastro_concessionaria'],
      dadosConcessionaria: body.dadosConcessionaria
    })

    return NextResponse.json({ success: true, data: nova })
  } catch (error) {
    console.error('Erro ao criar solicitação:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor', data: null },
      { status: 500 }
    )
  }
}