import { NextRequest, NextResponse } from 'next/server'

const ADMIN_COOKIE = 'admin_auth'
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5
const rateMap = new Map<string, { count: number; resetAt: number }>()

function getClientIp(req: NextRequest) {
  // Tentar múltiplos cabeçalhos comuns em diferentes plataformas
  const headerCandidates = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',
    'x-vercel-forwarded-for',
    'fly-client-ip',
  ]
  for (const h of headerCandidates) {
    const v = req.headers.get(h)
    if (v && v.length) {
      return v.split(',')[0].trim()
    }
  }
  // Fallback local: usar parte do user-agent para diferenciar sessões locais sem expor IP
  const ua = req.headers.get('user-agent') || 'unknown'
  return `local-${ua.slice(0, 30)}`
}

function allowRequest(ip: string) {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (entry.count < RATE_LIMIT_MAX) {
    entry.count += 1
    return true
  }
  return false
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    if (!allowRequest(ip)) {
      const resetAt = rateMap.get(ip)?.resetAt ?? Date.now() + RATE_LIMIT_WINDOW_MS
      const retryAfter = Math.ceil((resetAt - Date.now()) / 1000)
      return NextResponse.json(
        { success: false, message: 'Muitas tentativas. Tente novamente mais tarde.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }
    const { password } = await req.json()
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      return NextResponse.json(
        { success: false, message: 'ADMIN_PASSWORD não configurado no ambiente' },
        { status: 501 }
      )
    }

    if (typeof password !== 'string' || password.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Senha inválida' },
        { status: 400 }
      )
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { success: false, message: 'Credenciais incorretas' },
        { status: 401 }
      )
    }

    const res = NextResponse.json({ success: true })
    res.cookies.set({
      name: ADMIN_COOKIE,
      value: '1',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 2, // 2 horas
    })
    return res
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}