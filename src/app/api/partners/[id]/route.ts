import { NextRequest, NextResponse } from 'next/server'
import { getPartnerByIdDB, updatePartnerDB, deletePartnerDB } from '@/lib/partnersRepo'
import type { UpdatePartnerRequest } from '@/types/partner'

// GET - Buscar parceiro por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const partner = await getPartnerByIdDB(id)
    
    if (!partner) {
      return NextResponse.json(
        { error: 'Parceiro não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(partner)

  } catch (error) {
    console.error('Erro ao buscar parceiro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar parceiro
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: UpdatePartnerRequest = await request.json()

    const existing = await getPartnerByIdDB(id)
    if (!existing) {
      return NextResponse.json(
        { error: 'Parceiro não encontrado' },
        { status: 404 }
      )
    }
    try {
      const updatedDb = await updatePartnerDB(id, body)
      if (updatedDb) return NextResponse.json(updatedDb)
    } catch (err: any) {
      if (err?.message === 'EMAIL_IN_USE') {
        return NextResponse.json(
          { error: 'Email já está em uso por outro parceiro' },
          { status: 409 }
        )
      }
      if (err?.code === '23505') {
        return NextResponse.json(
          { error: 'Email já está em uso por outro parceiro' },
          { status: 409 }
        )
      }
      throw err
    }

  } catch (error) {
    console.error('Erro ao atualizar parceiro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Remover parceiro
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const existing = await getPartnerByIdDB(id)
    if (!existing) {
      return NextResponse.json(
        { error: 'Parceiro não encontrado' },
        { status: 404 }
      )
    }
    const deletedDb = await deletePartnerDB(id)
    return NextResponse.json({ message: 'Parceiro removido com sucesso', partner: deletedDb })

  } catch (error) {
    console.error('Erro ao remover parceiro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}