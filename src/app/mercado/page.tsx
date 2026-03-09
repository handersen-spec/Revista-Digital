'use client'

import Link from 'next/link'
import Newsletter from '@/components/Newsletter'
import { useMercado } from '@/hooks/useMercado'
import { useNoticiasPorCategoria, type Noticia } from '@/hooks/useNoticias'

export default function MercadoPage() {
  const { dadosMercado, loading: mercadoLoading, error: mercadoError } = useMercado()
  const { noticias, loading: noticiasLoading } = useNoticiasPorCategoria('mercado', 3)

  // Paleta de cores por categoria para fallback de imagem
  const getCategoriaColor = (categoria: string) => {
    const cores: Record<string, string> = {
      'Test Drive': 'from-blue-500 to-blue-700',
      'Análise': 'from-green-500 to-green-700',
      'Mercado': 'from-purple-500 to-purple-700',
      'Supercar': 'from-red-500 to-red-700',
      'Economia': 'from-yellow-500 to-yellow-700'
    }
    return cores[categoria] || 'from-gray-500 to-gray-700'
  }
  const getCategoriaTextColor = (categoria: string) => {
    const cores: Record<string, string> = {
      'Test Drive': 'text-blue-700',
      'Análise': 'text-green-700',
      'Mercado': 'text-purple-700',
      'Supercar': 'text-red-700',
      'Economia': 'text-yellow-700'
    }
    return cores[categoria] || 'text-gray-700'
  }

  // Estados de loading
  if (mercadoLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados do mercado...</p>
          </div>
        </div>
      </div>
    )
  }

  // Estado de erro
  if (mercadoError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Erro ao carregar dados</p>
              <p>{mercadoError}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Se não há dados
  if (!dadosMercado) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-600">Nenhum dado de mercado disponível</p>
          </div>
        </div>
      </div>
    )
  }

  const { estatisticas, dadosVendas, marcasLideres, segmentos } = dadosMercado

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Mercado Automobilístico Angolano
            </h1>
            <p className="text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto">
              Análises completas do mercado automobilístico angolano. Tendências, estatísticas e insights para entender o setor automotivo em Angola.
            </p>
          </div>
        </div>
      </section>

      {/* Resumo do Mercado */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Resumo do Mercado - Junho 2024</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vendas Totais</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.vendasTotais.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+{estatisticas.variacaoMensal}% vs mês anterior</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Veículos Importados</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.veiculosImportados}%</p>
                  <p className="text-sm text-blue-600">+3.1% vs ano anterior</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Financiamentos</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.financiamentos}%</p>
                  <p className="text-sm text-yellow-600">+2.3% vs mês anterior</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Veículos 4x4</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.veiculos4x4}%</p>
                  <p className="text-sm text-green-600">+18% vs ano anterior</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gráfico de Vendas */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Evolução das Vendas - 2024</h2>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-end justify-between h-64 space-x-2">
              {dadosVendas.map((dado, index) => (
                <div key={dado.mes} className="flex flex-col items-center flex-1">
                  <div 
                    className="bg-teal-600 rounded-t w-full transition-all hover:bg-teal-700"
                    style={{ height: `${(dado.vendas / 15000) * 100}%` }}
                  ></div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-gray-900">{dado.mes}</p>
                    <p className="text-xs text-gray-600">{(dado.vendas / 1000).toFixed(1)}k</p>
                    <p className={`text-xs ${dado.variacao > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {dado.variacao > 0 ? '+' : ''}{dado.variacao}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ranking de Marcas */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Ranking de Marcas - Junho 2024</h2>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marca
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variação
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {marcasLideres.map((marca, index) => (
                    <tr key={marca.marca} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-gray-900">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{marca.marca}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{marca.participacao}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${marca.participacao}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {marca.vendas.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          marca.variacao > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {marca.variacao > 0 ? '+' : ''}{marca.variacao}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Segmentos */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Vendas por Segmento</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {segmentos.map((segmento) => (
              <div key={segmento.nome} className="bg-gray-50 rounded-lg p-6 hover:bg-white hover:shadow-md transition-all">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{segmento.nome}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Participação</span>
                    <span className="text-sm font-medium">{segmento.participacao}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${segmento.participacao}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Vendas</span>
                    <span className="text-sm font-medium">{segmento.vendas.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Variação</span>
                    <span className={`text-sm font-medium ${
                      segmento.variacao > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {segmento.variacao > 0 ? '+' : ''}{segmento.variacao}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notícias do Mercado */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Últimas do Mercado</h2>
          
          {noticiasLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando notícias...</p>
            </div>
          ) : noticias && noticias.length > 0 ? (
            <div className="space-y-6">
              {(noticias
                .filter((n: any) => n?.status === 'published' || n?.status === undefined)
              ).map((noticia) => (
                <article key={noticia.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <Link href={`/noticias/${noticia.slug}`} className="flex">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 relative">
                      {noticia.imagem ? (
                        <img
                          src={noticia.imagem}
                          alt={noticia.titulo}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${getCategoriaColor(noticia.categoria)}`} />
                      )}
                      <div className="absolute top-1 left-1">
                        <span className={`bg-white ${getCategoriaTextColor(noticia.categoria)} px-1 py-0.5 rounded text-xs font-medium`}>
                          {noticia.categoria}
                        </span>
                      </div>
                      {noticia.destaque && (
                        <div className="absolute bottom-1 right-1 bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px] font-semibold">
                          DESTAQUE
                        </div>
                      )}
                    </div>
                    <div className="p-4 sm:p-6 flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-gray-500 text-xs sm:text-sm">
                          {new Date(noticia.dataPublicacao).toLocaleDateString('pt-AO')}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {noticia.titulo}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {noticia.resumo}
                      </p>
                      <span className="text-purple-600 hover:text-purple-700 font-medium text-sm">Ler mais →</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Nenhuma notícia de mercado disponível no momento.</p>
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link 
              href="/noticias" 
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Ver todas as notícias
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter 
        title="Relatório Semanal do Mercado"
        description="Receba análises exclusivas e dados do mercado automotivo toda semana no seu e-mail."
        theme="colored"
        color="purple"
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Auto Prestige</h3>
            <p className="text-gray-400 mb-8">
              Sua revista digital automotiva de confiança
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/sobre" className="text-gray-400 hover:text-white transition-colors">
                Sobre Nós
              </Link>
              <Link href="/contato" className="text-gray-400 hover:text-white transition-colors">
                Contato
              </Link>
              <Link href="/privacidade" className="text-gray-400 hover:text-white transition-colors">
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
