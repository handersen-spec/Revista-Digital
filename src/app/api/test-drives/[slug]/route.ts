import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    if (!slug) {
      return NextResponse.json({ error: 'Slug inválido' }, { status: 400 })
    }

    const sql = `
      SELECT id, slug, veiculo, categoria, nota, preco, resumo,
             conteudo_completo, pontos_favoraveis, pontos_negativos,
             avaliacoes, especificacoes, data_publicacao, autor, imagem,
             destaque, status
      FROM test_drives
      WHERE slug = $1
      LIMIT 1
    `
    const res = await query<any>(sql, [slug])
    const row = res.rows[0]
    if (!row) {
      return NextResponse.json({ error: 'Test drive não encontrado' }, { status: 404 })
    }

    const imgs = await query<{ id: number; url: string; alt: string | null; legenda: string | null }>(
      'SELECT id, url, alt, legenda FROM test_drive_imagens WHERE test_drive_id = $1 ORDER BY id ASC',
      [row.id]
    )

    const data = {
      id: row.id,
      slug: row.slug,
      veiculo: row.veiculo,
      marca: undefined,
      categoria: row.categoria || 'Geral',
      nota: typeof row.nota === 'number' ? row.nota : 0,
      preco: row.preco || '',
      resumo: row.resumo || '',
      conteudoCompleto: row.conteudo_completo || '',
      pontosFavoraveis: Array.isArray(row.pontos_favoraveis) ? row.pontos_favoraveis : [],
      pontosNegativos: Array.isArray(row.pontos_negativos) ? row.pontos_negativos : [],
      avaliacoes: row.avaliacoes || {},
      especificacoes: row.especificacoes || {},
      galeria: imgs.rows.map(img => ({ id: String(img.id), url: img.url, alt: img.alt || '', legenda: img.legenda || '' })),
      data: row.data_publicacao,
      autor: row.autor || '',
      imagem: row.imagem || '',
      destaque: !!row.destaque,
      status: row.status,
    }

    // Diferente da listagem, o hook espera o objeto diretamente
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro em GET /api/test-drives/[slug]:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

function normalizeStatusToDb(status: any): 'draft' | 'published' | 'scheduled' {
  if (status === 'publicado' || status === 'published') return 'published'
  if (status === 'agendado' || status === 'scheduled') return 'scheduled'
  return 'draft'
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    if (!slug) return NextResponse.json({ ok: false, error: 'Slug inválido' }, { status: 400 })

    const body = await request.json()

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

    const veiculoTexto = body?.titulo || `Test Drive: ${veiculoMarca} ${veiculoModelo} ${veiculoAno}`.trim()
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

    const isNumeric = /^[0-9]+$/.test(slug)
    const whereField = isNumeric ? 'id' : 'slug'
    const whereValue = isNumeric ? parseInt(slug) : slug

    const updateSql = `
      UPDATE test_drives SET
        veiculo = $1,
        categoria = $2,
        nota = $3,
        preco = $4,
        resumo = $5,
        conteudo_completo = $6,
        pontos_favoraveis = $7,
        pontos_negativos = $8,
        avaliacoes = $9,
        especificacoes = $10,
        data_publicacao = $11,
        autor = $12,
        imagem = $13,
        destaque = $14,
        status = $15,
        updated_at = NOW()
      WHERE ${whereField} = $16
      RETURNING id, slug, veiculo, categoria, nota, preco, resumo,
                conteudo_completo, pontos_favoraveis, pontos_negativos,
                avaliacoes, especificacoes, data_publicacao, autor, imagem,
                destaque, status
    `

    const updateRes = await query<any>(updateSql, [
      veiculoTexto,
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
      whereValue,
    ])

    const updated = updateRes.rows[0]
    if (!updated) {
      return NextResponse.json({ ok: false, error: 'Test drive não encontrado para atualização' }, { status: 404 })
    }

    const galeriaUrls: string[] = Array.isArray(body?.galeria) ? body.galeria : []
    if (galeriaUrls.length) {
      await query('DELETE FROM test_drive_imagens WHERE test_drive_id = $1', [updated.id])
      const imgSql = 'INSERT INTO test_drive_imagens (test_drive_id, url) VALUES ($1, $2)'
      for (const url of galeriaUrls) {
        if (typeof url === 'string' && url.trim()) {
          await query(imgSql, [updated.id, url])
        }
      }
    }

    const responseData = {
      id: updated.id,
      slug: updated.slug,
      veiculo: updated.veiculo,
      categoria: updated.categoria,
      nota: updated.nota,
      preco: updated.preco,
      resumo: updated.resumo,
      conteudoCompleto: updated.conteudo_completo,
      pontosFavoraveis: updated.pontos_favoraveis,
      pontosNegativos: updated.pontos_negativos,
      avaliacoes: updated.avaliacoes,
      especificacoes: updated.especificacoes,
      galeria: galeriaUrls.map((url, idx) => ({ id: String(idx + 1), url, alt: '', legenda: '' })),
      data: updated.data_publicacao,
      autor: updated.autor,
      imagem: updated.imagem,
      destaque: updated.destaque,
      status: updated.status,
    }

    return NextResponse.json({ ok: true, data: responseData })
  } catch (error) {
    console.error('Erro em PUT /api/test-drives/[slug]:', error)
    return NextResponse.json({ ok: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    if (!slug) return NextResponse.json({ ok: false, error: 'Slug inválido' }, { status: 400 })

    const isNumeric = /^[0-9]+$/.test(slug)
    const whereField = isNumeric ? 'id' : 'slug'
    const whereValue = isNumeric ? parseInt(slug) : slug

    // Obter id para remover imagens se necessário
    const idRes = await query<{ id: number }>(`SELECT id FROM test_drives WHERE ${whereField} = $1`, [whereValue])
    const row = idRes.rows[0]
    if (!row) return NextResponse.json({ ok: false, error: 'Test drive não encontrado para exclusão' }, { status: 404 })

    await query('DELETE FROM test_drive_imagens WHERE test_drive_id = $1', [row.id])
    await query(`DELETE FROM test_drives WHERE ${whereField} = $1`, [whereValue])

    return NextResponse.json({ ok: true, data: { id: row.id } })
  } catch (error) {
    console.error('Erro em DELETE /api/test-drives/[slug]:', error)
    return NextResponse.json({ ok: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}