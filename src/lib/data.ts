import { Artigo } from '@/types/artigo'
import { Noticia } from '@/types/noticia'
import { Video } from '@/types/video'

// TODO: Conectar com banco de dados real
// Todas as funções de geração de dados foram removidas
// Implementar busca real no banco de dados

// Interface para Test Drive
interface TestDrive {
  id: number
  slug: string
  veiculo: string
  marca: string
  categoria: string
  nota: number
  preco: string
  resumo: string
  conteudoCompleto: string
  pontosFavoraveis: string[]
  pontosNegativos: string[]
  avaliacoes: {
    design: number
    performance: number
    conforto: number
    tecnologia: number
    custoBeneficio: number
  }
  especificacoes: {
    motor: string
    potencia: string
    torque: string
    transmissao: string
    tracao: string
    consumo: string
    velocidadeMaxima: string
    aceleracao: string
    dimensoes: string
    peso: string
    capacidadeTanque: string
    bagageira: string
  }
  galeria: {
    id: string
    url: string
    alt: string
    legenda?: string
  }[]
  data: string
  autor: string
  imagem: string
  destaque: boolean
}

interface Concessionaria {
  id: number
  slug: string
  nome: string
  marca: string
  endereco: string
  telefone: string
  whatsapp: string
  email: string
  website?: string
  horario: string
  servicos: string[]
  avaliacao: number
  avaliacoes: number
  destaque: boolean
  descricao: string
  historia: string
  diferenciais: string[]
  certificacoes: string[]
  equipe: {
    nome: string
    cargo: string
    experiencia: string
  }[]
  galeria: {
    id: string
    url: string
    alt: string
    legenda?: string
  }[]
  localizacao: {
    latitude: number
    longitude: number
    provincia: string
    municipio: string
    bairro: string
  }
  redesSociais?: {
    facebook?: string
    instagram?: string
    linkedin?: string
  }
  imagem: string
}

// Funções removidas - implementar busca real no banco de dados
export function generateArtigoFromSlug(slug: string): Artigo | null {
  // TODO: Buscar artigo real no banco de dados pelo slug
  console.warn('generateArtigoFromSlug: Conecte com banco de dados real')
  return null
}

export function generateNoticiaFromSlug(slug: string): Noticia | null {
  // TODO: Buscar notícia real no banco de dados pelo slug
  console.warn('generateNoticiaFromSlug: Conecte com banco de dados real')
  return null
}

export function generateTestDriveFromSlug(slug: string): TestDrive | null {
  // TODO: Buscar test drive real no banco de dados pelo slug
  console.warn('generateTestDriveFromSlug: Conecte com banco de dados real')
  return null
}

export function generateVideoFromSlug(slug: string): Video | null {
  // TODO: Buscar vídeo real no banco de dados pelo slug
  console.warn('generateVideoFromSlug: Conecte com banco de dados real')
  return null
}

export function generateConcessionariaFromSlug(slug: string): Concessionaria | null {
  // TODO: Buscar concessionária real no banco de dados pelo slug
  console.warn('generateConcessionariaFromSlug: Conecte com banco de dados real')
  return null
}