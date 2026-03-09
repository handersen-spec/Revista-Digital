import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    if (!slug) {
      return NextResponse.json({ success: false, message: 'Slug inválido' }, { status: 400 })
    }

    const artigoRes = await query(
      `SELECT id, slug, titulo, resumo, conteudo, autor,
              data_publicacao, categoria, tempo_leitura, imagem, tags, status, specs
         FROM artigos
        WHERE slug = $1
        LIMIT 1`,
      [slug]
    )

    const artigoRow = artigoRes.rows[0]
    if (!artigoRow) {
      return NextResponse.json({ success: false, message: 'Artigo não encontrado' }, { status: 404 })
    }

    const imagensRes = await query(
      `SELECT id, url, alt, legenda
         FROM artigo_imagens
        WHERE artigo_id = $1
        ORDER BY id ASC`,
      [artigoRow.id]
    )

    const galeria = (imagensRes.rows || []).map((r: any) => ({
      id: String(r.id),
      url: r.url,
      alt: r.alt || '',
      legenda: r.legenda || undefined,
    }))

    const artigo = {
      slug: artigoRow.slug,
      titulo: artigoRow.titulo,
      resumo: artigoRow.resumo,
      conteudo: artigoRow.conteudo,
      autor: artigoRow.autor,
      data: artigoRow.data_publicacao,
      dataPublicacao: artigoRow.data_publicacao,
      categoria: artigoRow.categoria,
      tempoLeitura: artigoRow.tempo_leitura,
      imagem: artigoRow.imagem || '',
      galeria,
      tags: artigoRow.tags || [],
      status: artigoRow.status,
      specs: artigoRow.specs || null,
    }

    return NextResponse.json({ success: true, artigo })
  } catch (error) {
    console.error('Erro ao buscar artigo por slug:', error)
    return NextResponse.json({ success: false, message: 'Erro interno' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    if (!slug) {
      return NextResponse.json({ success: false, message: 'Slug inválido' }, { status: 400 })
    }

    const body = await request.json()

    // Mapear e normalizar campos permitidos
    const allowed: Record<string, any> = {
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
      titulo: typeof body?.titulo === 'string' ? body.titulo : undefined,
      resumo: typeof body?.resumo === 'string' ? body.resumo : undefined,
      conteudo: typeof body?.conteudo === 'string' ? body.conteudo : undefined,
      autor: typeof body?.autor === 'string' ? body.autor : undefined,
      data_publicacao: typeof body?.data === 'string' ? body.data : undefined,
      categoria: typeof body?.categoria === 'string' ? body.categoria : undefined,
      tempo_leitura: typeof body?.tempoLeitura === 'string' ? body.tempoLeitura : undefined,
      imagem: typeof body?.imagem === 'string' ? body.imagem : undefined,
      tags: Array.isArray(body?.tags) ? body.tags : undefined,
      status: typeof body?.status === 'string' ? body.status : undefined,
      specs: body?.specs !== undefined ? body.specs : undefined,
    }

    const setClauses: string[] = []
    const values: any[] = []
    Object.entries(allowed).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        values.push(value)
        setClauses.push(`${key} = $${values.length}`)
      }
    })

    if (!setClauses.length) {
      return NextResponse.json({ success: false, message: 'Nenhum campo para atualizar' }, { status: 400 })
    }

    values.push(slug)
    const updateRes = await query(
      `UPDATE artigos SET ${setClauses.join(', ')}, updated_at = NOW() WHERE slug = $${values.length}
       RETURNING id, slug, titulo, resumo, conteudo, autor, data_publicacao, categoria, tempo_leitura, imagem, tags, status, specs`,
      values
    )

    const r = updateRes.rows[0]
    if (!r) {
      return NextResponse.json({ success: false, message: 'Artigo não encontrado' }, { status: 404 })
    }

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

    return NextResponse.json({ success: true, artigo })
  } catch (error) {
    console.error('Erro ao atualizar artigo:', error)
    return NextResponse.json({ success: false, message: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    if (!slug) {
      return NextResponse.json({ success: false, message: 'Slug inválido' }, { status: 400 })
    }

    const delRes = await query(`DELETE FROM artigos WHERE slug = $1 RETURNING id`, [slug])
    if (delRes.rowCount === 0) {
      return NextResponse.json({ success: false, message: 'Artigo não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar artigo:', error)
    return NextResponse.json({ success: false, message: 'Erro interno' }, { status: 500 })
  }
}