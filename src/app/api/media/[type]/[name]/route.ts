import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { type MediaType } from '@/types/media'

const ROOT = process.cwd()
const UPLOAD_ROOT = path.join(ROOT, 'public', 'uploads')

export async function DELETE(_req: Request, { params }: { params: { type: string, name: string } }) {
  try {
    const type = params.type as MediaType
    const name = params.name
    if (!type || !name) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })
    }
    const dir = path.join(UPLOAD_ROOT, type)
    const fullPath = path.join(dir, name)
    await fs.unlink(fullPath)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('DELETE /api/media/[type]/[name] error', err)
    return NextResponse.json({ error: 'Falha ao apagar arquivo' }, { status: 500 })
  }
}

function sanitizeName(name: string) {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
}

export async function PATCH(req: Request, { params }: { params: { type: string, name: string } }) {
  try {
    const type = params.type as MediaType
    const oldName = params.name
    if (!type || !oldName) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })
    }
    const body = await req.json().catch(() => null) as { newName?: string } | null
    const rawNewName = body?.newName?.trim()
    if (!rawNewName) {
      return NextResponse.json({ error: 'Novo nome é obrigatório' }, { status: 400 })
    }
    const dir = path.join(UPLOAD_ROOT, type)
    const oldPath = path.join(dir, oldName)
    const oldExt = path.extname(oldName)
    const newSanitized = sanitizeName(rawNewName)
    const newExt = path.extname(newSanitized) || oldExt
    const base = path.basename(newSanitized, path.extname(newSanitized))
    const finalName = `${base}${newExt}`
    const newPath = path.join(dir, finalName)

    // Evita sobrescrever arquivos existentes
    try {
      await fs.access(newPath)
      return NextResponse.json({ error: 'Já existe um arquivo com esse nome' }, { status: 409 })
    } catch {
      // OK: newPath não existe
    }

    await fs.rename(oldPath, newPath)
    const stats = await fs.stat(newPath)
    const url = `/uploads/${type}/${finalName}`
    return NextResponse.json({ item: { name: finalName, url, type, size: stats.size, createdAt: stats.birthtime?.toISOString?.(), ext: path.extname(finalName) } })
  } catch (err: any) {
    console.error('PATCH /api/media/[type]/[name] error', err)
    return NextResponse.json({ error: 'Falha ao renomear arquivo' }, { status: 500 })
  }
}