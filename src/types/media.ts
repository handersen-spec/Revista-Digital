export type MediaType = 'image' | 'video' | 'document' | 'other'

export type MediaItem = {
  name: string
  url: string
  type: MediaType
  size: number
  createdAt?: string
  ext?: string
  thumbUrl?: string
  tags?: string[]
  group?: string
}