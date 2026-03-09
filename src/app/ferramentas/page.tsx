'use client'

import { useState } from 'react'
import Link from 'next/link'
import Modal from '@/components/Modal'
import CalculadoraFinanciamento from '@/components/ferramentas/CalculadoraFinanciamento'
import SimuladorConsumo from '@/components/ferramentas/SimuladorConsumo'
import AvaliadorVeiculos from '@/components/ferramentas/AvaliadorVeiculos'
import ComparadorVeiculos from '@/components/ferramentas/ComparadorVeiculos'
import ConversorMoedas from '@/components/ferramentas/ConversorMoedas'
import GuiaDocumentacao from '@/components/ferramentas/GuiaDocumentacao'
import CalculadoraSeguroENSA from '@/components/ferramentas/CalculadoraSeguroENSA'
import CalculadoraImpostos from '@/components/ferramentas/CalculadoraImpostos'
import SimuladorTroca from '@/components/ferramentas/SimuladorTroca'
import PlanejadorManutencao from '@/components/ferramentas/PlanejadorManutencao'

export default function FerramentasPage() {
  const [modalAberto, setModalAberto] = useState<string | null>(null)
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas")
  const ferramentas = [
    {
      id: "financiamento",
      titulo: "Calculadora de Financiamento",
      descricao: "Simule o financiamento do seu veículo com bancos angolanos (BFA, BAI, BPC)",
      categoria: "Financeiro",
      icone: "💰",
      popular: true
    },
    {
      id: "consumo",
      titulo: "Simulador de Consumo",
      descricao: "Calcule o consumo de combustível e custos de viagem em Angola",
      categoria: "Consumo",
      icone: "⛽",
      popular: true
    },
    {
      id: "avaliacao",
      titulo: "Avaliador de Veículos",
      descricao: "Consulte o valor de mercado do seu veículo em Angola",
      categoria: "Avaliação",
      icone: "📊",
      popular: true
    },
    {
      id: "seguro",
      titulo: "Calculadora de Seguro ENSA",
      descricao: "Estime o valor do seguro do seu veículo com a ENSA",
      categoria: "Seguro",
      icone: "🛡️",
      popular: false
    },
    {
      id: "comparador",
      titulo: "Comparador de Veículos",
      descricao: "Compare especificações técnicas entre diferentes modelos disponíveis em Angola",
      categoria: "Comparação",
      icone: "⚖️",
      popular: true
    },
    {
      id: "impostos",
      titulo: "Calculadora de Impostos",
      descricao: "Calcule os impostos de importação e taxas alfandegárias",
      categoria: "Impostos",
      icone: "🏛️",
      popular: false
    },
    {
      id: "troca",
      titulo: "Simulador de Troca",
      descricao: "Simule a troca do seu veículo atual por um novo no mercado angolano",
      categoria: "Troca",
      icone: "🔄",
      popular: false
    },
    {
      id: "conversor",
      titulo: "Conversor de Moedas",
      descricao: "Converta preços entre Kwanza, USD e EUR para importação de veículos",
      categoria: "Financeiro",
      icone: "💱",
      popular: true
    },
    {
      id: "manutencao",
      titulo: "Planejador de Manutenção",
      descricao: "Organize a manutenção considerando o clima e estradas de Angola",
      categoria: "Manutenção",
      icone: "🔧",
      popular: false
    },
    {
      id: "documentacao",
      titulo: "Guia de Documentação",
      descricao: "Saiba quais documentos são necessários para compra e registo de veículos",
      categoria: "Documentação",
      icone: "📋",
      popular: true
    }
  ]

  const categorias = ["Todas", "Financeiro", "Consumo", "Avaliação", "Seguro", "Comparação", "Impostos", "Troca", "Manutenção", "Documentação"]
  
  const ferramentasPopulares = ferramentas.filter(ferramenta => ferramenta.popular)
  const ferramentasFiltradas = categoriaFiltro === "Todas" 
    ? ferramentas 
    : ferramentas.filter(ferramenta => ferramenta.categoria === categoriaFiltro)

  const abrirModal = (ferramentaId: string) => {
    setModalAberto(ferramentaId)
  }

  const fecharModal = () => {
    setModalAberto(null)
  }

  const renderizarComponenteModal = () => {
    switch (modalAberto) {
      case 'financiamento':
        return <CalculadoraFinanciamento />
      case 'consumo':
        return <SimuladorConsumo />
      case 'avaliacao':
        return <AvaliadorVeiculos />
      case 'comparador':
        return <ComparadorVeiculos />
      case 'conversor':
        return <ConversorMoedas />
      case 'documentacao':
        return <GuiaDocumentacao />
      case 'seguro':
        return <CalculadoraSeguroENSA />
      case 'impostos':
        return <CalculadoraImpostos />
      case 'troca':
        return <SimuladorTroca />
      case 'manutencao':
        return <PlanejadorManutencao />
      default:
        return null
    }
  }
  const outrasFerramentas = ferramentasFiltradas.filter(ferramenta => !ferramenta.popular)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Ferramentas Automotivas
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
              Calculadoras, simuladores e utilitários adaptados ao mercado angolano para facilitar suas decisões automotivas.
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setCategoriaFiltro(categoria)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  categoria === categoriaFiltro
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Ferramentas Populares */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-heading" 
              style={{ 
                marginBottom: 'var(--spacing-xl)',
                color: 'var(--neutral-900)'
              }}>
            Ferramentas Populares
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {ferramentasPopulares.map((ferramenta, index) => (
              <article key={ferramenta.id} 
                       className="card-base card-elevated hover-lift animate-fade-in-up overflow-hidden h-full"
                       style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between" 
                       style={{ marginBottom: 'var(--spacing-md)' }}>
                    <div className="text-4xl">{ferramenta.icone}</div>
                    <span className="text-caption" 
                          style={{ 
                            backgroundColor: 'var(--primary-100)',
                            color: 'var(--primary-600)',
                            padding: 'var(--spacing-xs) var(--spacing-sm)',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: '500'
                          }}>
                      {ferramenta.categoria}
                    </span>
                  </div>
                  
                  <h3 className="text-heading" 
                      style={{ 
                        marginBottom: 'var(--spacing-sm)',
                        color: 'var(--neutral-900)'
                      }}>
                    {ferramenta.titulo}
                  </h3>
                  
                  <p className="text-body" 
                     style={{ 
                       marginBottom: 'var(--spacing-md)',
                       color: 'var(--neutral-600)'
                     }}>
                    {ferramenta.descricao}
                  </p>
                  
                  <button 
                    onClick={() => abrirModal(ferramenta.id)}
                    className="btn-base btn-primary btn-md w-full"
                  >
                    Usar ferramenta
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Outras Ferramentas */}
      <section className="py-12" style={{ backgroundColor: 'var(--background-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-heading" 
              style={{ 
                marginBottom: 'var(--spacing-xl)',
                color: 'var(--neutral-900)'
              }}>
            Outras Ferramentas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {outrasFerramentas.map((ferramenta, index) => (
              <article key={ferramenta.id} 
                       className="card-base hover-lift animate-fade-in-up h-full"
                       style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="p-4 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between" 
                       style={{ marginBottom: 'var(--spacing-md)' }}>
                    <div className="text-3xl">{ferramenta.icone}</div>
                    <span className="text-caption" 
                          style={{ 
                            backgroundColor: 'var(--neutral-100)',
                            color: 'var(--neutral-600)',
                            padding: 'var(--spacing-xs) var(--spacing-sm)',
                            borderRadius: 'var(--radius-full)'
                          }}>
                      {ferramenta.categoria}
                    </span>
                  </div>
                  
                  <h3 className="text-heading" 
                      style={{ 
                        marginBottom: 'var(--spacing-sm)',
                        color: 'var(--neutral-900)',
                        fontSize: '1.125rem'
                      }}>
                    {ferramenta.titulo}
                  </h3>
                  
                  <p className="text-body" 
                     style={{ 
                       marginBottom: 'var(--spacing-md)',
                       color: 'var(--neutral-600)',
                       fontSize: '0.875rem'
                     }}>
                    {ferramenta.descricao}
                  </p>
                  
                  <button 
                    onClick={() => abrirModal(ferramenta.id)}
                    className="btn-base btn-secondary btn-md w-full"
                  >
                    Usar ferramenta
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Calculadora em Destaque */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-6">🧮</div>
            <h2 className="text-3xl font-bold mb-4">Calculadora de Financiamento</h2>
            <p className="text-green-100 mb-8 text-lg">
              Nossa ferramenta mais popular! Simule diferentes cenários de financiamento e encontre a melhor opção para você.
            </p>
            
            <div className="bg-white rounded-lg p-6 text-gray-900 max-w-md mx-auto">
              <h3 className="font-bold mb-4">Simulação Rápida</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Valor do veículo</label>
                  <input 
                    type="text" 
                    placeholder="15.000.000 Kz"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Entrada</label>
                  <input 
                    type="text" 
                    placeholder="3.000.000 Kz"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prazo (meses)</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option>24</option>
                    <option>36</option>
                    <option>48</option>
                    <option>60</option>
                  </select>
                </div>
                <button 
                  onClick={() => abrirModal('financiamento')}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Calcular agora
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dicas */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Dicas para usar nossas ferramentas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Dados Precisos</h3>
              <p className="text-gray-600">
                Insira informações precisas para obter resultados mais confiáveis em suas simulações.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Resultados Instantâneos</h3>
              <p className="text-gray-600">
                Todas as nossas ferramentas fornecem resultados em tempo real para agilizar suas decisões.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Educação Financeira</h3>
              <p className="text-gray-600">
                Use nossas ferramentas para aprender mais sobre financiamento e custos automotivos.
              </p>
            </div>
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

      {/* Modal */}
      {modalAberto && (
        <Modal isOpen={true} onClose={fecharModal} title="Ferramenta">
          {renderizarComponenteModal()}
        </Modal>
      )}
    </div>
  )
}
