'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import Chatbot from './Chatbot'

const ChatbotButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-300 z-40 flex items-center justify-center ${
          isChatOpen 
            ? 'bg-gray-600 hover:bg-gray-700' 
            : 'bg-red-600 hover:bg-red-700 animate-pulse'
        }`}
        aria-label={isChatOpen ? 'Fechar chat' : 'Abrir chat'}
      >
        {isChatOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Badge de notificação */}
      {!isChatOpen && (
        <div className="fixed bottom-16 right-4 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow-lg animate-bounce z-40">
          Precisa de ajuda?
        </div>
      )}

      {/* Componente do Chatbot */}
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}

export default ChatbotButton