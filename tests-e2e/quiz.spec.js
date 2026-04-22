import { test, expect } from '@playwright/test'
import { dismissStorageNotice } from './_helpers.js'

test.describe('Quiz flow', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => localStorage.clear())
    await context.addInitScript(dismissStorageNotice)
  })

  test('5 steps then redirect to results with top-3 cards', async ({ page }) => {
    await page.goto('/quiz')

    await expect(page.getByRole('heading', { name: /Quel est votre usage/i })).toBeVisible()

    // Step 1 — Usage: gaming compétitif (unique sublabel "FPS, MOBA").
    await page.getByRole('button', { name: /FPS, MOBA, Battle Royale/i }).click()
    await page.getByRole('button', { name: /Suivant/i }).click()

    // Step 2 — Budget: 1400-2200 (unique sublabel "1 400 – 2 200 CHF").
    await page.getByRole('button', { name: /1 400 . 2 200 CHF/ }).click()
    await page.getByRole('button', { name: /Suivant/i }).click()

    // Step 3 — Level: intermediate (unique sublabel).
    await page.getByRole('button', { name: /Je connais les bases/i }).click()
    await page.getByRole('button', { name: /Suivant/i }).click()

    // Step 4 — Priority: balance.
    await page.getByRole('button', { name: /meilleur rapport qualité/i }).click()
    await page.getByRole('button', { name: /Suivant/i }).click()

    // Step 5 — Peripherals: skip (multi-select can be empty).
    await page.getByRole('button', { name: /Voir mes résultats/i }).click()

    await page.waitForURL(/\/results$/)
    await expect(page.getByRole('heading', { name: /configuration idéale/i })).toBeVisible()

    // Featured CTA "Découvrir cette configuration" + 2 secondary "Détails".
    await expect(page.locator('a[href^="/config/"]')).toHaveCount(3, { timeout: 10000 })
  })

  test('cannot advance until an answer is selected', async ({ page }) => {
    await page.goto('/quiz')
    const next = page.getByRole('button', { name: /Suivant/i })
    await expect(next).toBeDisabled()
  })

  test('quiz progress bar exposes proper ARIA values', async ({ page }) => {
    await page.goto('/quiz')
    const bar = page.getByRole('progressbar', { name: /Progression du quiz/i })
    await expect(bar).toHaveAttribute('aria-valuenow', '20')
  })
})
