import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('deve carregar a página inicial corretamente', async ({ page }) => {
    // Verificar se o título está correto
    await expect(page).toHaveTitle(/Auto Prestige/)
    
    // Verificar se o header está presente
    const header = page.locator('header')
    await expect(header).toBeVisible()
    
    // Verificar se o logo está presente
    const logo = page.locator('[data-testid="logo"]').or(page.locator('img[alt*="Auto Prestige"]')).or(page.locator('h1'))
    await expect(logo.first()).toBeVisible()
  })

  test('deve ter navegação funcional', async ({ page }) => {
    // Verificar se os links de navegação estão presentes
    const navLinks = [
      'Notícias',
      'Mercado',
      'Ferramentas',
      'Concessionárias',
      'Vídeos'
    ]

    for (const linkText of navLinks) {
      const link = page.locator(`nav a:has-text("${linkText}")`)
      await expect(link.first()).toBeVisible()
    }
  })

  test('deve exibir notícias em destaque', async ({ page }) => {
    // Aguardar o carregamento das notícias
    await page.waitForLoadState('networkidle')
    
    // Verificar se há pelo menos uma notícia em destaque
    const noticiaDestaque = page.locator('[data-testid="noticia-destaque"]').or(
      page.locator('.noticia-destaque')
    ).or(
      page.locator('article').first()
    )
    
    await expect(noticiaDestaque.first()).toBeVisible()
  })

  test('deve ter footer com informações da empresa', async ({ page }) => {
    // Scroll até o footer
    await page.locator('footer').scrollIntoViewIfNeeded()
    
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    
    // Verificar se contém informações sobre Angola
    await expect(footer).toContainText(/Angola/i)
  })

  test('deve ser responsivo em dispositivos móveis', async ({ page }) => {
    // Simular viewport mobile
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Verificar se o menu mobile está presente
    const mobileMenu = page.locator('[data-testid="mobile-menu"]').or(
      page.locator('button[aria-label*="menu"]')
    ).or(
      page.locator('.hamburger')
    )
    
    if (await mobileMenu.count() > 0) {
      await expect(mobileMenu.first()).toBeVisible()
    }
    
    // Verificar se o conteúdo se adapta ao mobile
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()
  })

  test('deve carregar sem erros de console críticos', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Filtrar erros conhecidos que não são críticos
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') &&
      !error.includes('404') &&
      !error.includes('net::ERR_FAILED')
    )
    
    expect(criticalErrors).toHaveLength(0)
  })

  test('deve ter meta tags SEO básicas', async ({ page }) => {
    // Verificar meta description
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /.+/)
    
    // Verificar meta keywords
    const metaKeywords = page.locator('meta[name="keywords"]')
    if (await metaKeywords.count() > 0) {
      await expect(metaKeywords).toHaveAttribute('content', /Angola/)
    }
    
    // Verificar Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]')
    if (await ogTitle.count() > 0) {
      await expect(ogTitle).toHaveAttribute('content', /.+/)
    }
  })
})
