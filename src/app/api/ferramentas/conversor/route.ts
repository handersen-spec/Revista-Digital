import { NextRequest, NextResponse } from 'next/server'

// Interface para conversão de unidades
interface ConversaoUnidade {
  categoria: string
  unidadeOrigem: string
  unidadeDestino: string
  valor: number
  resultado: number
  formula: string
}

// Definições de conversões disponíveis
const conversoes = {
  potencia: {
    nome: 'Potência',
    unidades: {
      cv: { nome: 'Cavalos-vapor (cv)', fator: 1 },
      hp: { nome: 'Horsepower (hp)', fator: 1.0139 },
      kw: { nome: 'Quilowatts (kW)', fator: 0.7355 },
      ps: { nome: 'Pferdestärke (PS)', fator: 1.0139 }
    }
  },
  torque: {
    nome: 'Torque',
    unidades: {
      'kgf.m': { nome: 'Quilograma-força metro (kgf.m)', fator: 1 },
      'nm': { nome: 'Newton metro (N.m)', fator: 9.8067 },
      'lb.ft': { nome: 'Libra-pé (lb.ft)', fator: 7.233 }
    }
  },
  velocidade: {
    nome: 'Velocidade',
    unidades: {
      'km/h': { nome: 'Quilômetros por hora (km/h)', fator: 1 },
      'mph': { nome: 'Milhas por hora (mph)', fator: 0.6214 },
      'm/s': { nome: 'Metros por segundo (m/s)', fator: 0.2778 }
    }
  },
  distancia: {
    nome: 'Distância',
    unidades: {
      'km': { nome: 'Quilômetros (km)', fator: 1 },
      'mi': { nome: 'Milhas (mi)', fator: 0.6214 },
      'm': { nome: 'Metros (m)', fator: 1000 },
      'ft': { nome: 'Pés (ft)', fator: 3280.84 }
    }
  },
  volume: {
    nome: 'Volume',
    unidades: {
      'l': { nome: 'Litros (l)', fator: 1 },
      'gal': { nome: 'Galões (gal)', fator: 0.2642 },
      'ml': { nome: 'Mililitros (ml)', fator: 1000 },
      'qt': { nome: 'Quartos (qt)', fator: 1.0567 }
    }
  },
  consumo: {
    nome: 'Consumo de Combustível',
    unidades: {
      'km/l': { nome: 'Quilômetros por litro (km/l)', fator: 1 },
      'mpg': { nome: 'Milhas por galão (mpg)', fator: 2.352 },
      'l/100km': { nome: 'Litros por 100km (l/100km)', fator: 100, inverso: true }
    }
  },
  pressao: {
    nome: 'Pressão',
    unidades: {
      'bar': { nome: 'Bar', fator: 1 },
      'psi': { nome: 'PSI (libras por polegada²)', fator: 14.5038 },
      'kpa': { nome: 'Quilopascal (kPa)', fator: 100 },
      'atm': { nome: 'Atmosfera (atm)', fator: 0.9869 }
    }
  },
  peso: {
    nome: 'Peso',
    unidades: {
      'kg': { nome: 'Quilogramas (kg)', fator: 1 },
      'lb': { nome: 'Libras (lb)', fator: 2.2046 },
      't': { nome: 'Toneladas (t)', fator: 0.001 },
      'g': { nome: 'Gramas (g)', fator: 1000 }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação dos parâmetros obrigatórios
    const { categoria, unidadeOrigem, unidadeDestino, valor } = body
    
    if (!categoria || !unidadeOrigem || !unidadeDestino || valor === undefined) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: categoria, unidadeOrigem, unidadeDestino, valor' },
        { status: 400 }
      )
    }
    
    // Validar categoria
    if (!conversoes[categoria as keyof typeof conversoes]) {
      return NextResponse.json(
        { error: `Categoria '${categoria}' não suportada` },
        { status: 400 }
      )
    }
    
    const categoriaConversao = conversoes[categoria as keyof typeof conversoes]
    
    // Validar unidades
    if (!categoriaConversao.unidades[unidadeOrigem as keyof typeof categoriaConversao.unidades]) {
      return NextResponse.json(
        { error: `Unidade de origem '${unidadeOrigem}' não suportada para categoria '${categoria}'` },
        { status: 400 }
      )
    }
    
    if (!categoriaConversao.unidades[unidadeDestino as keyof typeof categoriaConversao.unidades]) {
      return NextResponse.json(
        { error: `Unidade de destino '${unidadeDestino}' não suportada para categoria '${categoria}'` },
        { status: 400 }
      )
    }
    
    // Validar valor
    if (typeof valor !== 'number' || valor < 0) {
      return NextResponse.json(
        { error: 'Valor deve ser um número positivo' },
        { status: 400 }
      )
    }
    
    const unidadeOrig = categoriaConversao.unidades[unidadeOrigem as keyof typeof categoriaConversao.unidades] as any
    const unidadeDest = categoriaConversao.unidades[unidadeDestino as keyof typeof categoriaConversao.unidades] as any
    
    let resultado: number
    let formula: string
    
    // Cálculo da conversão
    if (categoria === 'consumo' && unidadeOrigem === 'l/100km') {
      // Conversão especial para l/100km (inverso)
      const kmPorLitro = 100 / valor
      resultado = kmPorLitro * unidadeDest.fator
      formula = `(100 / ${valor}) × ${unidadeDest.fator}`
    } else if (categoria === 'consumo' && unidadeDestino === 'l/100km') {
      // Conversão especial para l/100km (inverso)
      const valorEmKmL = valor / unidadeOrig.fator
      resultado = 100 / valorEmKmL
      formula = `100 / (${valor} / ${unidadeOrig.fator})`
    } else {
      // Conversão padrão
      const valorBase = valor / unidadeOrig.fator
      resultado = valorBase * unidadeDest.fator
      formula = `(${valor} / ${unidadeOrig.fator}) × ${unidadeDest.fator}`
    }
    
    // Arredondar resultado para 4 casas decimais
    resultado = Math.round(resultado * 10000) / 10000
    
    const conversao: ConversaoUnidade = {
      categoria,
      unidadeOrigem,
      unidadeDestino,
      valor,
      resultado,
      formula
    }
    
    // Conversões relacionadas (outras unidades da mesma categoria)
    const conversoesRelacionadas = Object.keys(categoriaConversao.unidades)
      .filter(unidade => unidade !== unidadeOrigem && unidade !== unidadeDestino)
      .slice(0, 3)
      .map(unidade => {
        const unidadeRel = categoriaConversao.unidades[unidade as keyof typeof categoriaConversao.unidades] as any
        let resultadoRel: number
        
        if (categoria === 'consumo' && unidadeOrigem === 'l/100km') {
          const kmPorLitro = 100 / valor
          resultadoRel = kmPorLitro * unidadeRel.fator
        } else if (categoria === 'consumo' && unidade === 'l/100km') {
          const valorEmKmL = valor / unidadeOrig.fator
          resultadoRel = 100 / valorEmKmL
        } else {
          const valorBase = valor / unidadeOrig.fator
          resultadoRel = valorBase * unidadeRel.fator
        }
        
        return {
          unidade,
          nome: unidadeRel.nome,
          resultado: Math.round(resultadoRel * 10000) / 10000
        }
      })
    
    // Exemplos práticos baseados na categoria
    const exemplosPraticos = gerarExemplosPraticos(categoria, conversao)
    
    return NextResponse.json({
      conversao,
      conversoesRelacionadas,
      exemplosPraticos,
      informacoes: {
        categoriaCompleta: categoriaConversao.nome,
        unidadeOrigemCompleta: unidadeOrig.nome,
        unidadeDestinoCompleta: unidadeDest.nome,
        precisao: 4,
        dataConversao: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Erro na conversão de unidades:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')
    
    if (categoria) {
      // Retornar unidades de uma categoria específica
      if (!conversoes[categoria as keyof typeof conversoes]) {
        return NextResponse.json(
          { error: `Categoria '${categoria}' não encontrada` },
          { status: 404 }
        )
      }
      
      const categoriaInfo = conversoes[categoria as keyof typeof conversoes]
      
      return NextResponse.json({
        categoria,
        nome: categoriaInfo.nome,
        unidades: Object.entries(categoriaInfo.unidades).map(([codigo, info]) => ({
          codigo,
          nome: info.nome,
          fator: info.fator,
          inverso: 'inverso' in info ? info.inverso : false
        }))
      })
    }
    
    // Retornar todas as categorias disponíveis
    const categoriasDisponiveis = Object.entries(conversoes).map(([codigo, info]) => ({
      codigo,
      nome: info.nome,
      totalUnidades: Object.keys(info.unidades).length,
      unidades: Object.keys(info.unidades)
    }))
    
    return NextResponse.json({
      categorias: categoriasDisponiveis,
      totalCategorias: categoriasDisponiveis.length,
      totalUnidades: categoriasDisponiveis.reduce((acc, cat) => acc + cat.totalUnidades, 0)
    })
    
  } catch (error) {
    console.error('Erro ao buscar conversões:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

function gerarExemplosPraticos(categoria: string, conversao: ConversaoUnidade) {
  const exemplos = []
  
  switch (categoria) {
    case 'potencia':
      exemplos.push(
        `Um motor de ${conversao.valor} ${conversao.unidadeOrigem} equivale a ${conversao.resultado} ${conversao.unidadeDestino}`,
        `Para comparação: um Corolla tem cerca de 144 cv`,
        `Motores esportivos podem ter mais de 500 cv`
      )
      break
      
    case 'torque':
      exemplos.push(
        `${conversao.valor} ${conversao.unidadeOrigem} de torque = ${conversao.resultado} ${conversao.unidadeDestino}`,
        `Maior torque significa melhor aceleração inicial`,
        `Motores diesel geralmente têm mais torque que gasolina`
      )
      break
      
    case 'velocidade':
      exemplos.push(
        `${conversao.valor} ${conversao.unidadeOrigem} = ${conversao.resultado} ${conversao.unidadeDestino}`,
        `Limite urbano em Angola: 60 km/h`,
        `Limite em autoestradas: 120 km/h`
      )
      break
      
    case 'consumo':
      exemplos.push(
        `${conversao.valor} ${conversao.unidadeOrigem} = ${conversao.resultado} ${conversao.unidadeDestino}`,
        `Consumo econômico: acima de 12 km/l`,
        `SUVs grandes: geralmente 6-8 km/l`
      )
      break
      
    case 'pressao':
      exemplos.push(
        `${conversao.valor} ${conversao.unidadeOrigem} = ${conversao.resultado} ${conversao.unidadeDestino}`,
        `Pressão recomendada pneus: 30-35 PSI`,
        `Sempre verificar pressão com pneus frios`
      )
      break
      
    default:
      exemplos.push(
        `${conversao.valor} ${conversao.unidadeOrigem} = ${conversao.resultado} ${conversao.unidadeDestino}`,
        `Conversão realizada com precisão de 4 casas decimais`
      )
  }
  
  return exemplos
}