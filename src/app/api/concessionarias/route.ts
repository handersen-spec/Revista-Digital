import { NextRequest, NextResponse } from 'next/server'
import { loadConcessionarias, addConcessionaria, computeStats } from '@/lib/concessionariasStore'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const marca = searchParams.get('marca')
    const cidade = searchParams.get('cidade')
    const provincia = searchParams.get('provincia')
    const servico = searchParams.get('servico')
    const busca = searchParams.get('busca')
    const verificada = searchParams.get('verificada')
    const destaque = searchParams.get('destaque')
    const limite = Math.max(1, Math.min(50, parseInt(searchParams.get('limite') || '20')))
    const pagina = Math.max(1, parseInt(searchParams.get('pagina') || '1'))

    // Filtrar concessionárias baseado nos parâmetros
    let concessionariasFiltradas = loadConcessionarias()

    if (marca && marca !== 'Todas') {
      concessionariasFiltradas = concessionariasFiltradas.filter(c => 
        c.marca.toLowerCase().includes(marca.toLowerCase())
      )
    }

    if (cidade) {
      concessionariasFiltradas = concessionariasFiltradas.filter(c => 
        c.cidade.toLowerCase().includes(cidade.toLowerCase())
      )
    }

    if (provincia) {
      concessionariasFiltradas = concessionariasFiltradas.filter(c => 
        c.provincia.toLowerCase().includes(provincia.toLowerCase())
      )
    }

    if (servico) {
      concessionariasFiltradas = concessionariasFiltradas.filter(c => 
        c.servicos.some(s => s.toLowerCase().includes(servico.toLowerCase()))
      )
    }

    if (busca) {
      concessionariasFiltradas = concessionariasFiltradas.filter(c => 
        c.nome.toLowerCase().includes(busca.toLowerCase()) ||
        c.cidade.toLowerCase().includes(busca.toLowerCase()) ||
        c.provincia.toLowerCase().includes(busca.toLowerCase())
      )
    }

    if (verificada !== null) {
      const flag = verificada === 'true'
      concessionariasFiltradas = concessionariasFiltradas.filter(c => c.verificada === flag)
    }

    if (destaque !== null) {
      const flag = destaque === 'true'
      concessionariasFiltradas = concessionariasFiltradas.filter(c => c.destaque === flag)
    }

    // Paginação
    const total = concessionariasFiltradas.length
    const totalPaginas = Math.ceil(total / limite)
    const inicio = (pagina - 1) * limite
    const fim = inicio + limite
    const concessionariasPaginadas = concessionariasFiltradas.slice(inicio, fim)

    // Estatísticas
    const { marcasDisponiveis, cidadesDisponiveis, provinciasDisponiveis, totalConcessionarias } = computeStats(loadConcessionarias())

    return NextResponse.json({
      concessionarias: concessionariasPaginadas,
      paginacao: {
        paginaAtual: pagina,
        totalPaginas,
        totalItens: total,
        itensPorPagina: limite,
        temProxima: pagina < totalPaginas,
        temAnterior: pagina > 1
      },
      filtros: {
        marca,
        cidade,
        provincia,
        servico,
        busca,
        verificada: verificada ? verificada === 'true' : undefined,
        destaque: destaque ? destaque === 'true' : undefined
      },
      estatisticas: {
        totalConcessionarias,
        marcasDisponiveis,
        cidadesDisponiveis,
        provinciasDisponiveis
      }
    })
  } catch (error) {
    console.error('Erro ao buscar concessionárias:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro interno do servidor',
        data: []
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validação mínima
    const nome = (body.nome || body.company || '').toString().trim()
    const email = (body.email || '').toString().trim()
    const telefone = (body.telefone || body.phone || '').toString().trim()
    const marca = (body.marca || 'Indefinida').toString().trim()
    const location = (body.location || '').toString()
    const [cidadeRaw, provinciaRaw] = location.split(',').map((s: string) => s?.trim()).filter(Boolean)
    const cidade = (body.cidade || cidadeRaw || '').toString()
    const provincia = (body.provincia || provinciaRaw || '').toString()
    const endereco = (body.endereco || '').toString()

    if (!nome || !email || !telefone || !cidade) {
      return NextResponse.json({ success: false, message: 'Campos obrigatórios ausentes' }, { status: 400 })
    }

    const created = addConcessionaria({
      nome,
      email,
      telefone,
      marca,
      cidade,
      provincia,
      endereco,
      servicos: ['Vendas'],
      verificada: false,
      destaque: false
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar concessionária:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro interno do servidor',
        data: null
      },
      { status: 500 }
    )
  }
}