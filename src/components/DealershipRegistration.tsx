'use client'

import { useState } from 'react'

interface DealershipRegistrationProps {
  title?: string
  description?: string
  variant?: 'default' | 'compact' | 'banner'
  theme?: 'light' | 'dark' | 'colored'
  color?: 'red' | 'blue' | 'green' | 'purple' | 'orange'
  className?: string
}

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  endereco: string
  cidade: string
  provincia: string
  latitude?: string
  longitude?: string
  workdayHours: string
  servicos: string[]
  descricao: string
  imagemFiles: File[]
}

export default function DealershipRegistration({
  title = "É proprietário de uma concessionária?",
  description = "Cadastre sua concessionária em nosso diretório e alcance mais clientes.",
  variant = 'default',
  theme = 'dark',
  color = 'orange',
  className = ''
}: DealershipRegistrationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    endereco: '',
    cidade: '',
    provincia: '',
    latitude: '',
    longitude: '',
    workdayHours: '08:00 - 18:00',
    servicos: [],
    descricao: '',
    imagemFiles: []
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleServicesChange = (service: string) => {
    setFormData(prev => {
      const exists = prev.servicos.includes(service)
      return {
        ...prev,
        servicos: exists ? prev.servicos.filter(s => s !== service) : [...prev.servicos, service]
      }
    })
  }

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({ ...prev, imagemFiles: files }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Upload de imagens primeiro (se houver)
      let imageUrls: string[] = []
      if (formData.imagemFiles.length) {
        imageUrls = []
        for (const file of formData.imagemFiles) {
          const fd = new FormData()
          fd.append('file', file)
          fd.append('type', 'image')
          const up = await fetch('/api/upload', { method: 'POST', body: fd })
          if (!up.ok) {
            const data = await up.json().catch(() => null)
            throw new Error(data?.error || 'Falha no upload de imagens')
          }
          const upData = await up.json()
          if (!upData?.success || !upData?.url) {
            throw new Error('Resposta inválida do servidor de upload')
          }
          imageUrls.push(upData.url)
        }
      }

      const res = await fetch('/api/solicitacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: 'parceria',
          titulo: `Cadastro de Concessionária: ${formData.company}`,
          descricao: `${formData.cidade}, ${formData.provincia}\n${formData.endereco}\n${formData.descricao}`.trim(),
          nomeRequerente: formData.name,
          emailRequerente: formData.email,
          telefoneRequerente: formData.phone,
          empresa: formData.company,
          prioridade: 'media',
          categoria: 'concessionaria_cadastro',
          tags: ['cadastro_concessionaria'],
          dadosConcessionaria: {
            endereco: formData.endereco,
            cidade: formData.cidade,
            provincia: formData.provincia,
            telefone: formData.phone,
            coordenadas: {
              latitude: parseFloat(formData.latitude || '0') || 0,
              longitude: parseFloat(formData.longitude || '0') || 0
            },
            horarios: {
              segunda: formData.workdayHours,
              terca: formData.workdayHours,
              quarta: formData.workdayHours,
              quinta: formData.workdayHours,
              sexta: formData.workdayHours,
              sabado: '09:00 - 13:00',
              domingo: 'Fechado'
            },
            servicos: formData.servicos,
            imagens: imageUrls,
            descricao: formData.descricao
          }
        })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.message || 'Falha ao enviar cadastro')
      }
      
      setIsSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        endereco: '',
        cidade: '',
        provincia: '',
        latitude: '',
        longitude: '',
        workdayHours: '08:00 - 18:00',
        servicos: [],
        descricao: '',
        imagemFiles: []
      })
      
      // Fechar modal após 3 segundos
      setTimeout(() => {
        setIsOpen(false)
        setIsSuccess(false)
      }, 3000)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar cadastro. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Configurações de tema
  const themeClasses = {
    light: 'bg-white text-gray-900',
    dark: 'bg-gray-900 text-white',
    colored: {
      red: 'bg-gradient-to-r from-red-600 to-red-700 text-white',
      blue: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
      green: 'bg-gradient-to-r from-green-600 to-green-700 text-white',
      purple: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white',
      orange: 'bg-gradient-to-r from-orange-600 to-orange-700 text-white'
    }
  }

  const buttonClasses = {
    light: 'bg-orange-600 text-white hover:bg-orange-700',
    dark: 'bg-orange-600 text-white hover:bg-orange-700',
    colored: 'bg-white text-orange-600 hover:bg-gray-100'
  }

  const getThemeClass = () => {
    if (theme === 'colored') {
      return themeClasses.colored[color]
    }
    return themeClasses[theme]
  }

  const getButtonClass = () => {
    if (theme === 'colored') {
      return buttonClasses.colored
    }
    return buttonClasses[theme]
  }

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Cadastrar Concessionária</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Cadastro enviado!</h4>
              <p className="text-gray-600">A sua solicitação foi registada e será validada pela equipa. Receberá um email quando for aprovada.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900" placeholder="Seu nome completo" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  placeholder="+244 xxx xxx xxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da concessionária *</label>
                <input type="text" name="company" value={formData.company} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900" placeholder="Nome da sua concessionária" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço *</label>
                  <input type="text" name="endereco" value={formData.endereco} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900" placeholder="Rua, bairro" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                  <input type="text" name="cidade" value={formData.cidade} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900" placeholder="Cidade" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Província *</label>
                  <input type="text" name="provincia" value={formData.provincia} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900" placeholder="Província" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input type="text" name="latitude" value={formData.latitude} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input type="text" name="longitude" value={formData.longitude} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900" placeholder="0" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horário (Segunda a Sexta) *</label>
                  <input type="text" name="workdayHours" value={formData.workdayHours} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900" placeholder="08:00 - 18:00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serviços oferecidos</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Vendas','Pós-vendas','Peças','Oficina','Funilaria','Seguro'].map(s => (
                      <label key={s} className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={formData.servicos.includes(s)} onChange={() => handleServicesChange(s)} />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição da concessionária</label>
                <textarea name="descricao" value={formData.descricao} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900" placeholder="Conte-nos mais sobre sua concessionária..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload de fotos</label>
                <input type="file" accept="image/*" multiple onChange={handleFilesChange} className="w-full" />
              </div>

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Enviando...' : 'Cadastrar concessionária'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )

  if (variant === 'compact') {
    return (
      <>
        <div className={`p-4 rounded-lg ${getThemeClass()} ${className}`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{title}</h3>
              <p className="text-xs opacity-80 mt-1">{description}</p>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className={`ml-4 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${getButtonClass()}`}
            >
              Cadastrar
            </button>
          </div>
        </div>
        {isOpen && modalContent}
      </>
    )
  }

  if (variant === 'banner') {
    return (
      <>
        <div className={`p-6 rounded-xl ${getThemeClass()} ${className}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold mb-2">{title}</h2>
              <p className="opacity-90">{description}</p>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${getButtonClass()}`}
            >
              Cadastrar concessionária
            </button>
          </div>
        </div>
        {isOpen && modalContent}
      </>
    )
  }

  // Variant default
  return (
    <>
      <section className={`py-16 ${getThemeClass()} ${className}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="opacity-90 mb-8 max-w-2xl mx-auto">{description}</p>
          
          <button
            onClick={() => setIsOpen(true)}
            className={`px-8 py-4 rounded-lg font-medium text-lg transition-colors ${getButtonClass()}`}
          >
            Cadastrar concessionária
          </button>
        </div>
      </section>
      {isOpen && modalContent}
    </>
  )
}