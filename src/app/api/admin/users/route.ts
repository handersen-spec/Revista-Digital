import { NextRequest, NextResponse } from 'next/server'

// TODO: Conectar com banco de dados real

export async function GET(request: NextRequest) {
  try {
    // TODO: Buscar usuários no banco de dados
    
    return NextResponse.json({
      success: true,
      data: [],
      message: 'Nenhum usuário encontrado. Conecte com banco de dados.'
    })
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
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
    // TODO: Implementar criação de usuário no banco de dados
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Funcionalidade não implementada. Conecte com banco de dados.',
        data: null
      },
      { status: 501 }
    )
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
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