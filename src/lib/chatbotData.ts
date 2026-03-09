'use client'

// Utilitário para buscar dados dinâmicos usados nas respostas do chatbot

type Artigo = { titulo?: string }
type Noticia = { titulo?: string }
type TestDrive = { veiculo?: string, marca?: string }

export async function fetchArtigosSummary(limit: number = 3) {
  try {
    const res = await fetch(`/api/artigos?limit=${limit}`)
    if (!res.ok) throw new Error(`Erro ${res.status}`)
    const data = await res.json()
    const total = Number(data?.total ?? 0)
    const titulos = (data?.artigos ?? []).slice(0, limit).map((a: Artigo) => a?.titulo).filter(Boolean)
    return { total, titulos }
  } catch (e) {
    return { total: 0, titulos: [] as string[] }
  }
}

export async function fetchNoticiasSummary(limit: number = 3) {
  try {
    const res = await fetch(`/api/noticias?limit=${limit}`)
    if (!res.ok) throw new Error(`Erro ${res.status}`)
    const data = await res.json()
    const total = Number(data?.total ?? 0)
    const titulos = (data?.noticias ?? []).slice(0, limit).map((n: Noticia) => n?.titulo).filter(Boolean)
    return { total, titulos }
  } catch (e) {
    return { total: 0, titulos: [] as string[] }
  }
}

export async function fetchTestDrivesSummary(limit: number = 3) {
  try {
    const res = await fetch(`/api/test-drives?limit=${limit}`)
    if (!res.ok) throw new Error(`Erro ${res.status}`)
    const data = await res.json()
    const total = Number(data?.total ?? 0)
    const itens = (data?.testDrives ?? []).slice(0, limit)
    const titulos = itens.map((t: TestDrive) => (t?.veiculo || t?.marca)).filter(Boolean)
    return { total, titulos }
  } catch (e) {
    return { total: 0, titulos: [] as string[] }
  }
}

export async function fetchConcessionariasSummary() {
  try {
    // Usa limite mínimo apenas para obter estatísticas
    const res = await fetch(`/api/concessionarias?limite=1&pagina=1`)
    if (!res.ok) throw new Error(`Erro ${res.status}`)
    const data = await res.json()
    const total = Number(data?.estatisticas?.totalConcessionarias ?? 0)
    const marcas = Array.isArray(data?.estatisticas?.marcasDisponiveis) ? data.estatisticas.marcasDisponiveis.slice(0, 5) : []
    return { total, marcas }
  } catch (e) {
    return { total: 0, marcas: [] as string[] }
  }
}

export async function fetchFerramentasSummary(limit: number = 3) {
  try {
    const res = await fetch(`/api/ferramentas?limite=${limit}`)
    if (!res.ok) throw new Error(`Erro ${res.status}`)
    const data = await res.json()
    const total = Number(data?.meta?.total ?? data?.estatisticas?.total ?? 0)
    const nomes = (data?.data ?? []).slice(0, limit).map((f: any) => f?.nome).filter(Boolean)
    return { total, nomes }
  } catch (e) {
    return { total: 0, nomes: [] as string[] }
  }
}