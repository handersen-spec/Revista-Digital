import { NextRequest, NextResponse } from 'next/server'
import { listPartnersDB, createPartnerDB } from '@/lib/partnersRepo'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = {
      type: searchParams.get('type') || undefined,
      status: searchParams.get('status') || undefined,
      province: searchParams.get('province') || undefined,
      verified: searchParams.get('verified') ? searchParams.get('verified') === 'true' : undefined,
      featured: searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      sortBy: (searchParams.get('sortBy') as any) || 'name',
      sortOrder: (searchParams.get('sortOrder') as any) || 'asc',
    }
    const resultDb = await listPartnersDB(params as any)
    return NextResponse.json(resultDb)
  } catch (error) {
    console.error('Erro ao buscar parceiros:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor (DB obrigatório para parceiros)' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const created = await createPartnerDB(body)
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar parceiro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor (DB obrigatório para parceiros)' },
      { status: 500 }
    )
  }
}