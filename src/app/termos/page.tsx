import Link from 'next/link'

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-600 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Termos de Uso
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
              Condições para utilização da plataforma Auto Prestige.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            
            {/* Última atualização */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <p className="text-green-800">
                <strong>Última atualização:</strong> 15 de janeiro de 2024
              </p>
            </div>

            {/* Introdução */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Bem-vindo à Auto Prestige! Estes Termos de Uso (&quot;Termos&quot;) regem o uso do nosso site, aplicações móveis e serviços relacionados (coletivamente, o &quot;Serviço&quot;) operados pela Auto Prestige (&quot;nós&quot;, &quot;nosso&quot; ou &quot;nossa&quot;).
                </p>
                <p>
                  Ao acessar ou usar nosso Serviço, você concorda em ficar vinculado a estes Termos. Se você discordar de qualquer parte destes termos, então você não pode acessar o Serviço.
                </p>
                <p>
                  Estes Termos se aplicam a todos os visitantes, usuários e outras pessoas que acessam ou usam o Serviço.
                </p>
              </div>
            </div>

            {/* Descrição do serviço */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descrição do Serviço</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  A Auto Prestige é uma revista digital automotiva que oferece:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Artigos e análises sobre veículos e mercado automotivo</li>
                  <li>Notícias atualizadas do setor automotivo</li>
                  <li>Test drives e avaliações de veículos</li>
                  <li>Vídeos e conteúdo multimídia</li>
                  <li>Ferramentas de cálculo automotivo</li>
                  <li>Diretório de concessionárias</li>
                  <li>Análises de mercado e tendências</li>
                  <li>Newsletter e comunicações personalizadas</li>
                </ul>
              </div>
            </div>

            {/* Contas de usuário */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Contas de Usuário</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Criação de conta</h3>
              <div className="space-y-4 text-gray-700 mb-4">
                <p>Para acessar certas funcionalidades do Serviço, você pode precisar criar uma conta. Você concorda em:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Fornecer informações precisas, atuais e completas</li>
                  <li>Manter e atualizar prontamente suas informações</li>
                  <li>Manter a segurança de sua senha</li>
                  <li>Aceitar toda a responsabilidade por atividades em sua conta</li>
                  <li>Notificar-nos imediatamente sobre uso não autorizado</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Elegibilidade</h3>
              <div className="space-y-4 text-gray-700">
                <p>Você deve ter pelo menos 18 anos para usar nosso Serviço. Menores de 18 anos podem usar o Serviço apenas com supervisão e consentimento dos pais ou responsáveis.</p>
              </div>
            </div>

            {/* Uso aceitável */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Uso Aceitável</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Usos permitidos</h3>
              <div className="space-y-4 text-gray-700 mb-4">
                <p>Você pode usar nosso Serviço para:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Ler e compartilhar nosso conteúdo</li>
                  <li>Participar de discussões e comentários</li>
                  <li>Usar nossas ferramentas e calculadoras</li>
                  <li>Receber newsletters e comunicações</li>
                  <li>Buscar informações sobre concessionárias</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Usos proibidos</h3>
              <div className="space-y-4 text-gray-700">
                <p>Você concorda em NÃO usar o Serviço para:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Violar leis, regulamentos ou direitos de terceiros</li>
                  <li>Transmitir conteúdo ilegal, prejudicial ou ofensivo</li>
                  <li>Fazer spam, phishing ou atividades fraudulentas</li>
                  <li>Interferir no funcionamento do Serviço</li>
                  <li>Tentar acessar sistemas não autorizados</li>
                  <li>Copiar, modificar ou distribuir nosso conteúdo sem permissão</li>
                  <li>Usar bots, scrapers ou ferramentas automatizadas</li>
                  <li>Personificar outras pessoas ou entidades</li>
                  <li>Coletar informações de outros usuários</li>
                </ul>
              </div>
            </div>

            {/* Conteúdo do usuário */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Conteúdo do Usuário</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Responsabilidade pelo conteúdo</h3>
              <div className="space-y-4 text-gray-700 mb-4">
                <p>Você é totalmente responsável por qualquer conteúdo que postar, incluindo comentários, avaliações e feedback. Você garante que:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Possui todos os direitos necessários sobre o conteúdo</li>
                  <li>O conteúdo não viola direitos de terceiros</li>
                  <li>O conteúdo é preciso e não enganoso</li>
                  <li>O conteúdo não é difamatório ou prejudicial</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Licença de conteúdo</h3>
              <div className="space-y-4 text-gray-700 mb-4">
                <p>Ao postar conteúdo em nosso Serviço, você nos concede uma licença mundial, não exclusiva, livre de royalties para usar, reproduzir, modificar, adaptar, publicar e exibir esse conteúdo.</p>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3 Moderação</h3>
              <div className="space-y-4 text-gray-700">
                <p>Reservamos o direito de revisar, editar ou remover qualquer conteúdo que viole estes Termos ou que consideremos inadequado, a nosso exclusivo critério.</p>
              </div>
            </div>

            {/* Propriedade intelectual */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Propriedade Intelectual</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  O Serviço e seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva da Auto Prestige e seus licenciadores. O Serviço é protegido por direitos autorais, marcas registradas e outras leis.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Uso permitido</h3>
                <p>Você pode:</p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Visualizar e ler nosso conteúdo para uso pessoal</li>
                  <li>Compartilhar links para nossos artigos</li>
                  <li>Citar trechos com atribuição adequada</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Uso proibido</h3>
                <p>Você NÃO pode:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Reproduzir, distribuir ou modificar nosso conteúdo sem permissão</li>
                  <li>Usar nossas marcas registradas sem autorização</li>
                  <li>Criar obras derivadas baseadas em nosso conteúdo</li>
                  <li>Usar nosso conteúdo para fins comerciais sem licença</li>
                </ul>
              </div>
            </div>

            {/* Publicidade e links */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Publicidade e Links Externos</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Nosso Serviço pode conter anúncios e links para sites de terceiros. Não somos responsáveis pelo conteúdo, políticas de privacidade ou práticas desses sites.
                </p>
                
                <p>
                  A inclusão de qualquer link não implica endosso por nossa parte. O uso de sites vinculados é por sua conta e risco.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1 Conteúdo publicitário</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Anúncios são claramente identificados como tal</li>
                  <li>Mantemos independência editorial</li>
                  <li>Parcerias comerciais são divulgadas quando relevante</li>
                  <li>Você pode optar por não receber comunicações promocionais</li>
                </ul>
              </div>
            </div>

            {/* Limitação de responsabilidade */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitação de Responsabilidade</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  O Serviço é fornecido &quot;como está&quot; e &quot;conforme disponível&quot;. Não garantimos que o Serviço será ininterrupto, livre de erros ou seguro.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">8.1 Isenção de garantias</h3>
                <p>Renunciamos a todas as garantias, expressas ou implícitas, incluindo:</p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Garantias de comercialização</li>
                  <li>Adequação a um propósito específico</li>
                  <li>Não violação de direitos de terceiros</li>
                  <li>Precisão ou completude das informações</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">8.2 Limitação de danos</h3>
                <p>
                  Em nenhuma circunstância seremos responsáveis por danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo perda de lucros, dados ou uso.
                </p>
              </div>
            </div>

            {/* Indenização */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Indenização</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Você concorda em indenizar, defender e isentar a Auto Prestige, seus funcionários, diretores e agentes de todas as reivindicações, danos, obrigações, perdas, responsabilidades, custos ou dívidas e despesas (incluindo honorários advocatícios) resultantes de:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Seu uso do Serviço</li>
                  <li>Violação destes Termos</li>
                  <li>Violação de direitos de terceiros</li>
                  <li>Conteúdo que você postar</li>
                </ul>
              </div>
            </div>

            {/* Rescisão */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Rescisão</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Podemos encerrar ou suspender sua conta imediatamente, sem aviso prévio ou responsabilidade, por qualquer motivo, incluindo violação destes Termos.
                </p>
                
                <p>
                  Você pode encerrar sua conta a qualquer momento entrando em contato conosco. Após o encerramento, seu direito de usar o Serviço cessará imediatamente.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">10.1 Efeitos da rescisão</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Acesso ao Serviço será interrompido</li>
                  <li>Dados da conta podem ser excluídos</li>
                  <li>Obrigações de indenização permanecem em vigor</li>
                  <li>Disposições que devem sobreviver continuarão válidas</li>
                </ul>
              </div>
            </div>

            {/* Lei aplicável */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Lei Aplicável e Jurisdição</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Estes Termos serão interpretados e regidos pelas leis da República Federativa do Brasil, sem consideração aos princípios de conflito de leis.
                </p>
                
                <p>
                  Qualquer disputa relacionada a estes Termos será submetida à jurisdição exclusiva dos tribunais de São Paulo, SP, Brasil.
                </p>
              </div>
            </div>

            {/* Alterações nos termos */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Alterações nos Termos</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Reservamos o direito de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer pelo menos 30 dias de aviso antes que os novos termos entrem em vigor.
                </p>
                
                <p>
                  O que constitui uma mudança material será determinado a nosso exclusivo critério. Ao continuar a acessar ou usar nosso Serviço após essas revisões entrarem em vigor, você concorda em ficar vinculado aos termos revisados.
                </p>
              </div>
            </div>

            {/* Disposições gerais */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Disposições Gerais</h2>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">13.1 Acordo integral</h3>
                <p>Estes Termos constituem o acordo integral entre você e a Auto Prestige sobre o uso do Serviço.</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">13.2 Divisibilidade</h3>
                <p>Se qualquer disposição destes Termos for considerada inválida, as disposições restantes permanecerão em pleno vigor.</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">13.3 Renúncia</h3>
                <p>Nossa falha em fazer cumprir qualquer direito ou disposição não constituirá renúncia a esses direitos.</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">13.4 Cessão</h3>
                <p>Você não pode ceder ou transferir estes Termos sem nosso consentimento prévio por escrito.</p>
              </div>
            </div>

            {/* Contato */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contato</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:</p>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <p><strong>Auto Prestige - Revista Digital Automotiva</strong></p>
                  <p><strong>E-mail:</strong> legal@autoprestige.ao</p>
                  <p><strong>Telefone:</strong> (11) 3000-0000</p>
                  <p><strong>Endereço:</strong> Rua das Montadoras, 123 - São Paulo, SP</p>
                  <p><strong>CEP:</strong> 01000-000</p>
                </div>
              </div>
            </div>

            {/* Última seção */}
            <div className="border-t pt-8">
              <p className="text-sm text-gray-500 text-center">
                Estes Termos de Uso são efetivos a partir de 15 de janeiro de 2024 e substituem todos os acordos anteriores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Auto Prestige</h3>
            <p className="text-gray-400 mb-8">
              Sua revista digital automotiva de confiança
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/sobre" className="text-gray-400 hover:text-white transition-colors">
                Sobre Nós
              </Link>
              <Link href="/privacidade" className="text-gray-400 hover:text-white transition-colors">
                Privacidade
              </Link>
              <Link href="/termos" className="text-white font-medium">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
