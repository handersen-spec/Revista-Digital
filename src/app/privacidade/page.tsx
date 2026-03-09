import Link from 'next/link'

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Políticas de Privacidade
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Transparência e proteção dos seus dados pessoais.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            
            {/* Última atualização */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-800">
                <strong>Última atualização:</strong> 15 de janeiro de 2024
              </p>
            </div>

            {/* Introdução */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introdução</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  A Auto Prestige (&quot;nós&quot;, &quot;nosso&quot; ou &quot;nossa&quot;) está comprometida em proteger e respeitar sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você visita nosso site ou utiliza nossos serviços.
                </p>
                <p>
                  Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e outras legislações aplicáveis de proteção de dados.
                </p>
              </div>
            </div>

            {/* Informações que coletamos */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Informações que Coletamos</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Informações fornecidas voluntariamente</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Nome e endereço de e-mail (newsletter e contato)</li>
                <li>Comentários e feedback em artigos</li>
                <li>Informações de contato em formulários</li>
                <li>Preferências de conteúdo e interesses automotivos</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Informações coletadas automaticamente</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Endereço IP e localização geográfica aproximada</li>
                <li>Tipo de navegador e sistema operacional</li>
                <li>Páginas visitadas e tempo de permanência</li>
                <li>Referências de sites que direcionaram você ao nosso site</li>
                <li>Cookies e tecnologias similares</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Informações de terceiros</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Dados de redes sociais (quando você interage conosco)</li>
                <li>Informações de parceiros comerciais (concessionárias)</li>
                <li>Dados de ferramentas de análise (Google Analytics)</li>
              </ul>
            </div>

            {/* Como usamos suas informações */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Como Usamos suas Informações</h2>
              
              <div className="space-y-4 text-gray-700">
                <p><strong>3.1 Finalidades do tratamento:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Fornecer e melhorar nossos serviços e conteúdo</li>
                  <li>Enviar newsletters e comunicações relevantes</li>
                  <li>Responder a suas perguntas e solicitações</li>
                  <li>Personalizar sua experiência no site</li>
                  <li>Realizar análises estatísticas e de mercado</li>
                  <li>Cumprir obrigações legais e regulamentares</li>
                  <li>Prevenir fraudes e garantir a segurança</li>
                </ul>

                <p><strong>3.2 Base legal para o tratamento:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Consentimento do titular dos dados</li>
                  <li>Execução de contrato ou procedimentos preliminares</li>
                  <li>Cumprimento de obrigação legal</li>
                  <li>Legítimo interesse do controlador</li>
                  <li>Proteção da vida ou incolumidade física</li>
                </ul>
              </div>
            </div>

            {/* Compartilhamento de informações */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Compartilhamento de Informações</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>Não vendemos, alugamos ou comercializamos suas informações pessoais. Podemos compartilhar suas informações apenas nas seguintes situações:</p>
                
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Prestadores de serviços:</strong> Empresas que nos ajudam a operar nosso site e serviços</li>
                  <li><strong>Parceiros comerciais:</strong> Concessionárias e fabricantes (apenas com seu consentimento)</li>
                  <li><strong>Obrigações legais:</strong> Quando exigido por lei ou autoridades competentes</li>
                  <li><strong>Proteção de direitos:</strong> Para proteger nossos direitos, propriedade ou segurança</li>
                  <li><strong>Transferência de negócios:</strong> Em caso de fusão, aquisição ou venda de ativos</li>
                </ul>
              </div>
            </div>

            {/* Cookies */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies e Tecnologias Similares</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência em nosso site. 
                  Cookies são pequenos arquivos de texto armazenados em seu dispositivo que nos ajudam a 
                  fornecer e melhorar nossos serviços.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                  <p className="text-blue-800 font-medium">
                    🍪 Você pode gerenciar suas preferências de cookies a qualquer momento através de nossa 
                    <Link href="/cookies" className="text-blue-600 hover:text-blue-800 underline ml-1">
                      página de configurações de cookies
                    </Link>.
                  </p>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Tipos de Cookies que Utilizamos:</h3>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">🛡️ Cookies Necessários</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Essenciais para o funcionamento básico do site. Não podem ser desabilitados.
                    </p>
                    <p className="text-xs text-gray-500">
                      Exemplos: Sessão de usuário, preferências de idioma, carrinho de compras, autenticação
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">🔧 Cookies Funcionais</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Permitem funcionalidades aprimoradas e personalização do site.
                    </p>
                    <p className="text-xs text-gray-500">
                      Exemplos: Preferências de layout, configurações de acessibilidade, localização geográfica
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">📊 Cookies de Análise</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Nos ajudam a entender como os visitantes interagem com o site, coletando informações anonimamente.
                    </p>
                    <p className="text-xs text-gray-500">
                      Exemplos: Google Analytics, tempo de permanência, páginas mais visitadas, taxa de rejeição
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">🎯 Cookies de Marketing</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Usados para rastrear visitantes e exibir anúncios relevantes e personalizados.
                    </p>
                    <p className="text-xs text-gray-500">
                      Exemplos: Google Ads, Facebook Pixel, remarketing, campanhas publicitárias
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Gerenciamento de Cookies:</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Você pode aceitar ou rejeitar cookies através do banner que aparece em sua primeira visita</li>
                  <li>Pode personalizar suas preferências na nossa página de configurações de cookies</li>
                  <li>Pode alterar as configurações do seu navegador para bloquear ou deletar cookies</li>
                  <li>Algumas funcionalidades do site podem não funcionar corretamente se você desabilitar certos cookies</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Cookies de Terceiros:</h3>
                <p>
                  Alguns cookies são definidos por serviços de terceiros que aparecem em nossas páginas. 
                  Isso inclui serviços como Google Analytics, redes sociais e plataformas de publicidade. 
                  Estes terceiros podem usar cookies para rastrear sua atividade online.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Duração dos Cookies:</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Cookies de Sessão:</strong> Temporários, deletados quando você fecha o navegador</li>
                  <li><strong>Cookies Persistentes:</strong> Permanecem no seu dispositivo por um período determinado ou até serem deletados manualmente</li>
                </ul>
              </div>
            </div>

            {/* Segurança */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Segurança dos Dados</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>Implementamos medidas técnicas e organizacionais apropriadas para proteger suas informações pessoais:</p>
                
                <ul className="list-disc list-inside space-y-2">
                  <li>Criptografia de dados em trânsito e em repouso</li>
                  <li>Controles de acesso rigorosos</li>
                  <li>Monitoramento contínuo de segurança</li>
                  <li>Treinamento regular da equipe</li>
                  <li>Auditorias de segurança periódicas</li>
                  <li>Backup e recuperação de dados</li>
                </ul>

                <p>Embora nos esforcemos para proteger suas informações, nenhum método de transmissão ou armazenamento é 100% seguro.</p>
              </div>
            </div>

            {/* Retenção de dados */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Retenção de Dados</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>Mantemos suas informações pessoais apenas pelo tempo necessário para:</p>
                
                <ul className="list-disc list-inside space-y-2">
                  <li>Cumprir as finalidades para as quais foram coletadas</li>
                  <li>Atender obrigações legais e regulamentares</li>
                  <li>Resolver disputas e fazer cumprir acordos</li>
                </ul>

                <p><strong>Períodos de retenção típicos:</strong></p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Newsletter:</strong> Até o cancelamento da inscrição</li>
                  <li><strong>Comentários:</strong> Indefinidamente (ou até solicitação de remoção)</li>
                  <li><strong>Dados de navegação:</strong> 24 meses</li>
                  <li><strong>Logs de segurança:</strong> 12 meses</li>
                </ul>
              </div>
            </div>

            {/* Seus direitos */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Seus Direitos (LGPD)</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>Você tem os seguintes direitos em relação aos seus dados pessoais:</p>
                
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Confirmação e acesso:</strong> Saber se tratamos seus dados e acessá-los</li>
                  <li><strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li><strong>Anonimização ou eliminação:</strong> Quando desnecessários ou excessivos</li>
                  <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                  <li><strong>Eliminação:</strong> Quando o consentimento for revogado</li>
                  <li><strong>Informação:</strong> Sobre entidades com quem compartilhamos dados</li>
                  <li><strong>Revogação do consentimento:</strong> A qualquer momento</li>
                  <li><strong>Oposição:</strong> Ao tratamento realizado com base no legítimo interesse</li>
                </ul>

                <p>Para exercer seus direitos, entre em contato conosco através do e-mail: <strong>privacidade@autoprestige.ao</strong></p>
              </div>
            </div>

            {/* Transferência internacional */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Transferência Internacional de Dados</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>Alguns de nossos prestadores de serviços podem estar localizados fora do Brasil. Quando isso ocorrer:</p>
                
                <ul className="list-disc list-inside space-y-2">
                  <li>Garantimos que o país oferece grau de proteção adequado</li>
                  <li>Implementamos salvaguardas contratuais apropriadas</li>
                  <li>Obtemos seu consentimento quando necessário</li>
                  <li>Cumprimos todas as exigências da LGPD</li>
                </ul>
              </div>
            </div>

            {/* Menores de idade */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Menores de Idade</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>Nosso site não é direcionado a menores de 18 anos. Não coletamos intencionalmente informações pessoais de menores sem o consentimento dos pais ou responsáveis.</p>
                
                <p>Se você é pai ou responsável e acredita que seu filho nos forneceu informações pessoais, entre em contato conosco para que possamos remover essas informações.</p>
              </div>
            </div>

            {/* Alterações na política */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Alterações nesta Política</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>Podemos atualizar esta Política de Privacidade periodicamente. Quando fizermos alterações significativas:</p>
                
                <ul className="list-disc list-inside space-y-2">
                  <li>Notificaremos você por e-mail (se fornecido)</li>
                  <li>Publicaremos um aviso em nosso site</li>
                  <li>Atualizaremos a data de &quot;última atualização&quot;</li>
                </ul>

                <p>Recomendamos que você revise esta política periodicamente para se manter informado sobre como protegemos suas informações.</p>
              </div>
            </div>

            {/* Contato */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contato</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos, entre em contato conosco:</p>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <p><strong>Auto Prestige - Revista Digital Automotiva</strong></p>
                  <p><strong>E-mail:</strong> privacidade@autoprestige.ao</p>
                  <p><strong>Telefone:</strong> (11) 3000-0000</p>
                  <p><strong>Endereço:</strong> Rua das Montadoras, 123 - São Paulo, SP</p>
                  <p><strong>Encarregado de Dados (DPO):</strong> dpo@autoprestige.ao</p>
                </div>

                <p>Você também pode registrar uma reclamação junto à Autoridade Nacional de Proteção de Dados (ANPD) se acreditar que o tratamento de seus dados pessoais viola a legislação aplicável.</p>
              </div>
            </div>

            {/* Última seção */}
            <div className="border-t pt-8">
              <p className="text-sm text-gray-500 text-center">
                Esta Política de Privacidade é efetiva a partir de 15 de janeiro de 2024 e substitui todas as versões anteriores.
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
              <Link href="/privacidade" className="text-white font-medium">
                Privacidade
              </Link>
              <Link href="/termos" className="text-gray-400 hover:text-white transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
