import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const target = url.searchParams.get('url')
    if (!target) {
      return NextResponse.json({ error: 'Parâmetro url é obrigatório' }, { status: 400 })
    }

    // Segurança básica: permitir apenas http/https
    if (!/^https?:\/\//.test(target)) {
      return NextResponse.json({ error: 'URL inválida' }, { status: 400 })
    }

    // Busca a imagem remota
    const res = await fetch(target, {
      redirect: 'follow',
      headers: {
        // Alguns CDNs exigem um User-Agent e aceitam melhor negociação de conteúdo
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/*,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    })
    if (!res.ok) {
      return NextResponse.json({ error: 'Falha ao buscar imagem' }, { status: res.status })
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const buf = await res.arrayBuffer()
    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (err: any) {
    console.error('GET /api/image-proxy error', err)
    return NextResponse.json({ error: 'Erro interno ao proxyficiar imagem' }, { status: 500 })
  }
}