'use client'

import { usePathname } from 'next/navigation'
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ChatbotButton from "@/components/ChatbotButton"
import OdometerScroll from "@/components/OdometerScroll"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Verifica se estamos em uma rota do admin
  const isAdminRoute = pathname?.startsWith('/admin')
  
  if (isAdminRoute) {
    // Para rotas admin, não mostra header nem footer
    return (
      <div className="min-h-screen">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    )
  }
  
  // Para outras rotas, mostra header e footer normalmente
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <OdometerScroll />
      <Footer />
      <ChatbotButton />
    </div>
  )
}