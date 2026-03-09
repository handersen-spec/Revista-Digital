import { NextRequest, NextResponse } from 'next/server'
import { enviarNotificacaoEmail, obterStatusEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados obrigatórios
    const { 
      solicitanteNome, 
      solicitanteEmail, 
      tipoSolicitacao, 
      statusAnterior, 
      novoStatus,
      observacoes 
    } = body

    if (!solicitanteNome || !solicitanteEmail || !tipoSolicitacao || !novoStatus) {
      return NextResponse.json(
        { error: 'Dados obrigatórios em falta' },
        { status: 400 }
      )
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(solicitanteEmail)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Validar status
    const statusValidos = ['pendente', 'em_andamento', 'resolvida', 'rejeitada']
    if (!statusValidos.includes(novoStatus)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      )
    }

    // Preparar dados para envio
    const notificationData = {
      solicitanteNome,
      solicitanteEmail,
      tipoSolicitacao,
      statusAnterior: statusAnterior || 'novo',
      novoStatus,
      dataAtualizacao: new Date().toLocaleDateString('pt-AO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      observacoes
    }

    // Enviar email
    const emailEnviado = await enviarNotificacaoEmail(notificationData)

    if (emailEnviado) {
      return NextResponse.json({
        success: true,
        message: 'Notificação enviada com sucesso',
        data: {
          destinatario: solicitanteEmail,
          status: novoStatus,
          dataEnvio: notificationData.dataAtualizacao
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Falha ao enviar notificação' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Erro ao processar notificação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const status = obterStatusEmail()
    
    return NextResponse.json({
      status: 'Email service status',
      ...status
    })
  } catch (error) {
    console.error('Erro ao obter status do email:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}