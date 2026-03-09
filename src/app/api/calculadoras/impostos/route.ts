import { NextRequest, NextResponse } from 'next/server'

// Interface para resultado do cálculo de impostos
interface ResultadoImpostos {
  valorCIF: number
  cilindrada: number
  idadeCarro: number
  tipoCombustivel: string
  direitosAduaneiros: number
  iva: number
  emolumentos: number
  seloAduaneiro: number
  totalImpostos: number
  valorFinal: number
  detalhamento: {
    item: string
    base: number
    taxa: string
    valor: number
  }[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação dos parâmetros obrigatórios
    const { valorCIF, cilindrada, idadeCarro, tipoCombustivel } = body
    
    if (!valorCIF || !cilindrada || idadeCarro === undefined || !tipoCombustivel) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: valorCIF, cilindrada, idadeCarro, tipoCombustivel' },
        { status: 400 }
      )
    }
    
    // Validações de valores
    if (valorCIF < 500000 || valorCIF > 100000000) {
      return NextResponse.json(
        { error: 'Valor CIF deve estar entre 500.000 AOA e 100.000.000 AOA' },
        { status: 400 }
      )
    }
    
    if (cilindrada < 800 || cilindrada > 8000) {
      return NextResponse.json(
        { error: 'Cilindrada deve estar entre 800cc e 8000cc' },
        { status: 400 }
      )
    }
    
    if (idadeCarro < 0 || idadeCarro > 10) {
      return NextResponse.json(
        { error: 'Idade do carro deve estar entre 0 e 10 anos' },
        { status: 400 }
      )
    }
    
    const tiposValidos = ['Gasolina', 'Gasóleo', 'Híbrido', 'Elétrico']
    if (!tiposValidos.includes(tipoCombustivel)) {
      return NextResponse.json(
        { error: 'Tipo de combustível deve ser: Gasolina, Gasóleo, Híbrido ou Elétrico' },
        { status: 400 }
      )
    }
    
    // Cálculo dos Direitos Aduaneiros
    let taxaDireitos = 0.30 // 30% base
    
    // Ajuste por idade do carro
    if (idadeCarro > 5) {
      taxaDireitos = 0.50 // 50% para carros mais antigos
    } else if (idadeCarro > 3) {
      taxaDireitos = 0.40 // 40% para carros de 3-5 anos
    }
    
    // Ajuste por cilindrada
    if (cilindrada > 3000) {
      taxaDireitos += 0.10 // +10% para carros de alta cilindrada
    } else if (cilindrada < 1200) {
      taxaDireitos -= 0.05 // -5% para carros pequenos
    }
    
    // Ajuste por tipo de combustível
    switch (tipoCombustivel) {
      case 'Elétrico':
        taxaDireitos = 0.05 // 5% para elétricos (incentivo)
        break
      case 'Híbrido':
        taxaDireitos *= 0.7 // 30% de desconto
        break
      case 'Gasóleo':
        taxaDireitos += 0.05 // +5% para gasóleo
        break
    }
    
    const direitosAduaneiros = Math.round(valorCIF * taxaDireitos)
    
    // Base para IVA (CIF + Direitos)
    const baseIVA = valorCIF + direitosAduaneiros
    const iva = Math.round(baseIVA * 0.14) // 14% IVA
    
    // Emolumentos (taxa fixa + percentual)
    let emolumentos = 50000 // Taxa fixa base
    emolumentos += Math.round(valorCIF * 0.02) // 2% do CIF
    
    // Ajuste de emolumentos por cilindrada
    if (cilindrada > 2500) {
      emolumentos += 100000 // Taxa adicional para carros grandes
    }
    
    // Selo Aduaneiro
    const seloAduaneiro = Math.round(valorCIF * 0.001) // 0.1% do CIF
    
    // Total
    const totalImpostos = direitosAduaneiros + iva + emolumentos + seloAduaneiro
    const valorFinal = valorCIF + totalImpostos
    
    // Detalhamento dos cálculos
    const detalhamento = [
      {
        item: 'Valor CIF',
        base: valorCIF,
        taxa: '-',
        valor: valorCIF
      },
      {
        item: 'Direitos Aduaneiros',
        base: valorCIF,
        taxa: `${(taxaDireitos * 100).toFixed(1)}%`,
        valor: direitosAduaneiros
      },
      {
        item: 'IVA',
        base: baseIVA,
        taxa: '14%',
        valor: iva
      },
      {
        item: 'Emolumentos',
        base: valorCIF,
        taxa: 'Variável',
        valor: emolumentos
      },
      {
        item: 'Selo Aduaneiro',
        base: valorCIF,
        taxa: '0.1%',
        valor: seloAduaneiro
      }
    ]
    
    const resultado: ResultadoImpostos = {
      valorCIF,
      cilindrada,
      idadeCarro,
      tipoCombustivel,
      direitosAduaneiros,
      iva,
      emolumentos,
      seloAduaneiro,
      totalImpostos,
      valorFinal,
      detalhamento
    }
    
    // Dicas baseadas no resultado
    const dicas = []
    
    if (idadeCarro > 5) {
      dicas.push('Carros com mais de 5 anos têm taxas aduaneiras mais altas')
    }
    
    if (cilindrada > 3000) {
      dicas.push('Carros de alta cilindrada pagam taxas adicionais')
    }
    
    if (tipoCombustivel === 'Elétrico') {
      dicas.push('Veículos elétricos têm incentivos fiscais significativos')
    }
    
    if (tipoCombustivel === 'Híbrido') {
      dicas.push('Veículos híbridos têm 30% de desconto nos direitos aduaneiros')
    }
    
    if (totalImpostos > valorCIF * 0.8) {
      dicas.push('Os impostos representam mais de 80% do valor CIF. Considere outras opções')
    }
    
    if (totalImpostos < valorCIF * 0.3) {
      dicas.push('Impostos relativamente baixos para este tipo de veículo')
    }
    
    // Comparação por tipo de combustível
    const comparacao = tiposValidos.map(tipo => {
      let taxaComparacao = taxaDireitos
      
      switch (tipo) {
        case 'Elétrico':
          taxaComparacao = 0.05
          break
        case 'Híbrido':
          taxaComparacao = taxaDireitos * 0.7
          break
        case 'Gasóleo':
          taxaComparacao = taxaDireitos + 0.05
          break
        case 'Gasolina':
          taxaComparacao = taxaDireitos
          break
      }
      
      const direitosComparacao = Math.round(valorCIF * taxaComparacao)
      const baseIVAComparacao = valorCIF + direitosComparacao
      const ivaComparacao = Math.round(baseIVAComparacao * 0.14)
      const totalComparacao = direitosComparacao + ivaComparacao + emolumentos + seloAduaneiro
      
      return {
        tipo,
        direitosAduaneiros: direitosComparacao,
        totalImpostos: totalComparacao,
        valorFinal: valorCIF + totalComparacao,
        economia: totalImpostos - totalComparacao
      }
    })
    
    return NextResponse.json({
      resultado,
      dicas,
      comparacao,
      resumo: {
        percentualImpostos: Math.round((totalImpostos / valorCIF) * 100),
        maiorImposto: detalhamento.slice(1).reduce((max, item) => 
          item.valor > max.valor ? item : max
        ).item,
        custoEfetivo: Math.round(((valorFinal / valorCIF) - 1) * 100)
      }
    })
    
  } catch (error) {
    console.error('Erro no cálculo de impostos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}