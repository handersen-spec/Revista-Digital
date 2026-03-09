import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const revalidate = 0
import { query } from '@/lib/db'

// Resultado de busca unificado
interface ResultadoBusca {
  id: string
  tipo: 'artigo' | 'noticia' | 'carro' | 'video' | 'concessionaria' | 'ferramenta'
  titulo: string
  descricao: string
  url: string
  imagem?: string
  relevancia: number
  dataPublicacao?: string
  autor?: string
  categoria?: string
  tags?: string[]
  destaque?: boolean
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parâmetros de busca
    const queryParam = searchParams.get('q') || searchParams.get('query') || ''
    const tipo = searchParams.get('tipo')
    const categoria = searchParams.get('categoria')
    const autor = searchParams.get('autor')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    const ordenacao = searchParams.get('ordenacao') || 'relevancia'

    // Paginação
    const pagina = parseInt(searchParams.get('pagina') || '1')
    const limite = parseInt(searchParams.get('limite') || '10')

    if (!queryParam.trim()) {
      return NextResponse.json(
        { error: 'Parâmetro de busca (q ou query) é obrigatório' },
        { status: 400 }
      )
    }
    if (queryParam.length < 2) {
      return NextResponse.json(
        { error: 'Termo de busca deve ter pelo menos 2 caracteres' },
        { status: 400 }
      )
    }

    const startedAt = Date.now()
    const termoBusca = queryParam.toLowerCase()
    const resultados: ResultadoBusca[] = []

    // Funções de busca por tabela (somente dados do banco)
    async function buscarArtigos() {
      const where: string[] = []
      const params: any[] = []
      params.push(`%${termoBusca}%`)
      where.push(`LOWER(titulo) LIKE $${params.length} OR LOWER(resumo) LIKE $${params.length} OR LOWER(conteudo) LIKE $${params.length}`)
      if (categoria) { params.push(categoria); where.push(`categoria = $${params.length}`) }
      if (autor) { params.push(autor); where.push(`autor = $${params.length}`) }
      if (dataInicio) { params.push(dataInicio); where.push(`data_publicacao >= $${params.length}`) }
      if (dataFim) { params.push(dataFim); where.push(`data_publicacao <= $${params.length}`) }
      const sql = `SELECT id, slug, titulo, resumo, autor, data_publicacao, categoria, imagem, tags FROM artigos WHERE ${where.join(' AND ')} ORDER BY data_publicacao DESC LIMIT 100`
      const { rows } = await query(sql, params)
      rows.forEach((r: any) => {
        const relevancia = calcularRelevancia(termoBusca, r.titulo || '', r.resumo || '', r.tags || [])
        resultados.push({
          id: `artigo:${r.id}`,
          tipo: 'artigo',
          titulo: r.titulo,
          descricao: r.resumo,
          url: `/artigos/${r.slug}`,
          imagem: r.imagem || undefined,
          relevancia,
          dataPublicacao: r.data_publicacao,
          autor: r.autor,
          categoria: r.categoria,
          tags: r.tags || []
        })
      })
    }

    async function buscarNoticias() {
      const where: string[] = []
      const params: any[] = []
      params.push(`%${termoBusca}%`)
      where.push(`LOWER(titulo) LIKE $${params.length} OR LOWER(resumo) LIKE $${params.length} OR LOWER(conteudo) LIKE $${params.length}`)
      if (categoria) { params.push(categoria); where.push(`categoria = $${params.length}`) }
      if (autor) { params.push(autor); where.push(`autor = $${params.length}`) }
      if (dataInicio) { params.push(dataInicio); where.push(`data_publicacao >= $${params.length}`) }
      if (dataFim) { params.push(dataFim); where.push(`data_publicacao <= $${params.length}`) }
      const sql = `SELECT id, slug, titulo, resumo, autor, data_publicacao, categoria, imagem, tags, destaque FROM noticias WHERE ${where.join(' AND ')} ORDER BY data_publicacao DESC LIMIT 100`
      const { rows } = await query(sql, params)
      rows.forEach((r: any) => {
        const relevancia = calcularRelevancia(termoBusca, r.titulo || '', r.resumo || '', r.tags || [])
        resultados.push({
          id: `noticia:${r.id}`,
          tipo: 'noticia',
          titulo: r.titulo,
          descricao: r.resumo,
          url: `/noticias/${r.slug}`,
          imagem: r.imagem || undefined,
          relevancia,
          dataPublicacao: r.data_publicacao,
          autor: r.autor,
          categoria: r.categoria,
          tags: r.tags || [],
          destaque: r.destaque
        })
      })
    }

    async function buscarVideos() {
      const where: string[] = []
      const params: any[] = []
      params.push(`%${termoBusca}%`)
      where.push(`LOWER(titulo) LIKE $${params.length} OR LOWER(descricao) LIKE $${params.length}`)
      if (categoria) { params.push(categoria); where.push(`categoria = $${params.length}`) }
      if (autor) { params.push(autor); where.push(`autor = $${params.length}`) }
      if (dataInicio) { params.push(dataInicio); where.push(`data_publicacao >= $${params.length}`) }
      if (dataFim) { params.push(dataFim); where.push(`data_publicacao <= $${params.length}`) }
      const sql = `SELECT id, slug, titulo, descricao, autor, data_publicacao, categoria, thumbnail, tags FROM videos WHERE ${where.join(' AND ')} ORDER BY data_publicacao DESC LIMIT 100`
      const { rows } = await query(sql, params)
      rows.forEach((r: any) => {
        const relevancia = calcularRelevancia(termoBusca, r.titulo || '', r.descricao || '', r.tags || [])
        resultados.push({
          id: `video:${r.id}`,
          tipo: 'video',
          titulo: r.titulo,
          descricao: r.descricao,
          url: `/videos/${r.slug}`,
          imagem: r.thumbnail || undefined,
          relevancia,
          dataPublicacao: r.data_publicacao,
          autor: r.autor,
          categoria: r.categoria,
          tags: r.tags || []
        })
      })
    }

    async function buscarTestDrives() {
      const where: string[] = []
      const params: any[] = []
      params.push(`%${termoBusca}%`)
      where.push(`LOWER(veiculo) LIKE $${params.length} OR LOWER(resumo) LIKE $${params.length} OR LOWER(conteudo_completo) LIKE $${params.length}`)
      if (categoria) { params.push(categoria); where.push(`categoria = $${params.length}`) }
      if (dataInicio) { params.push(dataInicio); where.push(`data_publicacao >= $${params.length}`) }
      if (dataFim) { params.push(dataFim); where.push(`data_publicacao <= $${params.length}`) }
      const sql = `SELECT id, slug, veiculo, marca, categoria, resumo, autor, data_publicacao, imagem FROM test_drives WHERE ${where.join(' AND ')} ORDER BY data_publicacao DESC LIMIT 100`
      const { rows } = await query(sql, params)
      rows.forEach((r: any) => {
        const relevancia = calcularRelevancia(termoBusca, r.veiculo || '', r.resumo || '', [])
        resultados.push({
          id: `test-drive:${r.id}`,
          tipo: 'carro',
          titulo: r.veiculo,
          descricao: r.resumo,
          url: `/test-drives/${r.slug}`,
          imagem: r.imagem || undefined,
          relevancia,
          dataPublicacao: r.data_publicacao,
          autor: r.autor || undefined,
          categoria: r.categoria
        })
      })
    }

    async function buscarConcessionarias() {
      const where: string[] = []
      const params: any[] = []
      params.push(`%${termoBusca}%`)
      where.push(`LOWER(nome) LIKE $${params.length}`)
      if (categoria) { params.push(categoria); where.push(`marca = $${params.length}`) }
      const sql = `SELECT id, nome AS titulo, marca AS categoria, cidade, provincia FROM concessionarias WHERE ${where.join(' AND ')} ORDER BY data_atualizacao DESC LIMIT 100`
      const { rows } = await query(sql, params)
      rows.forEach((r: any) => {
        const desc = `${r.cidade || ''} ${r.provincia || ''}`.trim()
        const relevancia = calcularRelevancia(termoBusca, r.titulo || '', desc, [])
        resultados.push({
          id: `concessionaria:${r.id}`,
          tipo: 'concessionaria',
          titulo: r.titulo,
          descricao: desc,
          url: `/concessionarias/${r.id}`,
          relevancia,
          categoria: r.categoria
        })
      })
    }

    // Executar buscas conforme o filtro de tipo
    if (!tipo || tipo === 'artigo') await buscarArtigos()
    if (!tipo || tipo === 'noticia') await buscarNoticias()
    if (!tipo || tipo === 'video') await buscarVideos()
    if (!tipo || tipo === 'carro') await buscarTestDrives()
    if (!tipo || tipo === 'concessionaria') await buscarConcessionarias()

    // Aplicar filtros por categoria/autor já feitos nas queries; reforço por segurança
    if (tipo) {
      for (let i = resultados.length - 1; i >= 0; i--) {
        if (resultados[i].tipo !== tipo) resultados.splice(i, 1)
      }
    }

    // Ordenação
    switch (ordenacao) {
      case 'relevancia':
        resultados.sort((a, b) => b.relevancia - a.relevancia)
        break
      case 'data':
        resultados.sort((a, b) => {
          if (!a.dataPublicacao && !b.dataPublicacao) return 0
          if (!a.dataPublicacao) return 1
          if (!b.dataPublicacao) return -1
          return new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime()
        })
        break
      case 'titulo':
        resultados.sort((a, b) => a.titulo.localeCompare(b.titulo))
        break
      case 'tipo':
        resultados.sort((a, b) => a.tipo.localeCompare(b.tipo))
        break
    }

    // Paginação
    const inicio = (pagina - 1) * limite
    const fim = inicio + limite
    const resultadosPaginados = resultados.slice(inicio, fim)

    // Estatísticas derivadas dos resultados reais
    const estatisticas = {
      total: resultados.length,
      porTipo: Object.entries(
        resultados.reduce((acc, item) => {
          acc[item.tipo] = (acc[item.tipo] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      ).map(([tipo, total]) => ({ tipo, total })),
      porCategoria: Object.entries(
        resultados.reduce((acc, item) => {
          if (item.categoria) acc[item.categoria] = (acc[item.categoria] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      ).map(([categoria, total]) => ({ categoria, total })),
      tempoRespostaMs: Date.now() - startedAt
    }

    // Sugestões de busca (apenas derivadas dos resultados)
    const sugestoes = gerarSugestoes(termoBusca, resultados)

    return NextResponse.json({
      query: termoBusca,
      resultados: resultadosPaginados,
      paginacao: {
        paginaAtual: pagina,
        totalPaginas: Math.ceil(resultados.length / limite) || 1,
        totalItens: resultados.length,
        itensPorPagina: limite,
        temProxima: fim < resultados.length,
        temAnterior: pagina > 1
      },
      estatisticas,
      sugestoes,
      filtros: { tipo, categoria, autor, dataInicio, dataFim, ordenacao }
    })

  } catch (error) {
    console.error('Erro na busca:', error)
    const msg = !process.env.DATABASE_URL
      ? 'Banco de dados indisponível. Configure DATABASE_URL.'
      : 'Erro interno do servidor'
    return NextResponse.json(
      { error: msg },
      { status: !process.env.DATABASE_URL ? 503 : 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { termos, filtros, ordenacao } = body

    if (!termos || !Array.isArray(termos) || termos.length === 0) {
      return NextResponse.json(
        { error: 'Array de termos de busca é obrigatório' },
        { status: 400 }
      )
    }

    const startedAt = Date.now()
    const termoPrincipal = String(termos[0] || '').toLowerCase()
    const resultados: ResultadoBusca[] = []

    // Reutiliza GET com termo principal. Critérios extras de filtros são aplicados nas queries.
    const categoria = filtros?.categoria || undefined
    const tipo = filtros?.tipo || undefined
    const autor = filtros?.autor || undefined
    const dataInicio = filtros?.dataInicio || undefined
    const dataFim = filtros?.dataFim || undefined

    async function executarBuscas() {
      const q = `%${termoPrincipal}%`
      // Artigos
      if (!tipo || tipo === 'artigo') {
        const { rows } = await query(
          `SELECT id, slug, titulo, resumo, autor, data_publicacao, categoria, imagem, tags FROM artigos
           WHERE (LOWER(titulo) LIKE $1 OR LOWER(resumo) LIKE $1 OR LOWER(conteudo) LIKE $1)
           ${categoria ? ` AND categoria = $2` : ''}
           ${autor ? ` AND autor = $${categoria ? 3 : 2}` : ''}
           ${dataInicio ? ` AND data_publicacao >= $${categoria && autor ? 4 : (categoria || autor ? 3 : 2)}` : ''}
           ${dataFim ? ` AND data_publicacao <= $${categoria && autor && dataInicio ? 5 : (categoria && autor || categoria && dataInicio || autor && dataInicio ? 4 : (categoria || autor || dataInicio ? 3 : 2))}` : ''}
           ORDER BY data_publicacao DESC LIMIT 100`,
          [q, ...(categoria ? [categoria] : []), ...(autor ? [autor] : []), ...(dataInicio ? [dataInicio] : []), ...(dataFim ? [dataFim] : [])]
        )
        rows.forEach((r: any) => resultados.push({
          id: `artigo:${r.id}`,
          tipo: 'artigo',
          titulo: r.titulo,
          descricao: r.resumo,
          url: `/artigos/${r.slug}`,
          imagem: r.imagem || undefined,
          relevancia: calcularRelevancia(termoPrincipal, r.titulo || '', r.resumo || '', r.tags || []),
          dataPublicacao: r.data_publicacao,
          autor: r.autor,
          categoria: r.categoria,
          tags: r.tags || []
        }))
      }
      // Notícias
      if (!tipo || tipo === 'noticia') {
        const { rows } = await query(
          `SELECT id, slug, titulo, resumo, autor, data_publicacao, categoria, imagem, tags, destaque FROM noticias
           WHERE (LOWER(titulo) LIKE $1 OR LOWER(resumo) LIKE $1 OR LOWER(conteudo) LIKE $1)
           ${categoria ? ` AND categoria = $2` : ''}
           ${autor ? ` AND autor = $${categoria ? 3 : 2}` : ''}
           ${dataInicio ? ` AND data_publicacao >= $${categoria && autor ? 4 : (categoria || autor ? 3 : 2)}` : ''}
           ${dataFim ? ` AND data_publicacao <= $${categoria && autor && dataInicio ? 5 : (categoria && autor || categoria && dataInicio || autor && dataInicio ? 4 : (categoria || autor || dataInicio ? 3 : 2))}` : ''}
           ORDER BY data_publicacao DESC LIMIT 100`,
          [q, ...(categoria ? [categoria] : []), ...(autor ? [autor] : []), ...(dataInicio ? [dataInicio] : []), ...(dataFim ? [dataFim] : [])]
        )
        rows.forEach((r: any) => resultados.push({
          id: `noticia:${r.id}`,
          tipo: 'noticia',
          titulo: r.titulo,
          descricao: r.resumo,
          url: `/noticias/${r.slug}`,
          imagem: r.imagem || undefined,
          relevancia: calcularRelevancia(termoPrincipal, r.titulo || '', r.resumo || '', r.tags || []),
          dataPublicacao: r.data_publicacao,
          autor: r.autor,
          categoria: r.categoria,
          tags: r.tags || [],
          destaque: r.destaque
        }))
      }
      // Vídeos
      if (!tipo || tipo === 'video') {
        const { rows } = await query(
          `SELECT id, slug, titulo, descricao, autor, data_publicacao, categoria, thumbnail, tags FROM videos
           WHERE (LOWER(titulo) LIKE $1 OR LOWER(descricao) LIKE $1)
           ${categoria ? ` AND categoria = $2` : ''}
           ${autor ? ` AND autor = $${categoria ? 3 : 2}` : ''}
           ${dataInicio ? ` AND data_publicacao >= $${categoria && autor ? 4 : (categoria || autor ? 3 : 2)}` : ''}
           ${dataFim ? ` AND data_publicacao <= $${categoria && autor && dataInicio ? 5 : (categoria && autor || categoria && dataInicio || autor && dataInicio ? 4 : (categoria || autor || dataInicio ? 3 : 2))}` : ''}
           ORDER BY data_publicacao DESC LIMIT 100`,
          [q, ...(categoria ? [categoria] : []), ...(autor ? [autor] : []), ...(dataInicio ? [dataInicio] : []), ...(dataFim ? [dataFim] : [])]
        )
        rows.forEach((r: any) => resultados.push({
          id: `video:${r.id}`,
          tipo: 'video',
          titulo: r.titulo,
          descricao: r.descricao,
          url: `/videos/${r.slug}`,
          imagem: r.thumbnail || undefined,
          relevancia: calcularRelevancia(termoPrincipal, r.titulo || '', r.descricao || '', r.tags || []),
          dataPublicacao: r.data_publicacao,
          autor: r.autor,
          categoria: r.categoria,
          tags: r.tags || []
        }))
      }
      // Test drives
      if (!tipo || tipo === 'carro') {
        const { rows } = await query(
          `SELECT id, slug, veiculo, categoria, resumo, autor, data_publicacao, imagem FROM test_drives
           WHERE (LOWER(veiculo) LIKE $1 OR LOWER(resumo) LIKE $1 OR LOWER(conteudo_completo) LIKE $1)
           ${categoria ? ` AND categoria = $2` : ''}
           ${dataInicio ? ` AND data_publicacao >= $${categoria ? 3 : 2}` : ''}
           ${dataFim ? ` AND data_publicacao <= $${categoria && dataInicio ? 4 : (categoria || dataInicio ? 3 : 2)}` : ''}
           ORDER BY data_publicacao DESC LIMIT 100`,
          [q, ...(categoria ? [categoria] : []), ...(dataInicio ? [dataInicio] : []), ...(dataFim ? [dataFim] : [])]
        )
        rows.forEach((r: any) => resultados.push({
          id: `test-drive:${r.id}`,
          tipo: 'carro',
          titulo: r.veiculo,
          descricao: r.resumo,
          url: `/test-drives/${r.slug}`,
          imagem: r.imagem || undefined,
          relevancia: calcularRelevancia(termoPrincipal, r.veiculo || '', r.resumo || '', []),
          dataPublicacao: r.data_publicacao,
          autor: r.autor || undefined,
          categoria: r.categoria
        }))
      }
    }

    await executarBuscas()

    // Ordenação
    if (ordenacao) {
      switch (ordenacao.campo || ordenacao) {
        case 'relevancia':
          resultados.sort((a, b) => (ordenacao.direcao === 'asc' ? a.relevancia - b.relevancia : b.relevancia - a.relevancia))
          break
        case 'data':
          resultados.sort((a, b) => {
            const aTime = a.dataPublicacao ? new Date(a.dataPublicacao).getTime() : 0
            const bTime = b.dataPublicacao ? new Date(b.dataPublicacao).getTime() : 0
            return ordenacao.direcao === 'asc' ? aTime - bTime : bTime - aTime
          })
          break
        case 'titulo':
          resultados.sort((a, b) => (ordenacao.direcao === 'asc' ? a.titulo.localeCompare(b.titulo) : b.titulo.localeCompare(a.titulo)))
          break
      }
    } else {
      resultados.sort((a, b) => b.relevancia - a.relevancia)
    }

    const analise = {
      termosEncontrados: termos.filter((termo: string) => resultados.some(item => `${item.titulo} ${item.descricao}`.toLowerCase().includes(termo.toLowerCase()))),
      termosNaoEncontrados: termos.filter((termo: string) => !resultados.some(item => `${item.titulo} ${item.descricao}`.toLowerCase().includes(termo.toLowerCase()))),
      distribuicaoRelevancia: {
        alta: resultados.filter(r => r.relevancia >= 90).length,
        media: resultados.filter(r => r.relevancia >= 70 && r.relevancia < 90).length,
        baixa: resultados.filter(r => r.relevancia < 70).length
      }
    }

    return NextResponse.json({
      termos,
      resultados: resultados.slice(0, 50),
      analise,
      estatisticas: {
        total: resultados.length,
        relevanciaMedia: resultados.length ? Math.round(resultados.reduce((acc, r) => acc + r.relevancia, 0) / resultados.length) : 0,
        tempoProcessamentoMs: Date.now() - startedAt
      }
    })

  } catch (error) {
    console.error('Erro na busca avançada:', error)
    const msg = !process.env.DATABASE_URL
      ? 'Banco de dados indisponível. Configure DATABASE_URL.'
      : 'Erro interno do servidor'
    return NextResponse.json(
      { error: msg },
      { status: !process.env.DATABASE_URL ? 503 : 500 }
    )
  }
}

function gerarSugestoes(termo: string, resultados: ResultadoBusca[]): string[] {
  const sugestoes = new Set<string>()
  const t = termo.toLowerCase()

  resultados.forEach(r => {
    r.tags?.forEach(tag => {
      const lower = String(tag || '').toLowerCase()
      if (lower.includes(t) && lower !== t) sugestoes.add(lower)
    })
    r.titulo.toLowerCase().split(' ').forEach(palavra => {
      if (palavra.length > 3 && palavra.includes(t) && palavra !== t) sugestoes.add(palavra)
    })
  })

  return Array.from(sugestoes).slice(0, 8)
}

function calcularRelevancia(termo: string, titulo: string, descricao: string, tags: string[]): number {
  const t = termo.toLowerCase()
  let score = 0
  if ((titulo || '').toLowerCase().includes(t)) score += 60
  if ((descricao || '').toLowerCase().includes(t)) score += 30
  if (Array.isArray(tags) && tags.some(tag => (tag || '').toLowerCase().includes(t))) score += 10
  return score
}