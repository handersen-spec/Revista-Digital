'use client'

import Link from 'next/link'

export default function BrokenCar404({ message = 'Oops! O carro avariou, a página sumiu… kkkkk' }: { message?: string }) {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8">
      <div className="relative">
        <svg width="360" height="200" viewBox="0 0 360 200" role="img" aria-label="Carro avariado soltando fumaça">
          <defs>
            <linearGradient id="car-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1f2937" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>
            <linearGradient id="car-top" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#4b5563" />
            </linearGradient>
          </defs>

          {/* Corpo do carro */}
          <rect x="50" y="80" rx="12" ry="12" width="220" height="60" fill="url(#car-body)" />
          {/* Teto */}
          <rect x="80" y="60" rx="8" ry="8" width="120" height="35" fill="url(#car-top)" />

          {/* Vidro rachado */}
          <path d="M170 75 l10 10 -8 6 12 8 -6 7" stroke="#ef4444" strokeWidth="3" fill="none" />

          {/* Farol quebrado */}
          <circle cx="260" cy="105" r="6" fill="#f59e0b" opacity="0.7" />

          {/* Rodas */}
          <circle cx="100" cy="150" r="18" fill="#111827" />
          <circle cx="100" cy="150" r="7" fill="#6b7280" />
          <circle cx="220" cy="150" r="18" fill="#111827" />
          <circle cx="220" cy="150" r="7" fill="#6b7280" />

          {/* Fumaça do motor */}
          <g className="smoke">
            <circle cx="260" cy="70" r="6" fill="#9ca3af" />
            <circle cx="270" cy="60" r="5" fill="#d1d5db" />
            <circle cx="280" cy="50" r="4" fill="#e5e7eb" />
            <circle cx="290" cy="40" r="3" fill="#f3f4f6" />
          </g>

          {/* Faíscas do motor */}
          <g className="sparks">
            <circle cx="255" cy="90" r="2" fill="#f59e0b" />
            <circle cx="265" cy="95" r="2" fill="#f59e0b" />
            <circle cx="260" cy="85" r="2" fill="#f59e0b" />
          </g>
        </svg>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="shake" />
        </div>
      </div>

      <div className="max-w-md text-center md:text-left">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">404</h1>
        <p className="text-lg text-gray-700 mb-4">{message}</p>
        <p className="text-gray-500 mb-6">A página que procuras foi engolida pelo trânsito.</p>
        <div className="flex gap-3 justify-center md:justify-start">
          <Link href="/" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">Voltar à home</Link>
          <Link href="/sobre" className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors">Sobre a Auto Prestige</Link>
        </div>
      </div>

      <style jsx>{`
        .smoke circle {
          animation: rise 3s ease-in-out infinite;
          transform-origin: 260px 70px;
          opacity: 0.9;
        }
        .smoke circle:nth-child(1) { animation-delay: 0s; }
        .smoke circle:nth-child(2) { animation-delay: .3s; }
        .smoke circle:nth-child(3) { animation-delay: .6s; }
        .smoke circle:nth-child(4) { animation-delay: .9s; }

        @keyframes rise {
          0% { transform: translateY(0) scale(1); opacity: .9; }
          60% { transform: translateY(-25px) scale(1.3); opacity: .5; }
          100% { transform: translateY(-50px) scale(1.6); opacity: 0; }
        }

        .sparks circle {
          animation: blink .9s linear infinite;
        }
        .sparks circle:nth-child(2) { animation-delay: .2s; }
        .sparks circle:nth-child(3) { animation-delay: .4s; }

        @keyframes blink {
          0% { opacity: 0; transform: scale(0.8) }
          50% { opacity: 1; transform: scale(1) }
          100% { opacity: 0; transform: scale(0.8) }
        }

        .shake {
          animation: shake 1.5s ease-in-out infinite;
          width: 1px; height: 1px;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0) }
          20% { transform: translateX(-1px) }
          40% { transform: translateX(1px) }
          60% { transform: translateX(-1px) }
          80% { transform: translateX(1px) }
        }
      `}</style>
    </div>
  )
}
