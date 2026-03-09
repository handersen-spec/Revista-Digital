import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const revalidate = 0
import { query } from '@/lib/db'

type CarouselItem = {
  id?: number
  title: string
  subtitle?: string
  description?: string
  details?: string
  bgImage?: string
  categoria?: string
  active?: boolean
  ordem?: number
}

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
CREATE INDEX IF NOT EXISTS idx_hero_carousel_ordem ON hero_carousel (ordem);
`;

function normalizeRow(row: any): CarouselItem {
  return {
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
}

export async function GET() {
  try {
    await query(ensureTableSQL)
    const res = await query(`SELECT * FROM hero_carousel WHERE active = TRUE ORDER BY ordem ASC, id ASC LIMIT 20`)
    const items = res.rows.map(normalizeRow)
    // Sem fallback: retornar apenas dados reais do banco

    return NextResponse.json(
      { items },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0'
        }
      }
    )
  } catch (err: any) {
    console.error('GET /api/hero-carousel error', err)
    return NextResponse.json({ error: 'Falha ao obter carrossel' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await query(ensureTableSQL)
    const body: CarouselItem = await req.json()
    const {
      title,
      subtitle,
      description,
      details,
      bgImage,
      categoria,
      active = true,
      ordem = 0,
    } = body

    if (!title) {
      return NextResponse.json({ error: 'title é obrigatório' }, { status: 400 })
    }

    const res = await query(
      `INSERT INTO hero_carousel (title, subtitle, description, details, bg_image, categoria, active, ordem)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [title, subtitle ?? null, description ?? null, details ?? null, bgImage ?? null, categoria ?? null, active, ordem]
    )
    const item = normalizeRow(res.rows[0])
    return NextResponse.json({ item }, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/hero-carousel error', err)
    return NextResponse.json({ error: 'Falha ao criar item' }, { status: 500 })
  }
}