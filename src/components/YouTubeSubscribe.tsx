'use client'

import { useState } from 'react'

interface YouTubeSubscribeProps {
  title?: string
  description?: string
  channelUrl?: string
  variant?: 'default' | 'compact' | 'banner'
  theme?: 'light' | 'dark' | 'colored'
  color?: 'red' | 'blue' | 'green' | 'purple' | 'orange'
  className?: string
}

export default function YouTubeSubscribe({
  title = "Canal Auto Prestige no YouTube",
  description = "Se inscreva no nosso canal e ative as notificações para não perder nenhum vídeo novo!",
  channelUrl = "https://www.youtube.com/@autoprestigeangola",
  variant = 'default',
  theme = 'dark',
  color = 'red',
  className = ''
}: YouTubeSubscribeProps) {
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = () => {
    // Abrir o canal do YouTube em nova aba
    window.open(channelUrl, '_blank')
    setIsSubscribed(true)
    
    // Reset após 3 segundos
    setTimeout(() => {
      setIsSubscribed(false)
    }, 3000)
  }

  const handleViewVideos = () => {
    window.open(`${channelUrl}/videos`, '_blank')
  }

  // Configurações de tema
  const themeClasses = {
    light: 'bg-white text-gray-900',
    dark: 'bg-gray-900 text-white',
    colored: {
      red: 'bg-gradient-to-r from-red-600 to-red-700 text-white',
      blue: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
      green: 'bg-gradient-to-r from-green-600 to-green-700 text-white',
      purple: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white',
      orange: 'bg-gradient-to-r from-orange-600 to-orange-700 text-white'
    }
  }

  const buttonClasses = {
    light: {
      primary: 'bg-red-600 text-white hover:bg-red-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300'
    },
    dark: {
      primary: 'bg-red-600 text-white hover:bg-red-700',
      secondary: 'bg-gray-700 text-white hover:bg-gray-600'
    },
    colored: {
      primary: 'bg-white text-red-600 hover:bg-gray-100',
      secondary: 'bg-white/20 text-white hover:bg-white/30'
    }
  }

  const getThemeClass = () => {
    if (theme === 'colored') {
      return themeClasses.colored[color]
    }
    return themeClasses[theme]
  }

  const getButtonClass = (type: 'primary' | 'secondary') => {
    if (theme === 'colored') {
      return buttonClasses.colored[type]
    }
    return buttonClasses[theme][type]
  }

  if (variant === 'compact') {
    return (
      <div className={`p-4 rounded-lg ${getThemeClass()} ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs opacity-80 mt-1">{description}</p>
          </div>
          <button
            onClick={handleSubscribe}
            className={`ml-4 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${getButtonClass('primary')} ${
              isSubscribed ? 'scale-95' : 'hover:scale-105'
            }`}
          >
            {isSubscribed ? '✓ Inscrito!' : 'Se inscrever'}
          </button>
        </div>
      </div>
    )
  }

  if (variant === 'banner') {
    return (
      <div className={`p-6 rounded-xl ${getThemeClass()} ${className}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="opacity-90">{description}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSubscribe}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${getButtonClass('primary')} ${
                isSubscribed ? 'scale-95' : 'hover:scale-105'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              {isSubscribed ? 'Inscrito!' : 'Se inscrever'}
            </button>
            <button
              onClick={handleViewVideos}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${getButtonClass('secondary')}`}
            >
              Ver todos os vídeos
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Variant default
  return (
    <section className={`py-16 ${getThemeClass()} ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="opacity-90 mb-8 max-w-2xl mx-auto">{description}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleSubscribe}
            className={`px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 flex items-center justify-center gap-3 ${getButtonClass('primary')} ${
              isSubscribed ? 'scale-95' : 'hover:scale-105'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            {isSubscribed ? 'Inscrito!' : 'Se inscrever'}
          </button>
          
          <button
            onClick={handleViewVideos}
            className={`px-8 py-4 rounded-lg font-medium text-lg transition-colors ${getButtonClass('secondary')}`}
          >
            Ver todos os vídeos
          </button>
        </div>
        
        {isSubscribed && (
          <div className="mt-4 text-sm opacity-75">
            Obrigado por se inscrever! Não se esqueça de ativar as notificações 🔔
          </div>
        )}
      </div>
    </section>
  )
}
