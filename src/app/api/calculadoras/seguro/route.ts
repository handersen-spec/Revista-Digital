import { NextRequest, NextResponse } from 'next/server'

// Interface para resultado do cálculo de seguro
interface ResultadoSeguro {
  valorCarro: number
  idadeCondutor: number
  experiencia: number
  tipoCobertura: string
  localidade: string
  premioAnual: number
  premioMensal: number
  franquia: number
  coberturas: {
    nome: string
    incluida: boolean
    valor?: number
  }[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação dos parâmetros obrigatórios
    const { valorCarro, idadeCondutor, experiencia, tipoCobertura, localidade } = body
    
    if (!valorCarro || !idadeCondutor || !experiencia || !tipoCobertura || !localidade) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: valorCarro, idadeCondutor, experiencia, tipoCobertura, localidade' },
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
    
    if (idadeCondutor < 18 || idadeCondutor > 80) {
      return NextResponse.json(
        { error: 'Idade do condutor deve estar entre 18 e 80 anos' },
        { status: 400 }
      )
    }
    
    if (experiencia < 0 || experiencia > 50) {
      return NextResponse.json(
        { error: 'Experiência deve estar entre 0 e 50 anos' },
        { status: 400 }
      )
    }
    
    const tiposCobertura = ['Responsabilidade Civil', 'Terceiros Completo', 'Todos os Riscos']
    if (!tiposCobertura.includes(tipoCobertura)) {
      return NextResponse.json(
        { error: 'Tipo de cobertura inválido' },
        { status: 400 }
      )
    }
    
    const localidadesValidas = ['Luanda', 'Benguela', 'Huambo', 'Lobito', 'Outras']
    if (!localidadesValidas.includes(localidade)) {
      return NextResponse.json(
        { error: 'Localidade inválida' },
        { status: 400 }
      )
    }
    
    // Fatores de cálculo
    let taxaBase = 0.03 // 3% do valor do carro como base
    
    // Fator idade
    let fatorIdade = 1.0
    if (idadeCondutor < 25) fatorIdade = 1.5
    else if (idadeCondutor < 30) fatorIdade = 1.2
    else if (idadeCondutor > 65) fatorIdade = 1.3
    
    // Fator experiência
    let fatorExperiencia = 1.0
    if (experiencia < 2) fatorExperiencia = 1.4
    else if (experiencia < 5) fatorExperiencia = 1.2
    else if (experiencia > 20) fatorExperiencia = 0.9
    
    // Fator localidade
    let fatorLocalidade = 1.0
    switch (localidade) {
      case 'Luanda':
        fatorLocalidade = 1.3
        break
      case 'Benguela':
      case 'Lobito':
        fatorLocalidade = 1.1
        break
      case 'Huambo':
        fatorLocalidade = 1.0
        break
      default:
        fatorLocalidade = 0.9
    }
    
    // Fator tipo de cobertura
    let fatorCobertura = 1.0
    let franquia = 0
    
    switch (tipoCobertura) {
      case 'Responsabilidade Civil':
        fatorCobertura = 0.4
        taxaBase = 0.015
        franquia = 0
        break
      case 'Terceiros Completo':
        fatorCobertura = 0.7
        taxaBase = 0.025
        franquia = valorCarro * 0.05 // 5% do valor
        break
      case 'Todos os Riscos':
        fatorCobertura = 1.0
        taxaBase = 0.04
        franquia = valorCarro * 0.03 // 3% do valor
        break
    }
    
    // Cálculo do prémio
    const premioAnual = Math.round(valorCarro * taxaBase * fatorIdade * fatorExperiencia * fatorLocalidade * fatorCobertura)
    const premioMensal = Math.round(premioAnual / 12)
    
    // Definir coberturas incluídas
    const coberturas = [
      {
        nome: 'Responsabilidade Civil',
        incluida: true,
        valor: 50000000 // 50M AOA
      },
      {
        nome: 'Danos Próprios',
        incluida: tipoCobertura !== 'Responsabilidade Civil',
        valor: tipoCobertura !== 'Responsabilidade Civil' ? valorCarro : undefined
      },
      {
        nome: 'Roubo e Furto',
        incluida: tipoCobertura === 'Todos os Riscos',
        valor: tipoCobertura === 'Todos os Riscos' ? valorCarro : undefined
      },
      {
        nome: 'Incêndio',
        incluida: tipoCobertura !== 'Responsabilidade Civil',
        valor: tipoCobertura !== 'Responsabilidade Civil' ? valorCarro : undefined
      },
      {
        nome: 'Fenómenos Naturais',
        incluida: tipoCobertura === 'Todos os Riscos',
        valor: tipoCobertura === 'Todos os Riscos' ? valorCarro : undefined
      },
      {
        nome: 'Vidros',
        incluida: tipoCobertura === 'Todos os Riscos',
        valor: tipoCobertura === 'Todos os Riscos' ? 500000 : undefined
      },
      {
        nome: 'Assistência em Viagem',
        incluida: tipoCobertura !== 'Responsabilidade Civil'
      }
    ]
    
    const resultado: ResultadoSeguro = {
      valorCarro,
      idadeCondutor,
      experiencia,
      tipoCobertura,
      localidade,
      premioAnual,
      premioMensal,
      franquia: Math.round(franquia),
      coberturas
    }
    
    // Dicas baseadas no resultado
    const dicas = []
    
    if (idadeCondutor < 25) {
      dicas.push('Condutores jovens pagam prémios mais altos. O valor diminui com a idade')
    }
    
    if (experiencia < 5) {
      dicas.push('Mais experiência de condução resulta em prémios menores')
    }
    
    if (localidade === 'Luanda') {
      dicas.push('Luanda tem prémios mais altos devido ao maior risco de sinistros')
    }
    
    if (tipoCobertura === 'Responsabilidade Civil') {
      dicas.push('Considere uma cobertura mais abrangente para melhor proteção')
    }
    
    if (premioAnual > valorCarro * 0.08) {
      dicas.push('O prémio está alto. Compare preços entre seguradoras')
    }
    
    // Comparação entre tipos de cobertura
    const comparacao = tiposCobertura.map(tipo => {
      let fatorTipo = 1.0
      let taxaTipo = 0.03
      let franquiaTipo = 0
      
      switch (tipo) {
        case 'Responsabilidade Civil':
          fatorTipo = 0.4
          taxaTipo = 0.015
          franquiaTipo = 0
          break
        case 'Terceiros Completo':
          fatorTipo = 0.7
          taxaTipo = 0.025
          franquiaTipo = valorCarro * 0.05
          break
        case 'Todos os Riscos':
          fatorTipo = 1.0
          taxaTipo = 0.04
          franquiaTipo = valorCarro * 0.03
          break
      }
      
      const premioTipo = Math.round(valorCarro * taxaTipo * fatorIdade * fatorExperiencia * fatorLocalidade * fatorTipo)
      
      return {
        tipo,
        premioAnual: premioTipo,
        premioMensal: Math.round(premioTipo / 12),
        franquia: Math.round(franquiaTipo),
        economia: premioAnual - premioTipo
      }
    })
    
    return NextResponse.json({
      resultado,
      dicas,
      comparacao,
      fatores: {
        taxaBase: `${(taxaBase * 100).toFixed(1)}%`,
        fatorIdade: fatorIdade.toFixed(1),
        fatorExperiencia: fatorExperiencia.toFixed(1),
        fatorLocalidade: fatorLocalidade.toFixed(1),
        fatorCobertura: fatorCobertura.toFixed(1)
      }
    })
    
  } catch (error) {
    console.error('Erro no cálculo de seguro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}