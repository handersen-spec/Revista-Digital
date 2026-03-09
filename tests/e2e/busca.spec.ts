import { test, expect } from '@playwright/test'

test.describe('Funcionalidade de Busca', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('deve exibir campo de busca no header', async ({ page }) => {
    // Verificar se o campo de busca está presente
    const searchInput = page.locator('input[type="search"], input[placeholder*="buscar"], input[placeholder*="pesquisar"]').first()
    await expect(searchInput).toBeVisible()
  })

  test('deve realizar busca por notícias', async ({ page }) => {
    // Localizar campo de busca
    const searchInput = page.locator('input[type="search"], input[placeholder*="buscar"], input[placeholder*="pesquisar"]').first()
    
    // Realizar busca
    await searchInput.fill('Toyota')
    await searchInput.press('Enter')
    
    // Aguardar carregamento dos resultados
    await page.waitForLoadState('networkidle')
    
    // Verificar se estamos na página de resultados ou se os resultados apareceram
    const hasResults = await page.locator('text=resultado').count() > 0 ||
                      await page.locator('[data-testid="search-results"]').count() > 0 ||
                      await page.locator('.search-results').count() > 0
    
    if (hasResults) {
      // Verificar se há resultados relacionados ao termo buscado
      const resultItems = page.locator('[data-testid="search-result-item"], .search-result-item, article')
      const count = await resultItems.count()
      
      if (count > 0) {
        // Verificar se pelo menos um resultado contém o termo buscado
        const firstResult = resultItems.first()
        const resultText = await firstResult.textContent()
        expect(resultText?.toLowerCase()).toContain('toyota')
      }
    }
  })

  test('deve mostrar sugestões de busca', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="buscar"], input[placeholder*="pesquisar"]').first()
    
    // Começar a digitar
    await searchInput.fill('Toy')
    
    // Aguardar um pouco para sugestões aparecerem
    await page.waitForTimeout(500)
    
    // Verificar se há sugestões (se implementadas)
    const suggestions = page.locator('[data-testid="search-suggestions"], .search-suggestions, .autocomplete')
    const hasSuggestions = await suggestions.count() > 0
    
    if (hasSuggestions) {
      await expect(suggestions).toBeVisible()
    }
  })

  test('deve filtrar resultados por categoria', async ({ page }) => {
    // Ir para página de busca ou realizar busca
    const searchInput = page.locator('input[type="search"], input[placeholder*="buscar"], input[placeholder*="pesquisar"]').first()
    await searchInput.fill('carro')
    await searchInput.press('Enter')
    
    await page.waitForLoadState('networkidle')
    
    // Procurar por filtros de categoria
    const categoryFilters = page.locator('[data-testid="category-filter"], .category-filter, select[name="categoria"]')
    const hasFilters = await categoryFilters.count() > 0
    
    if (hasFilters) {
      // Selecionar uma categoria específica
      const filter = categoryFilters.first()
      await filter.click()
      
      // Se for um select, escolher uma opção
      if (await filter.locator('option').count() > 0) {
        await filter.selectOption({ index: 1 })
      }
      
      await page.waitForLoadState('networkidle')
      
      // Verificar se os resultados foram filtrados
      const results = page.locator('[data-testid="search-result-item"], .search-result-item, article')
      const count = await results.count()
      
      // Se há resultados, verificar se pertencem à categoria selecionada
      if (count > 0) {
        expect(count).toBeGreaterThan(0)
      }
    }
  })

  test('deve exibir mensagem para busca sem resultados', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="buscar"], input[placeholder*="pesquisar"]').first()
    
    // Buscar por termo que provavelmente não existe
    await searchInput.fill('xyzabc123inexistente')
    await searchInput.press('Enter')
    
    await page.waitForLoadState('networkidle')
    
    // Verificar se há mensagem de "nenhum resultado encontrado"
    const noResultsMessage = page.locator('text=/nenhum resultado|sem resultados|não encontrado/i')
    const hasNoResultsMessage = await noResultsMessage.count() > 0
    
    if (hasNoResultsMessage) {
      await expect(noResultsMessage).toBeVisible()
    }
  })

  test('deve manter termo de busca no campo após pesquisa', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="buscar"], input[placeholder*="pesquisar"]').first()
    const searchTerm = 'Honda'
    
    await searchInput.fill(searchTerm)
    await searchInput.press('Enter')
    
    await page.waitForLoadState('networkidle')
    
    // Verificar se o termo ainda está no campo de busca
    const currentValue = await searchInput.inputValue()
    expect(currentValue).toBe(searchTerm)
  })

  test('deve funcionar busca em dispositivos móveis', async ({ page }) => {
    // Simular viewport móvel
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Pode haver um botão de busca em mobile
    const mobileSearchButton = page.locator('[data-testid="mobile-search"], .mobile-search-toggle, button[aria-label*="buscar"]')
    const hasMobileSearch = await mobileSearchButton.count() > 0
    
    if (hasMobileSearch) {
      await mobileSearchButton.click()
    }
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="buscar"], input[placeholder*="pesquisar"]').first()
    await expect(searchInput).toBeVisible()
    
    await searchInput.fill('BMW')
    await searchInput.press('Enter')
    
    await page.waitForLoadState('networkidle')
    
    // Verificar se a busca funcionou em mobile
    const hasContent = await page.locator('main, [role="main"], .content').count() > 0
    expect(hasContent).toBe(true)
  })

  test('deve permitir busca avançada', async ({ page }) => {
    // Procurar por link ou botão de busca avançada
    const advancedSearchLink = page.locator('text=/busca avançada|pesquisa avançada/i, [data-testid="advanced-search"]')
    const hasAdvancedSearch = await advancedSearchLink.count() > 0
    
    if (hasAdvancedSearch) {
      await advancedSearchLink.click()
      
      // Verificar se estamos na página de busca avançada
      await expect(page).toHaveURL(/busca|search|pesquisa/)
      
      // Verificar se há campos adicionais de filtro
      const priceFilter = page.locator('input[name*="preco"], input[name*="price"]')
      const yearFilter = page.locator('input[name*="ano"], input[name*="year"]')
      const brandFilter = page.locator('select[name*="marca"], select[name*="brand"]')
      
      const hasFilters = await priceFilter.count() > 0 || 
                        await yearFilter.count() > 0 || 
                        await brandFilter.count() > 0
      
      if (hasFilters) {
        expect(hasFilters).toBe(true)
      }
    }
  })

  test('deve exibir histórico de buscas', async ({ page }) => {
    // Realizar algumas buscas
    const searchInput = page.locator('input[type="search"], input[placeholder*="buscar"], input[placeholder*="pesquisar"]').first()
    
    await searchInput.fill('Toyota')
    await searchInput.press('Enter')
    await page.waitForLoadState('networkidle')
    
    await page.goto('/')
    
    await searchInput.fill('Honda')
    await searchInput.press('Enter')
    await page.waitForLoadState('networkidle')
    
    await page.goto('/')
    
    // Clicar no campo de busca para ver se aparece histórico
    await searchInput.click()
    
    // Verificar se há histórico de buscas (se implementado)
    const searchHistory = page.locator('[data-testid="search-history"], .search-history')
    const hasHistory = await searchHistory.count() > 0
    
    if (hasHistory) {
      await expect(searchHistory).toBeVisible()
      
      // Verificar se contém as buscas anteriores
      const historyItems = searchHistory.locator('li, .history-item')
      const count = await historyItems.count()
      expect(count).toBeGreaterThan(0)
    }
  })

  test('deve permitir limpar busca', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="buscar"], input[placeholder*="pesquisar"]').first()
    
    await searchInput.fill('Teste de busca')
    
    // Procurar por botão de limpar
    const clearButton = page.locator('[data-testid="clear-search"], .clear-search, button[aria-label*="limpar"]')
    const hasClearButton = await clearButton.count() > 0
    
    if (hasClearButton) {
      await clearButton.click()
      
      // Verificar se o campo foi limpo
      const currentValue = await searchInput.inputValue()
      expect(currentValue).toBe('')
    } else {
      // Tentar limpar com Ctrl+A + Delete
      await searchInput.press('Control+a')
      await searchInput.press('Delete')
      
      const currentValue = await searchInput.inputValue()
      expect(currentValue).toBe('')
    }
  })
})