import fs from 'fs'
import path from 'path'

export interface Concessionaria {
  id: string
  nome: string
  marca: string
  endereco: string
  cidade: string
  provincia: string
  telefone: string
  email: string
  website: string | null
  horarioFuncionamento: {
    segunda: string
    terca: string
    quarta: string
    quinta: string
    sexta: string
    sabado: string
    domingo: string
  }
  coordenadas: { latitude: number; longitude: number }
  servicos: string[]
  avaliacoes: { media: number; total: number }
  imagens: string[]
  destaque: boolean
  verificada: boolean
  dataAtualizacao: string
  distancia?: number
}

const dataFile = path.join(process.cwd(), 'src', 'data', 'concessionarias.json')

export function loadConcessionarias(): Concessionaria[] {
  try {
    const raw = fs.readFileSync(dataFile, 'utf-8')
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

export function saveConcessionarias(items: Concessionaria[]) {
  fs.writeFileSync(dataFile, JSON.stringify(items, null, 2), 'utf-8')
}

export function addConcessionaria(partial: Partial<Concessionaria>): Concessionaria {
  const list = loadConcessionarias()
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`
  const now = new Date().toISOString()

  const nova: Concessionaria = {
    id,
    nome: partial.nome || 'Concessionária',
    marca: partial.marca || 'Indefinida',
    endereco: partial.endereco || '',
    cidade: partial.cidade || '',
    provincia: partial.provincia || '',
    telefone: partial.telefone || '',
    email: partial.email || '',
    website: partial.website ?? null,
    horarioFuncionamento: partial.horarioFuncionamento || {
      segunda: '08:00 - 18:00',
      terca: '08:00 - 18:00',
      quarta: '08:00 - 18:00',
      quinta: '08:00 - 18:00',
      sexta: '08:00 - 18:00',
      sabado: '09:00 - 13:00',
      domingo: 'Fechado'
    },
    coordenadas: partial.coordenadas || { latitude: 0, longitude: 0 },
    servicos: partial.servicos || ['Vendas'],
    avaliacoes: partial.avaliacoes || { media: 0, total: 0 },
    imagens: partial.imagens || [],
    destaque: !!partial.destaque,
    verificada: !!partial.verificada,
    dataAtualizacao: now
  }

  list.unshift(nova)
  saveConcessionarias(list)
  return nova
}

export function updateConcessionaria(id: string, updates: Partial<Concessionaria>): Concessionaria | null {
  const list = loadConcessionarias()
  const idx = list.findIndex(c => c.id === id)
  if (idx === -1) return null
  const updated: Concessionaria = { ...list[idx], ...updates, dataAtualizacao: new Date().toISOString() }
  list[idx] = updated
  saveConcessionarias(list)
  return updated
}

export function deleteConcessionaria(id: string): boolean {
  const list = loadConcessionarias()
  const next = list.filter(c => c.id !== id)
  const changed = next.length !== list.length
  if (changed) saveConcessionarias(next)
  return changed
}

export function getConcessionaria(id: string): Concessionaria | null {
  const list = loadConcessionarias()
  return list.find(c => c.id === id) || null
}

export function computeStats(items: Concessionaria[]) {
  const marcasDisponiveis = Array.from(new Set(items.map(c => c.marca).filter(Boolean)))
  const cidadesDisponiveis = Array.from(new Set(items.map(c => c.cidade).filter(Boolean)))
  const provinciasDisponiveis = Array.from(new Set(items.map(c => c.provincia).filter(Boolean)))
  return {
    totalConcessionarias: items.length,
    marcasDisponiveis,
    cidadesDisponiveis,
    provinciasDisponiveis
  }
}