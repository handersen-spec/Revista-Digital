'use client'

import { useState, useEffect } from 'react'
import { useGoogleAnalytics } from '../GoogleAnalytics'

interface CalculadoraImpostosProps {
  onClose?: () => void
}

interface DadosVeiculo {
  tipoOperacao: string
  tipoVeiculo: string
  valorVeiculo: string
  anoVeiculo: string
  cilindrada: string
  combustivel: string
  origem: string
  finalidade: string
}

interface ResultadoImpostos {
  direitosAduaneiros: number
  iva: number
  impuestoConsumo: number
  taxaEstatistica: number
  emolumentos: number
  total: number
  valorFinalVeiculo: number
}

export default function CalculadoraImpostos({ onClose }: CalculadoraImpostosProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { trackCalculatorUse } = useGoogleAnalytics()
  const [dados, setDados] = useState<DadosVeiculo>({
    tipoOperacao: '',
    tipoVeiculo: '',
    valorVeiculo: '',
    anoVeiculo: '',
    cilindrada: '',
    combustivel: 'gasolina',
    origem: 'importacao',
    finalidade: 'particular'
  })

  const [resultado, setResultado] = useState<ResultadoImpostos | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const tiposOperacao = [
    { value: 'importacao', label: 'Importação de Veículo' },
    { value: 'matricula', label: 'Primeira Matrícula' },
    { value: 'transferencia', label: 'Transferência de Propriedade' },
    { value: 'renovacao_inspecao', label: 'Renovação de Inspeção' }
  ]

  const tiposVeiculo = [
    { value: 'ligeiro_passageiros', label: 'Ligeiro de Passageiros' },
    { value: 'comercial_ligeiro', label: 'Comercial Ligeiro' },
    { value: 'comercial_pesado', label: 'Comercial Pesado' },
    { value: 'motociclo', label: 'Motociclo' },
    { value: 'autocarro', label: 'Autocarro' },
    { value: 'tractor', label: 'Tractor' }
  ]

  const anos = Array.from({ length: 25 }, (_, i) => 2024 - i)

  const formatarMoeda = (valor: number) => {
    if (!isMounted) return '---'
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(valor)
  }

  const calcularImpostos = () => {
    if (!dados.tipoOperacao || !dados.tipoVeiculo || !dados.valorVeiculo) {
      alert('Por favor, preencha os campos obrigatórios.')
      return
    }

    const valorVeiculo = parseFloat(dados.valorVeiculo.replace(/\D/g, '')) || 0
    const anoVeiculo = parseInt(dados.anoVeiculo) || (isMounted ? new Date().getFullYear() : 2024)
    const anoAtual = isMounted ? new Date().getFullYear() : 2024
    const idadeVeiculo = anoAtual - anoVeiculo
    const cilindrada = parseFloat(dados.cilindrada) || 1.0

    let direitosAduaneiros = 0
    let iva = 0
    let impuestoConsumo = 0
    let taxaEstatistica = 0
    let emolumentos = 0

    if (dados.tipoOperacao === 'importacao') {
      // Direitos Aduaneiros (varia por tipo de veículo e idade)
      let taxaAduaneira = 0.3 // 30% base

      // Ajustes por tipo de veículo
      switch (dados.tipoVeiculo) {
        case 'ligeiro_passageiros':
          if (idadeVeiculo <= 3) {
            taxaAduaneira = 0.3
          } else if (idadeVeiculo <= 5) {
            taxaAduaneira = 0.35
          } else {
            taxaAduaneira = 0.5
          }
          break
        case 'comercial_ligeiro':
          taxaAduaneira = 0.25
          break
        case 'comercial_pesado':
          taxaAduaneira = 0.2
          break
        case 'motociclo':
          taxaAduaneira = 0.2
          break
        case 'autocarro':
          taxaAduaneira = 0.15
          break
        case 'tractor':
          taxaAduaneira = 0.1
          break
      }

      // Ajustes por cilindrada (para ligeiros)
      if (dados.tipoVeiculo === 'ligeiro_passageiros') {
        if (cilindrada > 3.0) {
          taxaAduaneira += 0.1 // +10% para veículos de alta cilindrada
        } else if (cilindrada < 1.2) {
          taxaAduaneira -= 0.05 // -5% para veículos econômicos
        }
      }

      direitosAduaneiros = valorVeiculo * taxaAduaneira

      // IVA (14% sobre valor + direitos aduaneiros)
      const baseIVA = valorVeiculo + direitosAduaneiros
      iva = baseIVA * 0.14

      // Imposto de Consumo (varia por cilindrada e tipo)
      if (dados.tipoVeiculo === 'ligeiro_passageiros') {
        if (cilindrada <= 1.5) {
          impuestoConsumo = valorVeiculo * 0.1 // 10%
        } else if (cilindrada <= 2.0) {
          impuestoConsumo = valorVeiculo * 0.15 // 15%
        } else if (cilindrada <= 3.0) {
          impuestoConsumo = valorVeiculo * 0.25 // 25%
        } else {
          impuestoConsumo = valorVeiculo * 0.35 // 35%
        }
      } else if (dados.tipoVeiculo === 'motociclo') {
        if (cilindrada <= 0.25) {
          impuestoConsumo = valorVeiculo * 0.05
        } else {
          impuestoConsumo = valorVeiculo * 0.1
        }
      }

      // Taxa Estatística (1% do valor CIF)
      taxaEstatistica = valorVeiculo * 0.01

      // Emolumentos e taxas diversas
      emolumentos = 50000 // Taxa fixa base
      
    } else if (dados.tipoOperacao === 'matricula') {
      // Primeira matrícula (veículo já em Angola)
      emolumentos = 25000 // Taxa de matrícula
      
      // Imposto de Circulação (anual)
      switch (dados.tipoVeiculo) {
        case 'ligeiro_passageiros':
          if (cilindrada <= 1.2) {
            impuestoConsumo = 15000
          } else if (cilindrada <= 1.6) {
            impuestoConsumo = 25000
          } else if (cilindrada <= 2.0) {
            impuestoConsumo = 40000
          } else {
            impuestoConsumo = 60000
          }
          break
        case 'comercial_ligeiro':
          impuestoConsumo = 30000
          break
        case 'motociclo':
          impuestoConsumo = 8000
          break
        default:
          impuestoConsumo = 50000
      }
      
    } else if (dados.tipoOperacao === 'transferencia') {
      // Transferência de propriedade
      emolumentos = 15000 // Taxa de transferência
      
      // Imposto de Selo (2% do valor declarado)
      iva = valorVeiculo * 0.02
      
    } else if (dados.tipoOperacao === 'renovacao_inspecao') {
      // Renovação de inspeção técnica
      switch (dados.tipoVeiculo) {
        case 'ligeiro_passageiros':
          emolumentos = 8000
          break
        case 'comercial_ligeiro':
          emolumentos = 12000
          break
        case 'comercial_pesado':
          emolumentos = 20000
          break
        case 'motociclo':
          emolumentos = 5000
          break
        default:
          emolumentos = 15000
      }
    }

    const total = direitosAduaneiros + iva + impuestoConsumo + taxaEstatistica + emolumentos
    const valorFinalVeiculo = valorVeiculo + total

    setResultado({
      direitosAduaneiros,
      iva,
      impuestoConsumo,
      taxaEstatistica,
      emolumentos,
      total,
      valorFinalVeiculo
    })

    // Track calculator usage
    trackCalculatorUse('impostos', total)
  }

  const handleInputChange = (campo: string, valor: string) => {
    setDados(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const obterDescricaoImposto = () => {
    switch (dados.tipoOperacao) {
      case 'importacao':
        return {
          direitos: 'Direitos Aduaneiros',
          iva: 'IVA (14%)',
          consumo: 'Imposto de Consumo',
          estatistica: 'Taxa Estatística',
          emolumentos: 'Emolumentos e Taxas'
        }
      case 'matricula':
        return {
          direitos: 'Taxa de Matrícula',
          iva: 'Taxas Administrativas',
          consumo: 'Imposto de Circulação',
          estatistica: 'Taxa de Inspeção',
          emolumentos: 'Emolumentos'
        }
      case 'transferencia':
        return {
          direitos: 'Taxa de Transferência',
          iva: 'Imposto de Selo (2%)',
          consumo: 'Taxas Administrativas',
          estatistica: 'Taxa de Registo',
          emolumentos: 'Emolumentos'
        }
      default:
        return {
          direitos: 'Taxa Principal',
          iva: 'Taxas Secundárias',
          consumo: 'Outros Impostos',
          estatistica: 'Taxa Estatística',
          emolumentos: 'Emolumentos'
        }
    }
  }

  return (
    <div className="space-y-6">
      {/* Formulário */}
      <div className="space-y-6">
        {/* Tipo de Operação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de Operação *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tiposOperacao.map((tipo) => (
              <button
                key={tipo.value}
                onClick={() => handleInputChange('tipoOperacao', tipo.value)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  dados.tipoOperacao === tipo.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{tipo.label}</div>
              </button>
            ))}
          </div>
        </div>

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
                Ano do Veículo
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
                Cilindrada (L)
              </label>
              <input
                type="text"
                value={dados.cilindrada}
                onChange={(e) => handleInputChange('cilindrada', e.target.value)}
                placeholder="Ex: 1.8"
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
                <option value="hibrido">Híbrido</option>
                <option value="eletrico">Elétrico</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Finalidade
              </label>
              <select
                value={dados.finalidade}
                onChange={(e) => handleInputChange('finalidade', e.target.value)}
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
      </div>

      {/* Botão Calcular */}
      <div className="text-center">
        <button
          onClick={calcularImpostos}
          className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          Calcular Impostos
        </button>
      </div>

      {/* Resultados */}
      {resultado && (
        <div className="space-y-6">
          {/* Resumo dos Impostos */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              💰 Cálculo de Impostos e Taxas
            </h3>
            
            <div className="space-y-3">
              {resultado.direitosAduaneiros > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">{obterDescricaoImposto().direitos}:</span>
                  <span className="font-medium">{formatarMoeda(resultado.direitosAduaneiros)}</span>
                </div>
              )}
              {resultado.iva > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">{obterDescricaoImposto().iva}:</span>
                  <span className="font-medium">{formatarMoeda(resultado.iva)}</span>
                </div>
              )}
              {resultado.impuestoConsumo > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">{obterDescricaoImposto().consumo}:</span>
                  <span className="font-medium">{formatarMoeda(resultado.impuestoConsumo)}</span>
                </div>
              )}
              {resultado.taxaEstatistica > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">{obterDescricaoImposto().estatistica}:</span>
                  <span className="font-medium">{formatarMoeda(resultado.taxaEstatistica)}</span>
                </div>
              )}
              {resultado.emolumentos > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">{obterDescricaoImposto().emolumentos}:</span>
                  <span className="font-medium">{formatarMoeda(resultado.emolumentos)}</span>
                </div>
              )}
              <hr className="border-gray-300" />
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-gray-900">Total de Impostos:</span>
                <span className="font-bold text-red-600">{formatarMoeda(resultado.total)}</span>
              </div>
              {dados.tipoOperacao === 'importacao' && (
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-gray-900">Valor Final do Veículo:</span>
                  <span className="font-bold text-orange-600">{formatarMoeda(resultado.valorFinalVeiculo)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Análise dos Impostos */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="font-bold text-blue-900 mb-4">📊 Análise dos Impostos</h4>
            <div className="space-y-2 text-sm text-blue-800">
              {dados.tipoOperacao === 'importacao' && (
                <>
                  <p>• <strong>Carga Fiscal Total:</strong> {((resultado.total / parseFloat(dados.valorVeiculo.replace(/\D/g, ''))) * 100).toFixed(1)}% do valor do veículo</p>
                  <p>• <strong>Maior Componente:</strong> {
                    resultado.direitosAduaneiros > resultado.iva && resultado.direitosAduaneiros > resultado.impuestoConsumo 
                      ? 'Direitos Aduaneiros' 
                      : resultado.iva > resultado.impuestoConsumo 
                        ? 'IVA' 
                        : 'Imposto de Consumo'
                  }</p>
                </>
              )}
              <p>• <strong>Documentação:</strong> Guarde todos os comprovantes de pagamento</p>
              <p>• <strong>Prazo:</strong> Impostos devem ser pagos antes da conclusão do processo</p>
            </div>
          </div>

          {/* Dicas para Reduzir Impostos */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-green-600 mr-3">💡</div>
              <div>
                <h4 className="font-bold text-green-800 mb-1">Dicas para Reduzir Impostos</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Considere veículos com menor cilindrada para reduzir impostos</li>
                  <li>• Veículos comerciais têm taxas aduaneiras menores</li>
                  <li>• Veículos elétricos podem ter benefícios fiscais</li>
                  <li>• Verifique acordos comerciais que possam reduzir taxas</li>
                  <li>• Consulte um despachante para otimização fiscal</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Órgãos Competentes */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-3">🏛️ Órgãos Competentes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-900">Serviços Aduaneiros</div>
                <div className="text-gray-600">Direitos aduaneiros e IVA</div>
                <div className="text-gray-600">Tel: +244 222 310 000</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Conservatória do Registo</div>
                <div className="text-gray-600">Matrícula e transferências</div>
                <div className="text-gray-600">Tel: +244 222 334 455</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">AGT - Administração Geral Tributária</div>
                <div className="text-gray-600">Impostos diversos</div>
                <div className="text-gray-600">Tel: +244 222 638 200</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Ministério dos Transportes</div>
                <div className="text-gray-600">Regulamentação e licenças</div>
                <div className="text-gray-600">Tel: +244 222 321 000</div>
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
            <h4 className="font-bold text-yellow-800 mb-1">Aviso Legal</h4>
            <p className="text-sm text-yellow-700">
              Este cálculo é uma estimativa baseada na legislação vigente e pode variar conforme 
              mudanças nas taxas, acordos comerciais, ou características específicas do veículo. 
              Para valores oficiais, consulte sempre os órgãos competentes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}