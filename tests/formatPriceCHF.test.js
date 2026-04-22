import { describe, it, expect } from 'vitest'
import { formatPriceCHF } from '@/composables/useToast'

describe('formatPriceCHF', () => {
  it('formats integers with the CHF suffix', () => {
    expect(formatPriceCHF(690)).toMatch(/690 CHF$/)
  })

  it('rounds floats to integers', () => {
    expect(formatPriceCHF(1499.6)).toMatch(/1[ ' ]?500 CHF$/)
  })

  it('uses Swiss thousands separator (apostrophe or space)', () => {
    const formatted = formatPriceCHF(12345)
    expect(formatted).toMatch(/12[ '’ ]?345 CHF$/)
  })

  it('returns a dash for null or undefined', () => {
    expect(formatPriceCHF(null)).toBe('—')
    expect(formatPriceCHF(undefined)).toBe('—')
  })

  it('handles zero', () => {
    expect(formatPriceCHF(0)).toBe('0 CHF')
  })
})
