'use client'

import { useState, useEffect } from 'react'

interface CalculadoraFinanciamentoProps {
  onClose?: () => void
}

export default function CalculadoraFinanciamento({ onClose }: CalculadoraFinanciamentoProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [valores, setValores] = useState({
    valorVeiculo: '',
    entrada: '',
    prazo: '36',
    taxa: '12'
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const [resultado, setResultado] = useState<{
    valorFinanciado: number
    parcela: number
    totalPago: number
    jurosTotal: number
  } | null>(null)

  const bancos = [
    { nome: 'BFA', taxa: 12 },
    { nome: 'BAI', taxa: 11.5 },
    { nome: 'BPC', taxa: 13 },
    { nome: 'Millennium Atlântico', taxa: 12.5 },
    { nome: 'Standard Bank', taxa: 11.8 }
  ]

  const formatarMoeda = (valor: number) => {
    if (!isMounted) return '---'
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(valor)
  }

  const calcular = () => {
    // Melhor parsing dos valores, removendo pontos e vírgulas
    const valorVeiculo = parseFloat(valores.valorVeiculo.replace(/[^\d]/g, '')) || 0
    const entrada = parseFloat(valores.entrada.replace(/[^\d]/g, '')) || 0
    const prazo = parseInt(valores.prazo)
    const taxa = parseFloat(valores.taxa) / 100 / 12

    if (valorVeiculo <= 0) {
      alert('Por favor, insira um valor válido para o veículo.')
      return
    }

    if (entrada >= valorVeiculo) {
      alert('O valor da entrada não pode ser maior ou igual ao valor do veículo.')
      return
    }

    if (prazo <= 0) {
      alert('Por favor, selecione um prazo válido.')
      return
    }

    const valorFinanciado = valorVeiculo - entrada
    
    if (valorFinanciado <= 0) {
      alert('O valor a ser financiado deve ser maior que zero.')
      return
    }

    const parcela = (valorFinanciado * taxa * Math.pow(1 + taxa, prazo)) / (Math.pow(1 + taxa, prazo) - 1)
    const totalPago = parcela * prazo + entrada
    const jurosTotal = totalPago - valorVeiculo

    setResultado({
      valorFinanciado,
      parcela,
      totalPago,
      jurosTotal
    })
  }

  const handleInputChange = (campo: string, valor: string) => {
    if (campo === 'valorVeiculo' || campo === 'entrada') {
      // Remove tudo exceto números
      const numeroLimpo = valor.replace(/[^\d]/g, '')
      if (numeroLimpo === '') {
        setValores(prev => ({ ...prev, [campo]: '' }))
      } else {
        // Formata como moeda
        const valorFormatado = formatarMoeda(parseFloat(numeroLimpo) || 0)
        setValores(prev => ({ ...prev, [campo]: valorFormatado }))
      }
    } else {
      setValores(prev => ({ ...prev, [campo]: valor }))
    }
    
    // Limpa o resultado quando os valores mudam
    if (resultado) {
      setResultado(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Formulário */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor do Veículo (AOA)
          </label>
          <input
            type="text"
            value={valores.valorVeiculo}
            onChange={(e) => handleInputChange('valorVeiculo', e.target.value)}
            placeholder="Ex: 15.000.000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor da Entrada (AOA)
          </label>
          <input
            type="text"
            value={valores.entrada}
            onChange={(e) => handleInputChange('entrada', e.target.value)}
            placeholder="Ex: 3.000.000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prazo (meses)
          </label>
          <select
            value={valores.prazo}
            onChange={(e) => handleInputChange('prazo', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="12">12 meses</option>
            <option value="24">24 meses</option>
            <option value="36">36 meses</option>
            <option value="48">48 meses</option>
            <option value="60">60 meses</option>
            <option value="72">72 meses</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taxa de Juros (% ao ano)
          </label>
          <select
            value={valores.taxa}
            onChange={(e) => handleInputChange('taxa', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {bancos.map((banco) => (
              <option key={banco.nome} value={banco.taxa}>
                {banco.nome} - {banco.taxa}%
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botão Calcular */}
      <div className="text-center">
        <button
          onClick={calcular}
          className="btn-base btn-primary btn-lg px-12"
        >
          Calcular Financiamento
        </button>
      </div>

      {/* Resultados */}
      {resultado && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Resultado da Simulação</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm text-gray-600">Valor Financiado</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatarMoeda(resultado.valorFinanciado)}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm text-gray-600">Parcela Mensal</div>
              <div className="text-2xl font-bold text-orange-600">
                {formatarMoeda(resultado.parcela)}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total a Pagar</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatarMoeda(resultado.totalPago)}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total de Juros</div>
              <div className="text-2xl font-bold text-red-600">
                {formatarMoeda(resultado.jurosTotal)}
              </div>
            </div>
          </div>

          {/* Dicas */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">💡 Dicas Importantes:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Quanto maior a entrada, menor será o valor financiado e os juros</li>
              <li>• Prazos mais longos resultam em parcelas menores, mas mais juros</li>
              <li>• Compare as taxas de diferentes bancos antes de decidir</li>
              <li>• Considere também o seguro obrigatório e taxas administrativas</li>
            </ul>
          </div>
        </div>
      )}

      {/* Informações dos Bancos */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Taxas dos Principais Bancos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bancos.map((banco) => (
            <div key={banco.nome} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">{banco.nome}</span>
              <span className="text-orange-600 font-bold">{banco.taxa}%</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-4">
          * Taxas aproximadas e podem variar conforme perfil do cliente e condições do mercado.
        </p>
      </div>
    </div>
  )
}