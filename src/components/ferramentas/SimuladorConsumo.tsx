'use client'

import { useState, useEffect } from 'react'

interface SimuladorConsumoProps {
  onClose?: () => void
}

export default function SimuladorConsumo({ onClose }: SimuladorConsumoProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [dados, setDados] = useState({
    distancia: '',
    consumo: '',
    precoCombustivel: '180', // Preço médio da gasolina em Angola
    tipoCombustivel: 'gasolina'
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const [resultado, setResultado] = useState<{
    litrosNecessarios: number
    custoTotal: number
    custoKm: number
  } | null>(null)

  const precosCombustivel = {
    gasolina: 180,
    diesel: 150,
    gas: 120
  }

  const formatarMoeda = (valor: number) => {
    if (!isMounted) return '---'
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(valor)
  }

  const calcular = () => {
    const distancia = parseFloat(dados.distancia.replace(',', '.'))
    const consumo = parseFloat(dados.consumo.replace(',', '.'))
    const preco = parseFloat(dados.precoCombustivel.replace(',', '.'))

    if (!distancia || !consumo || !preco || distancia <= 0 || consumo <= 0 || preco <= 0) {
      alert('Por favor, preencha todos os campos com valores válidos.')
      return
    }

    const litrosNecessarios = distancia / consumo
    const custoTotal = litrosNecessarios * preco
    const custoKm = custoTotal / distancia

    setResultado({
      litrosNecessarios,
      custoTotal,
      custoKm
    })
  }

  const handleInputChange = (campo: string, valor: string) => {
    setDados(prev => ({
      ...prev,
      [campo]: valor
    }))

    // Atualizar preço automaticamente quando mudar o tipo de combustível
    if (campo === 'tipoCombustivel') {
      setDados(prev => ({
        ...prev,
        precoCombustivel: precosCombustivel[valor as keyof typeof precosCombustivel].toString()
      }))
    }
  }

  const rotasPopulares = [
    { origem: 'Luanda', destino: 'Benguela', distancia: 629 },
    { origem: 'Luanda', destino: 'Huambo', distancia: 600 },
    { origem: 'Luanda', destino: 'Lobito', distancia: 508 },
    { origem: 'Luanda', destino: 'Malanje', distancia: 380 },
    { origem: 'Luanda', destino: 'Sumbe', distancia: 356 }
  ]

  return (
    <div className="space-y-6">
      {/* Formulário */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distância da Viagem (km)
          </label>
          <input
            type="text"
            value={dados.distancia}
            onChange={(e) => handleInputChange('distancia', e.target.value)}
            placeholder="Ex: 500"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Consumo do Veículo (km/l)
          </label>
          <input
            type="text"
            value={dados.consumo}
            onChange={(e) => handleInputChange('consumo', e.target.value)}
            placeholder="Ex: 12"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Combustível
          </label>
          <select
            value={dados.tipoCombustivel}
            onChange={(e) => handleInputChange('tipoCombustivel', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="gasolina">Gasolina</option>
            <option value="diesel">Diesel</option>
            <option value="gas">Gás</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preço do Combustível (AOA/litro)
          </label>
          <input
            type="text"
            value={dados.precoCombustivel}
            onChange={(e) => handleInputChange('precoCombustivel', e.target.value)}
            placeholder="Ex: 180"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Rotas Populares */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-bold text-gray-900 mb-3">🗺️ Rotas Populares em Angola</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {rotasPopulares.map((rota, index) => (
            <button
              key={index}
              onClick={() => handleInputChange('distancia', rota.distancia.toString())}
              className="text-left p-3 bg-white rounded-lg hover:bg-orange-50 transition-colors border border-gray-200"
            >
              <div className="font-medium text-gray-900">
                {rota.origem} → {rota.destino}
              </div>
              <div className="text-sm text-gray-600">{rota.distancia} km</div>
            </button>
          ))}
        </div>
      </div>

      {/* Botão Calcular */}
      <div className="text-center">
        <button
          onClick={calcular}
          className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          Calcular Consumo
        </button>
      </div>

      {/* Resultados */}
      {resultado && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Resultado da Simulação</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-sm text-gray-600">Combustível Necessário</div>
              <div className="text-2xl font-bold text-orange-600">
                {resultado.litrosNecessarios.toFixed(1)} L
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-sm text-gray-600">Custo Total</div>
              <div className="text-2xl font-bold text-green-600">
                {formatarMoeda(resultado.custoTotal)}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-sm text-gray-600">Custo por Km</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatarMoeda(resultado.custoKm)}
              </div>
            </div>
          </div>

          {/* Dicas de Economia */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-bold text-green-900 mb-2">💡 Dicas para Economizar Combustível:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Mantenha a velocidade constante entre 80-90 km/h</li>
              <li>• Verifique a pressão dos pneus regularmente</li>
              <li>• Evite acelerações e frenagens bruscas</li>
              <li>• Faça a manutenção preventiva do motor</li>
              <li>• Remova peso desnecessário do veículo</li>
            </ul>
          </div>
        </div>
      )}

      {/* Preços Atuais */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Preços Médios de Combustível em Angola</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">⛽ Gasolina</span>
            <span className="text-orange-600 font-bold">{precosCombustivel.gasolina} AOA/L</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">🚛 Diesel</span>
            <span className="text-orange-600 font-bold">{precosCombustivel.diesel} AOA/L</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">🔥 Gás</span>
            <span className="text-orange-600 font-bold">{precosCombustivel.gas} AOA/L</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          * Preços aproximados e podem variar conforme região e posto de combustível.
        </p>
      </div>
    </div>
  )
}