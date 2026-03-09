import { NextRequest } from 'next/server'

// Utilitário para criar NextRequest mock
const createMockRequest = (url: string, method: string = 'GET', body?: any) => {
  const request = {
    url,
    method,
    json: async () => body,
    nextUrl: new URL(url, 'http://localhost:3000'),
  } as NextRequest
  return request
}

describe('Hero Carousel API', () => {
  const imgHaval = '/uploads/image/1759423902275_Haval_H5_-_Principal.jpg'
  const imgLambo = '/uploads/image/1759437419057_Lamborghini-Temerario-Traseira.jpg'
  const imgTank = '/uploads/image/1759440477534_tank500-new-lead-sa.avif'

  it('deve criar um slide com imagem existente (POST)', async () => {
    const { POST } = await import('@/app/api/hero-carousel/route')

    const novoSlide = {
      title: 'Slide Haval',
      subtitle: 'SUV',
      description: 'Haval H5 destaque',
      details: 'Conheça o Haval H5',
      bgImage: imgHaval,
      categoria: 'Mercado',
      active: true,
      ordem: 1,
    }

    const request = createMockRequest('http://localhost:3000/api/hero-carousel', 'POST', novoSlide)
    const response = await POST(request as any)

    expect(response.status).toBe(201)
    const data = await response.json()
    expect(data).toHaveProperty('item')
    expect(data.item.title).toBe(novoSlide.title)
    expect(data.item.bgImage).toBe(imgHaval)
  })

  it('deve atualizar a imagem do slide (PUT)', async () => {
    const { POST } = await import('@/app/api/hero-carousel/route')
    const { PUT } = await import('@/app/api/hero-carousel/[id]/route')

    // Primeiro cria
    const slideBase = {
      title: 'Slide Lambo',
      bgImage: imgTank,
      ordem: 2,
    }
    const reqPost = createMockRequest('http://localhost:3000/api/hero-carousel', 'POST', slideBase)
    const resPost = await POST(reqPost as any)
    const { item } = await resPost.json()

    // Atualiza bgImage
    const reqPut = createMockRequest(`http://localhost:3000/api/hero-carousel/${item.id}`, 'PUT', { bgImage: imgLambo })
    const resPut = await PUT(reqPut as any, { params: { id: String(item.id) } })

    expect(resPut.status).toBe(200)
    const dataPut = await resPut.json()
    expect(dataPut.item.bgImage).toBe(imgLambo)
  })

  it('deve listar itens ativos incluindo imagens (GET)', async () => {
    const { POST, GET } = await import('@/app/api/hero-carousel/route')

    // Garante pelo menos um item com imagem
    const slide = {
      title: 'Slide Tank 500',
      bgImage: imgTank,
      active: true,
      ordem: 0,
    }
    const reqPost = createMockRequest('http://localhost:3000/api/hero-carousel', 'POST', slide)
    await POST(reqPost as any)

    const resGet = await GET()
    expect(resGet.status).toBe(200)
    const data = await resGet.json()
    expect(Array.isArray(data.items)).toBe(true)
    // Pelo menos um item com bgImage definido
    const hasImage = data.items.some((it: any) => typeof it.bgImage === 'string' && it.bgImage.includes('/uploads/image/'))
    expect(hasImage).toBe(true)
  })
})