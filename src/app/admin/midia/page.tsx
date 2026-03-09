"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMidiaList, useUploadMidia, useDeleteMidia, useRenameMidia } from '@/hooks/useMidia'
import type { MediaItem, MediaType } from '@/types/media'
import Modal from '@/components/Modal'
import { Images, Video, FileText, Upload, X, Trash2, Loader2, Eye, Check, Copy, Edit, Search } from 'lucide-react'

type TabKey = MediaType | 'all'
const TABS: { key: TabKey, label: string, icon: any }[] = [
  { key: 'all', label: 'Todos', icon: Images },
  { key: 'image', label: 'Imagens', icon: Images },
  { key: 'video', label: 'Vídeos', icon: Video },
  { key: 'document', label: 'Documentos', icon: FileText },
  { key: 'other', label: 'Outros', icon: FileText },
]

export default function AdminMidiaPage() {
  const [type, setType] = useState<TabKey>('image')
  const [search, setSearch] = useState('')
  const isAll = type === 'all'
  const { items, loading, error, reload } = useMidiaList({ type: isAll ? undefined : (type as MediaType), search })
  const { upload, loading: uploading, error: uploadError } = useUploadMidia()
  const { remove, loading: deleting } = useDeleteMidia()
  const { rename, loading: renaming, error: renameError } = useRenameMidia()
  const [preview, setPreview] = useState<MediaItem | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [editing, setEditing] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [editTags, setEditTags] = useState<Record<string, string>>({})
  const [editGroup, setEditGroup] = useState<Record<string, string>>({})
  const [dragging, setDragging] = useState(false)

  useEffect(() => { setMessage(null) }, [type, search])

  const gridItems = useMemo(() => items, [items])
  const counts = useMemo(() => ({
    total: items.length,
    image: items.filter(i => i.type === 'image').length,
    video: items.filter(i => i.type === 'video').length,
    document: items.filter(i => i.type === 'document').length,
    other: items.filter(i => i.type === 'other').length,
  }), [items])

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return
    setMessage(null)
    for (const file of Array.from(files)) {
      const saved = await upload(file, isAll ? undefined : (type as MediaType))
      if (saved) setMessage('Arquivo enviado com sucesso.')
    }
    reload()
    setTimeout(() => setMessage(null), 2500)
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm(`Apagar ${item.name}?`)) return
    const ok = await remove(item.type, item.name)
    if (ok) {
      setMessage('Arquivo removido.')
      reload()
      setTimeout(() => setMessage(null), 2000)
    }
  }

  function keyOf(item: MediaItem) { return `${item.type}:${item.name}` }
  function toggleSelect(item: MediaItem) {
    const k = keyOf(item)
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })
  }

  async function handleBulkDelete() {
    if (!selected.size) return
    if (!confirm(`Apagar ${selected.size} arquivos selecionados?`)) return
    for (const k of Array.from(selected)) {
      const [typeStr, name] = k.split(':')
      await remove(typeStr as MediaType, name)
    }
    setSelected(new Set())
    reload()
    setMessage('Arquivos removidos.')
    setTimeout(() => setMessage(null), 2000)
  }

  async function handleCopyUrls() {
    const urls = items.filter(i => selected.has(keyOf(i))).map(i => i.url).join('\n')
    if (!urls) return
    await navigator.clipboard.writeText(urls)
    setMessage('URLs copiadas para a área de transferência.')
    setTimeout(() => setMessage(null), 2000)
  }

  async function handleRename(item: MediaItem) {
    if (!newName.trim()) return
    const res = await rename(item.type, item.name, newName.trim())
    if (res) {
      setMessage('Arquivo renomeado.')
      setEditing(null)
      setNewName('')
      reload()
      setTimeout(() => setMessage(null), 2000)
    }
  }

  async function handleSaveMeta(item: MediaItem) {
    const tagsStr = editTags[keyOf(item)] || ''
    const groupStr = editGroup[keyOf(item)] || ''
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean)
    const res = await fetch('/api/media/meta', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: item.type, name: item.name, tags, group: groupStr })
    })
    if (res.ok) {
      setMessage('Metadados atualizados.')
      reload()
      setTimeout(() => setMessage(null), 2000)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Biblioteca de Mídia</h1>
          <p className="text-gray-600 mt-1">Gerencie imagens, vídeos, documentos e outros arquivos.</p>
        </div>
        {(loading || uploading || deleting) && (
          <span className="inline-flex items-center text-sm text-gray-600"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Processando…</span>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Arquivos</p>
              <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Images className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">Todos os tipos</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Imagens</p>
              <p className="text-2xl font-bold text-gray-900">{counts.image}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Images className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">Arquivos de imagem</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vídeos</p>
              <p className="text-2xl font-bold text-gray-900">{counts.video}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Video className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">Arquivos de vídeo</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Documentos</p>
              <p className="text-2xl font-bold text-gray-900">{counts.document}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">PDFs e outros</div>
        </div>
      </div>
      {/* Container em estilo Ferramentas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Abas de categorias */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setType(t.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  type === t.key
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {t.key === 'all' ? counts.total : (counts as any)[t.key]}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Busca */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar pelo nome"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

      {error && (
        <div className="mb-4 text-red-700 bg-red-50 border border-red-200 rounded p-3 text-sm">{error}</div>
      )}
      {(uploadError || renameError) && (
        <div className="mb-4 text-red-700 bg-red-50 border border-red-200 rounded p-3 text-sm">{uploadError}</div>
      )}
      {message && (
        <div className="mb-4 inline-flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 text-sm"><Check className="h-4 w-4"/>{message}</div>
      )}

      

        {/* Conteúdo */}
        <div className="p-6">
      {/* Upload */}
      <div className="bg-white border rounded-lg p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium">Enviar arquivos ({isAll ? 'Automático' : type})</div>
          <button className="btn-base inline-flex items-center" onClick={() => inputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4"/> Selecionar arquivos
          </button>
          <input ref={inputRef} type="file" hidden multiple onChange={(e) => handleFiles(e.target.files)} />
        </div>
        <div
          className={`relative rounded-lg p-10 text-center transition border-2 border-dashed ${dragging ? 'border-red-500 bg-red-50 ring-2 ring-red-500/20' : 'border-gray-300 bg-gray-50'} text-gray-700`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white border flex items-center justify-center shadow-sm">
              <Upload className="h-6 w-6 text-gray-500"/>
            </div>
            <div className="text-sm font-medium">
              {dragging ? 'Solte para enviar' : 'Arraste arquivos para enviar'}
            </div>
            <div className="text-xs text-gray-500">
              Formatos: JPG, PNG, WEBP, MP4, PDF • Tamanho máx. recomendado 10MB
            </div>
            <button
              type="button"
              className="btn-base btn-ghost mt-2"
              onClick={() => inputRef.current?.click()}
            >
              Ou clique para selecionar
            </button>
          </div>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4 text-sm flex items-center gap-2">
          <span>{selected.size} selecionado(s).</span>
          <button className="btn-base btn-ghost" onClick={handleCopyUrls}><Copy className="h-4 w-4 mr-1"/> Copiar URLs</button>
          <button className="btn-base btn-danger" onClick={handleBulkDelete}><Trash2 className="h-4 w-4 mr-1"/> Apagar Selecionados</button>
          <button className="ml-auto btn-base btn-ghost" onClick={() => setSelected(new Set())}>Limpar seleção</button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {gridItems.map(item => (
          <div key={item.url} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
            <div className="relative aspect-square bg-white cursor-pointer" onClick={() => setPreview(item)}>
              
              {item.type === 'image' ? (
                item.url ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <Images className="h-8 w-8" />
                    <span className="sr-only">Imagem indisponível</span>
                  </div>
                )
              ) : item.type === 'video' ? (
                <video src={item.url} className="w-full h-full object-cover" muted preload="metadata"/>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <FileText className="h-8 w-8"/>
                </div>
              )}
            </div>
          </div>
        ))}
        {!gridItems.length && (
          <div className="col-span-full text-sm text-slate-500">Nenhum arquivo encontrado.</div>
        )}
      </div>
        </div>
      </div>

      {/* Preview Modal */}
      {preview && (
        <Modal isOpen={true} onClose={() => setPreview(null)} title={preview.name}>
          <div className="space-y-3">
            <div className="rounded border overflow-hidden">
              {preview.type === 'image' ? (
                preview.url ? (
                  <img src={preview.url} alt={preview.name} className="max-h-[60vh] w-full object-contain"/>
                ) : (
                  <div className="w-full h-[60vh] flex items-center justify-center text-gray-500">
                    <Images className="h-10 w-10" />
                    <span className="sr-only">Imagem indisponível</span>
                  </div>
                )
              ) : preview.type === 'video' ? (
                <video src={preview.url} className="max-h-[60vh] w-full" controls />
              ) : preview.ext?.toLowerCase() === '.pdf' ? (
                <embed src={preview.url} type="application/pdf" className="w-full h-[60vh]" />
              ) : (
                <a href={preview.url} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm">Abrir arquivo</a>
              )}
            </div>
            {/* Barra de ações fora da imagem (sem sobreposição) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="btn-base btn-ghost inline-flex items-center" onClick={() => navigator.clipboard.writeText(preview.url)}>
                  <Copy className="mr-2 h-4 w-4"/> Copiar URL
                </button>
                <a className="btn-base btn-ghost inline-flex items-center" href={preview.url} target="_blank" rel="noreferrer">
                  <Eye className="mr-2 h-4 w-4"/> Abrir nova aba
                </a>
              </div>
              <button className="btn-base inline-flex items-center" onClick={() => setPreview(null)}>
                <X className="mr-2 h-4 w-4"/> Fechar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}