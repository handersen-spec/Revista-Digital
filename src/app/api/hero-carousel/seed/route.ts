import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const revalidate = 0
import { query } from '@/lib/db'

type SeedItem = {
  title: string
  subtitle?: string
  description?: string
  details?: string
  categoria?: string
  bgImage?: string
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
`

const seedItems: SeedItem[] = [
  {
    title: 'Lamborghini',
    subtitle: 'Temerario',
    description: 'Supercarro italiano com design arrojado e performance extrema.',
    details: 'Veloz, marcante e feito para adrenalina.',
    categoria: 'Supercar',
    bgImage: "url('/uploads/image/1759437419057_Lamborghini-Temerario-Traseira.jpg')",
    active: true,
    ordem: 0,
  },
  {
    title: 'GWM Tank',
    subtitle: '500',
    description: 'SUV robusto com presença e tecnologia de ponta.',
    details: 'Conforto e força para qualquer terreno.',
    categoria: 'Mercado',
    bgImage: "url('/uploads/image/1759440477534_tank500-new-lead-sa.avif')",
    active: true,
    ordem: 1,
  },
  {
    title: 'Haval',
    subtitle: 'H5',
    description: 'SUV moderno com estilo e excelente custo-benefício.',
    details: 'Espaçoso e eficiente para o dia a dia.',
    categoria: 'Mercado',
    bgImage: "url('/uploads/image/1759423902275_Haval_H5_-_Principal.jpg')",
    active: true,
    ordem: 2,
  },
  {
    title: 'Toyota',
    subtitle: 'Starlet Cross',
    description: 'Compacto versátil com visual aventureiro e tecnologia.',
    details: 'Agilidade urbana com conforto e conectividade.',
    categoria: 'Mercado',
    bgImage: "url('/uploads/image/1759435403362_Toyota-Starlet-Cross-South-Africa-2.webp')",
    active: true,
    ordem: 3,
  },
  {
    title: 'Ineos',
    subtitle: 'Grenadier',
    description: '4x4 autêntico, feito para trilhas e uso pesado.',
    details: 'Durabilidade e capacidade off-road sem compromissos.',
    categoria: 'Test Drive',
    bgImage: "url('/uploads/image/1759439092379_ineos_grenadier_-_trialmaster_edition_-_rhd_-_fr3q.jpg')",
    active: true,
    ordem: 4,
  },
]

export async function POST() {
  try {
    await query(ensureTableSQL)
    const countRes = await query(`SELECT COUNT(*)::int AS cnt FROM hero_carousel`)
    const current = Number(countRes.rows?.[0]?.cnt || 0)
    if (current > 0) {
      return NextResponse.json(
        { success: true, inserted: 0, message: 'Tabela já possui dados, seed não aplicado.' },
        { status: 200, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    let inserted = 0
    for (const item of seedItems) {
      await query(
        `INSERT INTO hero_carousel (title, subtitle, description, details, bg_image, categoria, active, ordem)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          item.title,
          item.subtitle ?? null,
          item.description ?? null,
          item.details ?? null,
          item.bgImage ?? null,
          item.categoria ?? null,
          item.active ?? true,
          item.ordem ?? 0,
        ]
      )
      inserted++
    }

    return NextResponse.json(
      { success: true, inserted },
      { status: 201, headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (err: any) {
    console.error('POST /api/hero-carousel/seed error', err)
    return NextResponse.json({ error: 'Falha ao executar seed' }, { status: 500 })
  }
}