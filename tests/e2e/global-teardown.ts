import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Iniciando teardown global dos testes E2E...')
  
  // Aqui você pode adicionar limpeza global se necessário
  // Por exemplo: limpar banco de dados de teste, parar serviços, etc.
  
  console.log('✅ Teardown global concluído!')
}

export default globalTeardown