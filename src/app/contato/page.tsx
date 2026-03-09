'use client'

import { useState } from 'react'
import Newsletter from '@/components/Newsletter'
import { useEnviarContato } from '@/hooks/useContatos'

export default function ContatoPage() {
  const { enviarMensagem } = useEnviarContato()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [assunto, setAssunto] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [statusEnvio, setStatusEnvio] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [erroEnvio, setErroEnvio] = useState<string | null>(null)

  // Mapeia assunto selecionado para categoria suportada pelo Admin
  const mapAssuntoToCategoria = (
    a: string
  ): 'geral' | 'suporte' | 'parceria' | 'publicidade' | 'feedback' => {
    const s = a.toLowerCase()
    if (s === 'publicidade' || s.includes('publicidade')) return 'publicidade'
    if (s === 'parceria' || s.includes('parceria')) return 'parceria'
    if (s === 'tecnico' || s.includes('suporte')) return 'suporte'
    if (s === 'sugestao' || s.includes('sugest') || s === 'reclamacao' || s.includes('reclam')) return 'feedback'
    return 'geral'
  }

  const inferPrioridadeFromCategoria = (
    cat: 'geral' | 'suporte' | 'parceria' | 'publicidade' | 'feedback'
  ): 'baixa' | 'media' | 'alta' => {
    if (cat === 'suporte') return 'alta'
    if (cat === 'publicidade' || cat === 'parceria') return 'media'
    return 'baixa'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatusEnvio('loading')
    setErroEnvio(null)
    try {
      const categoria = mapAssuntoToCategoria(assunto)
      const prioridade = inferPrioridadeFromCategoria(categoria)
      await enviarMensagem({ nome, email, telefone, assunto, mensagem, categoria, prioridade })
      setStatusEnvio('success')
      setNome('')
      setEmail('')
      setTelefone('')
      setAssunto('')
      setMensagem('')
    } catch (err: any) {
      setErroEnvio(err?.message || 'Falha ao enviar')
      setStatusEnvio('error')
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Entre em Contato</h1>
          <p className="text-xl text-blue-100">
            Estamos aqui para ajudar. Fale connosco através dos canais abaixo.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envie-nos uma Mensagem</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+244 9XX XXX XXX"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assunto *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={assunto}
                    onChange={(e) => setAssunto(e.target.value)}
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="geral">Informação Geral</option>
                    <option value="publicidade">Publicidade</option>
                    <option value="parceria">Parcerias</option>
                    <option value="sugestao">Sugestões</option>
                    <option value="reclamacao">Reclamações</option>
                    <option value="tecnico">Suporte Técnico</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Escreva sua mensagem aqui..."
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-60"
                  disabled={statusEnvio === 'loading'}
                >
                  {statusEnvio === 'loading' ? 'Enviando...' : 'Enviar Mensagem'}
                </button>

                {statusEnvio === 'success' && (
                  <p className="text-green-600 text-sm mt-3">Mensagem enviada com sucesso! ✅</p>
                )}
                {statusEnvio === 'error' && (
                  <p className="text-red-600 text-sm mt-3">Falha ao enviar: {erroEnvio}</p>
                )}
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Informações de Contato</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 text-blue-600 mt-1">
                      📧
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">E-mail</p>
                      <p className="text-gray-600">contato@autoprestige.ao</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 text-blue-600 mt-1">
                      📱
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Telefone</p>
                      <p className="text-gray-600">+244 923 456 789</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 text-blue-600 mt-1">
                      📍
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Endereço</p>
                      <p className="text-gray-600">
                        Rua da Imprensa, 123<br />
                        Ingombota, Luanda<br />
                        Angola
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 text-blue-600 mt-1">
                      🕒
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Horário de Atendimento</p>
                      <p className="text-gray-600">
                        Segunda a Sexta: 8h às 17h<br />
                        Sábado: 8h às 13h
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Redes Sociais</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Facebook
                  </a>
                  <a href="#" className="bg-pink-600 text-white p-3 rounded-lg hover:bg-pink-700 transition-colors">
                    Instagram
                  </a>
                  <a href="#" className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors">
                    YouTube
                  </a>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Como posso anunciar na Auto Prestige?</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Entre em contato connosco através do formulário ou e-mail para informações sobre publicidade.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Posso sugerir conteúdo?</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Sim! Adoramos receber sugestões de conteúdo dos nossos leitores.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Como reportar um problema técnico?</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Selecione "Suporte Técnico" no formulário e descreva o problema detalhadamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter 
        title="Mantenha-se Atualizado"
        description="Receba as últimas notícias e análises do mercado automóvel angolano."
        theme="colored"
        color="blue"
      />
    </div>
  )
}
