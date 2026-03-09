'use client'

import Link from 'next/link'
import { usePublicidadeData } from '@/hooks/usePublicidadeData'

export default function PublicidadePage() {
  const { dadosPublicidade, loading, error } = usePublicidadeData()

  // Estados de loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados de publicidade...</p>
          </div>
        </div>
      </div>
    )
  }

  // Estados de erro
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar dados</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Estados de dados não encontrados
  if (!dadosPublicidade) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum dado encontrado</h2>
            <p className="text-gray-600">Não foi possível carregar os dados de publicidade.</p>
          </div>
        </div>
      </div>
    )
  }

  const { formatos: formatosPublicidade, audiencia, demograficos, cases } = dadosPublicidade

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-600 to-pink-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Anuncie na Auto Prestige
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
              Conecte sua marca ao público automotivo angolano.
            </p>
          </div>
        </div>
      </section>

      {/* Audiência */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nossa Audiência</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {audiencia.map((item) => (
              <div key={item.metrica} className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl mb-4">{item.icone}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.valor}</h3>
                <p className="text-gray-600">{item.metrica}</p>
              </div>
            ))}
          </div>

          {/* Demografia */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {demograficos.map((demo) => (
              <div key={demo.categoria} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{demo.categoria}</h3>
                <div className="space-y-3">
                  {demo.dados.map((item) => (
                    <div key={item.faixa}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">{item.faixa}</span>
                        <span className="text-sm font-medium">{item.percentual}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${item.percentual}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formatos de Publicidade */}
      <section className="py-12" style={{ backgroundColor: 'var(--background-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-heading text-center" 
              style={{ 
                marginBottom: 'var(--spacing-xl)',
                color: 'var(--neutral-900)'
              }}>
            Formatos de Publicidade
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formatosPublicidade.map((formato, index) => (
              <div key={formato.id} 
                   className={`card-base card-elevated hover-lift animate-fade-in-up overflow-hidden ${
                     formato.destaque ? 'ring-2 ring-primary-500' : ''
                   }`}
                   style={{
                     animationDelay: `${index * 0.1}s`,
                     backgroundColor: formato.destaque ? 'var(--primary-50)' : 'var(--background)'
                   }}>
                {formato.destaque && (
                  <div style={{ 
                    backgroundColor: 'var(--primary-600)',
                    color: 'white',
                    textAlign: 'center',
                    padding: 'var(--spacing-sm)'
                  }}>
                    <span className="text-caption font-medium">MAIS POPULAR</span>
                  </div>
                )}
                
                <div style={{ padding: 'var(--spacing-lg)' }}>
                  <h3 className="text-heading" 
                      style={{ 
                        marginBottom: 'var(--spacing-sm)',
                        color: 'var(--neutral-900)'
                      }}>
                    {formato.nome}
                  </h3>
                  <p className="text-body" 
                     style={{ 
                       marginBottom: 'var(--spacing-md)',
                       color: 'var(--neutral-600)'
                     }}>
                    {formato.descricao}
                  </p>
                  
                  <div style={{ 
                    marginBottom: 'var(--spacing-lg)',
                    gap: 'var(--spacing-sm)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div className="flex justify-between">
                      <span className="text-caption" style={{ color: 'var(--neutral-500)' }}>Dimensões:</span>
                      <span className="text-caption font-medium" style={{ color: 'var(--neutral-700)' }}>{formato.dimensoes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-caption" style={{ color: 'var(--neutral-500)' }}>Posição:</span>
                      <span className="text-caption font-medium" style={{ color: 'var(--neutral-700)' }}>{formato.posicao}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-caption" style={{ color: 'var(--neutral-500)' }}>Impressões:</span>
                      <span className="text-caption font-medium" style={{ color: 'var(--neutral-700)' }}>{formato.impressoes}</span>
                    </div>
                  </div>
                  
                  <div style={{ 
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: 'var(--spacing-md)'
                  }}>
                    <div className="flex justify-between items-center" 
                         style={{ marginBottom: 'var(--spacing-md)' }}>
                      <span className="text-heading" style={{ color: 'var(--neutral-900)' }}>{formato.preco}</span>
                      <span className="text-caption" style={{ color: 'var(--neutral-500)' }}>/mês</span>
                    </div>
                    
                    <button className={`btn-base focus-ring w-full ${
                      formato.destaque 
                        ? 'btn-primary' 
                        : 'btn-ghost text-primary hover:text-primary'
                    }`}>
                      Solicitar orçamento
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cases de Sucesso */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-heading text-center" 
              style={{ 
                marginBottom: 'var(--spacing-xl)',
                color: 'var(--neutral-900)'
              }}>
            Cases de Sucesso
          </h2>
          
          <div style={{ gap: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column' }}>
            {cases.map((case_, index) => (
              <div key={case_.id} 
                   className="card-base card-elevated hover-lift animate-fade-in-up"
                   style={{ 
                     padding: 'var(--spacing-lg)',
                     animationDelay: `${index * 0.1}s`
                   }}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-heading" 
                        style={{ 
                          marginBottom: 'var(--spacing-sm)',
                          color: 'var(--neutral-900)'
                        }}>
                      {case_.cliente}
                    </h3>
                    <p className="text-body" 
                       style={{ 
                         marginBottom: 'var(--spacing-sm)',
                         color: 'var(--neutral-600)'
                       }}>
                      {case_.campanha}
                    </p>
                    <div className="flex flex-wrap" style={{ gap: 'var(--spacing-md)' }}>
                      <span className="text-caption" 
                            style={{ 
                              backgroundColor: 'var(--neutral-100)',
                              padding: 'var(--spacing-xs) var(--spacing-sm)',
                              borderRadius: 'var(--radius-full)',
                              color: 'var(--neutral-700)'
                            }}>
                        {case_.formato}
                      </span>

                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                        {case_.duracao}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <div className="bg-green-100 text-green-600 px-4 py-2 rounded-lg text-center">
                      <span className="font-bold">{case_.resultado}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vantagens */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Por que anunciar na Auto Prestige?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Audiência Qualificada em Angola</h3>
              <p className="text-gray-600">
                Público automotivo qualificado no mercado angolano, com alto poder de compra.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Relatórios Detalhados</h3>
              <p className="text-gray-600">
                Acompanhe o desempenho da sua campanha com relatórios completos e métricas precisas.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Resultados Rápidos</h3>
              <p className="text-gray-600">
                Campanhas otimizadas para conversão, com resultados visíveis desde o primeiro mês.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para acelerar sua marca?</h2>
          <p className="text-green-100 mb-8 text-lg">
            Entre em contato conosco e descubra como podemos ajudar sua empresa a alcançar mais clientes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Solicitar orçamento
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-green-600 transition-colors font-medium">
              Baixar mídia kit
            </button>
          </div>
          
          <div className="mt-8 text-green-100">
            <p>📧 publicidade@autoprestige.ao</p>
            <p>📱 +244 999 999 999</p>
          </div>
        </div>
      </section>

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
