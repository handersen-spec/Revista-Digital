import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Estruturas de resposta alinhadas com useVideos.ts
function normalizeNumber(value: string | null, def: number, min = 1, max = 100) {
  const n = parseInt(String(value || def))
  if (isNaN(n)) return def
  return Math.max(min, Math.min(n, max))
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const metadata = searchParams.get('metadata') === 'true'
    const categoria = searchParams.get('categoria') || undefined
    const destaqueParam = searchParams.get('destaque')
    const destaque = destaqueParam === 'true' ? true : destaqueParam === 'false' ? false : undefined
    const page = normalizeNumber(searchParams.get('page'), 1, 1, 1000)
    const limit = normalizeNumber(searchParams.get('limit'), 10, 1, 100)
    const offset = (page - 1) * limit

    if (metadata) {
      const categoriasRes = await query<{ categoria: string | null }>(
        `SELECT DISTINCT categoria FROM videos WHERE status = 'published'`
      )
      const categorias = categoriasRes.rows
        .map((r) => r.categoria)
        .filter((c): c is string => !!c)
        .sort((a, b) => a.localeCompare(b))

      return NextResponse.json({ success: true, categorias })
    }

    const whereParts: string[] = ["status = 'published'"]
    const params: any[] = []

    if (categoria) {
      params.push(categoria)
      whereParts.push(`categoria = $${params.length}`)
    }

    const where = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : ''

    const totalRes = await query<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM videos ${where}`,
      params
    )
    const total = totalRes.rows[0]?.total || 0

    const orderBy = typeof destaque === 'boolean' && destaque
      ? 'visualizacoes DESC, likes DESC, data_publicacao DESC'
      : 'data_publicacao DESC'

    const itemsRes = await query(
      `SELECT id, slug, titulo, descricao, categoria, duracao,
              visualizacoes, likes, data_publicacao, autor, thumbnail, video_url, tags, status
         FROM videos
         ${where}
         ORDER BY ${orderBy}
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    )

    const pageItems = itemsRes.rows.map((r: any) => ({
      id: r.id,
      slug: r.slug,
      titulo: r.titulo,
      descricao: r.descricao,
      categoria: r.categoria || 'Geral',
      duracao: r.duracao || '',
      visualizacoes: String(r.visualizacoes || 0),
      data: r.data_publicacao,
      canal: r.autor || 'Auto Prestige',
      thumbnail: r.thumbnail || '',
      destaque: false,
    }))

    const totalPages = Math.max(1, Math.ceil(total / Math.max(limit, 1)))
    const currentPage = Math.min(Math.max(page, 1), Math.max(totalPages, 1))

    return NextResponse.json({
      success: true,
      data: pageItems,
      pagination: {
        currentPage,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
      },
    })
  } catch (error) {
    console.error('Erro em GET /api/videos:', error)
    return NextResponse.json(
      {
        success: false,
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 10,
        },
        message: 'Erro interno do servidor',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { titulo, descricao, autor, videoUrl, slug } = body || {}
    if (!titulo || !descricao || !autor || !videoUrl) {
      return NextResponse.json({ success: false, message: 'Campos obrigatórios ausentes' }, { status: 400 })
    }
    const normalizedSlug = (slug || String(titulo))
      .toLowerCase()
      .normalize('NFD')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const res = await query(
      `INSERT INTO videos (slug, titulo, descricao, autor, video_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, slug, titulo, descricao, categoria, duracao, visualizacoes, likes, data_publicacao, autor, thumbnail, video_url, tags, status`,
      [normalizedSlug, titulo, descricao, autor, videoUrl]
    )

    const r = res.rows[0]
    const data = {
      id: r.id,
      slug: r.slug,
      titulo: r.titulo,
      descricao: r.descricao,
      categoria: r.categoria || 'Geral',
      duracao: r.duracao || '',
      visualizacoes: String(r.visualizacoes || 0),
      data: r.data_publicacao,
      canal: r.autor || 'Auto Prestige',
      thumbnail: r.thumbnail || '',
      destaque: false,
    }
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('Erro em POST /api/videos:', error)
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 })
  }
}
