'use client'

import { useState, useEffect } from 'react'

interface CalculadoraSeguroENSAProps {
  onClose?: () => void
}

interface DadosSeguro {
  tipoVeiculo: string
  valorVeiculo: string
  anoVeiculo: string
  tipoCobertura: string
  franquia: string
  condutor: {
    idade: string
    experiencia: string
    sexo: string
    estadoCivil: string
  }
  utilizacao: string
  regiao: string
}

interface ResultadoSeguro {
  premioBase: number
  impostos: number
  taxas: number
  premioTotal: number
  franquiaValor: number
  coberturaMorte: number
  coberturaInvalidez: number
  coberturaResponsabilidadeCivil: number
}

export default function CalculadoraSeguroENSA({ onClose }: CalculadoraSeguroENSAProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [dados, setDados] = useState<DadosSeguro>({
    tipoVeiculo: '',
    valorVeiculo: '',
    anoVeiculo: '',
    tipoCobertura: 'obrigatorio',
    franquia: '5',
    condutor: {
      idade: '',
      experiencia: '',
      sexo: '',
      estadoCivil: ''
    },
    utilizacao: 'particular',
    regiao: 'luanda'
  })

  const [resultado, setResultado] = useState<ResultadoSeguro | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const tiposVeiculo = [
    { value: 'ligeiro', label: 'Ligeiro de Passageiros' },
    { value: 'comercial_ligeiro', label: 'Comercial Ligeiro' },
    { value: 'comercial_pesado', label: 'Comercial Pesado' },
    { value: 'motociclo', label: 'Motociclo' },
    { value: 'autocarro', label: 'Autocarro' },
    { value: 'taxi', label: 'Táxi' }
  ]

  const anos = Array.from({ length: 25 }, (_, i) => 2024 - i)

  const formatarMoeda = (valor: number) => {
    if (!isMounted) return '---'
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(valor)
  }

  const calcularSeguro = () => {
    if (!dados.tipoVeiculo || !dados.valorVeiculo || !dados.anoVeiculo) {
      alert('Por favor, preencha os campos obrigatórios.')
      return
    }

    const valorVeiculo = parseFloat(dados.valorVeiculo.replace(/\D/g, '')) || 0
    const anoVeiculo = parseInt(dados.anoVeiculo)
    const anoAtual = isMounted ? new Date().getFullYear() : 2024
    const idadeVeiculo = anoAtual - anoVeiculo
    const idadeCondutor = parseInt(dados.condutor.idade) || 25
    const experienciaCondutor = parseInt(dados.condutor.experiencia) || 1

    // Cálculo do prêmio base por tipo de veículo
    let taxaBase = 0.03 // 3% do valor do veículo como base

    switch (dados.tipoVeiculo) {
      case 'ligeiro':
        taxaBase = 0.025
        break
      case 'comercial_ligeiro':
        taxaBase = 0.035
        break
      case 'comercial_pesado':
        taxaBase = 0.045
        break
      case 'motociclo':
        taxaBase = 0.04
        break
      case 'autocarro':
        taxaBase = 0.05
        break
      case 'taxi':
        taxaBase = 0.06
        break
    }

    let premioBase = valorVeiculo * taxaBase

    // Ajustes por idade do veículo
    if (idadeVeiculo > 10) {
      premioBase *= 1.3
    } else if (idadeVeiculo > 5) {
      premioBase *= 1.15
    }

    // Ajustes por idade do condutor
    if (idadeCondutor < 25) {
      premioBase *= 1.4
    } else if (idadeCondutor < 30) {
      premioBase *= 1.2
    } else if (idadeCondutor > 65) {
      premioBase *= 1.1
    }

    // Ajustes por experiência
    if (experienciaCondutor < 2) {
      premioBase *= 1.3
    } else if (experienciaCondutor < 5) {
      premioBase *= 1.1
    } else if (experienciaCondutor > 15) {
      premioBase *= 0.9
    }

    // Ajustes por sexo
    if (dados.condutor.sexo === 'masculino' && idadeCondutor < 30) {
      premioBase *= 1.15
    }

    // Ajustes por estado civil
    if (dados.condutor.estadoCivil === 'casado') {
      premioBase *= 0.95
    }

    // Ajustes por utilização
    switch (dados.utilizacao) {
      case 'comercial':
        premioBase *= 1.5
        break
      case 'taxi':
        premioBase *= 2.0
        break
      case 'aluguer':
        premioBase *= 1.8
        break
    }

    // Ajustes por região
    switch (dados.regiao) {
      case 'luanda':
        premioBase *= 1.2
        break
      case 'benguela':
        premioBase *= 1.1
        break
      case 'huambo':
        premioBase *= 1.05
        break
    }

    // Ajustes por tipo de cobertura
    if (dados.tipoCobertura === 'contra_terceiros') {
      premioBase *= 1.5
    } else if (dados.tipoCobertura === 'todos_riscos') {
      premioBase *= 2.5
    }

    // Cálculo de impostos e taxas
    const impostos = premioBase * 0.1 // 10% de impostos
    const taxas = 5000 // Taxa fixa de emissão

    const premioTotal = premioBase + impostos + taxas

    // Cálculo da franquia
    const franquiaPercentual = parseFloat(dados.franquia) / 100
    const franquiaValor = valorVeiculo * franquiaPercentual

    // Coberturas
    const coberturaMorte = dados.tipoCobertura === 'obrigatorio' ? 2000000 : 5000000
    const coberturaInvalidez = dados.tipoCobertura === 'obrigatorio' ? 1000000 : 3000000
    const coberturaResponsabilidadeCivil = dados.tipoCobertura === 'obrigatorio' ? 5000000 : 15000000

    setResultado({
      premioBase,
      impostos,
      taxas,
      premioTotal,
      franquiaValor,
      coberturaMorte,
      coberturaInvalidez,
      coberturaResponsabilidadeCivil
    })
  }

  const handleInputChange = (campo: string, valor: string) => {
    if (campo.startsWith('condutor.')) {
      const subcampo = campo.split('.')[1]
      setDados(prev => ({
        ...prev,
        condutor: {
          ...prev.condutor,
          [subcampo]: valor
        }
      }))
    } else {
      setDados(prev => ({
        ...prev,
        [campo]: valor
      }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Formulário */}
      <div className="space-y-6">
        {/* Dados do Veículo */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🚗 Dados do Veículo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Veículo *
              </label>
              <select
                value={dados.tipoVeiculo}
                onChange={(e) => handleInputChange('tipoVeiculo', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Selecione o tipo</option>
                {tiposVeiculo.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor do Veículo (AOA) *
              </label>
              <input
                type="text"
                value={dados.valorVeiculo}
                onChange={(e) => handleInputChange('valorVeiculo', e.target.value)}
                placeholder="Ex: 8000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ano do Veículo *
              </label>
              <select
                value={dados.anoVeiculo}
                onChange={(e) => handleInputChange('anoVeiculo', e.target.value)}
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
                Tipo de Cobertura
              </label>
              <select
                value={dados.tipoCobertura}
                onChange={(e) => handleInputChange('tipoCobertura', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="obrigatorio">Seguro Obrigatório</option>
                <option value="contra_terceiros">Contra Terceiros</option>
                <option value="todos_riscos">Todos os Riscos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Franquia (%)
              </label>
              <select
                value={dados.franquia}
                onChange={(e) => handleInputChange('franquia', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="5">5% - Prêmio mais alto</option>
                <option value="10">10% - Prêmio médio</option>
                <option value="15">15% - Prêmio mais baixo</option>
                <option value="20">20% - Prêmio mínimo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Utilização
              </label>
              <select
                value={dados.utilizacao}
                onChange={(e) => handleInputChange('utilizacao', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="particular">Particular</option>
                <option value="comercial">Comercial</option>
                <option value="taxi">Táxi</option>
                <option value="aluguer">Aluguer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dados do Condutor */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">👤 Dados do Condutor Principal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idade
              </label>
              <input
                type="number"
                value={dados.condutor.idade}
                onChange={(e) => handleInputChange('condutor.idade', e.target.value)}
                placeholder="Ex: 35"
                min="18"
                max="80"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anos de Experiência
              </label>
              <input
                type="number"
                value={dados.condutor.experiencia}
                onChange={(e) => handleInputChange('condutor.experiencia', e.target.value)}
                placeholder="Ex: 10"
                min="0"
                max="50"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sexo
              </label>
              <select
                value={dados.condutor.sexo}
                onChange={(e) => handleInputChange('condutor.sexo', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado Civil
              </label>
              <select
                value={dados.condutor.estadoCivil}
                onChange={(e) => handleInputChange('condutor.estadoCivil', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="solteiro">Solteiro(a)</option>
                <option value="casado">Casado(a)</option>
                <option value="divorciado">Divorciado(a)</option>
                <option value="viuvo">Viúvo(a)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Localização */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📍 Localização</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Região de Circulação
            </label>
            <select
              value={dados.regiao}
              onChange={(e) => handleInputChange('regiao', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="luanda">Luanda</option>
              <option value="benguela">Benguela</option>
              <option value="huambo">Huambo</option>
              <option value="lubango">Lubango</option>
              <option value="cabinda">Cabinda</option>
              <option value="outras">Outras Províncias</option>
            </select>
          </div>
        </div>
      </div>

      {/* Botão Calcular */}
      <div className="text-center">
        <button
          onClick={calcularSeguro}
          className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          Calcular Seguro ENSA
        </button>
      </div>

      {/* Resultados */}
      {resultado && (
        <div className="space-y-6">
          {/* Resumo do Prêmio */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              💰 Cálculo do Prêmio Anual
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Prêmio Base:</span>
                <span className="font-medium">{formatarMoeda(resultado.premioBase)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Impostos (10%):</span>
                <span className="font-medium">{formatarMoeda(resultado.impostos)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Taxas de Emissão:</span>
                <span className="font-medium">{formatarMoeda(resultado.taxas)}</span>
              </div>
              <hr className="border-gray-300" />
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-gray-900">Total Anual:</span>
                <span className="font-bold text-orange-600">{formatarMoeda(resultado.premioTotal)}</span>
              </div>
              <div className="text-center text-sm text-gray-600">
                Pagamento mensal: {formatarMoeda(resultado.premioTotal / 12)}
              </div>
            </div>
          </div>

          {/* Coberturas */}
          <div className="bg-white rounded-lg border p-6">
            <h4 className="font-bold text-gray-900 mb-4">🛡️ Coberturas Incluídas</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-700">Morte</div>
                <div className="font-bold text-blue-900">{formatarMoeda(resultado.coberturaMorte)}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-700">Invalidez Permanente</div>
                <div className="font-bold text-green-900">{formatarMoeda(resultado.coberturaInvalidez)}</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-700">Responsabilidade Civil</div>
                <div className="font-bold text-purple-900">{formatarMoeda(resultado.coberturaResponsabilidadeCivil)}</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm text-yellow-700">Franquia:</div>
              <div className="font-bold text-yellow-900">{formatarMoeda(resultado.franquiaValor)}</div>
              <div className="text-xs text-yellow-600 mt-1">
                Valor que fica por sua conta em caso de sinistro
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-blue-600 mr-3">ℹ️</div>
              <div>
                <h4 className="font-bold text-blue-800 mb-1">Informações Importantes</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Este é um cálculo estimativo baseado em dados padrão da ENSA</li>
                  <li>• O valor final pode variar conforme análise de risco detalhada</li>
                  <li>• Desconto para bom condutor pode ser aplicado</li>
                  <li>• Consulte um agente ENSA para cotação oficial</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contatos ENSA */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-bold text-gray-900 mb-3">📞 Contatos ENSA</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-900">Sede Principal</div>
            <div className="text-gray-600">Rua Amílcar Cabral, 58-60</div>
            <div className="text-gray-600">Tel: +244 222 432 100</div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Atendimento ao Cliente</div>
            <div className="text-gray-600">Linha Verde: 800 200 300</div>
            <div className="text-gray-600">Email: info@ensa.co.ao</div>
          </div>
        </div>
      </div>
    </div>
  )
}