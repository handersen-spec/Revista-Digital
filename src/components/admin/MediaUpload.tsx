'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, X, Image, Video, File, Trash2, Eye, Download, Search } from 'lucide-react'

interface MediaFile {
  id: string
  filename: string
  url: string
  type: string
  size: number
  uploadedAt: string
}

interface MediaUploadProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (file: MediaFile) => void
  acceptedTypes?: string[]
  maxSize?: number
  multiple?: boolean
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  isOpen,
  onClose,
  onSelect,
  acceptedTypes = ['image/*'],
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false
}) => {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Carregar arquivos existentes
  const loadFiles = useCallback(async () => {
    try {
      const response = await fetch('/api/upload?type=image&limit=50', { cache: 'no-store' })
      const data = await response.json()
      if (data.success) {
        setFiles(data.files)
      }
    } catch (error) {
      console.error('Erro ao carregar arquivos:', error)
    }
  }, [])

  // Carregar ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      loadFiles()
    }
  }, [isOpen, loadFiles])

  // Upload de arquivo
  const handleFileUpload = async (selectedFiles: FileList) => {
    setUploading(true)

    // Função de compressão para imagens grandes
    const compressImage = async (file: File): Promise<File> => {
      try {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image()
          image.onload = () => resolve(image)
          image.onerror = (e) => reject(e)
          image.src = URL.createObjectURL(file)
        })

        const maxWidth = 1920
        const scale = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.floor(img.width * scale)
        canvas.height = Math.floor(img.height * scale)
        const ctx = canvas.getContext('2d')
        if (!ctx) return file
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        const blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.85))
        if (!blob) return file
        const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' })
        return compressed
      } catch {
        return file
      }
    }

    try {
      const filesArray = Array.from(selectedFiles)
      const uploadPromises = filesArray.map(async (file) => {
        // Validar tamanho bruto antes de compressão
        if (file.size > maxSize && file.type.startsWith('image/') === false) {
          return { error: `Arquivo ${file.name} é muito grande.` }
        }

        let uploadFile = file
        const uploadType: 'image' | 'video' | 'document' = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document'

        // Comprimir imagens para acelerar upload
        if (uploadType === 'image') {
          uploadFile = await compressImage(file)
        }

        const formData = new FormData()
        formData.append('file', uploadFile)
        formData.append('type', uploadType)

        const response = await fetch('/api/upload', { method: 'POST', body: formData })
        const result = await response.json()

        if (!result.success) {
          return { error: result.error || `Falha no upload de ${file.name}` }
        }

        const newFile: MediaFile = {
          id: Date.now().toString(),
          filename: result.filename,
          url: result.url,
          type: uploadFile.type,
          size: uploadFile.size,
          uploadedAt: new Date().toISOString()
        }
        return { file: newFile }
      })

      const settled = await Promise.allSettled(uploadPromises)
      const successFiles: MediaFile[] = []
      const errors: string[] = []

      settled.forEach((res) => {
        if (res.status === 'fulfilled') {
          const value: any = res.value
          if (value.file) successFiles.push(value.file)
          if (value.error) errors.push(value.error)
        } else {
          errors.push('Erro desconhecido no upload')
        }
      })

      if (successFiles.length) {
        setFiles(prev => [...successFiles, ...prev])
      }
      if (errors.length) {
        alert(errors.join('\n'))
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload dos arquivos')
    } finally {
      setUploading(false)
    }
  }

  // Drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles)
    }
  }

  // Deletar arquivo
  const handleDelete = async (file: MediaFile) => {
    if (confirm(`Tem certeza que deseja deletar ${file.filename}?`)) {
      try {
        const response = await fetch(`/api/upload?filename=${file.filename}&type=${file.type.split('/')[0]}`, {
          method: 'DELETE'
        })
        
        const result = await response.json()
        if (result.success) {
          setFiles(prev => prev.filter(f => f.id !== file.id))
        }
      } catch (error) {
        console.error('Erro ao deletar arquivo:', error)
      }
    }
  }

  // Filtrar arquivos
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || file.type.startsWith(selectedType)
    return matchesSearch && matchesType
  })

  // Formatar tamanho do arquivo
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Obter ícone do tipo de arquivo
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />
    return <File className="w-4 h-4" />
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Biblioteca de Mídia</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Area */}
        <div className="p-6 border-b border-gray-200">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Tipos aceitos: {acceptedTypes.join(', ')} | Tamanho máximo: {maxSize / (1024 * 1024)}MB
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {uploading ? 'Fazendo upload...' : 'Selecionar Arquivos'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple={multiple}
              accept={acceptedTypes.join(',')}
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar arquivos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Todos os tipos</option>
              <option value="image">Imagens</option>
              <option value="video">Vídeos</option>
              <option value="application">Documentos</option>
            </select>
          </div>
        </div>

        {/* Files Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="group relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => onSelect(file)}
              >
                {/* Preview */}
                <div className="aspect-square mb-2 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={file.url}
                      alt={file.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="text-xs">
                  <p className="font-medium text-gray-900 truncate" title={file.filename}>
                    {file.filename}
                  </p>
                  <p className="text-gray-500">{formatFileSize(file.size)}</p>
                </div>

                {/* Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(file.url, '_blank')
                      }}
                      className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
                      title="Visualizar"
                    >
                      <Eye className="w-3 h-3 text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(file)
                      }}
                      className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
                      title="Deletar"
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFiles.length === 0 && (
            <div className="text-center py-12">
              <Image className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum arquivo encontrado</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MediaUpload