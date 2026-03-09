import Newsletter from '@/components/Newsletter'

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Newsletter Auto Prestige</h1>
          <p className="text-xl text-red-100">
            Receba as últimas notícias e análises do mercado automóvel angolano diretamente no seu e-mail.
          </p>
        </div>
      </section>

      {/* Newsletter Benefits */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Porquê Subscrever a Nossa Newsletter?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Mantenha-se sempre informado sobre as últimas tendências, lançamentos e oportunidades do mercado automóvel angolano.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="card-base card-elevated hover-lift animate-fade-in-up text-center"
                 style={{ 
                   padding: 'var(--spacing-lg)',
                   animationDelay: '0.1s'
                 }}>
              <div className="text-4xl" style={{ marginBottom: 'var(--spacing-md)' }}>📰</div>
              <h3 className="text-heading" 
                  style={{ 
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--neutral-900)'
                  }}>
                Notícias Exclusivas
              </h3>
              <p className="text-body" style={{ color: 'var(--neutral-600)' }}>
                Seja o primeiro a saber sobre lançamentos, eventos e novidades do sector automóvel.
              </p>
            </div>

            <div className="card-base card-elevated hover-lift animate-fade-in-up text-center"
                 style={{ 
                   padding: 'var(--spacing-lg)',
                   animationDelay: '0.2s'
                 }}>
              <div className="text-4xl" style={{ marginBottom: 'var(--spacing-md)' }}>📊</div>
              <h3 className="text-heading" 
                  style={{ 
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--neutral-900)'
                  }}>
                Análises de Mercado
              </h3>
              <p className="text-body" style={{ color: 'var(--neutral-600)' }}>
                Relatórios semanais com dados de vendas, tendências e previsões do mercado angolano.
              </p>
            </div>

            <div className="card-base card-elevated hover-lift animate-fade-in-up text-center"
                 style={{ 
                   padding: 'var(--spacing-lg)',
                   animationDelay: '0.3s'
                 }}>
              <div className="text-4xl" style={{ marginBottom: 'var(--spacing-md)' }}>🚗</div>
              <h3 className="text-heading" 
                  style={{ 
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--neutral-900)'
                  }}>
                Test Drives
              </h3>
              <p className="text-body" style={{ color: 'var(--neutral-600)' }}>
                Avaliações detalhadas dos últimos modelos disponíveis em Angola.
              </p>
            </div>

            <div className="card-base card-elevated hover-lift animate-fade-in-up text-center"
                 style={{ 
                   padding: 'var(--spacing-lg)',
                   animationDelay: '0.4s'
                 }}>
              <div className="text-4xl" style={{ marginBottom: 'var(--spacing-md)' }}>💰</div>
              <h3 className="text-heading" 
                  style={{ 
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--neutral-900)'
                  }}>
                Ofertas Especiais
              </h3>
              <p className="text-body" style={{ color: 'var(--neutral-600)' }}>
                Promoções exclusivas de concessionárias e oportunidades de financiamento.
              </p>
            </div>

            <div className="card-base card-elevated hover-lift animate-fade-in-up text-center"
                 style={{ 
                   padding: 'var(--spacing-lg)',
                   animationDelay: '0.5s'
                 }}>
              <div className="text-4xl" style={{ marginBottom: 'var(--spacing-md)' }}>🔧</div>
              <h3 className="text-heading" 
                  style={{ 
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--neutral-900)'
                  }}>
                Dicas de Manutenção
              </h3>
              <p className="text-body" style={{ color: 'var(--neutral-600)' }}>
                Conselhos práticos para manter o seu veículo em perfeitas condições.
              </p>
            </div>

            <div className="card-base card-elevated hover-lift animate-fade-in-up text-center"
                 style={{ 
                   padding: 'var(--spacing-lg)',
                   animationDelay: '0.6s'
                 }}>
              <div className="text-4xl" style={{ marginBottom: 'var(--spacing-md)' }}>📱</div>
              <h3 className="text-heading" 
                  style={{ 
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--neutral-900)'
                  }}>
                Conteúdo Mobile
              </h3>
              <p className="text-body" style={{ color: 'var(--neutral-600)' }}>
                Newsletter optimizada para leitura em qualquer dispositivo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <Newsletter 
        title="Subscreva Agora"
        description="Junte-se a mais de 10.000 entusiastas automóveis que já recebem a nossa newsletter semanal."
        theme="colored"
        color="red"
      />

      {/* Newsletter Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Prévia da Newsletter
            </h2>
            <p className="text-lg text-gray-600">
              Veja como será a sua newsletter semanal
            </p>
          </div>

          <div className="bg-gray-100 rounded-lg p-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Newsletter Header */}
              <div className="bg-red-600 text-white p-6 text-center">
                <h3 className="text-2xl font-bold">Auto Prestige Newsletter</h3>
                <p className="text-red-100">Edição Semanal - Semana de 15 Janeiro 2024</p>
              </div>

              {/* Newsletter Content */}
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">🔥 Destaque da Semana</h4>
                  <p className="text-gray-600">
                    Toyota lança nova Hilux 2024 em Angola com preços a partir de 18 milhões de Kz
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">📊 Números do Mercado</h4>
                  <p className="text-gray-600">
                    Vendas de veículos crescem 15% em Janeiro comparado ao mesmo período do ano anterior
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">🚗 Test Drive</h4>
                  <p className="text-gray-600">
                    Avaliação completa do BMW X3 nas estradas de Luanda
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">💡 Dica da Semana</h4>
                  <p className="text-gray-600">
                    Como preparar o seu veículo para a época das chuvas em Angola
                  </p>
                </div>
              </div>

              {/* Newsletter Footer */}
              <div className="bg-gray-50 p-4 text-center text-sm text-gray-600">
                <p>Auto Prestige - Revista Digital Automóvel de Angola</p>
                <p>www.autoprestige.ao | contato@autoprestige.ao</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Com que frequência recebo a newsletter?
              </h3>
              <p className="text-gray-600">
                A newsletter é enviada semanalmente, todas as segundas-feiras de manhã.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Posso cancelar a subscrição a qualquer momento?
              </h3>
              <p className="text-gray-600">
                Sim, pode cancelar a subscrição a qualquer momento clicando no link "Cancelar subscrição" no final de qualquer newsletter.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Os meus dados estão seguros?
              </h3>
              <p className="text-gray-600">
                Sim, respeitamos a sua privacidade. O seu e-mail será usado apenas para enviar a newsletter e nunca será partilhado com terceiros.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                A newsletter é gratuita?
              </h3>
              <p className="text-gray-600">
                Sim, a newsletter Auto Prestige é completamente gratuita.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
