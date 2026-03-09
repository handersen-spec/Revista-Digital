'use client'
import Link from 'next/link'
import { useState } from 'react'

interface Video {
  id: string
  titulo: string
  descricao: string
  categoria: string
  duracao: string
  thumbnail: string
  autor: string
  data: string
  views: string
}

const videosDestaque: Video[] = [
  {
    id: 'mclaren-720s-review',
    titulo: 'McLaren 720S: Test Drive Completo',
    descricao: 'Experiência completa ao volante do McLaren 720S nas estradas de Angola. Performance, conforto e tecnologia analisados em detalhe.',
    categoria: 'Test Drive',
    duracao: '12:45',
    thumbnail: 'bg-gradient-to-br from-orange-500 to-red-600',
    autor: 'Carlos Silva',
    data: '18 de Janeiro, 2024',
    views: '15.2K'
  },
  {
    id: 'ferrari-sf90-preview',
    titulo: 'Ferrari SF90 Stradale: Primeira Impressão',
    descricao: 'Antevisão exclusiva do novo Ferrari SF90 Stradale. Híbrido de 1000cv que promete revolucionar o segmento.',
    categoria: 'Antevisão',
    duracao: '8:30',
    thumbnail: 'bg-gradient-to-br from-red-500 to-red-700',
    autor: 'Ana Santos',
    data: '16 de Janeiro, 2024',
    views: '22.8K'
  },
  {
    id: 'porsche-911-gt3-track',
    titulo: 'Porsche 911 GT3 RS na Pista',
    descricao: 'O Porsche 911 GT3 RS mostra todo o seu potencial numa sessão de pista exclusiva. Adrenalina pura!',
    categoria: 'Pista',
    duracao: '15:20',
    thumbnail: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    autor: 'Miguel Ferreira',
    data: '14 de Janeiro, 2024',
    views: '18.5K'
  },
  {
    id: 'lamborghini-huracan-sto',
    titulo: 'Lamborghini Huracán STO: Beast Mode',
    descricao: 'O Lamborghini Huracán STO em ação. Descubra porque este é considerado um dos melhores supercars da atualidade.',
    categoria: 'Superdesportivo',
    duracao: '10:15',
    thumbnail: 'bg-gradient-to-br from-green-500 to-green-700',
    autor: 'Roberto Costa',
    data: '12 de Janeiro, 2024',
    views: '31.4K'
  }
]

export default function VideosDestaque() {
  const [videoSelecionado, setVideoSelecionado] = useState<Video>(videosDestaque[0])

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Vídeos em Destaque
          </h2>
          <Link 
            href="/videos" 
            className="text-red-600 hover:text-red-700 font-semibold flex items-center group"
          >
            Ver todos
            <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vídeo Principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className={`aspect-video ${videoSelecionado.thumbnail} relative group cursor-pointer`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-slate-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white text-slate-800 px-2 py-1 rounded text-sm font-medium">
                    {videoSelecionado.categoria}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {videoSelecionado.duracao}
                </div>
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {videoSelecionado.views} visualizações
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {videoSelecionado.titulo}
                </h3>
                <p className="text-slate-600 mb-4">
                  {videoSelecionado.descricao}
                </p>
                <div className="flex justify-between items-center text-sm text-slate-500">
                  <span>{videoSelecionado.autor}</span>
                  <span>{videoSelecionado.data}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Vídeos */}
          <div className="space-y-4">
            {videosDestaque.map((video) => (
              <div
                key={video.id}
                onClick={() => setVideoSelecionado(video)}
                className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                  videoSelecionado.id === video.id ? 'ring-2 ring-red-500' : ''
                }`}
              >
                <div className="flex">
                  <div className={`w-24 h-16 ${video.thumbnail} flex-shrink-0 relative`}>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
                      {video.duracao}
                    </div>
                  </div>
                  <div className="p-3 flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-2">
                      {video.titulo}
                    </h4>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>{video.autor}</span>
                      <span>{video.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}