'use client'

import { useState } from 'react'
import { useGoogleAnalytics } from './GoogleAnalytics'

interface NewsletterProps {
  variant?: 'default' | 'compact' | 'sidebar'
  title?: string
  description?: string
  className?: string
  theme?: 'light' | 'dark' | 'colored'
  color?: 'red' | 'blue' | 'purple' | 'green'
}

export default function Newsletter({ 
  variant = 'default',
  title,
  description,
  className = '',
  theme = 'dark',
  color = 'red'
}: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const { trackNewsletterSignup } = useGoogleAnalytics()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Por favor, insira um email válido.')
      return
    }

    setStatus('loading')
    
    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Aqui você integraria com seu serviço de newsletter (ex: Mailchimp, ConvertKit, etc.)
      console.log('Email subscrito:', email)
      
      setStatus('success')
      setMessage('Obrigado! Você foi inscrito na nossa newsletter.')
      setEmail('')
      
      // Track newsletter signup
      trackNewsletterSignup(variant)
      
      // Reset status após 3 segundos
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 3000)
      
    } catch (error) {
      setStatus('error')
      setMessage('Erro ao inscrever. Tente novamente.')
      
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 3000)
    }
  }

  const getThemeClasses = () => {
    if (theme === 'light') {
      return 'card-base'
    }
    if (theme === 'colored') {
      switch (color) {
        case 'blue':
          return 'bg-gradient-to-r from-blue-600 to-blue-800 text-white'
        case 'purple':
          return 'bg-gradient-to-r from-purple-600 to-purple-800 text-white'
        case 'green':
          return 'bg-gradient-to-r from-green-600 to-green-800 text-white'
        default:
          return 'bg-gradient-to-r from-red-600 to-red-700 text-white'
      }
    }
    return 'bg-transparent text-black'
  }

  const getInputClasses = () => {
    if (theme === 'light') {
      return 'input-base focus-ring'
    }
    if (theme === 'colored') {
      return 'input-base focus-ring text-gray-900'
    }
    return 'px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
  }

  const getButtonClasses = () => {
    if (theme === 'light') {
      return 'btn-base btn-primary'
    }
    if (theme === 'colored') {
      return 'btn-base btn-ghost text-gray-900 hover:bg-gray-100'
    }
    return 'px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors'
  }

  const getDefaultTitle = () => {
    if (variant === 'sidebar') return 'Newsletter'
    if (variant === 'compact') return 'Receba as últimas notícias'
    return 'Receba as últimas notícias'
  }

  const getDefaultDescription = () => {
    if (variant === 'sidebar') return 'Receba as últimas notícias do setor automóvel angolano.'
    if (variant === 'compact') return 'Assine nossa newsletter e seja o primeiro a saber sobre as novidades do mundo automotivo.'
    return 'Assine nossa newsletter e seja o primeiro a saber sobre as novidades do mundo automotivo.'
  }

  if (variant === 'compact') {
    return (
      <div className={`${getThemeClasses()} card-elevated animate-fade-in-up ${className}`}
           style={{ 
             padding: 'var(--spacing-md)',
             borderRadius: 'var(--radius-lg)'
           }}>
        <h3 className="text-heading" 
            style={{ 
              marginBottom: 'var(--spacing-sm)',
              fontSize: '1.125rem'
            }}>
          {title || getDefaultTitle()}
        </h3>
        <p className="text-body opacity-90" 
           style={{ 
             marginBottom: 'var(--spacing-md)',
             fontSize: '0.875rem'
           }}>
          {description || getDefaultDescription()}
        </p>
        <form onSubmit={handleSubmit} 
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail"
            className={`${getInputClasses()}`}
            style={{ 
              fontSize: '0.875rem',
              backgroundColor: '#eeeeee',
              color: '#000000'
            }}
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`${getButtonClasses()} btn-sm disabled:opacity-50`}
          >
            {status === 'loading' ? 'Inscrevendo...' : 'Subscrever'}
          </button>
        </form>
        {message && (
          <p className={`text-caption ${status === 'error' ? 'text-red-300' : 'text-green-300'}`}
             style={{ marginTop: 'var(--spacing-sm)' }}>
            {message}
          </p>
        )}
      </div>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div className={`${getThemeClasses()} card-elevated animate-fade-in-up ${className}`}
           style={{ 
             padding: 'var(--spacing-md)',
             borderRadius: 'var(--radius-lg)'
           }}>
        <h3 className="text-heading" 
            style={{ 
              marginBottom: 'var(--spacing-sm)',
              fontSize: '1.125rem'
            }}>
          {title || getDefaultTitle()}
        </h3>
        <p className="text-body opacity-90" 
           style={{ 
             marginBottom: 'var(--spacing-md)',
             fontSize: '0.875rem'
           }}>
          {description || getDefaultDescription()}
        </p>
        <form onSubmit={handleSubmit} 
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu email"
            className={`${getInputClasses()}`}
            style={{ fontSize: '0.875rem' }}
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`${getButtonClasses()} btn-sm disabled:opacity-50`}
          >
            {status === 'loading' ? 'Inscrevendo...' : 'Subscrever'}
          </button>
        </form>
        {message && (
          <p className={`text-caption ${status === 'error' ? 'text-red-300' : 'text-green-300'}`}
             style={{ marginTop: 'var(--spacing-sm)' }}>
            {message}
          </p>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <section className={`${getThemeClasses()} ${className}`}
             style={{ padding: 'var(--spacing-xl) 0' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-display animate-fade-in-up" 
            style={{ 
              marginBottom: 'var(--spacing-md)',
              fontSize: '1.875rem'
            }}>
          {title || getDefaultTitle()}
        </h2>
        <p className="text-body opacity-90 animate-fade-in-up" 
           style={{ 
             marginBottom: 'var(--spacing-lg)',
             animationDelay: '0.2s'
           }}>
          {description || getDefaultDescription()}
        </p>
        <form onSubmit={handleSubmit} 
              className="flex flex-col sm:flex-row max-w-md mx-auto animate-fade-in-up"
              style={{ 
                gap: 'var(--spacing-md)',
                animationDelay: '0.4s'
              }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail"
            className={`flex-1 ${getInputClasses()}`}
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`${getButtonClasses()} disabled:opacity-50`}
            style={{ 
              padding: 'var(--spacing-md) var(--spacing-lg)'
            }}
          >
            {status === 'loading' ? 'Inscrevendo...' : 'Assinar'}
          </button>
        </form>
        {message && (
          <p className={`text-body ${status === 'error' ? 'text-red-300' : 'text-green-300'}`}
             style={{ marginTop: 'var(--spacing-md)' }}>
            {message}
          </p>
        )}
      </div>
    </section>
  )
}