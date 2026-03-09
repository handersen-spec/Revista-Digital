'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Star, Calendar, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useTestDrive } from '@/hooks/useTestDrives'
import { sanitizeHtml } from '@/lib/sanitize'

// Interface para Test Drive
interface TestDrive {
  id: number
  slug: string
  veiculo: string
  marca: string
  categoria: string
  nota: number
  preco: string
  resumo: string
  conteudoCompleto: string
  pontosFavoraveis: string[]
  pontosNegativos: string[]
  avaliacoes: {
    design: number
    performance: number
    conforto: number
    tecnologia: number
    custoBeneficio: number
  }
  especificacoes: {
    motor: string
    potencia: string
    torque: string
    transmissao: string
    tracao: string
    consumo: string
    velocidadeMaxima: string
    aceleracao: string
    dimensoes: string
    peso: string
    capacidadeTanque: string
    bagageira: string
  }
  galeria: {
    id: string
    url: string
    alt: string
    legenda?: string
  }[]
  data: string
  autor: string
  imagem: string
  destaque: boolean
  testDrivesRelacionados?: TestDrive[]
}

// Função para obter cor da nota
function getNotaCor(nota: number): string {
  if (nota >= 9) return 'bg-green-600 text-white'
  if (nota >= 8) return 'bg-green-500 text-white'
  if (nota >= 7) return 'bg-yellow-500 text-white'
  if (nota >= 6) return 'bg-orange-500 text-white'
  return 'bg-red-500 text-white'
}

interface TestDrivePageProps {
  params: Promise<{
    slug: string
  }>
}

function TestDriveContent({ slug }: { slug: string }) {
  const { testDrive, loading, error } = useTestDrive(slug)
  const [imagemAtual, setImagemAtual] = useState(0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando test drive...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar test drive</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!testDrive || ((testDrive as any).status && (testDrive as any).status !== 'published')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Test drive não encontrado</h1>
          <p className="text-gray-600">O test drive que procura não existe.</p>
        </div>
      </div>
    )
  }

  const testDrivesRelacionados = testDrive.testDrivesRelacionados || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-red-600">Início</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/test-drives" className="hover:text-red-600">Test Drives</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{testDrive.veiculo}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informações principais */}
            <div>
              <Badge variant="secondary" className="mb-4">
                {testDrive.categoria}
              </Badge>
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${getNotaCor(testDrive.nota)}`}>
                  {testDrive.nota.toFixed(1)}
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(testDrive.nota / 2) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {testDrive.veiculo}
              </h1>

              <p className="text-lg text-gray-600 mb-6">
                {testDrive.resumo}
              </p>

              <div className="flex items-center justify-between mb-6">
                <div className="text-2xl font-bold text-red-600">
                  {testDrive.preco}
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{testDrive.autor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{testDrive.data}</span>
                </div>
              </div>
            </div>

            {/* Imagem principal */}
            <div className="relative">
              <Image
                src={testDrive.imagem}
                alt={testDrive.veiculo}
                width={600}
                height={400}
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galeria de imagens */}
            {testDrive.galeria && testDrive.galeria.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Galeria</h2>
                  <div className="relative">
                    <Image
                      src={testDrive.galeria[imagemAtual].url}
                      alt={testDrive.galeria[imagemAtual].alt}
                      width={800}
                      height={600}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    {testDrive.galeria[imagemAtual].legenda && (
                      <p className="text-sm text-gray-600 mt-2">
                        {testDrive.galeria[imagemAtual].legenda}
                      </p>
                    )}
                    
                    {testDrive.galeria.length > 1 && (
                      <>
                        <button
                          onClick={() => setImagemAtual(prev => prev === 0 ? testDrive.galeria!.length - 1 : prev - 1)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          onClick={() => setImagemAtual(prev => prev === testDrive.galeria!.length - 1 ? 0 : prev + 1)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {testDrive.galeria.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto">
                      {testDrive.galeria.map((imagem, index) => (
                        <button
                          key={imagem.id}
                          onClick={() => setImagemAtual(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                            index === imagemAtual ? 'border-red-600' : 'border-gray-200'
                          }`}
                        >
                          <Image
                            src={imagem.url}
                            alt={imagem.alt}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Avaliação detalhada */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Avaliação Detalhada</h2>
                <div className="space-y-4">
                  {Object.entries(testDrive.avaliacoes).map(([categoria, nota]) => (
                    <div key={categoria} className="flex items-center justify-between">
                      <span className="font-medium capitalize">
                        {categoria === 'custoBeneficio' ? 'Custo-Benefício' : categoria}
                      </span>
                      <div className="flex items-center gap-3">
                         <div className="w-32 bg-gray-200 rounded-full h-2">
                           <div 
                             className="bg-red-600 h-2 rounded-full" 
                             style={{ width: `${nota * 10}%` }}
                           ></div>
                         </div>
                         <span className="font-bold text-lg">{nota.toFixed(1)}</span>
                       </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pontos favoráveis e negativos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-green-600 mb-4">Pontos Favoráveis</h3>
                  <ul className="space-y-2">
                    {testDrive.pontosFavoraveis.map((ponto, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{ponto}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-red-600 mb-4">Pontos Negativos</h3>
                  <ul className="space-y-2">
                    {testDrive.pontosNegativos.map((ponto, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{ponto}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Conteúdo detalhado */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Análise Completa</h2>
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(testDrive.conteudoCompleto) }}
                />
              </CardContent>
            </Card>

            {/* Publicidade */}
            <div className="my-8">
              <div className="bg-gray-100 h-32 flex items-center justify-center rounded-lg">
                <span className="text-gray-500">Publicidade</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Especificações técnicas */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Especificações Técnicas</h3>
                <div className="space-y-3">
                  {Object.entries(testDrive.especificacoes).map(([chave, valor]) => (
                    <div key={chave} className="flex justify-between">
                      <span className="text-gray-600 capitalize">
                        {chave === 'velocidadeMaxima' ? 'Velocidade Máxima' : 
                         chave === 'capacidadeTanque' ? 'Capacidade do Tanque' :
                         chave}:
                      </span>
                      <span className="font-medium">{valor}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Test drives relacionados */}
            {testDrivesRelacionados.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Test Drives Relacionados</h3>
                  <div className="space-y-4">
                    {testDrivesRelacionados.map((relacionado) => (
                      <Link
                        key={relacionado.slug}
                        href={`/test-drives/${relacionado.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-3">
                          <Image
                            src={relacionado.imagem}
                            alt={relacionado.veiculo}
                            width={80}
                            height={60}
                            className="w-20 h-15 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium group-hover:text-red-600 transition-colors line-clamp-2">
                              {relacionado.veiculo}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`px-2 py-1 rounded text-xs font-bold ${getNotaCor(relacionado.nota)}`}>
                                {relacionado.nota.toFixed(1)}
                              </div>
                              <span className="text-sm text-gray-500">{relacionado.categoria}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TestDrivePage({ params }: TestDrivePageProps) {
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    params.then(({ slug }) => setSlug(slug))
  }, [params])

  if (!slug) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return <TestDriveContent slug={slug} />
}

// Removido generateStaticParams para evitar conflito com 'use client'
// Removido generateMetadata export para evitar erro em componente com 'use client'