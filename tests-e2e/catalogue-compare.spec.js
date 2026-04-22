import { test, expect } from '@playwright/test'
import { dismissStorageNotice } from './_helpers.js'

test.describe('Catalogue + comparator', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => localStorage.clear())
    await context.addInitScript(dismissStorageNotice)
  })

  test('catalogue lists all 11 configs', async ({ page }) => {
    await page.goto('/configs')
    const cards = page.locator('main article')
    await expect(cards).toHaveCount(11)
  })

  test('tier filter "Extrême" narrows the list', async ({ page }) => {
    await page.goto('/configs')
    const cards = page.locator('main article')
    await expect(cards).toHaveCount(11)

    // Click the Extrême chip in the sidebar (only such button on the page).
    await page.getByRole('button', { name: 'Extrême', exact: true }).click()
    await expect.poll(async () => cards.count()).toBeLessThan(11)
  })

  test('compare tray appears, reaches /comparateur with 2 selected', async ({ page }) => {
    await page.goto('/configs')

    const compareButtons = page.getByRole('button', { name: /Ajouter au comparateur/i })

    await compareButtons.nth(0).click()
    await compareButtons.nth(1).click()

    // Tray CTA enabled once 2+ items selected.
    const trayCta = page.getByRole('button', { name: /Voir la comparaison/i })
    await expect(trayCta).toBeEnabled()
    await trayCta.click()

    await expect(page).toHaveURL(/\/comparateur$/)
    await expect(page.getByRole('heading', { name: /Comparer 2 configurations/i })).toBeVisible()
  })

  test('compare store cap respects MAX = 3', async ({ page }) => {
    await page.goto('/configs')
    const compareButtons = page.getByRole('button', { name: /Ajouter au comparateur/i })
    // 3 picks fill the tray; 4th button becomes disabled.
    await compareButtons.nth(0).click()
    await compareButtons.nth(1).click()
    await compareButtons.nth(2).click()
    await expect(page.getByText('(3/3)')).toBeVisible()
    await expect(compareButtons.nth(3)).toBeDisabled()
  })
})
