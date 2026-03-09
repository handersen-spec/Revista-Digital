import { test, expect } from '@playwright/test'

test.describe('Hero Carousel com imagens', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('deve aplicar background com imagens existentes', async ({ page }) => {
    // Seleciona o container de background do Hero
    const bg = page.locator('section#main-content > div.absolute.inset-0').first()
    await expect(bg).toBeVisible()

    // Verifica se o estilo de background contém uma das imagens
    const style = await bg.evaluate((el) => (el as HTMLElement).getAttribute('style') || '')
    const candidates = [
      '1759423902275_Haval_H5_-_Principal.jpg',
      'tank500-new-lead-sa.avif',
      'Lamborghini-Temerario-Traseira.jpg',
      'Toyota-Starlet-Cross-South-Africa-2.webp',
      'foto1-1240x827.jpg',
    ]
    const hasImage = candidates.some(name => style.includes(name))
    expect(hasImage).toBeTruthy()
  })
})