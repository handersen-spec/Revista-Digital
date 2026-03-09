'use client'

import { useState } from 'react'

interface GuiaDocumentacaoProps {
  onClose?: () => void
}

interface Documento {
  id: string
  nome: string
  descricao: string
  obrigatorio: boolean
  observacoes?: string
}

interface ProcessoDocumentacao {
  id: string
  titulo: string
  descricao: string
  documentos: Documento[]
  prazo: string
  custo: string
  local: string
}

export default function GuiaDocumentacao({ onClose }: GuiaDocumentacaoProps) {
  const [processoSelecionado, setProcessoSelecionado] = useState<string>('')
  const [documentosChecked, setDocumentosChecked] = useState<{ [key: string]: boolean }>({})

  const processos: ProcessoDocumentacao[] = [
    {
      id: 'compra_venda',
      titulo: 'Compra e Venda de Veículo',
      descricao: 'Documentação necessária para transferência de propriedade',
      prazo: '15-30 dias úteis',
      custo: '50.000 - 150.000 AOA',
      local: 'Conservatória do Registo Automóvel',
      documentos: [
        {
          id: 'livrete',
          nome: 'Livrete do Veículo',
          descricao: 'Documento original de propriedade',
          obrigatorio: true,
          observacoes: 'Deve estar em nome do vendedor'
        },
        {
          id: 'bi_vendedor',
          nome: 'BI do Vendedor',
          descricao: 'Bilhete de identidade válido',
          obrigatorio: true,
          observacoes: 'Original e fotocópia'
        },
        {
          id: 'bi_comprador',
          nome: 'BI do Comprador',
          descricao: 'Bilhete de identidade válido',
          obrigatorio: true,
          observacoes: 'Original e fotocópia'
        },
        {
          id: 'contrato_compra_venda',
          nome: 'Contrato de Compra e Venda',
          descricao: 'Documento que formaliza a transação',
          obrigatorio: true,
          observacoes: 'Pode ser feito na conservatória'
        },
        {
          id: 'inspecao_tecnica',
          nome: 'Inspeção Técnica',
          descricao: 'Certificado de inspeção válido',
          obrigatorio: true,
          observacoes: 'Não pode estar vencida'
        },
        {
          id: 'seguro_obrigatorio',
          nome: 'Seguro Obrigatório',
          descricao: 'Apólice de seguro válida',
          obrigatorio: true,
          observacoes: 'Deve cobrir o período da transferência'
        },
        {
          id: 'comprovativo_residencia',
          nome: 'Comprovativo de Residência',
          descricao: 'Conta de luz, água ou telefone',
          obrigatorio: false,
          observacoes: 'Dos últimos 3 meses'
        }
      ]
    },
    {
      id: 'matricula_primeira',
      titulo: 'Primeira Matrícula',
      descricao: 'Documentação para matricular veículo novo ou importado',
      prazo: '30-45 dias úteis',
      custo: '100.000 - 300.000 AOA',
      local: 'Conservatória do Registo Automóvel',
      documentos: [
        {
          id: 'factura_veiculo',
          nome: 'Factura do Veículo',
          descricao: 'Documento fiscal de aquisição',
          obrigatorio: true,
          observacoes: 'Original da concessionária ou importador'
        },
        {
          id: 'certificado_origem',
          nome: 'Certificado de Origem',
          descricao: 'Documento que comprova a origem do veículo',
          obrigatorio: true,
          observacoes: 'Para veículos importados'
        },
        {
          id: 'desalfandegamento',
          nome: 'Documento de Desalfandegamento',
          descricao: 'Comprovativo de pagamento de direitos aduaneiros',
          obrigatorio: true,
          observacoes: 'Para veículos importados'
        },
        {
          id: 'bi_proprietario',
          nome: 'BI do Proprietário',
          descricao: 'Bilhete de identidade válido',
          obrigatorio: true,
          observacoes: 'Original e fotocópia'
        },
        {
          id: 'inspecao_tecnica_nova',
          nome: 'Inspeção Técnica',
          descricao: 'Primeira inspeção técnica',
          obrigatorio: true,
          observacoes: 'Deve ser feita antes da matrícula'
        },
        {
          id: 'seguro_obrigatorio_novo',
          nome: 'Seguro Obrigatório',
          descricao: 'Apólice de seguro válida',
          obrigatorio: true,
          observacoes: 'Mínimo 1 ano de cobertura'
        }
      ]
    },
    {
      id: 'renovacao_inspecao',
      titulo: 'Renovação de Inspeção Técnica',
      descricao: 'Documentação para renovar a inspeção técnica do veículo',
      prazo: '1-3 dias úteis',
      custo: '15.000 - 25.000 AOA',
      local: 'Centro de Inspeção Técnica',
      documentos: [
        {
          id: 'livrete_inspecao',
          nome: 'Livrete do Veículo',
          descricao: 'Documento de propriedade',
          obrigatorio: true,
          observacoes: 'Original'
        },
        {
          id: 'bi_proprietario_inspecao',
          nome: 'BI do Proprietário',
          descricao: 'Bilhete de identidade válido',
          obrigatorio: true,
          observacoes: 'Original'
        },
        {
          id: 'inspecao_anterior',
          nome: 'Inspeção Anterior',
          descricao: 'Certificado da inspeção anterior',
          obrigatorio: false,
          observacoes: 'Se disponível'
        },
        {
          id: 'veiculo_presente',
          nome: 'Veículo Presente',
          descricao: 'O veículo deve estar presente para inspeção',
          obrigatorio: true,
          observacoes: 'Em condições de funcionamento'
        }
      ]
    },
    {
      id: 'seguro_obrigatorio_renovacao',
      titulo: 'Renovação de Seguro Obrigatório',
      descricao: 'Documentação para renovar o seguro obrigatório',
      prazo: '1-2 dias úteis',
      custo: '80.000 - 200.000 AOA/ano',
      local: 'Seguradora (ENSA, Global, etc.)',
      documentos: [
        {
          id: 'livrete_seguro',
          nome: 'Livrete do Veículo',
          descricao: 'Documento de propriedade',
          obrigatorio: true,
          observacoes: 'Original e fotocópia'
        },
        {
          id: 'bi_proprietario_seguro',
          nome: 'BI do Proprietário',
          descricao: 'Bilhete de identidade válido',
          obrigatorio: true,
          observacoes: 'Original e fotocópia'
        },
        {
          id: 'inspecao_valida',
          nome: 'Inspeção Técnica Válida',
          descricao: 'Certificado de inspeção em vigor',
          obrigatorio: true,
          observacoes: 'Não pode estar vencida'
        },
        {
          id: 'carta_conducao',
          nome: 'Carta de Condução',
          descricao: 'Licença de condução válida',
          obrigatorio: true,
          observacoes: 'Do condutor principal'
        }
      ]
    }
  ]

  const processo = processos.find(p => p.id === processoSelecionado)

  const toggleDocumento = (documentoId: string) => {
    setDocumentosChecked(prev => ({
      ...prev,
      [documentoId]: !prev[documentoId]
    }))
  }

  const calcularProgresso = () => {
    if (!processo) return 0
    const documentosObrigatorios = processo.documentos.filter(d => d.obrigatorio)
    const documentosCheckedObrigatorios = documentosObrigatorios.filter(d => documentosChecked[d.id])
    return Math.round((documentosCheckedObrigatorios.length / documentosObrigatorios.length) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Seleção de Processo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Selecione o tipo de documentação:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {processos.map((proc) => (
            <button
              key={proc.id}
              onClick={() => {
                setProcessoSelecionado(proc.id)
                setDocumentosChecked({})
              }}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                processoSelecionado === proc.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-bold text-gray-900 mb-2">{proc.titulo}</h3>
              <p className="text-sm text-gray-600">{proc.descricao}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Detalhes do Processo */}
      {processo && (
        <div className="space-y-6">
          {/* Informações Gerais */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4">{processo.titulo}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-blue-700 font-medium">Prazo Estimado</div>
                <div className="text-blue-900">{processo.prazo}</div>
              </div>
              <div>
                <div className="text-sm text-blue-700 font-medium">Custo Estimado</div>
                <div className="text-blue-900">{processo.custo}</div>
              </div>
              <div>
                <div className="text-sm text-blue-700 font-medium">Local</div>
                <div className="text-blue-900">{processo.local}</div>
              </div>
            </div>
          </div>

          {/* Progresso */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progresso da Documentação</span>
              <span className="text-sm text-gray-500">{calcularProgresso()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calcularProgresso()}%` }}
              ></div>
            </div>
          </div>

          {/* Lista de Documentos */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h4 className="font-bold text-gray-900">📋 Documentos Necessários</h4>
            </div>
            <div className="divide-y divide-gray-200">
              {processo.documentos.map((documento) => (
                <div key={documento.id} className="p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id={documento.id}
                      checked={documentosChecked[documento.id] || false}
                      onChange={() => toggleDocumento(documento.id)}
                      className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <label 
                        htmlFor={documento.id}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${
                            documentosChecked[documento.id] 
                              ? 'text-green-700 line-through' 
                              : 'text-gray-900'
                          }`}>
                            {documento.nome}
                          </span>
                          {documento.obrigatorio && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                              Obrigatório
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {documento.descricao}
                        </p>
                        {documento.observacoes && (
                          <p className="text-xs text-orange-600 mt-1">
                            💡 {documento.observacoes}
                          </p>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dicas Importantes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-yellow-600 mr-3">⚠️</div>
              <div>
                <h4 className="font-bold text-yellow-800 mb-2">Dicas Importantes</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Sempre leve documentos originais e fotocópias</li>
                  <li>• Verifique se todos os documentos estão válidos</li>
                  <li>• Confirme os horários de funcionamento dos órgãos</li>
                  <li>• Tenha dinheiro em espécie para taxas e emolumentos</li>
                  <li>• Em caso de dúvidas, consulte um despachante</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contatos Úteis */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-3">📞 Contatos Úteis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-900">Conservatória do Registo Automóvel</div>
                <div className="text-gray-600">Rua Rainha Ginga, Luanda</div>
                <div className="text-gray-600">Tel: +244 222 334 455</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Centro de Inspeção Técnica</div>
                <div className="text-gray-600">Várias localizações</div>
                <div className="text-gray-600">Tel: +244 222 123 456</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">ENSA Seguros</div>
                <div className="text-gray-600">Rua Amílcar Cabral, Luanda</div>
                <div className="text-gray-600">Tel: +244 222 432 100</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Ministério dos Transportes</div>
                <div className="text-gray-600">Informações gerais</div>
                <div className="text-gray-600">Tel: +244 222 321 000</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem Inicial */}
      {!processoSelecionado && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Guia de Documentação Automóvel
          </h3>
          <p className="text-gray-600">
            Selecione o tipo de processo acima para ver a documentação necessária
          </p>
        </div>
      )}
    </div>
  )
}