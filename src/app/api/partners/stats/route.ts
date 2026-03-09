import { NextRequest, NextResponse } from 'next/server'
import { computeStatsDB } from '@/lib/partnersRepo'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const statsDb = await computeStatsDB()
    return NextResponse.json(statsDb)
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor (DB obrigatório para parceiros)' },
      { status: 500 }
    )
  }
}