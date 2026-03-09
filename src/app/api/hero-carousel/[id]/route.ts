import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const revalidate = 0
import { query } from '@/lib/db'

const ensureTableSQL = `
CREATE TABLE IF NOT EXISTS hero_carousel (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  details TEXT,
  bg_image TEXT,
  categoria TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await query(ensureTableSQL)
    const { id: idStr } = await ctx.params
    const id = Number(idStr)
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: 'id inválido' }, { status: 400 })
    }

    const body = await req.json()
    const fields: string[] = []
    const values: any[] = []
    let idx = 1

    const map: Record<string, string> = {
      title: 'title',
      subtitle: 'subtitle',
      description: 'description',
      details: 'details',
      bgImage: 'bg_image',
      categoria: 'categoria',
      active: 'active',
      ordem: 'ordem',
    }

    for (const key of Object.keys(map)) {
      if (key in body) {
        fields.push(`${map[key]} = $${idx}`)
        values.push(body[key])
        idx++
      }
    }

    if (!fields.length) {
      return NextResponse.json({ error: 'Nenhum campo para atualizar' }, { status: 400 })
    }

    values.push(id)
    const sql = `UPDATE hero_carousel SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`
    const res = await query(sql, values)
    if (!res.rowCount) {
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
    }
    const row = res.rows[0]
    const item = {
      id: row.id,
      title: row.title,
      subtitle: row.subtitle ?? undefined,
      description: row.description ?? undefined,
      details: row.details ?? undefined,
      bgImage: row.bg_image ?? undefined,
      categoria: row.categoria ?? undefined,
      active: row.active,
      ordem: row.ordem,
    }
    return NextResponse.json({ item })
  } catch (err: any) {
    console.error('PUT /api/hero-carousel/[id] error', err)
    return NextResponse.json({ error: 'Falha ao atualizar item' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await query(ensureTableSQL)
    const { id: idStr } = await ctx.params
    const id = Number(idStr)
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: 'id inválido' }, { status: 400 })
    }
    const res = await query('DELETE FROM hero_carousel WHERE id = $1', [id])
    if (!res.rowCount) {
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('DELETE /api/hero-carousel/[id] error', err)
    return NextResponse.json({ error: 'Falha ao remover item' }, { status: 500 })
  }
}