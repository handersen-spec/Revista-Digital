import { NextRequest, NextResponse } from 'next/server'

// Interface para resultado do cálculo de consumo
interface ResultadoConsumo {
  kmMensais: number
  consumoMedio: number
  precoCombustivel: number
  tipoCombustivel: string
  litrosMensais: number
  custoMensal: number
  custoAnual: number
  custoPorKm: number
  projecoes: {
    periodo: string
    km: number
    litros: number
    custo: number
  }[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação dos parâmetros obrigatórios
    const { kmMensais, consumoMedio, precoCombustivel, tipoCombustivel } = body
    
    if (!kmMensais || !consumoMedio || !precoCombustivel || !tipoCombustivel) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: kmMensais, consumoMedio, precoCombustivel, tipoCombustivel' },
        { status: 400 }
      )
    }
    
    // Validações de valores
    if (kmMensais < 100 || kmMensais > 10000) {
      return NextResponse.json(
        { error: 'Quilómetros mensais devem estar entre 100 e 10.000' },
        { status: 400 }
      )
    }
    
    if (consumoMedio < 5 || consumoMedio > 25) {
      return NextResponse.json(
        { error: 'Consumo médio deve estar entre 5 e 25 L/100km' },
        { status: 400 }
      )
    }
    
    if (precoCombustivel < 50 || precoCombustivel > 500) {
      return NextResponse.json(
        { error: 'Preço do combustível deve estar entre 50 e 500 AOA/L' },
        { status: 400 }
      )
    }
    
    const tiposValidos = ['Gasolina', 'Gasóleo', 'GPL']
    if (!tiposValidos.includes(tipoCombustivel)) {
      return NextResponse.json(
        { error: 'Tipo de combustível deve ser: Gasolina, Gasóleo ou GPL' },
        { status: 400 }
      )
    }
    
    // Cálculos
    const litrosMensais = (kmMensais * consumoMedio) / 100
    const custoMensal = litrosMensais * precoCombustivel
    const custoAnual = custoMensal * 12
    const custoPorKm = custoMensal / kmMensais
    
    // Projeções para diferentes períodos
    const projecoes = [
      {
        periodo: '1 mês',
        km: kmMensais,
        litros: Math.round(litrosMensais * 10) / 10,
        custo: Math.round(custoMensal)
      },
      {
        periodo: '3 meses',
        km: kmMensais * 3,
        litros: Math.round(litrosMensais * 3 * 10) / 10,
        custo: Math.round(custoMensal * 3)
      },
      {
        periodo: '6 meses',
        km: kmMensais * 6,
        litros: Math.round(litrosMensais * 6 * 10) / 10,
        custo: Math.round(custoMensal * 6)
      },
      {
        periodo: '1 ano',
        km: kmMensais * 12,
        litros: Math.round(litrosMensais * 12 * 10) / 10,
        custo: Math.round(custoAnual)
      }
    ]
    
    const resultado: ResultadoConsumo = {
      kmMensais,
      consumoMedio,
      precoCombustivel,
      tipoCombustivel,
      litrosMensais: Math.round(litrosMensais * 10) / 10,
      custoMensal: Math.round(custoMensal),
      custoAnual: Math.round(custoAnual),
      custoPorKm: Math.round(custoPorKm * 100) / 100,
      projecoes
    }
    
    // Dicas baseadas no resultado
    const dicas = []
    
    if (consumoMedio > 12) {
      dicas.push('O consumo está acima da média. Considere verificar a manutenção do veículo')
    }
    
    if (consumoMedio < 7) {
      dicas.push('Excelente consumo! O seu veículo é muito eficiente')
    }
    
    if (kmMensais > 2000) {
      dicas.push('Alto quilometragem mensal. Considere um veículo mais económico')
    }
    
    if (tipoCombustivel === 'Gasóleo' && consumoMedio > 8) {
      dicas.push('Para um veículo a gasóleo, o consumo pode ser otimizado')
    }
    
    if (tipoCombustivel === 'GPL') {
      dicas.push('GPL é uma opção económica. Considere a conversão se ainda não tem')
    }
    
    // Comparação com outros combustíveis
    const precosMedios = {
      'Gasolina': 180,
      'Gasóleo': 160,
      'GPL': 120
    }
    
    const comparacao = Object.entries(precosMedios).map(([tipo, preco]) => {
      const custoComparacao = (kmMensais * consumoMedio / 100) * preco
      const economia = custoMensal - custoComparacao
      
      return {
        tipo,
        custoMensal: Math.round(custoComparacao),
        economia: Math.round(economia),
        economiaAnual: Math.round(economia * 12)
      }
    })
    
    return NextResponse.json({
      resultado,
      dicas,
      comparacao,
      estatisticas: {
        percentualRendimento: Math.round((100 / consumoMedio) * 10) / 10, // km/L
        custoPercentualSalario: Math.round((custoMensal / 150000) * 100), // Assumindo salário médio
        litrosPor100km: consumoMedio
      }
    })
    
  } catch (error) {
    console.error('Erro no cálculo de consumo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}