'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Newspaper, 
  Video, 
  Car, 
  Building2, 
  Users, 
  BarChart3, 
  Settings, 
  Bell, 
  Search, 
  Menu, 
  X,
  LogOut,
  User,
  ChevronDown,
  Megaphone,
  Calculator,
  Mail,
  Shield,
  Globe,
  Zap,
  TrendingUp,
  Eye,
  MessageSquare
} from 'lucide-react'
import { Images } from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
    color: 'text-blue-500'
  },
  {
    title: 'Gestão de Conteúdo',
    icon: FileText,
    color: 'text-purple-500',
    submenu: [
      { title: 'Artigos', href: '/admin/content?tab=article', icon: FileText },
      { title: 'Notícias', href: '/admin/content?tab=news', icon: Newspaper },
      { title: 'Vídeos', href: '/admin/content?tab=video', icon: Video },
      { title: 'Test Drives', href: '/admin/content?tab=test-drive', icon: Car },
      { title: 'Carrossel', href: '/admin/dashboard/carrossel', icon: Car }
    ]
  },
  {
    title: 'Parceiros',
    icon: Building2,
    color: 'text-green-500',
    submenu: [
      { title: 'Parceiros', href: '/admin/parceiros', icon: Building2 },
      { title: 'Concessionárias', href: '/admin/concessionarias', icon: Building2 },
      { title: 'Solicitações', href: '/admin/solicitacoes', icon: Mail }
    ]
  },
  {
    title: 'Usuários',
    icon: Users,
    href: '/admin/usuarios',
    color: 'text-orange-500'
  },
  {
    title: 'Publicidade',
    icon: Megaphone,
    href: '/admin/publicidade',
    color: 'text-pink-500'
  },
  {
    title: 'Ferramentas',
    icon: Calculator,
    href: '/admin/ferramentas',
    color: 'text-cyan-500'
  },
  {
    title: 'Mídia',
    icon: Images,
    href: '/admin/midia',
    color: 'text-teal-500'
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    color: 'text-indigo-500',
    submenu: [
      { title: 'Visão Geral', href: '/admin/analytics', icon: TrendingUp },
      { title: 'Tráfego', href: '/admin/analytics/trafego', icon: Eye },
      { title: 'Engajamento', href: '/admin/analytics/engajamento', icon: MessageSquare }
    ]
  },
  {
    title: 'Configurações',
    icon: Settings,
    color: 'text-gray-500',
    submenu: [
      { title: 'Geral', href: '/admin/configuracoes', icon: Settings },
      { title: 'SEO', href: '/admin/configuracoes/seo', icon: Globe },
      { title: 'Segurança', href: '/admin/configuracoes/seguranca', icon: Shield },
      { title: 'Performance', href: '/admin/configuracoes/performance', icon: Zap }
    ]
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const isLoginRoute = pathname?.startsWith('/admin/login')

  const toggleSubmenu = (title: string) => {
    setExpandedMenus(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActiveRoute = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  // Auto-expand menu if current route is in submenu
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.submenu) {
        const hasActiveSubmenu = item.submenu.some(subitem => isActiveRoute(subitem.href))
        if (hasActiveSubmenu && !expandedMenus.includes(item.title)) {
          setExpandedMenus(prev => [...prev, item.title])
        }
      }
    })
  }, [pathname])

  if (isLoginRoute) {
    // Para a página de login, não renderizar sidebar/topbar do Admin
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center w-full">
        <main className="w-full max-w-full">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Auto Prestige</span>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">ADMIN</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {menuItems.map((item) => (
            <div key={item.title} className="mb-1">
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      expandedMenus.includes(item.title) ? 'rotate-180' : ''
                    }`} />
                  </button>
                  {expandedMenus.includes(item.title) && (
                    <div className="mt-1 ml-6 space-y-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                            isActiveRoute(subitem.href)
                              ? 'bg-red-50 text-red-700 border-r-2 border-red-500'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <subitem.icon className="w-4 h-4" />
                          <span>{subitem.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href!}
                  className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActiveRoute(item.href!)
                      ? 'bg-red-50 text-red-700 border-r-2 border-red-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span>{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">Admin Auto Prestige</div>
                <div className="text-xs text-gray-500">admin@autoprestige.ao</div>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <Link href="/admin/perfil" className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User className="w-4 h-4" />
                  <span>Meu Perfil</span>
                </Link>
                <Link href="/admin/configuracoes" className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings className="w-4 h-4" />
                  <span>Configurações</span>
                </Link>
                <hr className="my-2" />
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const term = (e.target as HTMLInputElement).value.trim()
                      if (term) {
                        router.push(`/admin/content?tab=all&search=${encodeURIComponent(term)}`)
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <Link href="/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                <Globe className="w-4 h-4" />
                <span>Ver Site</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
