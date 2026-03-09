import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function normalizeNumber(value: string | null, def: number, min = 1, max = 100) {
  const n = parseInt(String(value || def))
  if (isNaN(n)) return def
  return Math.max(min, Math.min(n, max))
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const categoria = searchParams.get('categoria') || undefined
    const autor = searchParams.get('autor') || undefined
    const slugParam = searchParams.get('slug') || undefined
    const tag = searchParams.get('tag') || undefined
    const busca = searchParams.get('busca') || undefined
    const page = normalizeNumber(searchParams.get('page'), 1, 1, 1000)
    const limit = normalizeNumber(searchParams.get('limit'), 12, 1, 50)
    const offset = (page - 1) * limit

    const whereParts: string[] = []
    const params: any[] = []

    if (categoria) {
      params.push(categoria)
      whereParts.push(`categoria = $${params.length}`)
    }
    if (autor) {
      params.push(autor)
      whereParts.push(`autor = $${params.length}`)
    }
    if (slugParam) {
      params.push(slugParam)
      whereParts.push(`slug = $${params.length}`)
    }
    if (tag) {
      params.push(tag)
      whereParts.push(`tags @> ARRAY[$${params.length}]::text[]`)
    }
    if (busca) {
      params.push(`%${busca}%`)
      params.push(`%${busca}%`)
      params.push(`%${busca}%`)
      whereParts.push(`(titulo ILIKE $${params.length - 2} OR resumo ILIKE $${params.length - 1} OR conteudo ILIKE $${params.length})`)
    }

    const where = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : ''

    const sqlTotal = `SELECT COUNT(*)::int AS total FROM artigos ${where}`
    const sqlItems = `
      SELECT id, slug, titulo, resumo, conteudo, autor,
             data_publicacao, categoria, tempo_leitura, imagem, tags, status, specs
      FROM artigos
      ${where}
      ORDER BY data_publicacao DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `

    const totalRes = await query<{ total: number }>(sqlTotal, params)
    const total = totalRes.rows[0]?.total || 0

    const itemsRes = await query(sqlItems, [...params, limit, offset])
    const pageItems = itemsRes.rows.map((r: any) => ({
      slug: r.slug,
      titulo: r.titulo,
      resumo: r.resumo,
      conteudo: r.conteudo,
      autor: r.autor,
      data: r.data_publicacao,
      dataPublicacao: r.data_publicacao,
      categoria: r.categoria,
      tempoLeitura: r.tempo_leitura,
      imagem: r.imagem || '',
      galeria: [],
      tags: r.tags || [],
      status: r.status,
      specs: r.specs || null,
    }))

    const totalPages = Math.max(1, Math.ceil(total / limit))
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return NextResponse.json({
      artigos: pageItems,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
    })
  } catch (error) {
    console.error('Erro ao listar artigos:', error)
    return NextResponse.json({ success: false, message: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const titulo = typeof body?.titulo === 'string' ? body.titulo.trim() : ''
    const resumo = typeof body?.resumo === 'string' ? body.resumo.trim() : ''
    const conteudo = typeof body?.conteudo === 'string' ? body.conteudo.trim() : ''
    const autor = typeof body?.autor === 'string' ? body.autor.trim() : ''
    const categoria = typeof body?.categoria === 'string' ? body.categoria.trim() : ''
    const tempoLeitura = typeof body?.tempoLeitura === 'string' ? body.tempoLeitura.trim() : null
    const imagem = typeof body?.imagem === 'string' ? body.imagem.trim() : null
    const dataPublicacao = typeof body?.data === 'string' ? body.data : null
    const tags = Array.isArray(body?.tags) ? body.tags : []
    const status = typeof body?.status === 'string' ? body.status : 'published'
    const specs = body?.specs ?? null

    if (!titulo || !resumo || !conteudo || !autor || !categoria) {
      return NextResponse.json({ success: false, message: 'Campos obrigatórios ausentes' }, { status: 400 })
    }

    const normalizedSlug = (typeof body?.slug === 'string' ? body.slug : titulo)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    try {
      const res = await query(
        `INSERT INTO artigos (slug, titulo, resumo, conteudo, autor, categoria, tempo_leitura, imagem, tags, data_publicacao, status, specs)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,COALESCE($10::timestamptz, NOW()),$11,$12)
         RETURNING id, slug, titulo, resumo, conteudo, autor, data_publicacao, categoria, tempo_leitura, imagem, tags, status, specs`,
        [
          normalizedSlug,
          titulo,
          resumo,
          conteudo,
          autor,
          categoria,
          tempoLeitura,
          imagem,
          tags,
          dataPublicacao,
          status,
          specs,
        ]
      )

      const r: any = res.rows[0]
      const artigo = {
        slug: r.slug,
        titulo: r.titulo,
        resumo: r.resumo,
        conteudo: r.conteudo,
        autor: r.autor,
        data: r.data_publicacao,
        dataPublicacao: r.data_publicacao,
        categoria: r.categoria,
        tempoLeitura: r.tempo_leitura || '',
        imagem: r.imagem || '',
        galeria: [],
        tags: Array.isArray(r.tags) ? r.tags : [],
        status: r.status,
        specs: r.specs || null,
      }

      return NextResponse.json({ success: true, artigo }, { status: 201 })
    } catch (e: any) {
      const msg = String(e?.message || '')
      if (msg.toLowerCase().includes('duplicate key') || msg.toLowerCase().includes('unique')) {
        return NextResponse.json({ success: false, message: 'Slug já existe' }, { status: 409 })
      }
      throw e
    }
  } catch (error) {
    console.error('Erro ao criar artigo:', error)
    return NextResponse.json({ success: false, message: 'Erro interno' }, { status: 500 })
  }
}