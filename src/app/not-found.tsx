import Lottie404 from '@/components/ui/Lottie404'
import animationData from './Error 404 Animation.json'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-sm p-8">
        <Lottie404 animationData={animationData} />
        <div className="mt-8 text-center text-sm text-gray-500">
          <span>Se acha que isso é um bug, </span>
          <Link href="/contato" className="text-green-700 hover:underline">fale connosco</Link>.
        </div>
      </div>
    </div>
  )
}