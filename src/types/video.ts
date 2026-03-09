export interface Video {
  slug: string
  titulo: string
  descricao: string
  conteudoDetalhado: string
  autor: string
  data: string
  categoria: string
  duracao: string
  visualizacoes: string
  likes: string
  videoUrl: string
  thumbnail: string
  tags: string[]
  status?: 'published' | 'draft' | 'scheduled' | 'archived'
}