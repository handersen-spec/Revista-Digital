export interface Imagem {
  id: string
  url: string
  alt: string
  legenda?: string
}

export interface Noticia {
  slug: string
  titulo: string
  resumo: string
  conteudo: string
  autor: string
  data: string
  categoria: string
  destaque: boolean
  imagem: string
  galeria?: Imagem[]
  tags: string[]
  status?: 'published' | 'draft' | 'scheduled' | 'archived'
}