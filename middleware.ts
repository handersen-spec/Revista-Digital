import { NextRequest, NextResponse } from 'next/server'

const ADMIN_COOKIE = 'admin_auth'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAdminPage = pathname.startsWith('/admin')
  const isAdminLogin = pathname.startsWith('/admin/login')
  const isAdminApi = pathname.startsWith('/api/admin')

  // Apenas proteger páginas do admin e APIs /api/admin
  if (isAdminPage && !isAdminLogin) {
    const hasCookie = req.cookies.get(ADMIN_COOKIE)?.value === '1'
    if (!hasCookie) {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  if (isAdminApi) {
    const hasCookie = req.cookies.get(ADMIN_COOKIE)?.value === '1'
    if (!hasCookie) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}