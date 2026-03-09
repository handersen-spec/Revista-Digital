// Layout do segmento 'artigos' como Server Component
// Move configs dinâmicas para o nível pai, garantindo que /artigos e /artigos/[slug] não tentem SSG

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default function ArtigosLayout({ children }: { children: React.ReactNode }) {
  return children
}