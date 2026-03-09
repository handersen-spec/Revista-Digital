'use client'

import { useState, useEffect } from 'react'

interface SimuladorTrocaProps {
  onClose?: () => void
}

interface DadosVeiculo {
  marca: string
  modelo: string
  ano: string
  quilometragem: string
  combustivel: string
  transmissao: string
  estado: string
  cor: string
  documentacao: string
  acidentes: string
  modificacoes: string
}

interface VeiculoDesejado {
  marca: string
  modelo: string
  ano: string
  precoMaximo: string
  combustivel: string
  transmissao: string
}

interface ResultadoTroca {
  valorAtual: number
  valorDesejado: number
  diferenca: number
  tipoTroca: 'pagar' | 'receber' | 'equilibrada'
  depreciacao: number
  custosTroca: number
  valorLiquido: number
}

export default function SimuladorTroca({ onClose }: SimuladorTrocaProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [veiculoAtual, setVeiculoAtual] = useState<DadosVeiculo>({
    marca: '',
    modelo: '',
    ano: '',
    quilometragem: '',
    combustivel: 'gasolina',
    transmissao: 'manual',
    estado: 'bom',
    cor: '',
    documentacao: 'completa',
    acidentes: 'nao',
    modificacoes: 'nao'
  })

  const [veiculoDesejado, setVeiculoDesejado] = useState<VeiculoDesejado>({
    marca: '',
    modelo: '',
    ano: '',
    precoMaximo: '',
    combustivel: 'gasolina',
    transmissao: 'manual'
  })

  const [resultado, setResultado] = useState<ResultadoTroca | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const marcas = [
    'Toyota', 'Hyundai', 'Mitsubishi', 'Nissan', 'Honda', 'Volkswagen',
    'Ford', 'Chevrolet', 'Kia', 'Mazda', 'Suzuki', 'Isuzu', 'Mercedes-Benz',
    'BMW', 'Audi', 'Land Rover', 'Jeep', 'Peugeot', 'Renault', 'Citroën'
  ]

  const anos = Array.from({ length: 25 }, (_, i) => 2024 - i)

  const formatarMoeda = (valor: number) => {
    if (!isMounted) return '---'
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(valor)
  }

  const calcularValorVeiculo = (dados: DadosVeiculo | VeiculoDesejado, isAtual: boolean = false) => {
    // Valores base por marca (em AOA)
    const valoresBase: { [key: string]: number } = {
      'Toyota': 12000000,
      'Hyundai': 10000000,
      'Mitsubishi': 9000000,
      'Nissan': 11000000,
      'Honda': 11500000,
      'Volkswagen': 10500000,
      'Ford': 9500000,
      'Chevrolet': 8500000,
      'Kia': 9000000,
      'Mazda': 10000000,
      'Suzuki': 7500000,
      'Isuzu': 15000000,
      'Mercedes-Benz': 25000000,
      'BMW': 22000000,
      'Audi': 20000000,
      'Land Rover': 30000000,
      'Jeep': 18000000,
      'Peugeot': 8000000,
      'Renault': 7500000,
      'Citroën': 7000000
    }

    let valorBase = valoresBase[dados.marca] || 8000000
    const anoVeiculo = parseInt(dados.ano) || (isMounted ? new Date().getFullYear() : 2024)
    const anoAtual = isMounted ? new Date().getFullYear() : 2024
    const idadeVeiculo = anoAtual - anoVeiculo

    // Depreciação por idade
    let fatorDepreciacao = 1
    if (idadeVeiculo <= 1) {
      fatorDepreciacao = 0.85 // -15% no primeiro ano
    } else if (idadeVeiculo <= 3) {
      fatorDepreciacao = 0.75 // -25% até 3 anos
    } else if (idadeVeiculo <= 5) {
      fatorDepreciacao = 0.6 // -40% até 5 anos
    } else if (idadeVeiculo <= 10) {
      fatorDepreciacao = 0.45 // -55% até 10 anos
    } else {
      fatorDepreciacao = 0.3 // -70% acima de 10 anos
    }

    valorBase *= fatorDepreciacao

    if (isAtual) {
      const dadosAtual = dados as DadosVeiculo
      
      // Ajustes por quilometragem
      const km = parseFloat(dadosAtual.quilometragem.replace(/\D/g, '')) || 0
      if (km > 200000) {
        valorBase *= 0.7 // -30% para alta quilometragem
      } else if (km > 150000) {
        valorBase *= 0.8 // -20%
      } else if (km > 100000) {
        valorBase *= 0.9 // -10%
      } else if (km < 50000) {
        valorBase *= 1.1 // +10% para baixa quilometragem
      }

      // Ajustes por estado
      switch (dadosAtual.estado) {
        case 'excelente':
          valorBase *= 1.15
          break
        case 'muito_bom':
          valorBase *= 1.1
          break
        case 'bom':
          valorBase *= 1.0
          break
        case 'regular':
          valorBase *= 0.85
          break
        case 'precisa_reparos':
          valorBase *= 0.7
          break
      }

      // Ajustes por combustível
      if (dadosAtual.combustivel === 'diesel') {
        valorBase *= 1.1 // +10% para diesel
      } else if (dadosAtual.combustivel === 'hibrido') {
        valorBase *= 1.2 // +20% para híbrido
      } else if (dadosAtual.combustivel === 'eletrico') {
        valorBase *= 1.3 // +30% para elétrico
      }

      // Ajustes por transmissão
      if (dadosAtual.transmissao === 'automatica') {
        valorBase *= 1.15 // +15% para automática
      }

      // Penalizações
      if (dadosAtual.acidentes === 'sim') {
        valorBase *= 0.8 // -20% por acidentes
      }

      if (dadosAtual.documentacao === 'incompleta') {
        valorBase *= 0.85 // -15% por documentação incompleta
      }

      if (dadosAtual.modificacoes === 'sim') {
        valorBase *= 0.9 // -10% por modificações
      }
    }

    return Math.round(valorBase)
  }

  const simularTroca = () => {
    if (!veiculoAtual.marca || !veiculoAtual.modelo || !veiculoDesejado.marca || !veiculoDesejado.modelo) {
      alert('Por favor, preencha os dados básicos dos veículos.')
      return
    }

    const valorAtual = calcularValorVeiculo(veiculoAtual, true)
    const valorDesejado = calcularValorVeiculo(veiculoDesejado)
    const diferenca = valorDesejado - valorAtual

    // Custos da troca (documentação, transferência, etc.)
    const custosTroca = 50000 // Taxa fixa estimada

    // Depreciação estimada no primeiro ano
    const depreciacao = valorDesejado * 0.15

    const valorLiquido = diferenca + custosTroca

    let tipoTroca: 'pagar' | 'receber' | 'equilibrada'
    if (Math.abs(diferenca) < 500000) {
      tipoTroca = 'equilibrada'
    } else if (diferenca > 0) {
      tipoTroca = 'pagar'
    } else {
      tipoTroca = 'receber'
    }

    setResultado({
      valorAtual,
      valorDesejado,
      diferenca,
      tipoTroca,
      depreciacao,
      custosTroca,
      valorLiquido
    })
  }

  const handleVeiculoAtualChange = (campo: string, valor: string) => {
    setVeiculoAtual(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const handleVeiculoDesejadomChange = (campo: string, valor: string) => {
    setVeiculoDesejado(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  return (
    <div className="space-y-6">
      {/* Veículo Atual */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-4">🚗 Seu Veículo Atual</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marca *
            </label>
            <select
              value={veiculoAtual.marca}
              onChange={(e) => handleVeiculoAtualChange('marca', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              value={veiculoAtual.modelo}
              onChange={(e) => handleVeiculoAtualChange('modelo', e.target.value)}
              placeholder="Ex: Corolla"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ano
            </label>
            <select
              value={veiculoAtual.ano}
              onChange={(e) => handleVeiculoAtualChange('ano', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione o ano</option>
              {anos.map((ano) => (
                <option key={ano} value={ano}>{ano}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quilometragem (km)
            </label>
            <input
              type="text"
              value={veiculoAtual.quilometragem}
              onChange={(e) => handleVeiculoAtualChange('quilometragem', e.target.value)}
              placeholder="Ex: 85000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Combustível
            </label>
            <select
              value={veiculoAtual.combustivel}
              onChange={(e) => handleVeiculoAtualChange('combustivel', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="gasolina">Gasolina</option>
              <option value="diesel">Diesel</option>
              <option value="hibrido">Híbrido</option>
              <option value="eletrico">Elétrico</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transmissão
            </label>
            <select
              value={veiculoAtual.transmissao}
              onChange={(e) => handleVeiculoAtualChange('transmissao', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="manual">Manual</option>
              <option value="automatica">Automática</option>
              <option value="cvt">CVT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado Geral
            </label>
            <select
              value={veiculoAtual.estado}
              onChange={(e) => handleVeiculoAtualChange('estado', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="excelente">Excelente</option>
              <option value="muito_bom">Muito Bom</option>
              <option value="bom">Bom</option>
              <option value="regular">Regular</option>
              <option value="precisa_reparos">Precisa Reparos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Documentação
            </label>
            <select
              value={veiculoAtual.documentacao}
              onChange={(e) => handleVeiculoAtualChange('documentacao', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="completa">Completa</option>
              <option value="incompleta">Incompleta</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Histórico de Acidentes
            </label>
            <select
              value={veiculoAtual.acidentes}
              onChange={(e) => handleVeiculoAtualChange('acidentes', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
          </div>
        </div>
      </div>

      {/* Veículo Desejado */}
      <div className="bg-green-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-green-900 mb-4">🎯 Veículo Desejado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marca *
            </label>
            <select
              value={veiculoDesejado.marca}
              onChange={(e) => handleVeiculoDesejadomChange('marca', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              value={veiculoDesejado.modelo}
              onChange={(e) => handleVeiculoDesejadomChange('modelo', e.target.value)}
              placeholder="Ex: Camry"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ano Desejado
            </label>
            <select
              value={veiculoDesejado.ano}
              onChange={(e) => handleVeiculoDesejadomChange('ano', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Selecione o ano</option>
              {anos.map((ano) => (
                <option key={ano} value={ano}>{ano}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço Máximo (AOA)
            </label>
            <input
              type="text"
              value={veiculoDesejado.precoMaximo}
              onChange={(e) => handleVeiculoDesejadomChange('precoMaximo', e.target.value)}
              placeholder="Ex: 15000000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Combustível Preferido
            </label>
            <select
              value={veiculoDesejado.combustivel}
              onChange={(e) => handleVeiculoDesejadomChange('combustivel', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="gasolina">Gasolina</option>
              <option value="diesel">Diesel</option>
              <option value="hibrido">Híbrido</option>
              <option value="eletrico">Elétrico</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transmissão Preferida
            </label>
            <select
              value={veiculoDesejado.transmissao}
              onChange={(e) => handleVeiculoDesejadomChange('transmissao', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="manual">Manual</option>
              <option value="automatica">Automática</option>
              <option value="cvt">CVT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Botão Simular */}
      <div className="text-center">
        <button
          onClick={simularTroca}
          className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          Simular Troca
        </button>
      </div>

      {/* Resultados */}
      {resultado && (
        <div className="space-y-6">
          {/* Resumo da Troca */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              🔄 Simulação de Troca
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Valor do Seu Veículo</div>
                <div className="text-2xl font-bold text-blue-600">{formatarMoeda(resultado.valorAtual)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Valor do Veículo Desejado</div>
                <div className="text-2xl font-bold text-green-600">{formatarMoeda(resultado.valorDesejado)}</div>
              </div>
            </div>

            <div className="text-center mb-4">
              {resultado.tipoTroca === 'pagar' && (
                <div>
                  <div className="text-lg font-medium text-gray-700 mb-2">Você precisa pagar:</div>
                  <div className="text-3xl font-bold text-red-600">{formatarMoeda(Math.abs(resultado.diferenca))}</div>
                </div>
              )}
              {resultado.tipoTroca === 'receber' && (
                <div>
                  <div className="text-lg font-medium text-gray-700 mb-2">Você vai receber:</div>
                  <div className="text-3xl font-bold text-green-600">{formatarMoeda(Math.abs(resultado.diferenca))}</div>
                </div>
              )}
              {resultado.tipoTroca === 'equilibrada' && (
                <div>
                  <div className="text-lg font-medium text-gray-700 mb-2">Troca equilibrada!</div>
                  <div className="text-2xl font-bold text-orange-600">Diferença mínima</div>
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Custos de Troca:</span>
                <span className="font-medium">{formatarMoeda(resultado.custosTroca)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valor Líquido da Operação:</span>
                <span className={`font-bold ${resultado.valorLiquido > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatarMoeda(Math.abs(resultado.valorLiquido))}
                </span>
              </div>
            </div>
          </div>

          {/* Análise da Troca */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="font-bold text-blue-900 mb-4">📊 Análise da Troca</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="text-blue-600 mr-3">💰</div>
                <div>
                  <div className="font-medium text-blue-900">Depreciação Estimada</div>
                  <div className="text-sm text-blue-700">
                    O veículo desejado pode depreciar {formatarMoeda(resultado.depreciacao)} no primeiro ano
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-blue-600 mr-3">📈</div>
                <div>
                  <div className="font-medium text-blue-900">Valorização do Seu Veículo</div>
                  <div className="text-sm text-blue-700">
                    {resultado.valorAtual > 5000000 
                      ? 'Seu veículo mantém bom valor de mercado'
                      : 'Considere melhorias para aumentar o valor'
                    }
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-blue-600 mr-3">🎯</div>
                <div>
                  <div className="font-medium text-blue-900">Recomendação</div>
                  <div className="text-sm text-blue-700">
                    {resultado.tipoTroca === 'equilibrada' 
                      ? 'Excelente oportunidade de troca!'
                      : resultado.diferenca > 0 
                        ? 'Avalie se o investimento adicional vale a pena'
                        : 'Ótima troca com valor positivo para você!'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dicas para Melhorar a Troca */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-green-600 mr-3">💡</div>
              <div>
                <h4 className="font-bold text-green-800 mb-2">Dicas para Melhorar sua Troca</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Faça uma revisão completa antes da avaliação</li>
                  <li>• Mantenha toda a documentação em dia</li>
                  <li>• Considere pequenos reparos estéticos</li>
                  <li>• Pesquise o valor de mercado em várias fontes</li>
                  <li>• Negocie os custos de transferência</li>
                  <li>• Avalie múltiplas propostas de stands</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Próximos Passos */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-3">📋 Próximos Passos</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">1</div>
                <span>Obtenha avaliações profissionais do seu veículo</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">2</div>
                <span>Pesquise o veículo desejado em diferentes stands</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">3</div>
                <span>Negocie as condições de troca e financiamento</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">4</div>
                <span>Verifique toda a documentação antes de fechar</span>
              </div>
            </div>
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
              Esta simulação é baseada em estimativas de mercado e pode variar conforme 
              as condições reais dos veículos, demanda do mercado e políticas dos stands. 
              Sempre obtenha avaliações profissionais antes de tomar decisões.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}