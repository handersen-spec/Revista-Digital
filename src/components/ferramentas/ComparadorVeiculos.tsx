'use client'

import { useState, useEffect } from 'react'

interface ComparadorVeiculosProps {
  onClose?: () => void
}

interface Veiculo {
  id: number
  marca: string
  modelo: string
  ano: string
  preco: string
  motor: string
  combustivel: string
  consumoCidade: string
  consumoEstrada: string
  transmissao: string
  potencia: string
  torque: string
  aceleracao: string
  velocidadeMaxima: string
  tanque: string
}

export default function ComparadorVeiculos({ onClose }: ComparadorVeiculosProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [veiculos, setVeiculos] = useState<Veiculo[]>([
    {
      id: 1,
      marca: '',
      modelo: '',
      ano: '',
      preco: '',
      motor: '',
      combustivel: '',
      consumoCidade: '',
      consumoEstrada: '',
      transmissao: '',
      potencia: '',
      torque: '',
      aceleracao: '',
      velocidadeMaxima: '',
      tanque: ''
    },
    {
      id: 2,
      marca: '',
      modelo: '',
      ano: '',
      preco: '',
      motor: '',
      combustivel: '',
      consumoCidade: '',
      consumoEstrada: '',
      transmissao: '',
      potencia: '',
      torque: '',
      aceleracao: '',
      velocidadeMaxima: '',
      tanque: ''
    }
  ])

  const [mostrarComparacao, setMostrarComparacao] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const marcas = [
    'Toyota', 'Hyundai', 'Kia', 'Volkswagen', 'Ford', 'Chevrolet', 
    'Nissan', 'Honda', 'Mitsubishi', 'Peugeot', 'Renault', 'BMW', 
    'Mercedes-Benz', 'Audi', 'Land Rover', 'Isuzu'
  ]

  const anos = Array.from({ length: 10 }, (_, i) => 2024 - i)

  const formatarMoeda = (valor: string) => {
    if (!isMounted) return '---'
    const numero = parseFloat(valor.replace(/\D/g, ''))
    if (isNaN(numero)) return valor
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(numero)
  }

  const handleInputChange = (veiculoId: number, campo: keyof Veiculo, valor: string) => {
    setVeiculos(prev => prev.map(veiculo => 
      veiculo.id === veiculoId 
        ? { ...veiculo, [campo]: valor }
        : veiculo
    ))
  }

  const adicionarVeiculo = () => {
    if (veiculos.length < 4) {
      const novoId = Math.max(...veiculos.map(v => v.id)) + 1
      setVeiculos(prev => [...prev, {
        id: novoId,
        marca: '',
        modelo: '',
        ano: '',
        preco: '',
        motor: '',
        combustivel: '',
        consumoCidade: '',
        consumoEstrada: '',
        transmissao: '',
        potencia: '',
        torque: '',
        aceleracao: '',
        velocidadeMaxima: '',
        tanque: ''
      }])
    }
  }

  const removerVeiculo = (id: number) => {
    if (veiculos.length > 2) {
      setVeiculos(prev => prev.filter(v => v.id !== id))
    }
  }

  const compararVeiculos = () => {
    const veiculosPreenchidos = veiculos.filter(v => v.marca && v.modelo)
    if (veiculosPreenchidos.length < 2) {
      alert('Por favor, preencha pelo menos 2 veículos para comparar.')
      return
    }
    setMostrarComparacao(true)
  }

  const obterMelhorValor = (campo: keyof Veiculo, tipo: 'maior' | 'menor') => {
    const valores = veiculos
      .filter(v => v.marca && v.modelo && v[campo])
      .map(v => {
        const valor = v[campo] as string
        return parseFloat(valor.replace(/\D/g, '')) || 0
      })

    if (valores.length === 0) return null

    const melhorValor = tipo === 'maior' 
      ? Math.max(...valores)
      : Math.min(...valores)

    return melhorValor
  }

  const ehMelhorValor = (veiculo: Veiculo, campo: keyof Veiculo, tipo: 'maior' | 'menor') => {
    const valorVeiculo = parseFloat((veiculo[campo] as string).replace(/\D/g, '')) || 0
    const melhorValor = obterMelhorValor(campo, tipo)
    return melhorValor !== null && valorVeiculo === melhorValor
  }

  return (
    <div className="space-y-6">
      {!mostrarComparacao ? (
        <>
          {/* Formulários dos Veículos */}
          <div className="space-y-6">
            {veiculos.map((veiculo, index) => (
              <div key={veiculo.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Veículo {index + 1}
                  </h3>
                  {veiculos.length > 2 && (
                    <button
                      onClick={() => removerVeiculo(veiculo.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remover
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marca *
                    </label>
                    <select
                      value={veiculo.marca}
                      onChange={(e) => handleInputChange(veiculo.id, 'marca', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    >
                      <option value="">Selecione</option>
                      {marcas.map((marca) => (
                        <option key={marca} value={marca}>{marca}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modelo *
                    </label>
                    <input
                      type="text"
                      value={veiculo.modelo}
                      onChange={(e) => handleInputChange(veiculo.id, 'modelo', e.target.value)}
                      placeholder="Ex: Corolla"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ano
                    </label>
                    <select
                      value={veiculo.ano}
                      onChange={(e) => handleInputChange(veiculo.id, 'ano', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    >
                      <option value="">Selecione</option>
                      {anos.map((ano) => (
                        <option key={ano} value={ano}>{ano}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preço (AOA)
                    </label>
                    <input
                      type="text"
                      value={veiculo.preco}
                      onChange={(e) => handleInputChange(veiculo.id, 'preco', e.target.value)}
                      placeholder="Ex: 8000000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Motor
                    </label>
                    <input
                      type="text"
                      value={veiculo.motor}
                      onChange={(e) => handleInputChange(veiculo.id, 'motor', e.target.value)}
                      placeholder="Ex: 1.8L"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Combustível
                    </label>
                    <select
                      value={veiculo.combustivel}
                      onChange={(e) => handleInputChange(veiculo.id, 'combustivel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    >
                      <option value="">Selecione</option>
                      <option value="gasolina">Gasolina</option>
                      <option value="diesel">Diesel</option>
                      <option value="flex">Flex</option>
                      <option value="hibrido">Híbrido</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Consumo Cidade (km/l)
                    </label>
                    <input
                      type="text"
                      value={veiculo.consumoCidade}
                      onChange={(e) => handleInputChange(veiculo.id, 'consumoCidade', e.target.value)}
                      placeholder="Ex: 12.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Consumo Estrada (km/l)
                    </label>
                    <input
                      type="text"
                      value={veiculo.consumoEstrada}
                      onChange={(e) => handleInputChange(veiculo.id, 'consumoEstrada', e.target.value)}
                      placeholder="Ex: 16.8"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transmissão
                    </label>
                    <select
                      value={veiculo.transmissao}
                      onChange={(e) => handleInputChange(veiculo.id, 'transmissao', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    >
                      <option value="">Selecione</option>
                      <option value="manual">Manual</option>
                      <option value="automatica">Automática</option>
                      <option value="cvt">CVT</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-center space-x-4">
            {veiculos.length < 4 && (
              <button
                onClick={adicionarVeiculo}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Adicionar Veículo
              </button>
            )}
            <button
              onClick={compararVeiculos}
              className="bg-orange-600 text-white px-8 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Comparar Veículos
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Tabela de Comparação */}
          <div className="bg-white rounded-lg overflow-hidden border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Características
                    </th>
                    {veiculos.filter(v => v.marca && v.modelo).map((veiculo, index) => (
                      <th key={veiculo.id} className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                        {veiculo.marca} {veiculo.modelo}
                        {veiculo.ano && ` ${veiculo.ano}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Preço</td>
                    {veiculos.filter(v => v.marca && v.modelo).map((veiculo) => (
                      <td key={veiculo.id} className={`px-4 py-3 text-sm text-center ${
                        ehMelhorValor(veiculo, 'preco', 'menor') ? 'bg-green-50 text-green-800 font-bold' : ''
                      }`}>
                        {veiculo.preco ? formatarMoeda(veiculo.preco) : '-'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Motor</td>
                    {veiculos.filter(v => v.marca && v.modelo).map((veiculo) => (
                      <td key={veiculo.id} className="px-4 py-3 text-sm text-center">
                        {veiculo.motor || '-'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Combustível</td>
                    {veiculos.filter(v => v.marca && v.modelo).map((veiculo) => (
                      <td key={veiculo.id} className="px-4 py-3 text-sm text-center capitalize">
                        {veiculo.combustivel || '-'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Consumo Cidade</td>
                    {veiculos.filter(v => v.marca && v.modelo).map((veiculo) => (
                      <td key={veiculo.id} className={`px-4 py-3 text-sm text-center ${
                        ehMelhorValor(veiculo, 'consumoCidade', 'maior') ? 'bg-green-50 text-green-800 font-bold' : ''
                      }`}>
                        {veiculo.consumoCidade ? `${veiculo.consumoCidade} km/l` : '-'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Consumo Estrada</td>
                    {veiculos.filter(v => v.marca && v.modelo).map((veiculo) => (
                      <td key={veiculo.id} className={`px-4 py-3 text-sm text-center ${
                        ehMelhorValor(veiculo, 'consumoEstrada', 'maior') ? 'bg-green-50 text-green-800 font-bold' : ''
                      }`}>
                        {veiculo.consumoEstrada ? `${veiculo.consumoEstrada} km/l` : '-'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Transmissão</td>
                    {veiculos.filter(v => v.marca && v.modelo).map((veiculo) => (
                      <td key={veiculo.id} className="px-4 py-3 text-sm text-center capitalize">
                        {veiculo.transmissao || '-'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Análise da Comparação */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4">📊 Análise da Comparação</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• <strong>Melhor Preço:</strong> Destacado em verde na tabela</p>
              <p>• <strong>Melhor Consumo:</strong> Veículos mais econômicos destacados em verde</p>
              <p>• <strong>Custo-Benefício:</strong> Considere preço vs. características oferecidas</p>
              <p>• <strong>Manutenção:</strong> Marcas japonesas geralmente têm menor custo de manutenção</p>
            </div>
          </div>

          {/* Botão Voltar */}
          <div className="text-center">
            <button
              onClick={() => setMostrarComparacao(false)}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Nova Comparação
            </button>
          </div>
        </>
      )}
    </div>
  )
}