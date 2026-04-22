import { test, expect } from '@playwright/test'
import { dismissStorageNotice } from './_helpers.js'

test.describe('HomeView', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(dismissStorageNotice)
  })

  test('renders hero, popular configs and FAQ', async ({ page }) => {
    await page.goto('/')

    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toContainText('PC Gaming')

    // Primary hero CTA — locate by text (router-link renders as <a>).
    const cta = page.locator('a[href="/quiz"]').first()
    await expect(cta).toBeVisible({ timeout: 10000 })

    // Featured popular config card present.
    await expect(page.getByRole('heading', { name: /Sweet Spot/i })).toBeVisible()

    // FAQ accordion expands on click.
    const faqButton = page.getByRole('button', { name: /délais d'assemblage/i })
    await faqButton.scrollIntoViewIfNeeded()
    await faqButton.click()
    await expect(faqButton).toHaveAttribute('aria-expanded', 'true')
  })

  test('skip-to-content link is exposed to keyboard users', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: /aller au contenu/i })
    await expect(skip).toBeFocused()
  })
})
