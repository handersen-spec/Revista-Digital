import ClientArtigoPage from './ClientArtigoPage'

export default function ArtigoPage({ params }: { params: { slug: string } }) {
  return <ClientArtigoPage slug={params.slug} />
}