'use client'

import { useState, useEffect } from 'react'

interface PlanejadorManutencaoProps {
  onClose?: () => void
}

interface DadosVeiculo {
  marca: string
  modelo: string
  ano: string
  quilometragem: string
  combustivel: string
  transmissao: string
  ultimaRevisao: string
  kmUltimaRevisao: string
  tipoUso: string
}

interface ItemManutencao {
  id: string
  nome: string
  categoria: 'preventiva' | 'corretiva' | 'urgente'
  kmProximo: number
  dataProxima: string
  custo: number
  prioridade: 'alta' | 'media' | 'baixa'
  descricao: string
  frequencia: string
}

interface PlanoManutencao {
  proximosItens: ItemManutencao[]
  custoTotal: number
  custoMensal: number
  alertas: string[]
}

export default function PlanejadorManutencao({ onClose }: PlanejadorManutencaoProps) {
  const [dados, setDados] = useState<DadosVeiculo>({
    marca: '',
    modelo: '',
    ano: '',
    quilometragem: '',
    combustivel: 'gasolina',
    transmissao: 'manual',
    ultimaRevisao: '',
    kmUltimaRevisao: '',
    tipoUso: 'urbano'
  })
  const [plano, setPlano] = useState<PlanoManutencao | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const marcas = [
    'Toyota', 'Hyundai', 'Mitsubishi', 'Nissan', 'Honda', 'Volkswagen',
    'Ford', 'Chevrolet', 'Kia', 'Mazda', 'Suzuki', 'Isuzu'
  ]

  const anos = Array.from({ length: 25 }, (_, i) => 2024 - i)

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(valor)
  }

  const formatarData = (data: string) => {
    if (!isMounted) return '---'
    return new Date(data).toLocaleDateString('pt-AO')
  }

  const calcularProximaData = (meses: number) => {
    if (!isMounted) return ''
    const hoje = new Date()
    hoje.setMonth(hoje.getMonth() + meses)
    return hoje.toISOString().split('T')[0]
  }

  const gerarPlanoManutencao = () => {
    if (!dados.marca || !dados.quilometragem) {
      alert('Por favor, preencha os dados básicos do veículo.')
      return
    }

    const kmAtual = parseFloat(dados.quilometragem.replace(/\D/g, '')) || 0
    const kmUltimaRevisao = parseFloat(dados.kmUltimaRevisao.replace(/\D/g, '')) || kmAtual
    const anoVeiculo = parseInt(dados.ano) || (isMounted ? new Date().getFullYear() : 2024)
    const idadeVeiculo = (isMounted ? new Date().getFullYear() : 2024) - anoVeiculo

    // Fator de ajuste baseado no tipo de uso
    const fatorUso = dados.tipoUso === 'urbano' ? 1.0 : 
                     dados.tipoUso === 'estrada' ? 0.8 : 
                     dados.tipoUso === 'misto' ? 0.9 : 1.2

    const itensManutencao: ItemManutencao[] = []

    // Manutenções básicas
    const manutencaoBasica = [
      {
        nome: 'Troca de Óleo e Filtro',
        categoria: 'preventiva' as const,
        kmIntervalo: Math.round(5000 * fatorUso),
        mesesIntervalo: 6,
        custo: 150000,
        prioridade: 'alta' as const,
        descricao: 'Troca do óleo do motor e filtro de óleo',
        frequencia: 'A cada 5.000 km ou 6 meses'
      },
      {
        nome: 'Filtro de Ar',
        categoria: 'preventiva' as const,
        kmIntervalo: Math.round(10000 * fatorUso),
        mesesIntervalo: 12,
        custo: 50000,
        prioridade: 'media' as const,
        descricao: 'Substituição do filtro de ar do motor',
        frequencia: 'A cada 10.000 km ou 12 meses'
      },
      {
        nome: 'Filtro de Combustível',
        categoria: 'preventiva' as const,
        kmIntervalo: Math.round(20000 * fatorUso),
        mesesIntervalo: 24,
        custo: 80000,
        prioridade: 'media' as const,
        descricao: 'Troca do filtro de combustível',
        frequencia: 'A cada 20.000 km ou 2 anos'
      },
      {
        nome: 'Velas de Ignição',
        categoria: 'preventiva' as const,
        kmIntervalo: Math.round(30000 * fatorUso),
        mesesIntervalo: 36,
        custo: 200000,
        prioridade: 'media' as const,
        descricao: 'Substituição das velas de ignição',
        frequencia: 'A cada 30.000 km ou 3 anos'
      },
      {
        nome: 'Pastilhas de Freio',
        categoria: 'preventiva' as const,
        kmIntervalo: Math.round(25000 * fatorUso),
        mesesIntervalo: 30,
        custo: 300000,
        prioridade: 'alta' as const,
        descricao: 'Troca das pastilhas de freio dianteiras',
        frequencia: 'A cada 25.000 km ou conforme desgaste'
      },
      {
        nome: 'Pneus (Rodízio)',
        categoria: 'preventiva' as const,
        kmIntervalo: Math.round(10000 * fatorUso),
        mesesIntervalo: 6,
        custo: 50000,
        prioridade: 'media' as const,
        descricao: 'Rodízio e balanceamento dos pneus',
        frequencia: 'A cada 10.000 km'
      },
      {
        nome: 'Fluido de Freio',
        categoria: 'preventiva' as const,
        kmIntervalo: Math.round(40000 * fatorUso),
        mesesIntervalo: 24,
        custo: 120000,
        prioridade: 'alta' as const,
        descricao: 'Troca do fluido de freio',
        frequencia: 'A cada 2 anos ou 40.000 km'
      },
      {
        nome: 'Correia Dentada',
        categoria: 'preventiva' as const,
        kmIntervalo: Math.round(60000 * fatorUso),
        mesesIntervalo: 60,
        custo: 800000,
        prioridade: 'alta' as const,
        descricao: 'Substituição da correia dentada e tensor',
        frequencia: 'A cada 60.000 km ou 5 anos'
      }
    ]

    // Manutenções específicas por idade do veículo
    if (idadeVeiculo > 5) {
      manutencaoBasica.push(
        {
          nome: 'Radiador (Limpeza)',
          categoria: 'preventiva' as const,
          kmIntervalo: Math.round(30000 * fatorUso),
          mesesIntervalo: 24,
          custo: 180000,
          prioridade: 'media' as const,
          descricao: 'Limpeza e verificação do sistema de arrefecimento',
          frequencia: 'A cada 2 anos'
        },
        {
          nome: 'Amortecedores',
          categoria: 'preventiva' as const,
          kmIntervalo: Math.round(80000 * fatorUso),
          mesesIntervalo: 72,
          custo: 1200000,
          prioridade: 'media' as const,
          descricao: 'Verificação e possível troca dos amortecedores',
          frequencia: 'A cada 80.000 km'
        }
      )
    }

    if (idadeVeiculo > 10) {
      manutencaoBasica.push(
        {
          nome: 'Embreagem',
          categoria: 'preventiva' as const,
          kmIntervalo: Math.round(100000 * fatorUso),
          mesesIntervalo: 120,
          custo: 2000000,
          prioridade: 'alta' as const,
          descricao: 'Verificação e possível troca da embreagem',
          frequencia: 'A cada 100.000 km'
        }
      )
    }

    // Calcular próximas manutenções
    manutencaoBasica.forEach((item, index) => {
      const kmDesdeUltimaRevisao = kmAtual - kmUltimaRevisao
      const kmProximo = kmUltimaRevisao + Math.ceil((kmDesdeUltimaRevisao + item.kmIntervalo) / item.kmIntervalo) * item.kmIntervalo
      
      // Estimar data baseada na quilometragem média mensal (assumindo 1500 km/mês)
      const kmRestantes = kmProximo - kmAtual
      const mesesRestantes = Math.max(1, Math.round(kmRestantes / 1500))
      const dataProxima = calcularProximaData(mesesRestantes)

      itensManutencao.push({
        id: `item-${index}`,
        nome: item.nome,
        categoria: item.categoria,
        kmProximo,
        dataProxima,
        custo: item.custo,
        prioridade: item.prioridade,
        descricao: item.descricao,
        frequencia: item.frequencia
      })
    })

    // Ordenar por quilometragem
    itensManutencao.sort((a, b) => a.kmProximo - b.kmProximo)

    // Pegar apenas os próximos 8 itens
    const proximosItens = itensManutencao.slice(0, 8)

    // Calcular custos
    const custoTotal = proximosItens.reduce((total, item) => total + item.custo, 0)
    const custoMensal = custoTotal / 12

    // Gerar alertas
    const alertas: string[] = []
    const kmAtualNum = kmAtual

    proximosItens.forEach(item => {
      const kmRestantes = item.kmProximo - kmAtualNum
      if (kmRestantes <= 1000) {
        alertas.push(`⚠️ ${item.nome} - URGENTE (${kmRestantes} km restantes)`)
      } else if (kmRestantes <= 3000) {
        alertas.push(`🔔 ${item.nome} - Em breve (${kmRestantes} km restantes)`)
      }
    })

    // Alertas por idade do veículo
    if (idadeVeiculo > 8) {
      alertas.push('🔍 Veículo com mais de 8 anos - Aumente a frequência de inspeções')
    }

    if (kmAtual > 150000) {
      alertas.push('📊 Veículo com alta quilometragem - Monitore componentes críticos')
    }

    setPlano({
      proximosItens,
      custoTotal,
      custoMensal,
      alertas
    })
  }

  const handleInputChange = (campo: string, valor: string) => {
    setDados(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'text-red-600 bg-red-50 border-red-200'
      case 'media': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'baixa': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'preventiva': return '🔧'
      case 'corretiva': return '⚙️'
      case 'urgente': return '🚨'
      default: return '🔧'
    }
  }

  return (
    <div className="space-y-6">
      {/* Formulário */}
      <div className="space-y-6">
        {/* Dados Básicos do Veículo */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">🚗 Dados do Veículo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca *
              </label>
              <select
                value={dados.marca}
                onChange={(e) => handleInputChange('marca', e.target.value)}
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
                Modelo
              </label>
              <input
                type="text"
                value={dados.modelo}
                onChange={(e) => handleInputChange('modelo', e.target.value)}
                placeholder="Ex: Corolla"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ano
              </label>
              <select
                value={dados.ano}
                onChange={(e) => handleInputChange('ano', e.target.value)}
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
                Quilometragem Atual (km) *
              </label>
              <input
                type="text"
                value={dados.quilometragem}
                onChange={(e) => handleInputChange('quilometragem', e.target.value)}
                placeholder="Ex: 85000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Combustível
              </label>
              <select
                value={dados.combustivel}
                onChange={(e) => handleInputChange('combustivel', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="gasolina">Gasolina</option>
                <option value="diesel">Diesel</option>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="manual">Manual</option>
                <option value="automatica">Automática</option>
                <option value="cvt">CVT</option>
              </select>
            </div>
          </div>
        </div>

        {/* Histórico de Manutenção */}
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-green-900 mb-4">📋 Histórico de Manutenção</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data da Última Revisão
              </label>
              <input
                type="date"
                value={dados.ultimaRevisao}
                onChange={(e) => handleInputChange('ultimaRevisao', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                KM da Última Revisão
              </label>
              <input
                type="text"
                value={dados.kmUltimaRevisao}
                onChange={(e) => handleInputChange('kmUltimaRevisao', e.target.value)}
                placeholder="Ex: 80000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Uso
              </label>
              <select
                value={dados.tipoUso}
                onChange={(e) => handleInputChange('tipoUso', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="urbano">Urbano (cidade)</option>
                <option value="estrada">Estrada (rodovia)</option>
                <option value="misto">Misto</option>
                <option value="severo">Severo (taxi, delivery)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Gerar Plano */}
      <div className="text-center">
        <button
          onClick={gerarPlanoManutencao}
          className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          Gerar Plano de Manutenção
        </button>
      </div>

      {/* Resultados */}
      {plano && (
        <div className="space-y-6">
          {/* Alertas */}
          {plano.alertas.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-bold text-red-800 mb-3">🚨 Alertas Importantes</h4>
              <div className="space-y-2">
                {plano.alertas.map((alerta, index) => (
                  <div key={index} className="text-sm text-red-700">
                    {alerta}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resumo de Custos */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              💰 Resumo de Custos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-sm text-gray-600 mb-1">Custo Total Estimado</div>
                <div className="text-2xl font-bold text-blue-600">{formatarMoeda(plano.custoTotal)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Custo Médio Mensal</div>
                <div className="text-2xl font-bold text-purple-600">{formatarMoeda(plano.custoMensal)}</div>
              </div>
            </div>
          </div>

          {/* Plano de Manutenção */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">🔧 Próximas Manutenções</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {plano.proximosItens.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{getCategoriaIcon(item.categoria)}</span>
                        <h4 className="text-lg font-bold text-gray-900">{item.nome}</h4>
                        <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full border ${getPrioridadeColor(item.prioridade)}`}>
                          {item.prioridade.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{item.descricao}</p>
                      <div className="text-sm text-gray-500 space-y-1">
                        <div>📅 <strong>Frequência:</strong> {item.frequencia}</div>
                        <div>🛣️ <strong>Próxima em:</strong> {isMounted ? item.kmProximo.toLocaleString() : '---'} km</div>
                        <div>📆 <strong>Data estimada:</strong> {formatarData(item.dataProxima)}</div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-orange-600">
                        {formatarMoeda(item.custo)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dicas de Manutenção */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-green-600 mr-3">💡</div>
              <div>
                <h4 className="font-bold text-green-800 mb-2">Dicas para Economizar na Manutenção</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Faça manutenções preventivas para evitar reparos caros</li>
                  <li>• Compare preços em diferentes oficinas</li>
                  <li>• Use peças originais ou de qualidade equivalente</li>
                  <li>• Mantenha um registro detalhado das manutenções</li>
                  <li>• Aprenda verificações básicas (óleo, pneus, fluidos)</li>
                  <li>• Respeite os intervalos recomendados pelo fabricante</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Oficinas Recomendadas */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-3">🔧 Oficinas Recomendadas em Luanda</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-900">Toyota Angola</div>
                <div className="text-gray-600">Rua Rainha Ginga, Maianga</div>
                <div className="text-gray-600">Tel: +244 222 310 500</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Hyundai Caetano Angola</div>
                <div className="text-gray-600">Zona Industrial, Viana</div>
                <div className="text-gray-600">Tel: +244 222 760 100</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Oficina Central</div>
                <div className="text-gray-600">Rua Amílcar Cabral, Centro</div>
                <div className="text-gray-600">Tel: +244 222 334 567</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Auto Mecânica Moderna</div>
                <div className="text-gray-600">Bairro Operário, Luanda</div>
                <div className="text-gray-600">Tel: +244 222 445 678</div>
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
              Este plano é uma estimativa baseada em padrões gerais de manutenção. 
              Consulte sempre o manual do proprietário e um mecânico qualificado 
              para orientações específicas do seu veículo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}