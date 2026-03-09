import { test, expect } from '@playwright/test'

test.describe('API Endpoints', () => {
  test('deve verificar health check da API', async ({ request }) => {
    const response = await request.get('/api/health')
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('status', 'ok')
    expect(data).toHaveProperty('timestamp')
    expect(data).toHaveProperty('version')
    expect(data).toHaveProperty('environment')
    expect(data).toHaveProperty('uptime')
    expect(data).toHaveProperty('services')
  })

  test('deve retornar lista de notícias', async ({ request }) => {
    const response = await request.get('/api/noticias')
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('noticias')
    expect(data).toHaveProperty('total')
    expect(data).toHaveProperty('page')
    expect(data).toHaveProperty('limit')
    expect(Array.isArray(data.noticias)).toBe(true)
    
    // Verificar estrutura de uma notícia
    if (data.noticias.length > 0) {
      const noticia = data.noticias[0]
      expect(noticia).toHaveProperty('id')
      expect(noticia).toHaveProperty('titulo')
      expect(noticia).toHaveProperty('resumo')
      expect(noticia).toHaveProperty('autor')
      expect(noticia).toHaveProperty('categoria')
      expect(noticia).toHaveProperty('dataPublicacao')
      expect(noticia).toHaveProperty('tags')
      expect(noticia).toHaveProperty('imagem')
    }
  })

  test('deve filtrar notícias por categoria', async ({ request }) => {
    const response = await request.get('/api/noticias?categoria=lancamentos')
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data.noticias.every((noticia: any) => noticia.categoria === 'lancamentos')).toBe(true)
  })

  test('deve implementar paginação nas notícias', async ({ request }) => {
    const response = await request.get('/api/noticias?page=1&limit=3')
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data.page).toBe(1)
    expect(data.limit).toBe(3)
    expect(data.noticias.length).toBeLessThanOrEqual(3)
  })

  test('deve buscar notícias por termo', async ({ request }) => {
    const response = await request.get('/api/noticias?busca=toyota')
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    // Verificar se as notícias contêm o termo de busca
    data.noticias.forEach((noticia: any) => {
      const contemTermo = 
        noticia.titulo.toLowerCase().includes('toyota') ||
        noticia.resumo.toLowerCase().includes('toyota') ||
        noticia.tags.some((tag: string) => tag.toLowerCase().includes('toyota'))
      expect(contemTermo).toBe(true)
    })
  })

  test('deve retornar lista de carros', async ({ request }) => {
    const response = await request.get('/api/carros')
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('carros')
    expect(data).toHaveProperty('total')
    expect(Array.isArray(data.carros)).toBe(true)
    
    // Verificar estrutura de um carro
    if (data.carros.length > 0) {
      const carro = data.carros[0]
      expect(carro).toHaveProperty('id')
      expect(carro).toHaveProperty('marca')
      expect(carro).toHaveProperty('modelo')
      expect(carro).toHaveProperty('ano')
      expect(carro).toHaveProperty('preco')
      expect(carro).toHaveProperty('combustivel')
      expect(carro).toHaveProperty('transmissao')
      expect(carro).toHaveProperty('cor')
      expect(carro).toHaveProperty('quilometragem')
      expect(carro).toHaveProperty('imagens')
    }
  })

  test('deve filtrar carros por marca', async ({ request }) => {
    const response = await request.get('/api/carros?marca=Toyota')
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    data.carros.forEach((carro: any) => {
      expect(carro.marca.toLowerCase()).toContain('toyota')
    })
  })

  test('deve filtrar carros por faixa de preço', async ({ request }) => {
    const response = await request.get('/api/carros?precoMin=10000000&precoMax=20000000')
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    data.carros.forEach((carro: any) => {
      expect(carro.preco).toBeGreaterThanOrEqual(10000000)
      expect(carro.preco).toBeLessThanOrEqual(20000000)
    })
  })

  test('deve retornar detalhes de um carro específico', async ({ request }) => {
    // Primeiro, obter lista de carros para pegar um ID válido
    const listResponse = await request.get('/api/carros')
    const listData = await listResponse.json()
    
    if (listData.carros.length > 0) {
      const carroId = listData.carros[0].id
      
      const response = await request.get(`/api/carros/${carroId}`)
      expect(response.status()).toBe(200)
      
      const data = await response.json()
      expect(data).toHaveProperty('carro')
      expect(data).toHaveProperty('relacionados')
      expect(data.carro.id).toBe(carroId)
      expect(Array.isArray(data.relacionados)).toBe(true)
    }
  })

  test('deve retornar 404 para carro inexistente', async ({ request }) => {
    const response = await request.get('/api/carros/999999')
    expect(response.status()).toBe(404)
    
    const data = await response.json()
    expect(data).toHaveProperty('error', 'Carro não encontrado')
  })

  test('deve retornar lista de concessionárias', async ({ request }) => {
    const response = await request.get('/api/concessionarias')
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('concessionarias')
    expect(data).toHaveProperty('total')
    expect(Array.isArray(data.concessionarias)).toBe(true)
    
    // Verificar estrutura de uma concessionária
    if (data.concessionarias.length > 0) {
      const concessionaria = data.concessionarias[0]
      expect(concessionaria).toHaveProperty('id')
      expect(concessionaria).toHaveProperty('nome')
      expect(concessionaria).toHaveProperty('endereco')
      expect(concessionaria).toHaveProperty('cidade')
      expect(concessionaria).toHaveProperty('telefone')
      expect(concessionaria).toHaveProperty('email')
      expect(concessionaria).toHaveProperty('marcas')
      expect(concessionaria).toHaveProperty('coordenadas')
    }
  })

  test('deve filtrar concessionárias por cidade', async ({ request }) => {
    const response = await request.get('/api/concessionarias?cidade=Luanda')
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    data.concessionarias.forEach((concessionaria: any) => {
      expect(concessionaria.cidade.toLowerCase()).toContain('luanda')
    })
  })

  test('deve calcular distância quando coordenadas são fornecidas', async ({ request }) => {
    const response = await request.get('/api/concessionarias?lat=-8.8390&lng=13.2894')
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    data.concessionarias.forEach((concessionaria: any) => {
      expect(concessionaria).toHaveProperty('distancia')
      expect(typeof concessionaria.distancia).toBe('number')
    })
  })

  test('deve retornar documentação da API', async ({ request }) => {
    const response = await request.get('/api/docs')
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('openapi')
    expect(data).toHaveProperty('info')
    expect(data).toHaveProperty('paths')
    expect(data).toHaveProperty('components')
    
    // Verificar se contém os endpoints principais
    expect(data.paths).toHaveProperty('/api/health')
    expect(data.paths).toHaveProperty('/api/noticias')
    expect(data.paths).toHaveProperty('/api/carros')
    expect(data.paths).toHaveProperty('/api/concessionarias')
  })

  test('deve criar nova notícia via POST', async ({ request }) => {
    const novaNoticia = {
      titulo: 'Notícia de Teste E2E',
      resumo: 'Resumo da notícia de teste E2E',
      conteudo: 'Conteúdo completo da notícia de teste E2E',
      autor: 'Autor E2E',
      categoria: 'teste',
      tags: ['teste', 'e2e'],
      imagem: '/images/test-e2e.jpg'
    }
    
    const response = await request.post('/api/noticias', {
      data: novaNoticia
    })
    
    expect(response.status()).toBe(201)
    
    const data = await response.json()
    expect(data).toHaveProperty('message', 'Notícia criada com sucesso')
    expect(data).toHaveProperty('noticia')
    expect(data.noticia.titulo).toBe(novaNoticia.titulo)
  })

  test('deve validar campos obrigatórios no POST de notícias', async ({ request }) => {
    const noticiaIncompleta = {
      titulo: 'Título sem outros campos'
    }
    
    const response = await request.post('/api/noticias', {
      data: noticiaIncompleta
    })
    
    expect(response.status()).toBe(400)
    
    const data = await response.json()
    expect(data).toHaveProperty('error')
  })

  test('deve verificar CORS headers', async ({ request }) => {
    const response = await request.get('/api/health')
    
    expect(response.status()).toBe(200)
    
    const headers = response.headers()
    expect(headers['access-control-allow-origin']).toBe('*')
    expect(headers['access-control-allow-methods']).toContain('GET')
    expect(headers['access-control-allow-methods']).toContain('POST')
    expect(headers['access-control-allow-methods']).toContain('PUT')
    expect(headers['access-control-allow-methods']).toContain('DELETE')
  })
})