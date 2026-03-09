import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'
import { type MediaItem, type MediaType } from '@/types/media'

const ROOT = process.cwd()
const UPLOAD_ROOT = path.join(ROOT, 'public', 'uploads')

const TYPE_DIR: Record<MediaType, string> = {
  image: 'image',
  video: 'video',
  document: 'document',
  other: 'other',
}

async function ensureDirs() {
  await fs.mkdir(UPLOAD_ROOT, { recursive: true })
  for (const dir of Object.values(TYPE_DIR)) {
    const p = path.join(UPLOAD_ROOT, dir)
    if (!existsSync(p)) {
      await fs.mkdir(p, { recursive: true })
    }
  }
}

function detectTypeByExt(ext: string): MediaType {
  const e = ext.toLowerCase()
  if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(e)) return 'image'
  if (['.mp4', '.webm', '.mov', '.mkv'].includes(e)) return 'video'
  if (['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'].includes(e)) return 'document'
  return 'other'
}

function toItem(file: string, type: MediaType, stats: any): MediaItem {
  const url = `/uploads/${TYPE_DIR[type]}/${file}`
  const ext = path.extname(file)
  return {
    name: file,
    url,
    type,
    size: stats?.size ?? 0,
    createdAt: stats?.birthtime?.toISOString?.() ?? undefined,
    ext,
  }
}

export async function GET(req: Request) {
  try {
    await ensureDirs()
    const { searchParams } = new URL(req.url)
    const typeParamRaw = searchParams.get('type') as string | null
    const search = (searchParams.get('search') || '').toLowerCase()

    let types: MediaType[] = ['image', 'video', 'document', 'other']
    if (typeParamRaw && typeParamRaw !== 'all') {
      types = [typeParamRaw as MediaType]
    }
    const items: MediaItem[] = []

    for (const t of types) {
      const dir = path.join(UPLOAD_ROOT, TYPE_DIR[t])
      const files = await fs.readdir(dir)
      for (const file of files) {
        const stats = await fs.stat(path.join(dir, file))
        if (search && !file.toLowerCase().includes(search)) continue
        items.push(toItem(file, t, stats))
      }
    }

    // Ordena por data decrescente se disponível, caso contrário por nome
    items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '') || b.name.localeCompare(a.name))

    return NextResponse.json({ items })
  } catch (err: any) {
    console.error('GET /api/media error', err)
    return NextResponse.json({ error: 'Falha ao listar mídia' }, { status: 500 })
  }
}

function sanitizeName(name: string) {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
}

export async function POST(req: Request) {
  try {
    await ensureDirs()
    const form = await req.formData()
    const file = form.get('file') as File | null
    const type = (form.get('type') as string | null) as MediaType | null
    if (!file) {
      return NextResponse.json({ error: 'Arquivo é obrigatório' }, { status: 400 })
    }
    const buf = Buffer.from(await file.arrayBuffer())
    const origName = sanitizeName(file.name || 'file')
    const ext = path.extname(origName) || ''
    const finalType: MediaType = type || detectTypeByExt(ext)
    const dir = path.join(UPLOAD_ROOT, TYPE_DIR[finalType])
    const name = `${Date.now()}_${origName}`
    const fullPath = path.join(dir, name)
    await fs.writeFile(fullPath, buf)
    const stats = await fs.stat(fullPath)
    const item = toItem(name, finalType, stats)
    return NextResponse.json({ item }, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/media error', err)
    return NextResponse.json({ error: 'Falha ao enviar arquivo' }, { status: 500 })
  }
}