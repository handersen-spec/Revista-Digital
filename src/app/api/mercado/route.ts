import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Tipos para dados de mercado
interface DadosVendas {
  mes: string
  vendas: number
  variacao: number
}

interface MarcaLider {
  marca: string
  participacao: number
  vendas: number
  variacao: number
}

interface Segmento {
  nome: string
  participacao: number
  vendas: number
  variacao: number
}

interface EstatisticasMercado {
  vendasTotais: number
  variacaoMensal: number
  veiculosImportados: number
  financiamentos: number
  veiculos4x4: number
}

interface DadosMercado {
  estatisticas: EstatisticasMercado
  dadosVendas: DadosVendas[]
  marcasLideres: MarcaLider[]
  segmentos: Segmento[]
}

export async function GET(_request: NextRequest) {
  try {
    const dadosMercado: DadosMercado = {
      estatisticas: {
        vendasTotais: 12850,
        variacaoMensal: 3.1,
        veiculosImportados: 86,
        financiamentos: 42,
        veiculos4x4: 37
      },
      dadosVendas: [
        { mes: 'Jan', vendas: 920, variacao: -2.4 },
        { mes: 'Fev', vendas: 870, variacao: -5.4 },
        { mes: 'Mar', vendas: 950, variacao: 9.2 },
        { mes: 'Abr', vendas: 980, variacao: 3.1 },
        { mes: 'Mai', vendas: 1010, variacao: 3.1 },
        { mes: 'Jun', vendas: 1040, variacao: 3.0 },
        { mes: 'Jul', vendas: 1100, variacao: 5.8 },
        { mes: 'Ago', vendas: 1135, variacao: 3.2 },
        { mes: 'Set', vendas: 1150, variacao: 1.3 },
        { mes: 'Out', vendas: 1180, variacao: 2.6 },
        { mes: 'Nov', vendas: 1200, variacao: 1.7 },
        { mes: 'Dez', vendas: 1215, variacao: 1.3 }
      ],
      marcasLideres: [
        { marca: 'Toyota', participacao: 22, vendas: 2830, variacao: 4.2 },
        { marca: 'Haval', participacao: 18, vendas: 2310, variacao: 8.5 },
        { marca: 'GWM', participacao: 15, vendas: 1925, variacao: 7.1 },
        { marca: 'Hyundai', participacao: 12, vendas: 1540, variacao: 3.4 },
        { marca: 'Kia', participacao: 10, vendas: 1285, variacao: 2.1 },
        { marca: 'Outros', participacao: 23, vendas: 2950, variacao: 5.0 }
      ],
      segmentos: [
        { nome: 'SUVs', participacao: 45, vendas: 5780, variacao: 6.9 },
        { nome: 'Sedans', participacao: 20, vendas: 2570, variacao: 2.8 },
        { nome: 'Hatch', participacao: 18, vendas: 2315, variacao: 3.3 },
        { nome: 'Pickups', participacao: 12, vendas: 1540, variacao: 4.1 },
        { nome: 'Comerciais', participacao: 5, vendas: 645, variacao: 1.2 }
      ]
    }

    return NextResponse.json(
      { success: true, data: dadosMercado },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0' } }
    )

  } catch (error) {
    console.error('Erro ao buscar dados de mercado:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}