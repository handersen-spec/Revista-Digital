'use client'

import { useState } from 'react'
import Link from 'next/link'
import Advertisement from '@/components/Advertisement'
import { useTestDrives, useTestDrivesMetadata } from '@/hooks/useTestDrives'

export default function TestDrivesPage() {
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos")
  const [testDrivesVisiveis, setTestDrivesVisiveis] = useState(6)
  
  // Buscar test drives da API
  const { data, loading, error } = useTestDrives({
    categoria: categoriaFiltro,
    limit: 50 // Buscar mais para permitir paginação local
  })
  
  // Buscar metadados (categorias e marcas)
  const { categorias } = useTestDrivesMetadata()

  // Estados de loading e erro
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando test drives...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Erro ao carregar test drives: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!data || !data.testDrives.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-600">Nenhum test drive encontrado.</p>
          </div>
        </div>
      </div>
    )
  }

  const testDrives = data.testDrives.filter((t: any) => t.status === 'published' || t.status === undefined)
  const testDrivesDestaque = testDrives.filter(test => test.destaque)
  const outrosTestDrives = testDrives.filter(test => !test.destaque).slice(0, testDrivesVisiveis)
  
  const carregarMaisTestDrives = () => {
    setTestDrivesVisiveis(prev => prev + 6)
  }

  const getNotaCor = (nota: number) => {
    if (nota >= 9) return "text-green-600 bg-green-100"
    if (nota >= 8) return "text-blue-600 bg-blue-100"
    if (nota >= 7) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Test Drives
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
              Avaliações completas dos principais veículos do mercado angolano. Análises técnicas adaptadas às condições locais para sua melhor decisão de compra.
            </p>
          </div>
        </div>
      </section>

      {/* Publicidade Top */}
      <section className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Advertisement 
            format="banner" 
            position="top"
            className="max-w-4xl mx-auto"
          />
        </div>
      </section>

      {/* Filtros */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setCategoriaFiltro(categoria)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoriaFiltro === categoria
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Test Drives em Destaque */}
      {testDrivesDestaque.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Test Drives em Destaque
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {testDrivesDestaque.map((testDrive) => (
                <Link 
                  key={testDrive.id} 
                  href={`/test-drives/${testDrive.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img
                        src={testDrive.imagem}
                        alt={testDrive.veiculo}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getNotaCor(testDrive.nota)}`}>
                          {testDrive.nota}/10
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          DESTAQUE
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-green-600 font-medium">{testDrive.categoria}</span>
                        <span className="text-sm text-gray-500">{testDrive.data}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                        {testDrive.veiculo}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {testDrive.resumo}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">{testDrive.preco}</span>
                        <span className="text-sm text-gray-500">Por {testDrive.autor}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Outros Test Drives */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {categoriaFiltro === "Todos" ? "Todos os Test Drives" : `Test Drives - ${categoriaFiltro}`}
          </h2>
          
          {outrosTestDrives.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {outrosTestDrives.map((testDrive) => (
                  <Link 
                    key={testDrive.id} 
                    href={`/test-drives/${testDrive.slug}`}
                    className="group"
                  >
                    <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="relative">
                        <img
                          src={testDrive.imagem}
                          alt={testDrive.veiculo}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getNotaCor(testDrive.nota)}`}>
                            {testDrive.nota}/10
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-green-600 font-medium">{testDrive.categoria}</span>
                          <span className="text-sm text-gray-500">{testDrive.data}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                          {testDrive.veiculo}
                        </h3>
                        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                          {testDrive.resumo}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-600">{testDrive.preco}</span>
                          <span className="text-xs text-gray-500">Por {testDrive.autor}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Botão Carregar Mais */}
              {testDrivesVisiveis < testDrives.filter(test => !test.destaque).length && (
                <div className="text-center mt-12">
                  <button
                    onClick={carregarMaisTestDrives}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Carregar Mais Test Drives
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhum test drive encontrado para esta categoria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Publicidade Bottom */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Advertisement 
            format="banner" 
            position="bottom"
            className="max-w-4xl mx-auto"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Quer testar um veículo específico?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e solicite um test drive personalizado. Nossa equipe está pronta para ajudar na sua decisão de compra.
          </p>
          <Link
            href="/contato"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Solicitar Test Drive
          </Link>
        </div>
      </section>
    </div>
  )
}