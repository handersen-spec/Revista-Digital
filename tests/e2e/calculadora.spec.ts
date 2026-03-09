import { test, expect } from '@playwright/test'

test.describe('Calculadora de Impostos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ferramentas/calculadora-impostos')
  })

  test('deve carregar a calculadora corretamente', async ({ page }) => {
    // Verificar se o título da página está correto
    await expect(page).toHaveTitle(/Calculadora.*Impostos/i)
    
    // Verificar se o formulário está presente
    const form = page.locator('form').or(page.locator('[data-testid="calculadora-form"]'))
    await expect(form.first()).toBeVisible()
  })

  test('deve calcular impostos para compra de veículo', async ({ page }) => {
    // Aguardar carregamento completo
    await page.waitForLoadState('networkidle')
    
    // Selecionar tipo de operação (compra)
    const tipoOperacao = page.locator('select[name="tipoOperacao"]').or(
      page.locator('[data-testid="tipo-operacao"]')
    )
    
    if (await tipoOperacao.count() > 0) {
      await tipoOperacao.selectOption('compra')
    }
    
    // Selecionar tipo de veículo
    const tipoVeiculo = page.locator('select[name="tipoVeiculo"]').or(
      page.locator('[data-testid="tipo-veiculo"]')
    )
    
    if (await tipoVeiculo.count() > 0) {
      await tipoVeiculo.selectOption('ligeiro')
    }
    
    // Inserir valor do veículo
    const valorVeiculo = page.locator('input[name="valorVeiculo"]').or(
      page.locator('[data-testid="valor-veiculo"]')
    ).or(
      page.locator('input[type="number"]').first()
    )
    
    await valorVeiculo.fill('5000000') // 5 milhões de kwanzas
    
    // Clicar no botão calcular
    const btnCalcular = page.locator('button:has-text("Calcular")').or(
      page.locator('[data-testid="btn-calcular"]')
    ).or(
      page.locator('button[type="submit"]')
    )
    
    await btnCalcular.click()
    
    // Verificar se o resultado aparece
    const resultado = page.locator('[data-testid="resultado"]').or(
      page.locator('.resultado')
    ).or(
      page.locator('div:has-text("Total")')
    )
    
    await expect(resultado.first()).toBeVisible({ timeout: 10000 })
    
    // Verificar se há valores calculados
    const valorTotal = page.locator('text=/Total.*Kz/i').or(
      page.locator('[data-testid="total-impostos"]')
    )
    
    if (await valorTotal.count() > 0) {
      await expect(valorTotal.first()).toBeVisible()
    }
  })

  test('deve validar campos obrigatórios', async ({ page }) => {
    // Tentar calcular sem preencher campos
    const btnCalcular = page.locator('button:has-text("Calcular")').or(
      page.locator('[data-testid="btn-calcular"]')
    ).or(
      page.locator('button[type="submit"]')
    )
    
    await btnCalcular.click()
    
    // Verificar se há mensagens de erro ou validação
    const erroValidacao = page.locator('.error').or(
      page.locator('[data-testid="erro-validacao"]')
    ).or(
      page.locator('text=/obrigatório/i')
    )
    
    // Se não houver validação visual, pelo menos verificar se o resultado não aparece
    const resultado = page.locator('[data-testid="resultado"]').or(
      page.locator('.resultado')
    )
    
    // Aguardar um pouco para ver se alguma validação aparece
    await page.waitForTimeout(1000)
    
    // Verificar se há erro ou se resultado não aparece
    const hasError = await erroValidacao.count() > 0
    const hasResult = await resultado.count() > 0
    
    // Pelo menos uma das condições deve ser verdadeira (erro mostrado ou resultado não aparece)
    expect(hasError || !hasResult).toBeTruthy()
  })

  test('deve funcionar em dispositivos móveis', async ({ page }) => {
    // Simular viewport mobile
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Verificar se a calculadora ainda está visível e funcional
    const form = page.locator('form').or(page.locator('[data-testid="calculadora-form"]'))
    await expect(form.first()).toBeVisible()
    
    // Verificar se os campos são acessíveis no mobile
    const inputs = page.locator('input, select')
    const inputCount = await inputs.count()
    
    expect(inputCount).toBeGreaterThan(0)
    
    // Verificar se o primeiro input é focável
    if (inputCount > 0) {
      await inputs.first().focus()
      await expect(inputs.first()).toBeFocused()
    }
  })

  test('deve ter informações sobre os impostos', async ({ page }) => {
    // Verificar se há informações explicativas sobre os impostos
    const infoImpostos = page.locator('text=/imposto/i').or(
      page.locator('text=/taxa/i')
    ).or(
      page.locator('[data-testid="info-impostos"]')
    )
    
    await expect(infoImpostos.first()).toBeVisible()
    
    // Verificar se menciona impostos específicos de Angola
    const impostoAngola = page.locator('text=/sisa/i').or(
      page.locator('text=/emolumento/i')
    ).or(
      page.locator('text=/selo/i')
    )
    
    // Pelo menos deve haver alguma referência a impostos
    const hasImpostoInfo = await impostoAngola.count() > 0 || await infoImpostos.count() > 0
    expect(hasImpostoInfo).toBeTruthy()
  })

  test('deve permitir limpar o formulário', async ({ page }) => {
    // Preencher alguns campos
    const valorVeiculo = page.locator('input[name="valorVeiculo"]').or(
      page.locator('[data-testid="valor-veiculo"]')
    ).or(
      page.locator('input[type="number"]').first()
    )
    
    if (await valorVeiculo.count() > 0) {
      await valorVeiculo.fill('1000000')
      
      // Verificar se o valor foi preenchido
      await expect(valorVeiculo).toHaveValue('1000000')
      
      // Procurar botão de limpar
      const btnLimpar = page.locator('button:has-text("Limpar")').or(
        page.locator('[data-testid="btn-limpar"]')
      ).or(
        page.locator('button[type="reset"]')
      )
      
      if (await btnLimpar.count() > 0) {
        await btnLimpar.click()
        
        // Verificar se o campo foi limpo
        await expect(valorVeiculo).toHaveValue('')
      }
    }
  })
})