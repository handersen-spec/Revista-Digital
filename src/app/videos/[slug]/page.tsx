import ClientVideoContent from './ClientVideoContent'

interface VideoPageProps {
  params: {
    slug: string
  }
}

export default function VideoPage({ params }: VideoPageProps) {
  const { slug } = params
  return <ClientVideoContent slug={slug} />
}

// Metadata dinâmica
export async function generateMetadata({ params }: VideoPageProps) {
  const { slug } = params

  return {
    title: `Vídeo - Auto Prestige`,
    description: 'Assista aos nossos vídeos especializados sobre o mundo automóvel em Angola.',
    openGraph: {
      title: 'Vídeo - Auto Prestige',
      description: 'Assista aos nossos vídeos especializados sobre o mundo automóvel em Angola.',
    },
  }
}
