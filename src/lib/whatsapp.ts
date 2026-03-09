// Configurações do WhatsApp Business API
export const WHATSAPP_CONFIG = {
  // Substitua pelos dados reais da Auto Prestige
  businessPhone: '244XXXXXXXXX', // Número do WhatsApp Business da Auto Prestige
  businessName: 'Auto Prestige Angola',
  apiUrl: process.env.WHATSAPP_API_URL || '',
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
  webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || '',
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
}

// Interface para mensagens do WhatsApp
export interface WhatsAppMessage {
  to: string
  type: 'text' | 'template' | 'interactive'
  text?: {
    body: string
  }
  template?: {
    name: string
    language: {
      code: string
    }
    components?: any[]
  }
  interactive?: {
    type: 'button' | 'list'
    body: {
      text: string
    }
    action: any
  }
}

// Função para enviar mensagem via WhatsApp Business API
export async function sendWhatsAppMessage(message: WhatsAppMessage): Promise<boolean> {
  try {
    if (!WHATSAPP_CONFIG.apiUrl || !WHATSAPP_CONFIG.accessToken) {
      console.warn('WhatsApp API não configurada. Redirecionando para WhatsApp Web.')
      return redirectToWhatsAppWeb(message.to, message.text?.body || '')
    }

    const response = await fetch(`${WHATSAPP_CONFIG.apiUrl}/${WHATSAPP_CONFIG.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    if (response.ok) {
      console.log('Mensagem enviada via WhatsApp Business API')
      return true
    } else {
      console.error('Erro ao enviar mensagem via API:', await response.text())
      return redirectToWhatsAppWeb(message.to, message.text?.body || '')
    }
  } catch (error) {
    console.error('Erro na integração WhatsApp:', error)
    return redirectToWhatsAppWeb(message.to, message.text?.body || '')
  }
}

// Função de fallback para WhatsApp Web
export function redirectToWhatsAppWeb(phoneNumber: string, message: string): boolean {
  try {
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
    return true
  } catch (error) {
    console.error('Erro ao abrir WhatsApp Web:', error)
    return false
  }
}

// Função para iniciar conversa com atendente
export async function startHumanConversation(userMessage?: string): Promise<boolean> {
  const defaultMessage = userMessage || 'Olá! Vim do site da Auto Prestige e gostaria de falar com um atendente.'
  
  return await sendWhatsAppMessage({
    to: WHATSAPP_CONFIG.businessPhone,
    type: 'text',
    text: {
      body: defaultMessage
    }
  })
}

// Função para enviar informações de contato
export function sendContactInfo(): boolean {
  const contactMessage = `
🚗 Auto Prestige Angola - Revista Digital Automotiva

📱 WhatsApp: ${WHATSAPP_CONFIG.businessPhone}
📧 Email: contato@autoprestige.ao
🌐 Site: www.autoprestige.ao

Horário de atendimento:
Segunda a Sexta: 8h às 18h
Sábado: 8h às 14h

Estamos aqui para ajudar com todas as suas dúvidas sobre o mundo automotivo em Angola!
  `.trim()

  return redirectToWhatsAppWeb(WHATSAPP_CONFIG.businessPhone, contactMessage)
}

// Função para webhook do WhatsApp (para receber mensagens)
export async function handleWhatsAppWebhook(req: any) {
  try {
    // Verificação do webhook
    if (req.method === 'GET') {
      const mode = req.query['hub.mode']
      const token = req.query['hub.verify_token']
      const challenge = req.query['hub.challenge']

      if (mode === 'subscribe' && token === WHATSAPP_CONFIG.webhookVerifyToken) {
        return challenge
      } else {
        return null
      }
    }

    // Processamento de mensagens recebidas
    if (req.method === 'POST') {
      const body = req.body

      if (body.object === 'whatsapp_business_account') {
        body.entry?.forEach((entry: any) => {
          entry.changes?.forEach((change: any) => {
            if (change.field === 'messages') {
              const messages = change.value.messages
              if (messages) {
                messages.forEach((message: any) => {
                  console.log('Mensagem recebida:', message)
                  // Aqui você pode implementar lógica para processar mensagens recebidas
                  // Por exemplo, salvar no banco de dados, enviar notificações, etc.
                })
              }
            }
          })
        })
      }

      return 'EVENT_RECEIVED'
    }
  } catch (error) {
    console.error('Erro no webhook WhatsApp:', error)
    return null
  }
}

// Função para formatar número de telefone
export function formatPhoneNumber(phone: string): string {
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '')
  
  // Se não começar com código do país, adiciona o código de Angola (244)
  if (!cleaned.startsWith('244')) {
    return `244${cleaned}`
  }
  
  return cleaned
}

// Função para validar número de telefone angolano
export function isValidAngolanPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  
  // Números angolanos: +244 + 9 dígitos
  // Formato: 244XXXXXXXXX (total 12 dígitos)
  return /^244[0-9]{9}$/.test(cleaned)
}
