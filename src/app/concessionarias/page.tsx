'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import DealershipRegistration from '@/components/DealershipRegistration'
import { useConcessionarias } from '@/hooks/useConcessionarias'

export default function ConcessionariasPage() {
  const [marcaFiltro, setMarcaFiltro] = useState("Todas")
  const [servicoFiltro, setServicoFiltro] = useState("")
  const [busca, setBusca] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  // Hook para consumir dados da API
  const {
    concessionarias,
    paginacao,
    estatisticas,
    loading,
    error,
    filtros,
    setFiltros,
    setPagina,
    refetch
  } = useConcessionarias({
    marca: marcaFiltro !== "Todas" ? marcaFiltro : undefined,
    servico: servicoFiltro || undefined,
    busca: busca || undefined
  }, 6)

  const marcas = ["Todas", ...(estatisticas?.marcasDisponiveis || [])]
  const servicos = ["Vendas", "Pós-vendas", "Peças", "Oficina", "Funilaria", "Seguro"]
  
  const carregarMaisConcessionarias = () => {
    if (paginacao?.temProxima) {
      setPagina(paginacao.paginaAtual + 1)
    }
  }

  const renderStars = (rating: number) => {
    const filledStars = isMounted ? Math.floor(rating) : 0
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < filledStars ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  // Atualizar filtros quando os valores mudarem
  useEffect(() => {
    const timer = setTimeout(() => {
      setFiltros({
        marca: marcaFiltro !== "Todas" ? marcaFiltro : undefined,
        servico: servicoFiltro || undefined,
        busca: busca || undefined
      })
      setPagina(1) // Reset para primeira página
    }, 300)

    return () => clearTimeout(timer)
  }, [marcaFiltro, servicoFiltro, busca, setFiltros, setPagina])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Concessionárias em Angola
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
              Encontre as melhores concessionárias em Angola. Conectamos você aos melhores revendedores e ofertas do mercado automobilístico angolano.
            </p>
          </div>
        </div>
      </section>

      {/* Busca e Filtros */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Barra de Busca */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Digite sua província ou município"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <button 
                onClick={() => refetch()}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Marca</h3>
              <div className="flex flex-wrap gap-2">
                {marcas.map((marca) => (
                  <button
                    key={marca}
                    onClick={() => setMarcaFiltro(marca)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      marca === marcaFiltro
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                    }`}
                  >
                    {marca}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Serviços</h3>
              <div className="flex flex-wrap gap-2">
                {servicos.map((servico) => (
                  <button
                    key={servico}
                    onClick={() => setServicoFiltro(servicoFiltro === servico ? "" : servico)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      servicoFiltro === servico
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                    }`}
                  >
                    {servico}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Concessionárias */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Concessionárias em Angola</h2>
            <div className="text-sm text-gray-500">
              {loading ? 'Carregando...' : `${paginacao?.totalItens || 0} resultados encontrados`}
            </div>
          </div>

          {/* Estados de Loading, Erro e Vazio */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold">Erro ao carregar concessionárias</h3>
                <p className="text-sm mt-2">{error}</p>
              </div>
              <button 
                onClick={() => refetch()}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!loading && !error && concessionarias.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h6m-6 4h6" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-600">Nenhuma concessionária encontrada</h3>
                <p className="text-gray-500 mt-2">Tente ajustar os filtros ou buscar por outros termos.</p>
              </div>
              <button 
                onClick={() => {
                  setMarcaFiltro("Todas")
                  setServicoFiltro("")
                  setBusca("")
                }}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {/* Lista de Concessionárias */}
          {!loading && !error && concessionarias.length > 0 && (
            <div className="space-y-6">
              {concessionarias.map((concessionaria) => (
                <article key={concessionaria.id} className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${concessionaria.destaque ? 'ring-2 ring-orange-200' : ''}`}>
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/3">
                      <div className="aspect-video lg:aspect-square bg-gray-200 relative">
                        {concessionaria.destaque && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Destaque
                            </span>
                          </div>
                        )}
                        {concessionaria.imagens && concessionaria.imagens.length > 0 && (
                          <img 
                            src={concessionaria.imagens[0]} 
                            alt={concessionaria.nome}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="lg:w-2/3 p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {concessionaria.nome}
                          </h3>
                          <p className="text-orange-600 font-semibold mb-2">
                            {concessionaria.marca}
                          </p>
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {renderStars(concessionaria.avaliacoes?.media || 0)}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                              {concessionaria.avaliacoes?.media || 0} ({concessionaria.avaliacoes?.total || 0} avaliações)
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-600 text-sm">{concessionaria.endereco}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-gray-600 text-sm">{concessionaria.telefone}</span>
                        </div>
                        
                        {concessionaria.horarioFuncionamento && (
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-600 text-sm">
                              Seg-Sex: {concessionaria.horarioFuncionamento.segunda} | Sáb: {concessionaria.horarioFuncionamento.sabado}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Serviços disponíveis:</h4>
                        <div className="flex flex-wrap gap-2">
                          {concessionaria.servicos.map((servico) => (
                            <span key={servico} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                              {servico}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link 
                          href={`/concessionarias/${concessionaria.id}`}
                          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm text-center"
                        >
                          Ver detalhes
                        </Link>
                        <a 
                          href={`tel:${concessionaria.telefone}`}
                          className="border border-orange-600 text-orange-600 px-6 py-2 rounded-lg hover:bg-orange-50 transition-colors text-sm text-center"
                        >
                          Ligar
                        </a>
                        <a 
                          href={`mailto:${concessionaria.email}`}
                          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-center"
                        >
                          Email
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          
          {/* Load More */}
          {!loading && !error && paginacao?.temProxima && (
            <div className="text-center mt-12">
              <button 
                onClick={carregarMaisConcessionarias}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Carregar mais concessionárias
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <DealershipRegistration 
        title="É proprietário de uma concessionária?"
        description="Cadastre sua concessionária em nosso diretório e alcance mais clientes."
        theme="dark"
        color="orange"
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
