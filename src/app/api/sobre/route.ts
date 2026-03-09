import { NextRequest, NextResponse } from 'next/server'

// Interfaces para os dados da página sobre
export interface MembroEquipe {
  id: number
  nome: string
  cargo: string
  bio: string
  foto: string
  linkedin: string
  especialidades: string[]
}

export interface Valor {
  titulo: string
  descricao: string
  icone: string
}

export interface Marco {
  ano: string
  evento: string
  descricao: string
}

export interface Estatistica {
  valor: string
  descricao: string
}

export interface DadosSobre {
  equipe: MembroEquipe[]
  valores: Valor[]
  marcos: Marco[]
  estatisticas: Estatistica[]
  historia: {
    titulo: string
    descricao: string[]
  }
  missao: string
  visao: string
  valoresEmpresa: string
}

// Dados reais da Auto Prestige para exibição inicial
const dadosSobreSeed: DadosSobre = {
  equipe: [
    {
      id: 1,
      nome: 'Equipa Auto Prestige',
      cargo: 'Editorial e Produção',
      bio: 'A Auto Prestige é uma revista digital automotiva de Angola, dedicada a trazer notícias, análises, test drives e tendências do mercado.',
      foto: '/assets/images/auto-prestige-logo.svg',
      linkedin: 'https://www.linkedin.com/company/autoprestigeangola/',
      especialidades: ['Jornalismo Automotivo', 'Conteúdo Digital', 'Test Drives']
    },
    {
      id: 2,
      nome: 'Parcerias & Mercado',
      cargo: 'Operações e Relações',
      bio: 'Construímos pontes com marcas, concessionárias e parceiros para entregar informação confiável ao público angolano.',
      foto: '/assets/images/auto-prestige-logo.svg',
      linkedin: 'https://www.linkedin.com/company/autoprestigeangola/',
      especialidades: ['Parcerias', 'Mercado', 'Publicidade']
    }
  ],
  valores: [
    { titulo: 'Transparência', descricao: 'Conteúdos com rigor, sem vieses e baseados em fatos.', icone: 'shield' },
    { titulo: 'Inovação', descricao: 'Formatos e experiências digitais imersivas e acessíveis.', icone: 'sparkles' },
    { titulo: 'Proximidade', descricao: 'Foco no público angolano e nas suas necessidades.', icone: 'users' }
  ],
  marcos: [
    { ano: '2023', evento: 'Lançamento', descricao: 'Início da plataforma digital Auto Prestige.' },
    { ano: '2024', evento: 'Parcerias', descricao: 'Ampliação de parceiros e cobertura de eventos.' },
    { ano: '2025', evento: 'Expansão', descricao: 'Novas editorias e testes aprofundados.' }
  ],
  estatisticas: [
    { valor: '200+', descricao: 'Artigos e notícias publicados' },
    { valor: '50+', descricao: 'Test drives e análises técnicas' },
    { valor: '15+', descricao: 'Parcerias com marcas e concessionárias' }
  ],
  historia: {
    titulo: 'A Nossa História',
    descricao: [
      'A Auto Prestige nasceu com a missão de elevar o jornalismo automotivo em Angola.',
      'Cobrimos lançamentos, tendências do mercado, tecnologias e experiências reais ao volante.'
    ]
  },
  missao: 'Entregar informação automotiva confiável e relevante para Angola.',
  visao: 'Ser a referência em jornalismo automotivo digital no país.',
  valoresEmpresa: 'Integridade, qualidade editorial e proximidade com a comunidade.'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const secao = searchParams.get('secao')

    // Se uma seção específica for solicitada, retornar apenas essa seção
    if (secao) {
      switch (secao) {
        case 'equipe':
          return NextResponse.json({
            success: true,
            data: { equipe: dadosSobreSeed.equipe }
          })
        case 'valores':
          return NextResponse.json({
            success: true,
            data: { valores: dadosSobreSeed.valores }
          })
        case 'marcos':
          return NextResponse.json({
            success: true,
            data: { marcos: dadosSobreSeed.marcos }
          })
        case 'estatisticas':
          return NextResponse.json({
            success: true,
            data: { estatisticas: dadosSobreSeed.estatisticas }
          })
        case 'historia':
          return NextResponse.json({
            success: true,
            data: { historia: dadosSobreSeed.historia }
          })
        default:
          return NextResponse.json({
            success: false,
            message: 'Seção não encontrada'
          }, { status: 404 })
      }
    }

    // Retornar todos os dados da página sobre
    return NextResponse.json({
      success: true,
      data: dadosSobreSeed,
      message: 'Dados da página sobre carregados com sucesso'
    }, { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0' } })

  } catch (error) {
    console.error('Erro na API sobre:', error)
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}

// TODO: Implementar POST para atualizar dados da empresa (admin)
export async function POST(request: NextRequest) {
  try {
    // TODO: Implementar autenticação de admin
    // TODO: Validar dados de entrada
    // TODO: Conectar com banco de dados para salvar alterações
    
    return NextResponse.json({
      success: false,
      message: 'Funcionalidade não implementada'
    }, { status: 501 })
  } catch (error) {
    console.error('Erro ao atualizar dados sobre:', error)
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 })
  }
}
