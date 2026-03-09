// Interfaces para campos específicos por categoria de artigo

// Interface para imagens da galeria
export interface Imagem {
  id: string
  url: string
  alt: string
  legenda?: string
}

// Campos específicos para categoria Superdesportivo
export interface SuperdesportivoSpecs {
  tipoMotor: string
  cilindrada: string
  potencia: string
  velocidadeMaxima: string
  aceleracao: string
  pneus: string
  bagageira: string
  dataLancamento: string
}

// Campos específicos para categoria Ensaio
export interface EnsaiosSpecs {
  tipoMotor: string
  cilindrada: string
  potencia: string
  binarioMaximo: string
  transmissao: string
  velocidadeMaxima: string
  aceleracao: string
  consumoWLTP: string
  emissaoCO2WLTP: string
  dimensoes: string // Formato: "C/L/A"
  pneus: string
  peso: string
  bagageira: string
}

// Categoria Antevisão usa apenas campos padrão (sem campos específicos)
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AntevisaoSpecs {}

// Interface base do artigo
export interface ArtigoBase {
  slug: string
  titulo: string
  resumo: string
  conteudo: string
  autor: string
  data: string
  categoria: 'Superdesportivo' | 'Ensaio' | 'Antevisão'
  tempoLeitura: string
  imagem: string
  galeria?: Imagem[]
  tags: string[]
  status?: 'published' | 'draft' | 'scheduled' | 'archived'
}

// Interfaces específicas por categoria
export interface ArtigoSuperdesportivo extends ArtigoBase {
  categoria: 'Superdesportivo'
  specs: SuperdesportivoSpecs
}

export interface ArtigoEnsaios extends ArtigoBase {
  categoria: 'Ensaio'
  specs: EnsaiosSpecs
}

export interface ArtigoAntevisao extends ArtigoBase {
  categoria: 'Antevisão'
  specs?: AntevisaoSpecs // Opcional pois não tem campos específicos
}

// Union type para todos os tipos de artigo
export type Artigo = ArtigoSuperdesportivo | ArtigoEnsaios | ArtigoAntevisao

// Type guard functions para verificar o tipo de artigo
export function isSuperdesportivo(artigo: Artigo): artigo is ArtigoSuperdesportivo {
  return artigo.categoria === 'Superdesportivo'
}

export function isEnsaios(artigo: Artigo): artigo is ArtigoEnsaios {
  return artigo.categoria === 'Ensaio'
}

export function isAntevisao(artigo: Artigo): artigo is ArtigoAntevisao {
  return artigo.categoria === 'Antevisão'
}