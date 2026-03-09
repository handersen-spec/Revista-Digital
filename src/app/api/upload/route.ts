import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readdir, stat, unlink } from 'fs/promises'
import { join, extname } from 'path'
import { existsSync } from 'fs'

interface UploadResponse {
  success: boolean
  url?: string
  filename?: string
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'image'
    
    if (!file) {
      return NextResponse.json<UploadResponse>({
        success: false,
        error: 'Nenhum arquivo foi enviado'
      }, { status: 400 })
    }

    // Validar tipo de arquivo
    const allowedTypes = {
      // Para imagens, aceita qualquer MIME que comece com image/
      imageWildcard: 'image/',
      video: ['video/mp4', 'video/webm', 'video/ogg'],
      document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    }

    const isValidImage = type === 'image' && typeof file.type === 'string' && file.type.startsWith(allowedTypes.imageWildcard)
    const isValidVideo = type === 'video' && allowedTypes.video.includes(file.type)
    const isValidDocument = type === 'document' && allowedTypes.document.includes(file.type)

    if (!(isValidImage || isValidVideo || isValidDocument)) {
      const errMsg = type === 'image'
        ? 'Tipo de arquivo não permitido. Para imagens, use formatos válidos (image/*).'
        : `Tipo de arquivo não permitido. Tipos aceitos: ${(allowedTypes[type as 'video' | 'document'] || []).join(', ')}`
      return NextResponse.json<UploadResponse>({
        success: false,
        error: errMsg
      }, { status: 400 })
    }

    // Validar tamanho do arquivo (10MB para imagens, 100MB para vídeos)
    const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json<UploadResponse>({
        success: false,
        error: `Arquivo muito grande. Tamanho máximo: ${maxSize / (1024 * 1024)}MB`
      }, { status: 400 })
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}_${originalName}`
    
    // Definir diretório de upload
    const uploadDir = join(process.cwd(), 'public', 'uploads', type)
    
    // Criar diretório se não existir
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Salvar arquivo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(uploadDir, filename)
    
    await writeFile(filePath, buffer)

    // Retornar URL do arquivo
    const fileUrl = `/uploads/${type}/${filename}`

    return NextResponse.json<UploadResponse>({
      success: true,
      url: fileUrl,
      filename: filename
    })

  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json<UploadResponse>({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// Endpoint para listar arquivos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'image'
    const rawPage = parseInt(searchParams.get('page') || '1')
    const rawLimit = parseInt(searchParams.get('limit') || '20')
    const page = Math.max(1, isNaN(rawPage) ? 1 : rawPage)
    const limit = Math.max(1, Math.min(isNaN(rawLimit) ? 20 : rawLimit, 100))

    const uploadDir = join(process.cwd(), 'public', 'uploads', type)

    if (!existsSync(uploadDir)) {
      return NextResponse.json({
        success: true,
        files: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      })
    }

    const allFiles = await readdir(uploadDir)

    // Inferir MIME type pela extensão do arquivo
    const inferMimeFromFilename = (filename: string, folderType: string) => {
      const ext = extname(filename || '').toLowerCase()
      if (folderType === 'image') {
        switch (ext) {
          case '.jpg':
          case '.jpeg':
            return 'image/jpeg'
          case '.png':
            return 'image/png'
          case '.webp':
            return 'image/webp'
          case '.avif':
            return 'image/avif'
          case '.gif':
            return 'image/gif'
          case '.svg':
            return 'image/svg+xml'
          default:
            return 'image/*'
        }
      }
      if (folderType === 'video') {
        switch (ext) {
          case '.mp4':
            return 'video/mp4'
          case '.webm':
            return 'video/webm'
          case '.ogg':
            return 'video/ogg'
          default:
            return 'video/*'
        }
      }
      if (folderType === 'document') {
        switch (ext) {
          case '.pdf':
            return 'application/pdf'
          case '.doc':
            return 'application/msword'
          case '.docx':
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          default:
            return 'application/octet-stream'
        }
      }
      return 'application/octet-stream'
    }

    const filesWithMeta = await Promise.all(allFiles.map(async (filename) => {
      const filePath = join(uploadDir, filename)
      const s = await stat(filePath)
      const mimeType = inferMimeFromFilename(filename, type)
      return {
        id: filename,
        filename,
        url: `/uploads/${type}/${filename}`,
        type: mimeType,
        size: s.size,
        uploadedAt: s.birthtime.toISOString()
      }
    }))

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedFiles = filesWithMeta.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      files: paginatedFiles,
      pagination: {
        page,
        limit,
        total: filesWithMeta.length,
        totalPages: Math.ceil(filesWithMeta.length / limit)
      }
    })

  } catch (error) {
    console.error('Erro ao listar arquivos:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// Endpoint para deletar arquivo
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    const type = searchParams.get('type') || 'image'

    if (!filename) {
      return NextResponse.json({
        success: false,
        error: 'Nome do arquivo é obrigatório'
      }, { status: 400 })
    }

    // Deletar arquivo do sistema de arquivos, assegurando caminho seguro
    const safeName = filename.replace(/\/+|\\+/g, '')
    const filePath = join(process.cwd(), 'public', 'uploads', type, safeName)

    if (!existsSync(filePath)) {
      return NextResponse.json({
        success: false,
        error: 'Arquivo não encontrado'
      }, { status: 404 })
    }

    await unlink(filePath)

    return NextResponse.json({
      success: true,
      message: 'Arquivo deletado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao deletar arquivo:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}