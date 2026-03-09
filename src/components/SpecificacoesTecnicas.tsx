import { SuperdesportivoSpecs, EnsaiosSpecs, AntevisaoSpecs } from '@/types/artigo'

interface SpecificacoesTecnicasProps {
  categoria: 'Superdesportivo' | 'Ensaio' | 'Antevisão'
  specs?: SuperdesportivoSpecs | EnsaiosSpecs | AntevisaoSpecs
}

export default function SpecificacoesTecnicas({ categoria, specs }: SpecificacoesTecnicasProps) {
  // Antevisão não tem especificações técnicas específicas
  if (categoria === 'Antevisão' || !specs) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Especificações Técnicas
      </h3>

      {categoria === 'Superdesportivo' && (
        <SuperdesportivoSpecsComponent specs={specs as SuperdesportivoSpecs} />
      )}

  {categoria === 'Ensaio' && (
    <EnsaiosSpecsComponent specs={specs as EnsaiosSpecs} />
  )}
    </div>
  )
}

function SuperdesportivoSpecsComponent({ specs }: { specs: SuperdesportivoSpecs }) {
  const especificacoes = [
    { label: 'Tipo de Motor', value: specs.tipoMotor },
    { label: 'Cilindrada', value: specs.cilindrada },
    { label: 'Potência', value: specs.potencia },
    { label: 'Velocidade Máxima', value: specs.velocidadeMaxima },
    { label: 'Aceleração (0-100 km/h)', value: specs.aceleracao },
    { label: 'Pneus', value: specs.pneus },
    { label: 'Bagageira', value: specs.bagageira },
    { label: 'Data de Lançamento', value: specs.dataLancamento },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {especificacoes.map((spec, index) => (
        <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
          <span className="font-medium text-gray-700">{spec.label}:</span>
          <span className="text-slate-900 font-semibold">{spec.value}</span>
        </div>
      ))}
    </div>
  )
}

function EnsaiosSpecsComponent({ specs }: { specs: EnsaiosSpecs }) {
  const especificacoes = [
    { label: 'Tipo de Motor', value: specs.tipoMotor },
    { label: 'Cilindrada', value: specs.cilindrada },
    { label: 'Potência', value: specs.potencia },
    { label: 'Binário Máximo', value: specs.binarioMaximo },
    { label: 'Transmissão', value: specs.transmissao },
    { label: 'Velocidade Máxima', value: specs.velocidadeMaxima },
    { label: 'Aceleração (0-100 km/h)', value: specs.aceleracao },
    { label: 'Consumo (WLTP)', value: specs.consumoWLTP },
    { label: 'Emissão CO₂ (WLTP)', value: specs.emissaoCO2WLTP },
    { label: 'Dimensões (C/L/A)', value: specs.dimensoes },
    { label: 'Pneus', value: specs.pneus },
    { label: 'Peso', value: specs.peso },
    { label: 'Bagageira', value: specs.bagageira },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {especificacoes.map((spec, index) => (
        <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
          <span className="font-medium text-gray-700">{spec.label}:</span>
          <span className="text-slate-900 font-semibold">{spec.value}</span>
        </div>
      ))}
    </div>
  )
}