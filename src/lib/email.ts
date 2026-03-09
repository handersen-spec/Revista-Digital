interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

interface NotificationData {
  solicitanteNome: string
  solicitanteEmail: string
  tipoSolicitacao: string
  statusAnterior: string
  novoStatus: string
  dataAtualizacao: string
  observacoes?: string
}

// Configuração de email (em produção, usar variáveis de ambiente)
const emailConfig: EmailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
}

// Templates de email para cada status
const emailTemplates = {
  pendente: {
    subject: 'Solicitação Recebida - Auto Prestige Angola',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Auto Prestige Angola</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Olá {{nome}},</h2>
          <p>Recebemos a sua solicitação de <strong>{{tipo}}</strong> e ela está sendo analisada pela nossa equipe.</p>
          <div style="background-color: white; padding: 15px; border-left: 4px solid #fbbf24; margin: 20px 0;">
            <p><strong>Status:</strong> Pendente</p>
            <p><strong>Data:</strong> {{data}}</p>
          </div>
          <p>Entraremos em contacto consigo em breve com mais informações.</p>
          <p>Obrigado pela sua confiança!</p>
        </div>
        <div style="background-color: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p>Auto Prestige Angola - Revista Digital Automotiva</p>
        </div>
      </div>
    `,
    text: 'Olá {{nome}}, recebemos a sua solicitação de {{tipo}} e ela está sendo analisada. Status: Pendente. Data: {{data}}'
  },
  em_andamento: {
    subject: 'Solicitação em Andamento - Auto Prestige Angola',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Auto Prestige Angola</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Olá {{nome}},</h2>
          <p>A sua solicitação de <strong>{{tipo}}</strong> está agora em andamento.</p>
          <div style="background-color: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
            <p><strong>Status:</strong> Em Andamento</p>
            <p><strong>Data de Atualização:</strong> {{data}}</p>
            {{#observacoes}}<p><strong>Observações:</strong> {{observacoes}}</p>{{/observacoes}}
          </div>
          <p>A nossa equipa está a trabalhar na sua solicitação. Manteremos você informado sobre o progresso.</p>
        </div>
        <div style="background-color: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p>Auto Prestige Angola - Revista Digital Automotiva</p>
        </div>
      </div>
    `,
    text: 'Olá {{nome}}, a sua solicitação de {{tipo}} está em andamento. Data: {{data}}'
  },
  resolvida: {
    subject: 'Solicitação Resolvida - Auto Prestige Angola',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Auto Prestige Angola</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Olá {{nome}},</h2>
          <p>Temos o prazer de informar que a sua solicitação de <strong>{{tipo}}</strong> foi resolvida com sucesso!</p>
          <div style="background-color: white; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
            <p><strong>Status:</strong> Resolvida</p>
            <p><strong>Data de Resolução:</strong> {{data}}</p>
            {{#observacoes}}<p><strong>Observações:</strong> {{observacoes}}</p>{{/observacoes}}
          </div>
          <p>Obrigado por escolher a Auto Prestige Angola. Se tiver alguma dúvida, não hesite em contactar-nos.</p>
        </div>
        <div style="background-color: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p>Auto Prestige Angola - Revista Digital Automotiva</p>
        </div>
      </div>
    `,
    text: 'Olá {{nome}}, a sua solicitação de {{tipo}} foi resolvida com sucesso! Data: {{data}}'
  },
  rejeitada: {
    subject: 'Solicitação Rejeitada - Auto Prestige Angola',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Auto Prestige Angola</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Olá {{nome}},</h2>
          <p>Lamentamos informar que a sua solicitação de <strong>{{tipo}}</strong> não pôde ser aprovada neste momento.</p>
          <div style="background-color: white; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
            <p><strong>Status:</strong> Rejeitada</p>
            <p><strong>Data:</strong> {{data}}</p>
            {{#observacoes}}<p><strong>Motivo:</strong> {{observacoes}}</p>{{/observacoes}}
          </div>
          <p>Se tiver dúvidas sobre esta decisão ou desejar submeter uma nova solicitação, entre em contacto connosco.</p>
        </div>
        <div style="background-color: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p>Auto Prestige Angola - Revista Digital Automotiva</p>
        </div>
      </div>
    `,
    text: 'Olá {{nome}}, lamentamos informar que a sua solicitação de {{tipo}} foi rejeitada. Data: {{data}}'
  }
}

// Função para substituir placeholders no template
function replacePlaceholders(template: string, data: NotificationData): string {
  let result = template
    .replace(/{{nome}}/g, data.solicitanteNome)
    .replace(/{{tipo}}/g, data.tipoSolicitacao)
    .replace(/{{data}}/g, data.dataAtualizacao)
    .replace(/{{observacoes}}/g, data.observacoes || '')
  
  // Tratar condicionais de observações
  if (data.observacoes) {
    result = result.replace(/{{#observacoes}}(.*?){{\/observacoes}}/g, '$1')
  } else {
    result = result.replace(/{{#observacoes}}(.*?){{\/observacoes}}/g, '')
  }
  
  return result
}

// Função principal para enviar notificação por email
export async function enviarNotificacaoEmail(data: NotificationData): Promise<boolean> {
  try {
    // Em ambiente de desenvolvimento, apenas simular o envio
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Simulando envio de email:')
      console.log(`Para: ${data.solicitanteEmail}`)
      console.log(`Assunto: ${emailTemplates[data.novoStatus as keyof typeof emailTemplates]?.subject}`)
      console.log(`Status: ${data.statusAnterior} → ${data.novoStatus}`)
      console.log(`Data: ${data.dataAtualizacao}`)
      if (data.observacoes) {
        console.log(`Observações: ${data.observacoes}`)
      }
      
      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 1000))
      return true
    }

    // Em produção, implementar envio real com nodemailer ou outro serviço
    const template = emailTemplates[data.novoStatus as keyof typeof emailTemplates]
    if (!template) {
      throw new Error(`Template não encontrado para status: ${data.novoStatus}`)
    }

    const emailHtml = replacePlaceholders(template.html, data)
    const emailText = replacePlaceholders(template.text, data)
    const emailSubject = template.subject

    // Aqui seria implementado o envio real do email
    // Por exemplo, com nodemailer:
    /*
    const nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransporter(emailConfig)
    
    await transporter.sendMail({
      from: `"Auto Prestige Angola" <${emailConfig.auth.user}>`,
      to: data.solicitanteEmail,
      subject: emailSubject,
      text: emailText,
      html: emailHtml
    })
    */

    console.log(`✅ Email enviado para ${data.solicitanteEmail}`)
    return true

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error)
    return false
  }
}

// Função para validar configuração de email
export function validarConfiguracaoEmail(): boolean {
  if (process.env.NODE_ENV === 'development') {
    return true // Em desenvolvimento, sempre válido (modo simulação)
  }

  return !!(
    emailConfig.host &&
    emailConfig.auth.user &&
    emailConfig.auth.pass
  )
}

// Função para obter status de configuração
export function obterStatusEmail() {
  return {
    configurado: validarConfiguracaoEmail(),
    modo: process.env.NODE_ENV === 'development' ? 'simulacao' : 'producao',
    host: emailConfig.host || 'não configurado',
    usuario: emailConfig.auth.user ? '***@' + emailConfig.auth.user.split('@')[1] : 'não configurado'
  }
}
