'use client'
import { useState } from 'react'

interface Imagem {
  id: string
  url: string
  alt: string
  legenda?: string
}

interface GaleriaImagensProps {
  imagens: Imagem[]
  categoria?: string
}

export default function GaleriaImagens({ imagens, categoria = 'Conteúdo' }: GaleriaImagensProps) {
  const [imagemAtiva, setImagemAtiva] = useState(0)
  const [modalAberto, setModalAberto] = useState(false)

  const proximaImagem = () => {
    setImagemAtiva((prev) => (prev + 1) % imagens.length)
  }

  const imagemAnterior = () => {
    setImagemAtiva((prev) => (prev - 1 + imagens.length) % imagens.length)
  }

  const abrirModal = (index: number) => {
    setImagemAtiva(index)
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
  }

  if (!imagens || imagens.length === 0) {
    return (
      <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-6 flex items-center justify-center">
        <span className="text-gray-600 text-lg">Imagem de {categoria}</span>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        {/* Imagem Principal */}
        <div className="relative group">
          <div 
            className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => abrirModal(imagemAtiva)}
          >
            {imagens[imagemAtiva]?.url ? (
              <img
                src={imagens[imagemAtiva].url}
                alt={imagens[imagemAtiva].alt || `Imagem ${imagemAtiva + 1} de ${categoria}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center">
                <span className="text-blue-700 text-lg font-medium">
                  {imagens[imagemAtiva].alt || `Imagem ${imagemAtiva + 1} de ${categoria}`}
                </span>
              </div>
            )}

            {/* Overlay com ícone de zoom */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Navegação da imagem principal */}
          {imagens.length > 1 && (
            <>
              <button
                onClick={imagemAnterior}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={proximaImagem}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Contador de imagens */}
          {imagens.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {imagemAtiva + 1} / {imagens.length}
            </div>
          )}
        </div>

        {/* Legenda da imagem ativa */}
        {imagens[imagemAtiva].legenda && (
          <p className="text-sm text-gray-600 mt-2 italic">
            {imagens[imagemAtiva].legenda}
          </p>
        )}

        {/* Miniaturas */}
        {imagens.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {imagens.map((imagem, index) => (
              <button
                key={imagem.id}
                onClick={() => setImagemAtiva(index)}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === imagemAtiva 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {imagem.url ? (
                  <img
                    src={imagem.url}
                    alt={imagem.alt || `Imagem ${index + 1} de ${categoria}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center">
                    <span className="text-gray-600 text-xs text-center px-1">
                      {index + 1}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal de visualização */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Botão fechar */}
            <button
              onClick={fecharModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Imagem no modal */}
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="aspect-video">
                {imagens[imagemAtiva]?.url ? (
                  <img
                    src={imagens[imagemAtiva].url}
                    alt={imagens[imagemAtiva].alt || `Imagem ${imagemAtiva + 1} de ${categoria}`}
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center">
                    <span className="text-gray-700 text-xl font-medium">
                      {imagens[imagemAtiva].alt || `Imagem ${imagemAtiva + 1} de ${categoria}`}
                    </span>
                  </div>
                )}
              </div>
              
              {imagens[imagemAtiva].legenda && (
                <div className="p-4 bg-gray-50">
                  <p className="text-gray-700 text-center">
                    {imagens[imagemAtiva].legenda}
                  </p>
                </div>
              )}
            </div>

            {/* Navegação no modal */}
            {imagens.length > 1 && (
              <>
                <button
                  onClick={imagemAnterior}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={proximaImagem}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}