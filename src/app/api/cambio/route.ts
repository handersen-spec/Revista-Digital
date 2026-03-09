import { NextResponse } from 'next/server'

// Interface para taxas de câmbio
interface TaxaCambio {
  moedaOrigem: string
  moedaDestino: string
  taxa: number
  dataAtualizacao: string
  fonte: string
}

interface ConversorRequest {
  valor: number
  de: string
  para: string
}

interface ConversorResponse {
  valorOriginal: number
  valorConvertido: number
  moedaOrigem: string
  moedaDestino: string
  taxa: number
  dataConversao: string
}

// Simulação de integração com API de câmbio externa
async function obterTaxasCambio(): Promise<TaxaCambio[]> {
  try {
    // Exemplo de integração com API real (ex: exchangerate-api.com)
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`, {
      headers: {
        'Authorization': `Bearer ${process.env.EXCHANGE_API_KEY}`
      }
    })

    if (!response.ok) {
      throw new Error('Erro ao obter taxas de câmbio')
    }

    const data = await response.json()
    
    // Converter para nosso formato
    const taxas: TaxaCambio[] = []
    
    // Taxas principais para Angola
    const moedasPrincipais = ['AOA', 'USD', 'EUR', 'BRL', 'ZAR']
    
    for (const moeda of moedasPrincipais) {
      if (data.rates[moeda]) {
        taxas.push({
          moedaOrigem: 'USD',
          moedaDestino: moeda,
          taxa: data.rates[moeda],
          dataAtualizacao: new Date().toISOString(),
          fonte: 'exchangerate-api'
        })
      }
    }

    return taxas

  } catch (error) {
    // Fallback para taxas mockadas se a API externa falhar
    return [
      {
        moedaOrigem: 'USD',
        moedaDestino: 'AOA',
        taxa: 825.50,
        dataAtualizacao: new Date().toISOString(),
        fonte: 'banco_nacional_angola'
      },
      {
        moedaOrigem: 'EUR',
        moedaDestino: 'AOA',
        taxa: 890.25,
        dataAtualizacao: new Date().toISOString(),
        fonte: 'banco_nacional_angola'
      },
      {
        moedaOrigem: 'USD',
        moedaDestino: 'EUR',
        taxa: 0.92,
        dataAtualizacao: new Date().toISOString(),
        fonte: 'banco_central_europeu'
      }
    ]
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const moedaOrigem = searchParams.get('origem')
    const moedaDestino = searchParams.get('destino')

    const taxas = await obterTaxasCambio()

    // Filtrar por moedas específicas se fornecidas
    let taxasFiltradas = taxas
    if (moedaOrigem) {
      taxasFiltradas = taxasFiltradas.filter(t => 
        t.moedaOrigem.toLowerCase() === moedaOrigem.toLowerCase()
      )
    }
    if (moedaDestino) {
      taxasFiltradas = taxasFiltradas.filter(t => 
        t.moedaDestino.toLowerCase() === moedaDestino.toLowerCase()
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        taxas: taxasFiltradas,
        totalTaxas: taxasFiltradas.length,
        ultimaAtualizacao: new Date().toISOString()
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro ao obter taxas de câmbio'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const dados: ConversorRequest = await request.json()

    // Validação
    if (!dados.valor || dados.valor <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Valor deve ser maior que zero'
      }, { status: 400 })
    }

    if (!dados.de || !dados.para) {
      return NextResponse.json({
        success: false,
        error: 'Moedas de origem e destino são obrigatórias'
      }, { status: 400 })
    }

    // Obter taxas atuais
    const taxas = await obterTaxasCambio()

    // Encontrar taxa de conversão
    let taxa = 1
    let taxaEncontrada = false

    // Busca direta
    const taxaDireta = taxas.find(t => 
      t.moedaOrigem.toLowerCase() === dados.de.toLowerCase() && 
      t.moedaDestino.toLowerCase() === dados.para.toLowerCase()
    )

    if (taxaDireta) {
      taxa = taxaDireta.taxa
      taxaEncontrada = true
    } else {
      // Busca inversa
      const taxaInversa = taxas.find(t => 
        t.moedaOrigem.toLowerCase() === dados.para.toLowerCase() && 
        t.moedaDestino.toLowerCase() === dados.de.toLowerCase()
      )

      if (taxaInversa) {
        taxa = 1 / taxaInversa.taxa
        taxaEncontrada = true
      }
    }

    if (!taxaEncontrada) {
      return NextResponse.json({
        success: false,
        error: `Taxa de câmbio não encontrada para ${dados.de} -> ${dados.para}`
      }, { status: 404 })
    }

    const valorConvertido = dados.valor * taxa

    const resultado: ConversorResponse = {
      valorOriginal: dados.valor,
      valorConvertido: Math.round(valorConvertido * 100) / 100,
      moedaOrigem: dados.de.toUpperCase(),
      moedaDestino: dados.para.toUpperCase(),
      taxa: Math.round(taxa * 10000) / 10000,
      dataConversao: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: resultado
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro na conversão de moeda'
    }, { status: 500 })
  }
}