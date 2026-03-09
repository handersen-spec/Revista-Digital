import { NextRequest, NextResponse } from 'next/server'
import { getSolicitacao, updateSolicitacao, deleteSolicitacao } from '@/lib/solicitacoesStore'
import { addConcessionaria } from '@/lib/concessionariasStore'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = getSolicitacao(id)
  if (!item) return NextResponse.json({ success: false, error: 'Not Found' }, { status: 404 })
  return NextResponse.json({ success: true, data: item })
}

function verificaConcessionariaFromSolicitacao(s: any): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const okEmail = !!s.emailRequerente && emailRegex.test(s.emailRequerente)
  const okEmpresa = !!s.empresa && s.empresa.length >= 2
  const okTelefone = (s.telefoneRequerente || '').replace(/\D/g, '').length >= 7
  return okEmail && okEmpresa && okTelefone
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const updates = await request.json()
    const updated = updateSolicitacao(id, updates)
    if (!updated) return NextResponse.json({ success: false, error: 'Not Found' }, { status: 404 })

    // Ao resolver solicitação de cadastro de concessionária, criar a concessionária
    const isCadastro = (updated.categoria || '')?.includes('concessionaria') || (updated.tags || []).includes('cadastro_concessionaria')
    if (updates.status === 'resolvida' && isCadastro) {
      const verificada = verificaConcessionariaFromSolicitacao(updated)
      const nome = updated.empresa || updated.titulo || 'Concessionária'

      // Dados enviados no cadastro (se existirem)
      const dados = (updated as any).dadosConcessionaria || {}
      let cidade = dados.cidade || ''
      let provincia = dados.provincia || ''
      const endereco = dados.endereco || ''
      const telefone = dados.telefone || updated.telefoneRequerente || ''
      const coordenadas = dados.coordenadas || { latitude: 0, longitude: 0 }
      const servicos = Array.isArray(dados.servicos) && dados.servicos.length ? dados.servicos : ['Vendas']
      const imagens = Array.isArray(dados.imagens) ? dados.imagens : []
      const horasPadrao = '08:00 - 18:00'
      const horarios = {
        segunda: dados.horarios?.segunda || horasPadrao,
        terca: dados.horarios?.terca || horasPadrao,
        quarta: dados.horarios?.quarta || horasPadrao,
        quinta: dados.horarios?.quinta || horasPadrao,
        sexta: dados.horarios?.sexta || horasPadrao,
        sabado: dados.horarios?.sabado || '09:00 - 13:00',
        domingo: dados.horarios?.domingo || 'Fechado'
      }

      // Se não veio cidade/província, tentar inferir a partir da descrição simples "Cidade, Província"
      if ((!cidade || !provincia) && updated.descricao) {
        const parts = String(updated.descricao).split(',')
        if (parts.length >= 2) {
          cidade = cidade || parts[0].trim()
          provincia = provincia || parts[1].trim()
        }
      }

      addConcessionaria({
        nome,
        marca: 'Indefinida',
        endereco,
        cidade,
        provincia,
        telefone,
        email: updated.emailRequerente,
        website: null,
        horarioFuncionamento: horarios,
        coordenadas,
        servicos,
        avaliacoes: { media: 0, total: 0 },
        imagens,
        destaque: false,
        verificada
      })
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ok = deleteSolicitacao(id)
  if (!ok) return NextResponse.json({ success: false, error: 'Not Found' }, { status: 404 })
  return NextResponse.json({ success: true })
}