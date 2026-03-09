// Server layout para o segmento dinâmico [slug]
// Move as configs de segmento para um módulo server, evitando import do page client

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default function ArtigosSlugLayout({ children }: { children: React.ReactNode }) {
  return children
}