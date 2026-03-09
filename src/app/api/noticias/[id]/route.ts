import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const sql = `
      SELECT id, slug, titulo, resumo, conteudo, categoria, autor,
             data_publicacao, imagem, destaque, visualizacoes, fonte, link, tags, status
      FROM noticias
      WHERE slug = $1 OR CAST(id AS TEXT) = $1
      LIMIT 1
    `
    const { rows } = await query(sql, [id])

    if (!rows.length) {
      return NextResponse.json(
        { success: false, message: 'Notícia não encontrada', data: null },
        { status: 404 }
      )
    }

    const r = rows[0]
    const noticia = {
      id: r.id,
      slug: r.slug,
      titulo: r.titulo,
      resumo: r.resumo,
      conteudo: r.conteudo,
      categoria: r.categoria,
      autor: r.autor,
      dataPublicacao: r.data_publicacao,
      imagem: r.imagem,
      destaque: r.destaque,
      visualizacoes: r.visualizacoes,
      fonte: r.fonte,
      link: r.link,
      tags: r.tags || [],
      status: r.status
    }

    return NextResponse.json({ success: true, noticia })
  } catch (error) {
    console.error('Erro ao buscar notícia:', error)
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Normalizações para compatibilidade com o formulário
    const imagem = body.imagem ?? body.imagemDestaque ?? null
    const statusMap: Record<string, string> = {
      'rascunho': 'draft',
      'publicado': 'published',
      'agendado': 'scheduled'
    }
    const status = statusMap[body.status] ?? body.status
    const tags = Array.isArray(body.tags) ? body.tags : null

    const sql = `
      UPDATE noticias SET
        titulo = COALESCE($2, titulo),
        resumo = COALESCE($3, resumo),
        conteudo = COALESCE($4, conteudo),
        categoria = COALESCE($5, categoria),
        autor = COALESCE($6, autor),
        data_publicacao = COALESCE($7::timestamptz, data_publicacao),
        imagem = COALESCE($8, imagem),
        destaque = COALESCE($9, destaque),
        fonte = COALESCE($10, fonte),
        link = COALESCE($11, link),
        tags = COALESCE($12::text[], tags),
        status = COALESCE($13, status),
        updated_at = NOW()
      WHERE slug = $1 OR CAST(id AS TEXT) = $1
      RETURNING id
    `
    const paramsUpdate = [
      id,
      body.titulo,
      body.resumo,
      body.conteudo,
      body.categoria,
      body.autor,
      body.dataPublicacao,
      imagem,
      body.destaque,
      body.fonte,
      body.link,
      tags,
      status,
    ]

    const { rows } = await query(sql, paramsUpdate)
    if (!rows.length) {
      return NextResponse.json(
        { success: false, message: 'Notícia não encontrada', data: null },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: { id: rows[0].id } })
  } catch (error) {
    console.error('Erro ao atualizar notícia:', error)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const sql = `DELETE FROM noticias WHERE slug = $1 OR CAST(id AS TEXT) = $1 RETURNING id`
    const { rows } = await query(sql, [id])
    if (!rows.length) {
      return NextResponse.json(
        { success: false, message: 'Notícia não encontrada', data: null },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar notícia:', error)
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