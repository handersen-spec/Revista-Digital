import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

const ROOT = process.cwd()
const UPLOAD_ROOT = path.join(ROOT, 'public', 'uploads')
const META_PATH = path.join(UPLOAD_ROOT, 'meta.json')

type MetaEntry = { tags?: string[], group?: string, thumbName?: string }
type MetaMap = Record<string, MetaEntry>

async function readMeta(): Promise<MetaMap> {
  try {
    const buf = await fs.readFile(META_PATH)
    const data = JSON.parse(buf.toString())
    return data || {}
  } catch {
    return {}
  }
}

async function writeMeta(meta: MetaMap) {
  await fs.mkdir(UPLOAD_ROOT, { recursive: true })
  await fs.writeFile(META_PATH, JSON.stringify(meta, null, 2))
}

export async function GET() {
  try {
    const meta = await readMeta()
    return NextResponse.json({ meta })
  } catch (err: any) {
    console.error('GET /api/media/meta error', err)
    return NextResponse.json({ error: 'Falha ao ler metadados' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => null) as { type?: string, name?: string, tags?: string[], group?: string, thumbName?: string } | null
    const type = body?.type
    const name = body?.name
    if (!type || !name) {
      return NextResponse.json({ error: 'type e name são obrigatórios' }, { status: 400 })
    }
    const key = `${type}/${name}`
    const meta = await readMeta()
    const entry = meta[key] || {}
    if (Array.isArray(body?.tags)) entry.tags = body!.tags
    if (typeof body?.group === 'string') entry.group = body!.group
    if (typeof body?.thumbName === 'string') entry.thumbName = body!.thumbName
    meta[key] = entry
    await writeMeta(meta)
    return NextResponse.json({ success: true, entry })
  } catch (err: any) {
    console.error('PATCH /api/media/meta error', err)
    return NextResponse.json({ error: 'Falha ao atualizar metadados' }, { status: 500 })
  }
}