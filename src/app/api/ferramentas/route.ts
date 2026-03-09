import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// TODO: Conectar com banco de dados real
// const ferramentas: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    // TODO: Implementar busca no banco de dados
    // Por enquanto retorna array vazio
    const ferramentas: any[] = []

    return NextResponse.json({
      success: true,
      data: ferramentas,
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: limit
      },
      message: 'Nenhuma ferramenta encontrada. Conecte com banco de dados.'
    })
  } catch (error) {
    console.error('Erro ao buscar ferramentas:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro interno do servidor',
        data: []
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // TODO: Validar dados e salvar no banco de dados
    // TODO: Implementar criação de ferramenta
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Funcionalidade não implementada. Conecte com banco de dados.',
        data: null
      },
      { status: 501 }
    )
  } catch (error) {
    console.error('Erro ao criar ferramenta:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro interno do servidor',
        data: null
      },
      { status: 500 }
    )
  }
}