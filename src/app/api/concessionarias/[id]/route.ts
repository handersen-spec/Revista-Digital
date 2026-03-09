import { NextRequest, NextResponse } from 'next/server'
import { getConcessionaria, updateConcessionaria, deleteConcessionaria } from '@/lib/concessionariasStore'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = getConcessionaria(id)
  if (!item) return NextResponse.json({ message: 'Not Found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const updates = await request.json()
    const updated = updateConcessionaria(id, updates)
    if (!updated) return NextResponse.json({ message: 'Not Found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ok = deleteConcessionaria(id)
  if (!ok) return NextResponse.json({ message: 'Not Found' }, { status: 404 })
  return NextResponse.json({ success: true })
}