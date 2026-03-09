import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type EventType = 'impression' | 'click'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const adId = Number(body?.ad_id)
    const eventType: EventType | null = (body?.event_type === 'impression' || body?.event_type === 'click') ? body.event_type : null
    const meta = body?.meta && typeof body.meta === 'object' ? body.meta : null

    if (!adId || !eventType) {
      return NextResponse.json({ success: false, message: 'Parâmetros inválidos' }, { status: 400 })
    }

    try {
      // Valida existência do anúncio antes de registrar evento
      const exists = await query('SELECT 1 FROM advertising_ads WHERE id = $1', [adId])
      if (!exists.rows?.length) {
        return NextResponse.json({ success: false, message: 'Anúncio inexistente' }, { status: 404, headers: { 'Cache-Control': 'no-store' } })
      }
      await query('INSERT INTO advertising_events (ad_id, event_type, meta) VALUES ($1,$2,$3)', [adId, eventType, meta])
      return NextResponse.json({ success: true }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
    } catch (e) {
      // Fallback: apenas confirma para não bloquear tracking em dev
      return NextResponse.json({ success: true, note: 'DB indisponível, evento não persistido' }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
    }
  } catch (error) {
    console.error('Erro ao registrar evento de publicidade:', error)
    return NextResponse.json({ success: false, message: 'Erro interno' }, { status: 500 })
  }
}