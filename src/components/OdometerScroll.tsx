"use client"

import { useEffect, useRef, useState } from "react"

// Indicador de scroll em formato conta‑quilómetros (tipo painel de carro)
export default function OdometerScroll() {
  const [progress, setProgress] = useState(0)
  const [direction, setDirection] = useState<"up" | "down">("down")
  const prevY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0
      const doc = document.documentElement
      const total = (doc.scrollHeight - doc.clientHeight) || 1
      const pct = Math.max(0, Math.min(100, Math.round((y / total) * 100)))
      setProgress(pct)
      setDirection(y > prevY.current ? "down" : "up")
      prevY.current = y
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Mapeia 0–100% para ângulo do ponteiro (estilo conta‑quilómetros)
  const minAngle = -120 // início
  const maxAngle = 120  // fim
  const angle = minAngle + (progress / 100) * (maxAngle - minAngle)

  // Ticks do mostrador (de 0 em 10)
  const ticks = Array.from({ length: 11 }, (_, i) => i * 10)

  return (
    <div className="fixed bottom-6 left-6 z-50 select-none" aria-label="Progresso de leitura">
      <div
        className="relative w-20 h-20 rounded-full shadow-xl"
        style={{
          background: "rgba(15, 15, 15, 0.5)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        {/* Anel externo decorativo */}
        <div className="absolute inset-1 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.1)" }} />

        {/* Ticks e labels */}
        <svg className="absolute inset-0" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
          {ticks.map((t) => {
            const a = (minAngle + (t / 100) * (maxAngle - minAngle)) * (Math.PI / 180)
            const r1 = 40
            const r2 = t % 20 === 0 ? 46 : 44
            const x1 = 50 + r1 * Math.cos(a)
            const y1 = 50 + r1 * Math.sin(a)
            const x2 = 50 + r2 * Math.cos(a)
            const y2 = 50 + r2 * Math.sin(a)
            return (
              <g key={t}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={t % 20 === 0 ? "#e5e5e5" : "#777"} strokeWidth={t % 20 === 0 ? 2 : 1} />
                {t % 50 === 0 && (
                  <text x={50 + 33 * Math.cos(a)} y={50 + 33 * Math.sin(a)} fill="#bdbdbd" fontSize="7" textAnchor="middle" dominantBaseline="middle">
                    {t}
                  </text>
                )}
              </g>
            )
          })}

          {/* Ponteiro */}
          <g transform={`rotate(${angle} 50 50)`}>
            <line x1="50" y1="50" x2="90" y2="50" stroke="var(--primary-500)" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="3" fill="#e5e5e5" stroke="#666" strokeWidth="1" />
          </g>
        </svg>

        {/* Direção acima da percentagem */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center leading-tight">
          <div className="flex items-center gap-1">
            {direction === "down" ? (
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: "var(--primary-500)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: "var(--primary-500)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            )}
            <span className="text-[9px] tracking-wider uppercase" style={{ color: "#bdbdbd" }}>{direction === "down" ? "Descer" : "Subir"}</span>
          </div>
          <span className="text-[10px] font-semibold" style={{ color: "#e5e5e5" }}>{progress}%</span>
        </div>
      </div>
    </div>
  )
}