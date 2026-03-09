import { NextRequest, NextResponse } from 'next/server'

// Interface para resultado do cálculo de financiamento
interface ResultadoFinanciamento {
  valorCarro: number
  entrada: number
  valorFinanciado: number
  prazo: number
  taxaJuros: number
  prestacaoMensal: number
  totalPago: number
  totalJuros: number
  tabela: {
    mes: number
    prestacao: number
    juros: number
    amortizacao: number
    saldoDevedor: number
  }[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação dos parâmetros obrigatórios
    const { valorCarro, entrada, prazo, taxaJuros } = body
    
    if (!valorCarro || !entrada || !prazo || !taxaJuros) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: valorCarro, entrada, prazo, taxaJuros' },
        { status: 400 }
      )
    }
    
    // Validações de valores
    if (valorCarro < 1000000 || valorCarro > 50000000) {
      return NextResponse.json(
        { error: 'Valor do carro deve estar entre 1.000.000 AOA e 50.000.000 AOA' },
        { status: 400 }
      )
    }
    
    if (entrada < 0 || entrada >= valorCarro) {
      return NextResponse.json(
        { error: 'Entrada deve ser menor que o valor do carro' },
        { status: 400 }
      )
    }
    
    if (![12, 24, 36, 48, 60, 72].includes(parseInt(prazo))) {
      return NextResponse.json(
        { error: 'Prazo deve ser 12, 24, 36, 48, 60 ou 72 meses' },
        { status: 400 }
      )
    }
    
    if (taxaJuros < 5 || taxaJuros > 30) {
      return NextResponse.json(
        { error: 'Taxa de juros deve estar entre 5% e 30%' },
        { status: 400 }
      )
    }
    
    // Cálculos
    const valorFinanciado = valorCarro - entrada
    const taxaMensal = taxaJuros / 100 / 12
    const numeroPrestacoes = parseInt(prazo)
    
    // Fórmula PMT: PMT = PV * [r(1+r)^n] / [(1+r)^n - 1]
    const prestacaoMensal = valorFinanciado * 
      (taxaMensal * Math.pow(1 + taxaMensal, numeroPrestacoes)) / 
      (Math.pow(1 + taxaMensal, numeroPrestacoes) - 1)
    
    const totalPago = prestacaoMensal * numeroPrestacoes + entrada
    const totalJuros = totalPago - valorCarro
    
    // Gerar tabela de amortização
    const tabela = []
    let saldoDevedor = valorFinanciado
    
    for (let mes = 1; mes <= numeroPrestacoes; mes++) {
      const juros = saldoDevedor * taxaMensal
      const amortizacao = prestacaoMensal - juros
      saldoDevedor = saldoDevedor - amortizacao
      
      tabela.push({
        mes,
        prestacao: Math.round(prestacaoMensal),
        juros: Math.round(juros),
        amortizacao: Math.round(amortizacao),
        saldoDevedor: Math.round(Math.max(0, saldoDevedor))
      })
    }
    
    const resultado: ResultadoFinanciamento = {
      valorCarro,
      entrada,
      valorFinanciado,
      prazo: numeroPrestacoes,
      taxaJuros,
      prestacaoMensal: Math.round(prestacaoMensal),
      totalPago: Math.round(totalPago),
      totalJuros: Math.round(totalJuros),
      tabela
    }
    
    // Dicas baseadas no resultado
    const dicas = []
    
    if (entrada < valorCarro * 0.2) {
      dicas.push('Considere aumentar a entrada para reduzir o valor das prestações')
    }
    
    if (prestacaoMensal > valorCarro * 0.15 / 12) {
      dicas.push('A prestação representa mais de 15% do valor do carro por mês. Considere um prazo maior')
    }
    
    if (totalJuros > valorCarro * 0.5) {
      dicas.push('Os juros representam mais de 50% do valor do carro. Considere negociar uma taxa menor')
    }
    
    if (numeroPrestacoes >= 60) {
      dicas.push('Prazos longos resultam em mais juros pagos. Considere um prazo menor se possível')
    }
    
    return NextResponse.json({
      resultado,
      dicas,
      resumo: {
        percentualEntrada: Math.round((entrada / valorCarro) * 100),
        percentualJuros: Math.round((totalJuros / valorCarro) * 100),
        custoEfetivo: Math.round(((totalPago / valorCarro) - 1) * 100)
      }
    })
    
  } catch (error) {
    console.error('Erro no cálculo de financiamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}