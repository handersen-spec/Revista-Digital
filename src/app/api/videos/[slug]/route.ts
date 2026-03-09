import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    if (!slug) {
      return NextResponse.json({ success: false, message: 'Slug inválido' }, { status: 400 })
    }

    const videoRes = await query(
      `SELECT id, slug, titulo, descricao, conteudo_detalhado, autor,
              data_publicacao, categoria, duracao, visualizacoes, likes,
              video_url, thumbnail, tags, status
         FROM videos
        WHERE slug = $1 AND status = 'published'
        LIMIT 1`,
      [slug]
    )

    const row = videoRes.rows[0]
    if (!row) {
      return NextResponse.json({ success: false, message: 'Vídeo não encontrado' }, { status: 404 })
    }

    const video = {
      id: row.id,
      slug: row.slug,
      titulo: row.titulo,
      descricao: row.descricao,
      categoria: row.categoria || 'Geral',
      duracao: row.duracao || '',
      visualizacoes: String(row.visualizacoes || 0),
      data: row.data_publicacao,
      canal: row.autor || 'Auto Prestige',
      thumbnail: row.thumbnail || '',
      destaque: false,
      conteudoDetalhado: row.conteudo_detalhado || '',
      videoUrl: row.video_url,
      tags: Array.isArray(row.tags) ? row.tags : [],
      likes: String(row.likes || 0),
      status: row.status,
    }

    const relacionadosRes = await query(
      `SELECT id, slug, titulo, descricao, categoria, duracao,
              visualizacoes, data_publicacao, autor, thumbnail
         FROM videos
        WHERE status = 'published' AND categoria = $1 AND slug <> $2
        ORDER BY data_publicacao DESC
        LIMIT 6`,
      [row.categoria, slug]
    )

    const videosRelacionados = relacionadosRes.rows.map((r: any) => ({
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

    return NextResponse.json({ success: true, data: video, videosRelacionados })
  } catch (error) {
    console.error('Erro ao buscar vídeo por slug:', error)
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    if (!slug) {
      return NextResponse.json({ success: false, message: 'Slug inválido' }, { status: 400 })
    }

    const body = await request.json()

    const allowed: Record<string, any> = {
      titulo: body.titulo,
      descricao: body.descricao,
      conteudo_detalhado: body.conteudoDetalhado,
      autor: body.autor,
      data_publicacao: body.dataPublicacao,
      categoria: body.categoria,
      duracao: body.duracao,
      visualizacoes: typeof body.visualizacoes === 'number' ? body.visualizacoes : undefined,
      likes: typeof body.likes === 'number' ? body.likes : undefined,
      video_url: body.videoUrl,
      thumbnail: body.thumbnail,
      tags: Array.isArray(body.tags) ? body.tags : undefined,
      status: body.status,
      slug:
        typeof body?.slug === 'string'
          ? body.slug
              .toLowerCase()
              .normalize('NFD')
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim()
          : undefined,
    }

    const setClauses: string[] = []
    const values: any[] = []
    Object.entries(allowed).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        values.push(value)
        setClauses.push(`${key} = $${values.length}`)
      }
    })

    if (setClauses.length === 0) {
      return NextResponse.json({ success: false, message: 'Nenhum campo para atualizar' }, { status: 400 })
    }

    values.push(slug)
    const updateRes = await query(
      `UPDATE videos SET ${setClauses.join(', ')}, updated_at = NOW() WHERE slug = $${values.length}
       RETURNING id, slug, titulo, descricao, categoria, duracao,
                 visualizacoes, likes, data_publicacao, autor,
                 thumbnail, video_url, tags, status`,
      values
    )

    const row = updateRes.rows[0]
    if (!row) {
      return NextResponse.json({ success: false, message: 'Vídeo não encontrado' }, { status: 404 })
    }

    const data = {
      id: row.id,
      slug: row.slug,
      titulo: row.titulo,
      descricao: row.descricao,
      categoria: row.categoria || 'Geral',
      duracao: row.duracao || '',
      visualizacoes: String(row.visualizacoes || 0),
      data: row.data_publicacao,
      canal: row.autor || 'Auto Prestige',
      thumbnail: row.thumbnail || '',
      destaque: false,
      videoUrl: row.video_url,
      likes: String(row.likes || 0),
      tags: Array.isArray(row.tags) ? row.tags : [],
      status: row.status,
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Erro em PUT /api/videos/[slug]:', error)
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    if (!slug) {
      return NextResponse.json({ success: false, message: 'Slug inválido' }, { status: 400 })
    }

    const delRes = await query(
      `DELETE FROM videos WHERE slug = $1 RETURNING id`,
      [slug]
    )

    if (delRes.rowCount === 0) {
      return NextResponse.json({ success: false, message: 'Vídeo não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro em DELETE /api/videos/[slug]:', error)
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 })
  }
}
