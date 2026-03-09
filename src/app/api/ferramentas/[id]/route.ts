import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Sem dados fictícios: sem backend real, não retornamos conteúdo artificial
    return NextResponse.json(
      { error: 'Dados de ferramenta não disponíveis' },
      { status: 404 }
    )
    
  } catch (error) {
    console.error('Erro ao buscar ferramenta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
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
    // Operação não implementada sem backend real
    return NextResponse.json(
      { error: 'Operação não implementada' },
      { status: 501 }
    )
    
  } catch (error) {
    console.error('Erro ao atualizar ferramenta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Operação não implementada sem backend real
    return NextResponse.json(
      { error: 'Operação não implementada' },
      { status: 501 }
    )
    
  } catch (error) {
    console.error('Erro ao remover ferramenta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}