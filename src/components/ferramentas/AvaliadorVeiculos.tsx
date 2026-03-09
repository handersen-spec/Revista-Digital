'use client'

import { useState, useEffect } from 'react'

interface AvaliadorVeiculosProps {
  onClose?: () => void
}

export default function AvaliadorVeiculos({ onClose }: AvaliadorVeiculosProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [dados, setDados] = useState({
    marca: '',
    modelo: '',
    ano: '',
    quilometragem: '',
    combustivel: 'gasolina',
    transmissao: 'manual',
    estado: 'bom'
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const [resultado, setResultado] = useState<{
    valorMinimo: number
    valorMedio: number
    valorMaximo: number
    depreciacao: number
  } | null>(null)

  const marcas = [
    'Toyota', 'Hyundai', 'Kia', 'Volkswagen', 'Ford', 'Chevrolet', 
    'Nissan', 'Honda', 'Mitsubishi', 'Peugeot', 'Renault', 'BMW', 
    'Mercedes-Benz', 'Audi', 'Land Rover', 'Isuzu'
  ]

  const anos = Array.from({ length: 25 }, (_, i) => 2024 - i)

  const formatarMoeda = (valor: number) => {
    if (!isMounted) return '---'
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(valor)
  }

  const calcularAvaliacao = () => {
    if (!dados.marca || !dados.modelo || !dados.ano || !dados.quilometragem) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const anoAtual = isMounted ? new Date().getFullYear() : 2024
    const anoVeiculo = parseInt(dados.ano)
    const quilometragem = parseInt(dados.quilometragem.replace(/\D/g, ''))
    const idade = anoAtual - anoVeiculo

    // Valor base estimado por marca (em AOA)
    const valoresBase: { [key: string]: number } = {
      'Toyota': 8000000,
      'Hyundai': 6500000,
      'Kia': 6000000,
      'Volkswagen': 7000000,
      'Ford': 6500000,
      'Chevrolet': 6000000,
      'Nissan': 7500000,
      'Honda': 7000000,
      'Mitsubishi': 6500000,
      'Peugeot': 5500000,
      'Renault': 5500000,
      'BMW': 15000000,
      'Mercedes-Benz': 18000000,
      'Audi': 16000000,
      'Land Rover': 20000000,
      'Isuzu': 8500000
    }

    let valorBase = valoresBase[dados.marca] || 6000000

    // Ajustes por idade
    const depreciacao = Math.min(idade * 0.12, 0.8) // Máximo 80% de depreciação
    valorBase = valorBase * (1 - depreciacao)

    // Ajustes por quilometragem
    const quilometragemMedia = idade * 15000
    const diferencaQuilometragem = quilometragem - quilometragemMedia
    const ajusteQuilometragem = diferencaQuilometragem * -2 // -2 AOA por km extra
    valorBase += ajusteQuilometragem

    // Ajustes por combustível
    const ajusteCombustivel = dados.combustivel === 'diesel' ? 1.1 : 1
    valorBase *= ajusteCombustivel

    // Ajustes por transmissão
    const ajusteTransmissao = dados.transmissao === 'automatica' ? 1.15 : 1
    valorBase *= ajusteTransmissao

    // Ajustes por estado
    const ajustesEstado = {
      'excelente': 1.2,
      'muito_bom': 1.1,
      'bom': 1,
      'regular': 0.85,
      'ruim': 0.7
    }
    valorBase *= ajustesEstado[dados.estado as keyof typeof ajustesEstado]

    // Garantir valor mínimo
    valorBase = Math.max(valorBase, 1000000)

    const valorMinimo = valorBase * 0.85
    const valorMedio = valorBase
    const valorMaximo = valorBase * 1.15

    setResultado({
      valorMinimo,
      valorMedio,
      valorMaximo,
      depreciacao: depreciacao * 100
    })
  }

  const handleInputChange = (campo: string, valor: string) => {
    setDados(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  return (
    <div className="space-y-6">
      {/* Formulário */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marca *
          </label>
          <select
            value={dados.marca}
            onChange={(e) => handleInputChange('marca', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Selecione a marca</option>
            {marcas.map((marca) => (
              <option key={marca} value={marca}>{marca}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modelo *
          </label>
          <input
            type="text"
            value={dados.modelo}
            onChange={(e) => handleInputChange('modelo', e.target.value)}
            placeholder="Ex: Corolla, Civic, Golf"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ano *
          </label>
          <select
            value={dados.ano}
            onChange={(e) => handleInputChange('ano', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Selecione o ano</option>
            {anos.map((ano) => (
              <option key={ano} value={ano}>{ano}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quilometragem *
          </label>
          <input
            type="text"
            value={dados.quilometragem}
            onChange={(e) => handleInputChange('quilometragem', e.target.value)}
            placeholder="Ex: 50000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Combustível
          </label>
          <select
            value={dados.combustivel}
            onChange={(e) => handleInputChange('combustivel', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="gasolina">Gasolina</option>
            <option value="diesel">Diesel</option>
            <option value="flex">Flex</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transmissão
          </label>
          <select
            value={dados.transmissao}
            onChange={(e) => handleInputChange('transmissao', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="manual">Manual</option>
            <option value="automatica">Automática</option>
            <option value="cvt">CVT</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado Geral do Veículo
          </label>
          <select
            value={dados.estado}
            onChange={(e) => handleInputChange('estado', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="excelente">Excelente - Como novo, sem defeitos</option>
            <option value="muito_bom">Muito Bom - Pequenos sinais de uso</option>
            <option value="bom">Bom - Sinais normais de uso</option>
            <option value="regular">Regular - Precisa de alguns reparos</option>
            <option value="ruim">Ruim - Precisa de reparos significativos</option>
          </select>
        </div>
      </div>

      {/* Botão Avaliar */}
      <div className="text-center">
        <button
          onClick={calcularAvaliacao}
          className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          Avaliar Veículo
        </button>
      </div>

      {/* Resultados */}
      {resultado && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Avaliação do Veículo</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg text-center border-l-4 border-red-500">
              <div className="text-sm text-gray-600">Valor Mínimo</div>
              <div className="text-xl font-bold text-red-600">
                {formatarMoeda(resultado.valorMinimo)}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg text-center border-l-4 border-orange-500">
              <div className="text-sm text-gray-600">Valor Médio</div>
              <div className="text-2xl font-bold text-orange-600">
                {formatarMoeda(resultado.valorMedio)}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg text-center border-l-4 border-green-500">
              <div className="text-sm text-gray-600">Valor Máximo</div>
              <div className="text-xl font-bold text-green-600">
                {formatarMoeda(resultado.valorMaximo)}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">📊 Análise da Depreciação</h4>
            <p className="text-gray-700">
              Seu veículo sofreu uma depreciação de aproximadamente <strong>{resultado.depreciacao.toFixed(1)}%</strong> desde o ano de fabricação.
            </p>
          </div>

          {/* Fatores que Influenciam */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">💡 Fatores que Influenciam o Valor:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Marca e Modelo:</strong> Marcas premium mantêm valor melhor</li>
              <li>• <strong>Idade:</strong> Veículos mais novos valem mais</li>
              <li>• <strong>Quilometragem:</strong> Menor quilometragem = maior valor</li>
              <li>• <strong>Estado:</strong> Manutenção adequada preserva o valor</li>
              <li>• <strong>Transmissão:</strong> Automática adiciona valor</li>
              <li>• <strong>Combustível:</strong> Diesel pode valer mais em alguns casos</li>
            </ul>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="text-yellow-600 mr-3">⚠️</div>
          <div>
            <h4 className="font-bold text-yellow-800 mb-1">Aviso Importante</h4>
            <p className="text-sm text-yellow-700">
              Esta é uma estimativa baseada em dados de mercado e pode variar conforme condições específicas do veículo, 
              documentação, histórico de acidentes, modificações e demanda local. Recomendamos consultar um avaliador 
              profissional para uma avaliação mais precisa.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}