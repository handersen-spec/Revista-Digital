"use client"
import { useEffect, useRef, useState } from 'react'
import { useHeroCarousel, HeroCarouselItem } from '@/hooks/useHeroCarousel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MediaUpload from '@/components/admin/MediaUpload'

export default function AdminCarrosselPage() {
  const { items, reload, loading, error } = useHeroCarousel()
  const [savedRowId, setSavedRowId] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [localItems, setLocalItems] = useState<HeroCarouselItem[]>([])
  const saveTimers = useRef<Record<string, number>>({})
  const bcRef = useRef<BroadcastChannel | null>(null)
  const [pending, setPending] = useState<Record<number, boolean>>({})
  const DEBOUNCE_MS = Number(process.env.NEXT_PUBLIC_CAROUSEL_DEBOUNCE_MS ?? '') || 500
  const [imagePickerForId, setImagePickerForId] = useState<number | null>(null)
  const [newImagePickerOpen, setNewImagePickerOpen] = useState(false)
  const [newItem, setNewItem] = useState<HeroCarouselItem>({
    title: '',
    subtitle: '',
    description: '',
    details: '',
    bgImage: "radial-gradient(ellipse at 70% 30%, rgba(185,28,28,0.35) 0%, rgba(185,28,28,0.10) 40%, rgba(0,0,0,0) 60%), linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #0a0a0a 100%)",
    categoria: 'geral',
    active: true,
    ordem: (items?.length || 0),
  })

  async function createItem() {
    const res = await fetch('/api/hero-carousel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    })
    if (!res.ok) {
      alert('Falha ao criar item')
      return
    }
    setNewItem({
      title: '', subtitle: '', description: '', details: '', categoria: 'geral', active: true, ordem: (items?.length || 0) + 1, bgImage: "radial-gradient(ellipse at 70% 30%, rgba(185,28,28,0.35) 0%, rgba(185,28,28,0.10) 40%, rgba(0,0,0,0) 60%), linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #0a0a0a 100%)"
    })
    reload()
    setToast('Slide criado')
    setTimeout(() => setToast(null), 1800)
    bcRef.current?.postMessage({ type: 'reload' })
  }

  async function updateItem(id: number, partial: Partial<HeroCarouselItem>) {
    if (!id) {
      alert('Este slide é apenas um exemplo. Crie um novo para editar.')
      return
    }
    const res = await fetch(`/api/hero-carousel/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partial),
    })
    if (!res.ok) {
      alert('Falha ao atualizar item')
      return
    }
    reload()
  }

  async function handleUpdate(id: number, partial: Partial<HeroCarouselItem>) {
    await updateItem(id, partial)
    setSavedRowId(id)
    setTimeout(() => setSavedRowId(null), 1500)
    setToast('Alterações salvas')
    setTimeout(() => setToast(null), 1800)
    bcRef.current?.postMessage({ type: 'reload' })
  }

  async function deleteItem(id: number) {
    if (!id) {
      alert('Este slide é apenas um exemplo e não pode ser removido.')
      return
    }
    if (!confirm('Remover este item?')) return
    const res = await fetch(`/api/hero-carousel/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      alert('Falha ao remover item')
      return
    }
    reload()
    setToast('Slide removido')
    setTimeout(() => setToast(null), 1800)
    bcRef.current?.postMessage({ type: 'reload' })
  }

  async function moveItemUp(id: number) {
    if (!id) return
    const sorted = [...items].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0) || (a.id ?? 0) - (b.id ?? 0))
    const idx = sorted.findIndex(i => i.id === id)
    if (idx <= 0) return
    const current = sorted[idx]
    const above = sorted[idx - 1]
    const curOrder = current.ordem ?? idx
    const aboveOrder = above.ordem ?? (idx - 1)
    // swap orders atomically
    await Promise.all([
      fetch(`/api/hero-carousel/${current.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ordem: aboveOrder })
      }),
      fetch(`/api/hero-carousel/${above.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ordem: curOrder })
      })
    ])
    reload()
    setToast('Ordem atualizada')
    setTimeout(() => setToast(null), 1500)
    bcRef.current?.postMessage({ type: 'reload' })
  }

  async function moveItemDown(id: number) {
    if (!id) return
    const sorted = [...items].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0) || (a.id ?? 0) - (b.id ?? 0))
    const idx = sorted.findIndex(i => i.id === id)
    if (idx === -1 || idx >= sorted.length - 1) return
    const current = sorted[idx]
    const below = sorted[idx + 1]
    const curOrder = current.ordem ?? idx
    const belowOrder = below.ordem ?? (idx + 1)
    // swap orders atomically
    await Promise.all([
      fetch(`/api/hero-carousel/${current.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ordem: belowOrder })
      }),
      fetch(`/api/hero-carousel/${below.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ordem: curOrder })
      })
    ])
    reload()
    setToast('Ordem atualizada')
    setTimeout(() => setToast(null), 1500)
    bcRef.current?.postMessage({ type: 'reload' })
  }

  // Edição dinâmica: mantém cópia local e salva com debounce
  function scheduleUpdate<T extends keyof HeroCarouselItem>(id: number, field: T, value: HeroCarouselItem[T]) {
    if (!id) {
      alert('Este slide é apenas um exemplo. Crie um novo para editar.')
      return
    }
    setLocalItems(prev => prev.map(it => (it.id === id ? { ...it, [field]: value } : it)))
    const key = `${id}:${String(field)}`
    if (saveTimers.current[key]) {
      clearTimeout(saveTimers.current[key])
    }
    setPending(prev => ({ ...prev, [id]: true }))
    saveTimers.current[key] = window.setTimeout(async () => {
      try {
        await handleUpdate(id, { [field]: value } as Partial<HeroCarouselItem>)
      } finally {
        setPending(prev => ({ ...prev, [id]: false }))
      }
    }, DEBOUNCE_MS)
  }

  useEffect(() => {
    // Evita que itens sem id (fallbacks) sejam editáveis no Admin
    setLocalItems(items.filter(i => i.id != null))
  }, [items])

  useEffect(() => {
    if (typeof window === 'undefined') return
    bcRef.current = new BroadcastChannel('hero-carousel')
    return () => bcRef.current?.close()
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Carrossel do Hero</h1>
      <p className="text-sm text-slate-600 mb-6">Gerencie os slides que aparecem no topo da Home.</p>

      {loading && <div className="text-sm">Carregando...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
        <h2 className="text-lg font-semibold mb-3">Adicionar novo slide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Título"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          />
          <Input
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Subtítulo"
            value={newItem.subtitle || ''}
            onChange={(e) => setNewItem({ ...newItem, subtitle: e.target.value })}
          />
          <Input
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Categoria"
            value={newItem.categoria || ''}
            onChange={(e) => setNewItem({ ...newItem, categoria: e.target.value })}
          />
          <Input
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Gradiente/Background CSS"
            value={newItem.bgImage || ''}
            onChange={(e) => setNewItem({ ...newItem, bgImage: e.target.value })}
          />
          {/* Prévia e seleção de imagem para novo slide */}
          <div className="md:col-span-2 flex items-center gap-3">
            <div
              className="h-16 w-28 rounded border border-gray-300 bg-cover bg-center"
              style={{ backgroundImage: newItem.bgImage || "radial-gradient(ellipse at 70% 30%, rgba(185,28,28,0.35) 0%, rgba(185,28,28,0.10) 40%, rgba(0,0,0,0) 60%), linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #0a0a0a 100%)" }}
            />
            <button
              type="button"
              className="px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
              onClick={() => setNewImagePickerOpen(true)}
            >Selecionar imagem</button>
            <button
              type="button"
              className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
              onClick={() => setNewItem({ ...newItem, bgImage: "radial-gradient(ellipse at 70% 30%, rgba(185,28,28,0.35) 0%, rgba(185,28,28,0.10) 40%, rgba(0,0,0,0) 60%), linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #0a0a0a 100%)" })}
            >Usar gradiente padrão</button>
            <span className="text-xs text-slate-500">Você pode usar um CSS como <code>linear-gradient(...)</code> ou escolher uma imagem.</span>
          </div>
          <textarea
            className="md:col-span-2 w-full min-h-[96px] rounded-lg px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            placeholder="Descrição"
            value={newItem.description || ''}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
          <textarea
            className="md:col-span-2 w-full min-h-[96px] rounded-lg px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            placeholder="Detalhes"
            value={newItem.details || ''}
            onChange={(e) => setNewItem({ ...newItem, details: e.target.value })}
          />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={newItem.active ?? true}
              onChange={(e) => setNewItem({ ...newItem, active: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            Ativo
          </label>
              <Input className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" type="number" placeholder="Ordem" value={newItem.ordem ?? 0}
                 onChange={(e) => setNewItem({ ...newItem, ordem: Number(e.target.value) })} />
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            onClick={createItem}
          >
            Adicionar
          </button>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Slides atuais</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-h-[420px] overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-gray-700">
            <tr>
              <th className="text-left p-2 sticky top-0 z-10 bg-gray-50">Imagem</th>
              <th className="text-left p-2 sticky top-0 z-10 bg-gray-50">Título</th>
              <th className="text-left p-2 sticky top-0 z-10 bg-gray-50">Subtítulo</th>
              <th className="text-left p-2 sticky top-0 z-10 bg-gray-50">Categoria</th>
              <th className="text-left p-2 sticky top-0 z-10 bg-gray-50">Ordem</th>
              <th className="text-left p-2 sticky top-0 z-10 bg-gray-50">Ativo</th>
              <th className="text-left p-2 sticky top-0 z-10 bg-gray-50">Ações</th>
            </tr>
          </thead>
          <tbody>
            {[...localItems].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0) || (a.id ?? 0) - (b.id ?? 0)).map((item, index) => (
              <tr key={item.id ?? `${item.title}-${item.ordem ?? index}`} className="border-t border-gray-200 odd:bg-white even:bg-gray-50">
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-16 rounded border border-gray-300 bg-cover bg-center" style={{ backgroundImage: item.bgImage || "radial-gradient(ellipse at 70% 30%, rgba(185,28,28,0.35) 0%, rgba(185,28,28,0.10) 40%, rgba(0,0,0,0) 60%), linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #0a0a0a 100%)" }} />
                    <button
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs"
                      onClick={() => setImagePickerForId(item.id!)}
                      disabled={!!pending[item.id!]}
                    >Editar imagem</button>
                  </div>
                </td>
                <td className="p-2">
                  <Input className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent w-full" value={item.title} onChange={(e) => scheduleUpdate(item.id!, 'title', (e.target as HTMLInputElement).value)} />
                </td>
                <td className="p-2">
                  <Input className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent w-full" value={item.subtitle || ''} onChange={(e) => scheduleUpdate(item.id!, 'subtitle', (e.target as HTMLInputElement).value)} />
                </td>
                <td className="p-2">
                  <Input className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent w-full" value={item.categoria || ''} onChange={(e) => scheduleUpdate(item.id!, 'categoria', (e.target as HTMLInputElement).value)} />
                </td>
                <td className="p-2">
                  <Input className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" type="number" value={item.ordem ?? 0} onChange={(e) => scheduleUpdate(item.id!, 'ordem', Number((e.target as HTMLInputElement).value))} />
                </td>
                <td className="p-2">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.active ?? true}
                      onChange={(e) => scheduleUpdate(item.id!, 'active', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="sr-only">Ativo</span>
                  </label>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                      title="Mover para cima"
                      onClick={() => moveItemUp(item.id!)}
                      disabled={!!pending[item.id!]}
                    >↑</button>
                    <button
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                      title="Mover para baixo"
                      onClick={() => moveItemDown(item.id!)}
                      disabled={!!pending[item.id!]}
                    >↓</button>
                    <span className={"text-xs " + (pending[item.id!] ? 'text-slate-500' : 'text-green-600')}>
                      {pending[item.id!] ? 'Salvando…' : (savedRowId === item.id ? 'Salvo' : '')}
                    </span>
                    <button
                      className="ml-auto px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                      onClick={() => deleteItem(item.id!)}
                      disabled={!!pending[item.id!]}
                    >
                      Remover
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!localItems.length && (
              <tr>
                <td className="p-3 text-gray-500" colSpan={7}>Nenhum slide cadastrado ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {toast && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white text-sm px-4 py-2 rounded shadow-lg">
          {toast}
        </div>
      )}

      {/* Seletor de imagem para bgImage */}
      {imagePickerForId !== null && (
        <MediaUpload
          isOpen={true}
          onClose={() => setImagePickerForId(null)}
          acceptedTypes={["image/*"]}
          onSelect={(file) => {
            const id = imagePickerForId
            if (id !== null) {
              scheduleUpdate(id, 'bgImage', (`url('${file.url}')`) as unknown as string)
            }
            setImagePickerForId(null)
          }}
        />
      )}

      {/* Seletor de imagem para novo slide */}
      {newImagePickerOpen && (
        <MediaUpload
          isOpen={true}
          onClose={() => setNewImagePickerOpen(false)}
          acceptedTypes={["image/*"]}
          onSelect={(file) => {
            setNewItem(prev => ({ ...prev, bgImage: `url('${file.url}')` }))
            setNewImagePickerOpen(false)
          }}
        />
      )}
    </div>
  )
}