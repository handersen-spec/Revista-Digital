'use client'

import { useState, useEffect } from 'react'
import { ArrowLeftRight, X, TrendingUp, Clock, Calculator } from 'lucide-react'

interface ConversorMoedasProps {
  onClose?: () => void
}

interface Moeda {
  codigo: string
  nome: string
  simbolo: string
  taxa: number
}

export default function ConversorMoedas({ onClose }: ConversorMoedasProps) {
  const [valor, setValor] = useState('')
  const [moedaOrigem, setMoedaOrigem] = useState('AOA')
  const [moedaDestino, setMoedaDestino] = useState('USD')
  const [resultado, setResultado] = useState<number | null>(null)
  const [historico, setHistorico] = useState<any[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Taxas de câmbio simuladas (em uma aplicação real, viria de uma API)
  const moedas: Moeda[] = [
    { codigo: 'AOA', nome: 'Kwanza Angolano', simbolo: 'Kz', taxa: 1 },
    { codigo: 'USD', nome: 'Dólar Americano', simbolo: '$', taxa: 0.0012 },
    { codigo: 'EUR', nome: 'Euro', simbolo: '€', taxa: 0.0011 },
    { codigo: 'GBP', nome: 'Libra Esterlina', simbolo: '£', taxa: 0.00095 },
    { codigo: 'BRL', nome: 'Real Brasileiro', simbolo: 'R$', taxa: 0.0061 },
    { codigo: 'ZAR', nome: 'Rand Sul-Africano', simbolo: 'R', taxa: 0.022 },
    { codigo: 'JPY', nome: 'Iene Japonês', simbolo: '¥', taxa: 0.18 },
    { codigo: 'CNY', nome: 'Yuan Chinês', simbolo: '¥', taxa: 0.0087 }
  ]

  const formatarMoeda = (valor: number, moeda: string) => {
    if (!isMounted) return '---'
    const moedaInfo = moedas.find(m => m.codigo === moeda)
    if (!moedaInfo) return valor.toString()

    return new Intl.NumberFormat('pt-AO', {
      minimumFractionDigits: moeda === 'JPY' ? 0 : 2,
      maximumFractionDigits: moeda === 'JPY' ? 0 : 4
    }).format(valor) + ' ' + moedaInfo.simbolo
  }

  const converterMoeda = () => {
    const valorNumerico = parseFloat(valor.replace(/\D/g, '')) || 0
    
    if (valorNumerico <= 0) {
      alert('Por favor, insira um valor válido.')
      return
    }

    const moedaOrigemInfo = moedas.find(m => m.codigo === moedaOrigem)
    const moedaDestinoInfo = moedas.find(m => m.codigo === moedaDestino)

    if (!moedaOrigemInfo || !moedaDestinoInfo) return

    // Converter para AOA primeiro, depois para a moeda destino
    const valorEmAOA = valorNumerico / moedaOrigemInfo.taxa
    const valorConvertido = valorEmAOA * moedaDestinoInfo.taxa

    setResultado(valorConvertido)

    // Adicionar ao histórico apenas se montado no cliente
    if (isMounted) {
      const novaConversao = {
        id: Date.now(),
        valor: valorNumerico,
        origem: moedaOrigem,
        destino: moedaDestino,
        resultado: valorConvertido,
        data: new Date().toLocaleString('pt-AO')
      }

      setHistorico(prev => [novaConversao, ...prev.slice(0, 9)]) // Manter apenas 10 últimas
    }
  }

  const trocarMoedas = () => {
    const temp = moedaOrigem
    setMoedaOrigem(moedaDestino)
    setMoedaDestino(temp)
    setResultado(null)
  }

  const limparHistorico = () => {
    setHistorico([])
  }

  const obterTaxaCambio = (origem: string, destino: string) => {
    const moedaOrigemInfo = moedas.find(m => m.codigo === origem)
    const moedaDestinoInfo = moedas.find(m => m.codigo === destino)

    if (!moedaOrigemInfo || !moedaDestinoInfo) return 0

    const valorEmAOA = 1 / moedaOrigemInfo.taxa
    return valorEmAOA * moedaDestinoInfo.taxa
  }

  return (
    <div className="space-y-6">
      {/* Conversor Principal */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
          💱 Conversor de Moedas
        </h3>

        <div className="space-y-4">
          {/* Valor de Entrada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor a Converter
            </label>
            <input
              type="text"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Digite o valor"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg text-center"
            />
          </div>

          {/* Seleção de Moedas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                De
              </label>
              <select
                value={moedaOrigem}
                onChange={(e) => setMoedaOrigem(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {moedas.map((moeda) => (
                  <option key={moeda.codigo} value={moeda.codigo}>
                    {moeda.codigo} - {moeda.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-center">
              <button
                onClick={trocarMoedas}
                className="bg-orange-100 hover:bg-orange-200 text-orange-600 p-3 rounded-full transition-colors"
                title="Trocar moedas"
              >
                ⇄
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Para
              </label>
              <select
                value={moedaDestino}
                onChange={(e) => setMoedaDestino(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {moedas.map((moeda) => (
                  <option key={moeda.codigo} value={moeda.codigo}>
                    {moeda.codigo} - {moeda.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Taxa de Câmbio */}
          <div className="text-center text-sm text-gray-600">
            1 {moedaOrigem} = {obterTaxaCambio(moedaOrigem, moedaDestino).toFixed(6)} {moedaDestino}
          </div>

          {/* Botão Converter */}
          <div className="text-center">
            <button
              onClick={converterMoeda}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Converter
            </button>
          </div>

          {/* Resultado */}
          {resultado !== null && (
            <div className="bg-white rounded-lg p-6 border-2 border-orange-200">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Resultado da Conversão</div>
                <div className="text-3xl font-bold text-orange-600">
                  {formatarMoeda(resultado, moedaDestino)}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {formatarMoeda(parseFloat(valor.replace(/\D/g, '')) || 0, moedaOrigem)} = {formatarMoeda(resultado, moedaDestino)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conversões Rápidas */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-bold text-gray-900 mb-4">⚡ Conversões Rápidas (1 unidade)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['USD', 'EUR', 'BRL', 'ZAR'].map((moeda) => (
            <div key={moeda} className="bg-white p-4 rounded-lg text-center">
              <div className="text-sm text-gray-600">1 AOA =</div>
              <div className="font-bold text-gray-900">
                {formatarMoeda(obterTaxaCambio('AOA', moeda), moeda)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Histórico de Conversões */}
      {historico.length > 0 && (
        <div className="bg-white rounded-lg border">
          <div className="flex justify-between items-center p-4 border-b">
            <h4 className="font-bold text-gray-900">📊 Histórico de Conversões</h4>
            <button
              onClick={limparHistorico}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Limpar
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {historico.map((item) => (
              <div key={item.id} className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    {formatarMoeda(item.valor, item.origem)} → {formatarMoeda(item.resultado, item.destino)}
                  </div>
                  <div className="text-sm text-gray-500">{item.data}</div>
                </div>
                <div className="text-sm text-gray-600">
                  {item.origem} → {item.destino}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Informações Importantes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="text-blue-600 mr-3">ℹ️</div>
          <div>
            <h4 className="font-bold text-blue-800 mb-1">Informações Importantes</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• As taxas de câmbio são atualizadas regularmente</li>
              <li>• Valores podem variar conforme o banco ou casa de câmbio</li>
              <li>• Para transações oficiais, consulte sempre as taxas atuais do BNA</li>
              <li>• Taxas comerciais podem incluir spread e comissões</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Dicas de Câmbio */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="text-green-600 mr-3">💡</div>
          <div>
            <h4 className="font-bold text-green-800 mb-1">Dicas para Câmbio</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Compare taxas em diferentes casas de câmbio</li>
              <li>• Evite trocar dinheiro em aeroportos (taxas mais altas)</li>
              <li>• Considere usar cartões internacionais para melhores taxas</li>
              <li>• Monitore as flutuações para timing ideal</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}