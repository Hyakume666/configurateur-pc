import { test, expect } from '@playwright/test'
import { dismissStorageNotice } from './_helpers.js'

test.describe('ConfigDetailView', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(dismissStorageNotice)
  })

  test('renders Sweet Spot config + opens lead modal', async ({ page }) => {
    await page.goto('/config/sweet-spot')

    await expect(page.getByRole('heading', { name: 'Sweet Spot', exact: true })).toBeVisible()
    await expect(page.getByText(/meilleur équilibre/i)).toBeVisible()

    // Components table is populated.
    await expect(page.getByText(/Ryzen 5 7600X/)).toBeVisible()
    await expect(page.getByText(/RTX 4070 Super/)).toBeVisible()

    // Open the lead modal via the primary CTA.
    await page.getByRole('button', { name: /Je veux cette configuration/i }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    // First focusable in the dialog is the close button.
    await expect(dialog.getByRole('button', { name: /Fermer/i })).toBeFocused()

    // Escape closes the dialog.
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('toggling an upgrade animates the running total', async ({ page }) => {
    await page.goto('/config/sweet-spot')

    // Sweet Spot total = 1520 + 150 = 1670 CHF (rendered twice: hero + upgrades).
    await expect(page.getByText(/1[ '’]?670 CHF/).first()).toBeVisible()

    // Toggle the SSD 2TB upgrade (+100 CHF) → total becomes 1770.
    await page.getByRole('button', { name: /SSD 2TB au lieu de 1TB/i }).click()
    await expect(page.getByText(/1[ '’]?770 CHF/).first()).toBeVisible({ timeout: 3000 })
  })

  test('unknown slug redirects to 404', async ({ page }) => {
    await page.goto('/config/this-does-not-exist', { waitUntil: 'networkidle' })
    await expect(page.getByRole('heading', { name: /404|introuvable/i })).toBeVisible()
  })
})
