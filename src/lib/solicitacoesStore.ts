import fs from 'fs'
import path from 'path'

export interface Solicitacao {
  id: string
  tipo: 'parceria' | 'suporte' | 'reclamacao' | 'sugestao' | 'outro'
  titulo: string
  descricao: string
  nomeRequerente: string
  emailRequerente: string
  telefoneRequerente?: string
  empresa?: string
  status: 'pendente' | 'em_andamento' | 'resolvida' | 'rejeitada'
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  categoria?: string
  atribuidoA?: string
  criadoEm: string
  atualizadoEm: string
  dataVencimento?: string
  anexos?: string[]
  notas?: string[]
  tags?: string[]
  // Dados específicos para cadastro de concessionária (opcional)
  dadosConcessionaria?: {
    endereco?: string
    cidade?: string
    provincia?: string
    telefone?: string
    coordenadas?: { latitude: number; longitude: number }
    horarios?: {
      segunda?: string
      terca?: string
      quarta?: string
      quinta?: string
      sexta?: string
      sabado?: string
      domingo?: string
    }
    servicos?: string[]
    imagens?: string[]
    descricao?: string
  }
}

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'solicitacoes.json')

function ensureFile() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf-8')
}

export function loadSolicitacoes(): Solicitacao[] {
  try {
    ensureFile()
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveSolicitacoes(list: Solicitacao[]) {
  ensureFile()
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8')
}

export function addSolicitacao(data: Omit<Solicitacao, 'id' | 'criadoEm' | 'atualizadoEm' | 'status'> & { status?: Solicitacao['status'] }): Solicitacao {
  const list = loadSolicitacoes()
  const now = new Date().toISOString()
  const nova: Solicitacao = {
    id: crypto.randomUUID(),
    status: data.status || 'pendente',
    criadoEm: now,
    atualizadoEm: now,
    ...data,
  }
  list.unshift(nova)
  saveSolicitacoes(list)
  return nova
}

export function getSolicitacao(id: string): Solicitacao | null {
  const list = loadSolicitacoes()
  return list.find(s => s.id === id) || null
}

export function updateSolicitacao(id: string, updates: Partial<Solicitacao>): Solicitacao | null {
  const list = loadSolicitacoes()
  const idx = list.findIndex(s => s.id === id)
  if (idx === -1) return null
  const updated: Solicitacao = { ...list[idx], ...updates, atualizadoEm: new Date().toISOString() }
  list[idx] = updated
  saveSolicitacoes(list)
  return updated
}

export function deleteSolicitacao(id: string): boolean {
  const list = loadSolicitacoes()
  const next = list.filter(s => s.id !== id)
  if (next.length === list.length) return false
  saveSolicitacoes(next)
  return true
}

export function computeStats(list: Solicitacao[]) {
  const total = list.length
  const pendentes = list.filter(s => s.status === 'pendente').length
  const emAndamento = list.filter(s => s.status === 'em_andamento').length
  const resolvidas = list.filter(s => s.status === 'resolvida').length
  const rejeitadas = list.filter(s => s.status === 'rejeitada').length
  const porTipo = {
    parceria: list.filter(s => s.tipo === 'parceria').length,
    suporte: list.filter(s => s.tipo === 'suporte').length,
    reclamacao: list.filter(s => s.tipo === 'reclamacao').length,
    sugestao: list.filter(s => s.tipo === 'sugestao').length,
    outro: list.filter(s => s.tipo === 'outro').length,
  }
  const porPrioridade = {
    baixa: list.filter(s => s.prioridade === 'baixa').length,
    media: list.filter(s => s.prioridade === 'media').length,
    alta: list.filter(s => s.prioridade === 'alta').length,
    urgente: list.filter(s => s.prioridade === 'urgente').length,
  }

  return {
    total,
    pendentes,
    emAndamento,
    resolvidas,
    rejeitadas,
    porTipo,
    porPrioridade,
    tempoMedioResolucao: 0,
    taxaResolucao: total ? Math.round((resolvidas / total) * 100) : 0,
  }
}