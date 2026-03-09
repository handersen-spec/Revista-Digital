'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Send, MessageCircle, User, Bot, Phone } from 'lucide-react'
import { useGoogleAnalytics } from './GoogleAnalytics'
import {
  fetchArtigosSummary,
  fetchNoticiasSummary,
  fetchTestDrivesSummary,
  fetchConcessionariasSummary,
  fetchFerramentasSummary,
} from '@/lib/chatbotData'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  options?: string[]
}

interface ChatbotProps {
  isOpen: boolean
  onClose: () => void
}

const Chatbot = ({ isOpen, onClose }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showHumanHandoff, setShowHumanHandoff] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { trackChatbotInteraction } = useGoogleAnalytics()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0 && isMounted) {
      // Mensagem de boas-vindas
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: 'Olá! 👋 Sou o assistente virtual da Auto Prestige Angola. Como posso ajudá-lo hoje?',
        sender: 'bot',
        timestamp: new Date(),
        options: [
          'Informações sobre artigos',
          'Test drives disponíveis',
          'Notícias automotivas',
          'Ferramentas da plataforma',
          'Falar com atendente'
        ]
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length, isMounted])

  const getBotResponse = async (userMessage: string): Promise<Message> => {
    const message = userMessage.toLowerCase()
    const now = new Date()
    
    // Respostas baseadas nas funcionalidades da plataforma
    if (message.includes('artigo') || message.includes('artigos')) {
      const { total, titulos } = await fetchArtigosSummary(3)
      const lista = titulos.length ? `\n\nÚltimos artigos:\n• ${titulos.join('\n• ')}` : ''
      return {
        id: Date.now().toString(),
        text: `Temos ${total} artigos publicados. 📚${lista}\n\nExplore a seção de artigos para conteúdo atualizado.`,
        sender: 'bot',
        timestamp: now,
        options: ['Ver artigos', 'Test drives', 'Outras dúvidas']
      }
    }
    
    if (message.includes('test drive') || message.includes('teste')) {
      const { total, titulos } = await fetchTestDrivesSummary(3)
      const lista = titulos.length ? `\n\nMais recentes:\n• ${titulos.join('\n• ')}` : ''
      return {
        id: Date.now().toString(),
        text: `Temos ${total} test drives publicados. 🚗${lista}\n\nVeja os test drives para avaliações atualizadas.`,
        sender: 'bot',
        timestamp: now,
        options: ['Ver test drives', 'Notícias', 'Outras dúvidas']
      }
    }
    
    if (message.includes('notícia') || message.includes('noticias') || message.includes('novidade')) {
      const { total, titulos } = await fetchNoticiasSummary(3)
      const lista = titulos.length ? `\n\nÚltimas notícias:\n• ${titulos.join('\n• ')}` : ''
      return {
        id: Date.now().toString(),
        text: `Há ${total} notícias publicadas recentemente. 📰${lista}\n\nConfira a seção de notícias para novidades.`,
        sender: 'bot',
        timestamp: now,
        options: ['Ver notícias', 'Ferramentas', 'Outras dúvidas']
      }
    }
    
    if (message.includes('ferramenta') || message.includes('calculadora') || message.includes('simulador')) {
      const { total, nomes } = await fetchFerramentasSummary(3)
      const lista = nomes.length ? `\n\nExemplos:\n• ${nomes.join('\n• ')}` : ''
      const prefixo = total > 0 ? `Temos ${total} ferramentas disponíveis.` : 'Temos várias ferramentas úteis!'
      return {
        id: Date.now().toString(),
        text: `${prefixo} 🛠️${lista}\n\nTodas adaptadas ao mercado angolano para facilitar decisões.`,
        sender: 'bot',
        timestamp: now,
        options: ['Ver ferramentas', 'Concessionárias', 'Outras dúvidas']
      }
    }
    
    if (message.includes('concessionária') || message.includes('concessionarias') || message.includes('revendedor')) {
      const { total, marcas } = await fetchConcessionariasSummary()
      const marcasTxt = marcas.length ? `\n\nMarcas populares: ${marcas.join(', ')}` : ''
      const prefixo = total > 0 ? `Diretório com ${total} concessionárias em Angola.` : 'Temos um diretório completo de concessionárias.'
      return {
        id: Date.now().toString(),
        text: `${prefixo} 🏢${marcasTxt}\n\nEncontre a concessionária mais próxima de você.`,
        sender: 'bot',
        timestamp: now,
        options: ['Ver concessionárias', 'Newsletter', 'Outras dúvidas']
      }
    }
    
    if (message.includes('newsletter') || message.includes('subscrever') || message.includes('email')) {
      return {
        id: Date.now().toString(),
        text: 'Subscreva nossa newsletter! 📧\n\nReceba:\n• Últimas notícias\n• Novos artigos\n• Test drives exclusivos\n• Tendências do mercado\n\nMantenha-se sempre informado sobre o mundo automotivo angolano.',
        sender: 'bot',
        timestamp: new Date(),
        options: ['Subscrever newsletter', 'Contato', 'Outras dúvidas']
      }
    }
    
    if (message.includes('contato') || message.includes('contacto') || message.includes('falar') || message.includes('atendente') || message.includes('humano')) {
      setShowHumanHandoff(true)
      return {
        id: Date.now().toString(),
        text: 'Claro! Posso conectá-lo com nossa equipe. 👥\n\nEscolha como prefere entrar em contato:\n\n📱 WhatsApp Business\n📧 Email\n📞 Telefone\n\nOu continue conversando comigo para dúvidas básicas.',
        sender: 'bot',
        timestamp: new Date(),
        options: ['WhatsApp', 'Email', 'Continuar com bot']
      }
    }
    
    if (message.includes('whatsapp')) {
      return {
        id: Date.now().toString(),
        text: 'Perfeito! 📱\n\nVou conectá-lo ao nosso WhatsApp Business:\n\n+244 XXX XXX XXX\n\nOu clique no botão abaixo para iniciar a conversa diretamente.',
        sender: 'bot',
        timestamp: new Date(),
        options: ['Abrir WhatsApp', 'Outras opções', 'Voltar ao menu']
      }
    }
    
    if (message.includes('email')) {
      return {
        id: Date.now().toString(),
        text: 'Pode entrar em contato connosco por email: 📧\n\ncontato@autoprestige.ao\n\nResponderemos em até 24 horas.',
        sender: 'bot',
        timestamp: new Date(),
        options: ['WhatsApp', 'Outras dúvidas', 'Voltar ao menu']
      }
    }
    
    // Resposta padrão
    return {
      id: Date.now().toString(),
      text: 'Desculpe, não entendi completamente sua pergunta. 🤔\n\nPosso ajudá-lo com:\n• Informações sobre artigos\n• Test drives\n• Notícias\n• Ferramentas\n• Contato com nossa equipe\n\nOu escolha uma das opções abaixo:',
      sender: 'bot',
      timestamp: now,
      options: [
        'Artigos',
        'Test drives', 
        'Notícias',
        'Ferramentas',
        'Falar com atendente'
      ]
    }
  }

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim()
    if (!messageText) return

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simular delay de digitação
    try {
      trackChatbotInteraction?.('user_message')
    } catch {}

    // Simular delay de digitação e buscar dados dinâmicos
    setTimeout(async () => {
      try {
        const botResponse = await getBotResponse(messageText)
        setMessages(prev => [...prev, botResponse])
        try {
          const tipo = messageText.toLowerCase().includes('artigo') ? 'bot_reply:artigos'
            : messageText.toLowerCase().includes('notic') ? 'bot_reply:noticias'
            : messageText.toLowerCase().includes('test') ? 'bot_reply:test-drives'
            : messageText.toLowerCase().includes('conces') ? 'bot_reply:concessionarias'
            : messageText.toLowerCase().includes('ferrament') ? 'bot_reply:ferramentas'
            : 'bot_reply:geral'
          trackChatbotInteraction?.(tipo)
        } catch {}
      } catch (e) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: 'Tive um problema ao obter dados agora. Tente novamente em instantes.',
          sender: 'bot',
          timestamp: new Date(),
          options: ['Artigos', 'Notícias', 'Test drives']
        }])
      } finally {
        setIsTyping(false)
      }
    }, 900)
  }

  const handleOptionClick = (option: string) => {
    handleSendMessage(option)
  }

  const handleWhatsAppRedirect = async () => {
    try {
      const { startHumanConversation } = await import('@/lib/whatsapp')
      await startHumanConversation('Olá! Vim do site da Auto Prestige e gostaria de falar com um atendente.')
    } catch (error) {
      console.error('Erro ao conectar com WhatsApp:', error)
      // Fallback para WhatsApp Web
      const phoneNumber = '244XXXXXXXXX' // Substitua pelo número real
      const message = encodeURIComponent('Olá! Vim do site da Auto Prestige e gostaria de falar com um atendente.')
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-red-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">Auto Prestige Assistant</h3>
            <p className="text-xs text-red-100">Online agora</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-red-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-3 rounded-lg ${
              message.sender === 'user' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <div className="flex items-start space-x-2">
                {message.sender === 'bot' && <Bot className="w-4 h-4 mt-1 text-red-600" />}
                {message.sender === 'user' && <User className="w-4 h-4 mt-1" />}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  {message.options && (
                    <div className="mt-2 space-y-1">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="block w-full text-left text-xs bg-white text-gray-700 border border-gray-300 rounded px-2 py-1 hover:bg-gray-50 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-xs">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-red-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* WhatsApp Button */}
      {showHumanHandoff && (
        <div className="px-4 pb-2">
          <button
            onClick={handleWhatsAppRedirect}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm">Falar no WhatsApp</span>
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <button
            onClick={() => handleSendMessage()}
            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chatbot
