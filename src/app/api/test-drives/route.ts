import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function clampPage(pageRaw: string | null): number {
  const p = parseInt(pageRaw || '1')
  return Math.max(1, isNaN(p) ? 1 : p)
}

function clampLimit(limitRaw: string | null): number {
  const l = parseInt(limitRaw || '10')
  return Math.max(1, Math.min(isNaN(l) ? 10 : l, 100))
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoriaParam = searchParams.get('categoria') || undefined
    const marcaParam = searchParams.get('marca') || undefined
    const destaque = searchParams.get('destaque') === 'true'
    const page = clampPage(searchParams.get('page'))
    const limit = clampLimit(searchParams.get('limit'))

    const whereParts: string[] = ["status = 'published'"]
    const params: any[] = []

    if (categoriaParam && categoriaParam !== 'Todos') {
      params.push(categoriaParam)
      whereParts.push(`categoria = $${params.length}`)
    }

    if (marcaParam && marcaParam !== 'Todos') {
      // Sem coluna 'marca' no schema, filtramos por veiculo contendo a marca
      params.push(`%${marcaParam}%`)
      whereParts.push(`veiculo ILIKE $${params.length}`)
    }

    if (destaque) {
      whereParts.push('destaque = TRUE')
    }

    const whereClause = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : ''
    const offset = (page - 1) * limit

    const orderBy = destaque
      ? 'ORDER BY destaque DESC, nota DESC NULLS LAST, data_publicacao DESC'
      : 'ORDER BY data_publicacao DESC'

    const listSql = `
      SELECT id, slug, veiculo, categoria, nota, preco, resumo,
             conteudo_completo, pontos_favoraveis, pontos_negativos,
             avaliacoes, especificacoes, data_publicacao, autor, imagem,
             destaque, status
      FROM test_drives
      ${whereClause}
      ${orderBy}
      LIMIT $${params.length + 1}
      OFFSET $${params.length + 2}
    `
    const listRes = await query<any>(listSql, [...params, limit, offset])

    const countSql = `SELECT COUNT(*)::int AS total FROM test_drives ${whereClause}`
    const countRes = await query<{ total: number }>(countSql, params)
    const total = countRes.rows[0]?.total || 0
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit)

    // Metadados: categorias distintas publicadas
    const metaSql = `SELECT DISTINCT categoria FROM test_drives WHERE status = 'published' AND categoria IS NOT NULL`
    const metaRes = await query<{ categoria: string }>(metaSql)
    const categorias = ['Todos', ...metaRes.rows.map(r => r.categoria).filter(Boolean)]

    const formatted = listRes.rows.map(row => ({
      id: row.id,
      slug: row.slug,
      veiculo: row.veiculo,
      marca: undefined, // não há coluna dedicada; pode ser inferida do texto
      categoria: row.categoria || 'Geral',
      nota: typeof row.nota === 'number' ? row.nota : 0,
      preco: row.preco || '',
      resumo: row.resumo || '',
      conteudoCompleto: row.conteudo_completo || '',
      pontosFavoraveis: Array.isArray(row.pontos_favoraveis) ? row.pontos_favoraveis : [],
      pontosNegativos: Array.isArray(row.pontos_negativos) ? row.pontos_negativos : [],
      avaliacoes: row.avaliacoes || {},
      especificacoes: row.especificacoes || {},
      galeria: [], // para listagem, omitimos carga pesada; o detalhe carrega a galeria
      data: row.data_publicacao,
      autor: row.autor || '',
      imagem: row.imagem || '',
      destaque: !!row.destaque,
      status: row.status,
    }))

    return NextResponse.json({
      testDrives: formatted,
      total,
      page,
      limit,
      totalPages,
      categorias,
      marcas: [],
    })
  } catch (error) {
    console.error('Erro em GET /api/test-drives:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

function normalizeStatusToDb(status: any): 'draft' | 'published' | 'scheduled' {
  if (status === 'publicado' || status === 'published') return 'published'
  if (status === 'agendado' || status === 'scheduled') return 'scheduled'
  return 'draft'
}

function slugify(input: string): string {
  return (input || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Campos principais do formulário administrativo
    const titulo: string = body?.titulo || ''
    const veiculoForm = body?.veiculo || {}
    const avaliacaoForm = body?.avaliacao || {}

    const veiculoMarca: string = veiculoForm?.marca || ''
    const veiculoModelo: string = veiculoForm?.modelo || ''
    const veiculoAno: number = parseInt(veiculoForm?.ano ?? new Date().getFullYear())
    const precoNumber: number = typeof veiculoForm?.preco === 'number' ? veiculoForm.preco : 0

    const resumo: string = body?.resumo || ''
    const conteudo: string = body?.conteudo || ''
    const pontosFavoraveis: string[] = Array.isArray(body?.pontosFavoraveis) ? body.pontosFavoraveis : []
    const pontosNegativos: string[] = Array.isArray(body?.pontosNegativos) ? body.pontosNegativos : []
    const autor: string = body?.autor || ''
    const imagemDestaque: string = body?.imagemDestaque || ''
    const destaque: boolean = !!body?.destaque
    const dataPublicacaoStr: string = body?.dataPublicacao || new Date().toISOString()
    const statusDb = normalizeStatusToDb(body?.status)

    // Derivações
    const veiculoTexto = titulo || `Test Drive: ${veiculoMarca} ${veiculoModelo} ${veiculoAno}`.trim()
    const categoria = veiculoMarca || 'Geral'
    const precoTexto = precoNumber ? String(precoNumber) : ''
    const notaGeral5: number = typeof avaliacaoForm?.notaGeral === 'number' ? avaliacaoForm.notaGeral : 0
    const nota10 = Math.max(0, Math.min(10, Math.round(notaGeral5 * 2)))
    const avaliacoes = {
      design: Number(avaliacaoForm?.design || 0),
      conforto: Number(avaliacaoForm?.conforto || 0),
      performance: Number(avaliacaoForm?.performance || 0),
      tecnologia: Number(avaliacaoForm?.tecnologia || 0),
      custoBeneficio: Number(avaliacaoForm?.custoBeneficio || 0),
    }
    const especificacoes = {
      marca: veiculoMarca,
      modelo: veiculoModelo,
      ano: veiculoAno,
      versao: veiculoForm?.versao || '',
      combustivel: veiculoForm?.combustivel || '',
      transmissao: veiculoForm?.transmissao || '',
      potencia: veiculoForm?.potencia || '',
      torque: veiculoForm?.torque || '',
      aceleracao: veiculoForm?.aceleracao || '',
      velocidadeMaxima: veiculoForm?.velocidadeMaxima || '',
      consumo: veiculoForm?.consumo || '',
      preco: precoNumber,
      tags: Array.isArray(body?.tags) ? body.tags : [],
      localTeste: body?.localTeste || '',
      distanciaPercorrida: body?.distanciaPercorrida || '',
      condicoesClimaticas: body?.condicoesClimaticas || '',
      tipoPercurso: body?.tipoPercurso || '',
    }

    // Validações mínimas
    if (!veiculoMarca || !veiculoModelo || !resumo || !conteudo || !autor || !imagemDestaque) {
      return NextResponse.json({
        ok: false,
        error: 'Campos obrigatórios ausentes: marca, modelo, resumo, conteudo, autor, imagemDestaque',
      }, { status: 400 })
    }

    // Slug único
    const baseSlug = slugify(body?.slug || `${veiculoMarca}-${veiculoModelo}-${veiculoAno}`)
    let finalSlug = baseSlug
    let tries = 0
    while (true) {
      const exists = await query<{ exists: boolean }>('SELECT EXISTS(SELECT 1 FROM test_drives WHERE slug = $1) AS exists', [finalSlug])
      if (!exists.rows[0]?.exists) break
      tries += 1
      finalSlug = `${baseSlug}-${tries}`
      if (tries > 50) {
        return NextResponse.json({ ok: false, error: 'Não foi possível gerar slug único' }, { status: 500 })
      }
    }

    // Inserção
    const insertSql = `
      INSERT INTO test_drives (
        slug, veiculo, marca, categoria, nota, preco, resumo,
        conteudo_completo, pontos_favoraveis, pontos_negativos,
        avaliacoes, especificacoes, data_publicacao, autor, imagem,
        destaque, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10,
        $11, $12, $13, $14, $15,
        $16, $17
      )
      RETURNING id, slug, veiculo, categoria, nota, preco, resumo,
                conteudo_completo, pontos_favoraveis, pontos_negativos,
                avaliacoes, especificacoes, data_publicacao, autor, imagem,
                destaque, status
    `

    const insertRes = await query<any>(insertSql, [
      finalSlug,
      veiculoTexto,
      veiculoMarca,
      categoria,
      nota10,
      precoTexto,
      resumo,
      conteudo,
      pontosFavoraveis,
      pontosNegativos,
      avaliacoes,
      especificacoes,
      new Date(dataPublicacaoStr),
      autor,
      imagemDestaque,
      destaque,
      statusDb,
    ])

    const created = insertRes.rows[0]

    // Galeria opcional
    const galeriaUrls: string[] = Array.isArray(body?.galeria) ? body.galeria : []
    if (galeriaUrls.length) {
      const imgSql = 'INSERT INTO test_drive_imagens (test_drive_id, url) VALUES ($1, $2)'
      for (const url of galeriaUrls) {
        if (typeof url === 'string' && url.trim()) {
          await query(imgSql, [created.id, url])
        }
      }
    }

    const responseData = {
      id: created.id,
      slug: created.slug,
      veiculo: created.veiculo,
      categoria: created.categoria,
      nota: created.nota,
      preco: created.preco,
      resumo: created.resumo,
      conteudoCompleto: created.conteudo_completo,
      pontosFavoraveis: created.pontos_favoraveis,
      pontosNegativos: created.pontos_negativos,
      avaliacoes: created.avaliacoes,
      especificacoes: created.especificacoes,
      galeria: galeriaUrls.map((url, idx) => ({ id: String(idx + 1), url, alt: '', legenda: '' })),
      data: created.data_publicacao,
      autor: created.autor,
      imagem: created.imagem,
      destaque: created.destaque,
      status: created.status,
    }

    return NextResponse.json({ ok: true, data: responseData }, { status: 201 })
  } catch (error) {
    console.error('Erro em POST /api/test-drives:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ ok: false, error: `Erro interno do servidor: ${message}` }, { status: 500 })
  }
}