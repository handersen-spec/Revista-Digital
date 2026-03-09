'use client'
import { useState } from 'react'

interface VideoPlayerProps {
  videoUrl: string
  thumbnail: string
  titulo: string
}

export default function VideoPlayer({ videoUrl, thumbnail, titulo }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const parseYouTubeId = (url: string) => {
    try {
      const u = new URL(url)
      if (u.hostname.includes('youtube.com')) {
        return u.searchParams.get('v') || ''
      }
      if (u.hostname.includes('youtu.be')) {
        return u.pathname.split('/').filter(Boolean)[0] || ''
      }
      return ''
    } catch { return '' }
  }

  const parseVimeoId = (url: string) => {
    try {
      const u = new URL(url)
      if (u.hostname.includes('vimeo.com')) {
        const part = u.pathname.split('/').filter(Boolean).find((p) => /\d+/.test(p))
        return part || ''
      }
      return ''
    } catch { return '' }
  }

  const ytId = videoUrl ? parseYouTubeId(videoUrl) : ''
  const vimeoId = (!ytId && videoUrl) ? parseVimeoId(videoUrl) : ''
  const isLocal = !!(videoUrl && !ytId && !vimeoId)

  // Escolher thumbnail: usa a fornecida ou gera automaticamente pela URL
  const computedThumbnail = (() => {
    if (thumbnail) return thumbnail
    if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
    if (vimeoId) return `https://vumbnail.com/${vimeoId}.jpg`
    return ''
  })()

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      <div className="aspect-video">
        {!isPlaying ? (
          <div className="relative w-full h-full">
            <img 
              src={computedThumbnail} 
              alt={titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <button 
                onClick={() => setIsPlaying(true)}
                className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transition-colors"
                aria-label="Reproduzir vídeo"
              >
                <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5v10l8-5-8-5z"/>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full">
            {ytId ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                title={titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : vimeoId ? (
              <iframe
                className="w-full h-full"
                src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
                title={titulo}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : isLocal ? (
              <video className="w-full h-full" src={videoUrl} controls autoPlay />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                <div className="text-center">
                  <p className="mb-2">Vídeo não disponível</p>
                  <p className="text-sm text-gray-400 break-all">URL: {videoUrl || 'Indisponível'}</p>
                  <button 
                    onClick={() => setIsPlaying(false)}
                    className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Voltar ao thumbnail
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}