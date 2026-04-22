import { describe, it, expect } from 'vitest'
import { buildAffiliateUrl } from '@/utils/affiliateUrl'

const ldlc = {
  id: 'ldlc',
  baseUrl: 'https://www.ldlc.com',
  affiliateParam: '?affil=loicbarthoulot'
}
const digitec = {
  id: 'digitec',
  baseUrl: 'https://www.digitec.ch',
  affiliateParam: '?affil=loicbarthoulot'
}
const amazon = {
  id: 'amazon',
  baseUrl: 'https://www.amazon.fr',
  affiliateParam: '?tag=loicbart-21'
}

describe('buildAffiliateUrl', () => {
  it('appends affiliate param when no existing query string', () => {
    const cmp = {
      name: 'AMD Ryzen 5 5600',
      affiliateLinks: { ldlc: 'https://www.ldlc.com/fiche/PB00601234.html' }
    }
    expect(buildAffiliateUrl(cmp, ldlc)).toBe(
      'https://www.ldlc.com/fiche/PB00601234.html?affil=loicbarthoulot'
    )
  })

  it('uses & when URL already has a query string', () => {
    const cmp = {
      name: 'X',
      affiliateLinks: { digitec: 'https://www.digitec.ch/fr/s1/product/foo?ref=src' }
    }
    expect(buildAffiliateUrl(cmp, digitec)).toBe(
      'https://www.digitec.ch/fr/s1/product/foo?ref=src&affil=loicbarthoulot'
    )
  })

  it('falls back to a search URL when no direct link is set', () => {
    const cmp = { name: 'AMD Ryzen 5 5600' }
    expect(buildAffiliateUrl(cmp, digitec)).toBe(
      'https://www.digitec.ch/search?q=AMD%20Ryzen%205%205600&affil=loicbarthoulot'
    )
  })

  it('rejects non-HTTPS direct URLs and falls back to search', () => {
    const cmp = {
      name: 'AMD Ryzen 5 5600',
      affiliateLinks: { ldlc: 'http://not-secure.example.com/foo' }
    }
    const url = buildAffiliateUrl(cmp, ldlc)
    expect(url).toContain('https://www.ldlc.com/recherche/')
  })

  it('handles Amazon affiliate param correctly', () => {
    const cmp = {
      name: 'Test',
      affiliateLinks: { amazon: 'https://www.amazon.fr/dp/B0CXZL3W4F' }
    }
    expect(buildAffiliateUrl(cmp, amazon)).toBe(
      'https://www.amazon.fr/dp/B0CXZL3W4F?tag=loicbart-21'
    )
  })

  it('returns base URL safely when component is missing', () => {
    expect(buildAffiliateUrl(null, ldlc)).toBe('https://www.ldlc.com')
  })
})
