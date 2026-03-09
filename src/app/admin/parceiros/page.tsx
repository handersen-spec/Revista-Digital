"use client"
import { useEffect, useMemo, useState } from 'react'
import type { Partner } from '@/types/partner'

export default function AdminParceirosPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [partners, setPartners] = useState<Partner[]>([])

  const [name, setName] = useState('')
  const [type, setType] = useState<'dealership' | 'insurance' | 'service' | 'publisher'>('dealership')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [website, setWebsite] = useState('')
  const [logo, setLogo] = useState('')
  const [description, setDescription] = useState('')
  const [specialties, setSpecialties] = useState('')

  const canSubmit = useMemo(() => {
    return name.trim() && type && email.trim() && phone.trim() && address.trim() && province.trim()
  }, [name, type, email, phone, address, province])

  async function loadPartners() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/partners?limit=50`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Falha ao carregar parceiros')
      const data = await res.json()
      setPartners(data.partners || [])
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar parceiros')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPartners()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const body = {
        name: name.trim(),
        type,
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        province: province.trim(),
        website: website.trim() || undefined,
        logo: logo.trim() || undefined,
        description: description.trim() || '',
        specialties: specialties
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
      }
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Falha ao criar parceiro')
      }
      setSuccess('Parceiro criado com sucesso')
      // reset parcial
      setName('')
      setEmail('')
      setPhone('')
      setAddress('')
      setCity('')
      setProvince('')
      setWebsite('')
      setLogo('')
      setDescription('')
      setSpecialties('')
      await loadPartners()
    } catch (err: any) {
      setError(err?.message || 'Erro ao criar parceiro')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!id) return
    const ok = confirm('Confirma remover este parceiro?')
    if (!ok) return
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch(`/api/partners/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Falha ao remover parceiro')
      }
      setSuccess('Parceiro removido com sucesso')
      await loadPartners()
    } catch (err: any) {
      setError(err?.message || 'Erro ao remover parceiro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-2">Admin • Parceiros</h1>
      <p className="text-sm text-slate-600">Gerencie os parceiros e concessionárias cadastrados.</p>

      {error && (
        <div className="rounded-md bg-red-50 text-red-700 p-3 text-sm">{error}</div>
      )}
      {success && (
        <div className="rounded-md bg-green-50 text-green-700 p-3 text-sm">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h2 className="text-lg font-medium">Criar Parceiro</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Nome *</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm mb-1">Tipo *</label>
            <select value={type} onChange={e => setType(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent">
              <option value="dealership">Concessionária</option>
              <option value="insurance">Seguradora</option>
              <option value="service">Serviço</option>
              <option value="publisher">Editora/Media</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Email *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm mb-1">Telefone *</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm mb-1">Endereço *</label>
            <input value={address} onChange={e => setAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm mb-1">Cidade</label>
            <input value={city} onChange={e => setCity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm mb-1">Província *</label>
            <input value={province} onChange={e => setProvince(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm mb-1">Website</label>
            <input value={website} onChange={e => setWebsite(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm mb-1">Logo (URL)</label>
            <input value={logo} onChange={e => setLogo(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Descrição</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white" rows={3} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Especialidades (separadas por vírgula)</label>
            <input value={specialties} onChange={e => setSpecialties(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
        </div>
        <div className="flex gap-2">
          <button disabled={!canSubmit || loading} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
            {loading ? 'Processando…' : 'Criar Parceiro'}
          </button>
          <button type="button" onClick={loadPartners} className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50 transition-colors">
            Atualizar Lista
          </button>
        </div>
      </form>

      <div className="space-y-2">
        <h2 className="text-lg font-medium">Parceiros ({partners.length})</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="text-left p-2">Nome</th>
                <th className="text-left p-2">Tipo</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Província</th>
                <th className="text-left p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {partners.map(p => (
                <tr key={p.id} className="border-t border-gray-200">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.type}</td>
                  <td className="p-2">{p.status}</td>
                  <td className="p-2">{p.email}</td>
                  <td className="p-2">{p.province}</td>
                  <td className="p-2">
                    <button onClick={() => handleDelete(p.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
              {!partners.length && (
                <tr>
                  <td className="p-3 text-gray-500" colSpan={6}>Nenhum parceiro cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}