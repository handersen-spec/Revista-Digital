import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Iniciando setup global dos testes E2E...')
  
  // Verificar se o servidor está rodando
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000'
  
  try {
    const browser = await chromium.launch()
    const page = await browser.newPage()
    
    // Tentar acessar a página inicial
    await page.goto(baseURL, { waitUntil: 'networkidle' })
    
    // Verificar se a página carregou corretamente
    const title = await page.title()
    console.log(`✅ Servidor acessível em ${baseURL} - Título: ${title}`)
    
    await browser.close()
  } catch (error) {
    console.error(`❌ Erro ao acessar ${baseURL}:`, error)
    throw error
  }
  
  console.log('✅ Setup global concluído com sucesso!')
}

export default globalSetup