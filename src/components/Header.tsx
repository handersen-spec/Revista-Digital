'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, memo, useCallback } from 'react'

const menuItems = [
  { name: 'Artigos', href: '/artigos' },
  { name: 'Notícias', href: '/noticias' },
  { name: 'Vídeos', href: '/videos' },
  { name: 'Test Drives', href: '/test-drives' },
  { name: 'Concessionárias', href: '/concessionarias' },
  { name: 'Ferramentas', href: '/ferramentas' },
  { name: 'Mercado', href: '/mercado' },
  { name: 'Sobre Nós', href: '/sobre' }
]

const Header = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  // Fechar menu com ESC
  useEffect(() => {
    if (!isMounted) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMenuOpen, isMounted])

  return (
    <>
      {/* Skip Links para navegação por teclado */}
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>
      <a href="#navigation" className="skip-link">
        Pular para a navegação
      </a>

      <header 
        className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md" 
        style={{ 
          backgroundColor: 'rgba(20, 20, 20, 0.7)',
          borderColor: 'rgba(40, 40, 40, 0.5)',
          color: '#ffffff',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center hover-scale focus-visible-enhanced keyboard-navigation" 
            style={{ borderRadius: 'var(--radius-md)' }}
            aria-label="Auto Prestige - Página inicial da revista digital"
          >
            <Image
              src="/assets/images/auto-prestige-logo.svg"
              alt="Auto Prestige"
              width={200}
              height={55}
              className="w-auto h-20 object-contain -ml-2"
              priority
            />
            <div className="flex flex-col">
              <div className="hidden sm:block text-[10px] uppercase tracking-widest font-light mt-1 -ml-4" style={{ color: '#ffffff', opacity: 0.9, letterSpacing: '0.2em' }}>
                Revista Digital
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden lg:flex items-center space-x-4" 
            id="navigation"
            role="navigation"
            aria-label="Menu principal"
          >
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-medium transition-all duration-200 relative group focus-visible-enhanced keyboard-navigation px-2 py-1"
                style={{ 
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff'
                }}
                aria-label={`Navegar para ${item.name}`}
              >
                {item.name}
                <span 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full" 
                  style={{ backgroundColor: '#ffffff' }}
                  aria-hidden="true"
                ></span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="lg:!hidden btn-base btn-ghost btn-sm focus-visible-enhanced keyboard-navigation btn-accessible"
            style={{ color: '#ffffff' }}
            aria-label={isMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className={`w-6 h-6 transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
            <span className="sr-only">
              {isMenuOpen ? "Fechar menu" : "Abrir menu"}
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'max-h-96 opacity-100 pb-4' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
          id="mobile-menu"
          aria-hidden={!isMenuOpen}
        >
          <nav 
            className="pt-4 space-y-2" 
            role="navigation"
            aria-label="Menu mobile"
          >
            {menuItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className="block px-4 py-3 font-medium transition-all duration-200 hover-lift focus-visible-enhanced keyboard-navigation link-accessible"
                style={{ 
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'transparent',
                  color: '#ffffff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                aria-label={`Navegar para ${item.name}`}
                tabIndex={isMenuOpen ? 0 : -1}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1]"
          onClick={closeMenu}
        />
      )}
    </header>
    </>
  )
})

Header.displayName = 'Header'

export default Header
