// Builds the final outbound URL for an affiliate badge click.
//
// Priority:
//   1. If component.affiliateLinks[retailerId] is a full HTTPS URL → use it
//      (real product page the operator has mapped manually).
//   2. Otherwise build a search URL on the retailer's domain using the
//      component name (works as a fallback that always lands on real results).
// In both cases the retailer's affiliate param is merged into the query string
// without duplicating an existing `?` separator.

const SEARCH_PATH = {
  ldlc: 'recherche/',
  digitec: 'search?q=',
  amazon: 's?k='
}

function isHttpsUrl(value) {
  if (typeof value !== 'string') return false
  try {
    const u = new URL(value)
    return u.protocol === 'https:'
  } catch {
    return false
  }
}

function appendAffiliateParam(url, paramString) {
  if (!paramString) return url
  // paramString is like "?affil=foo" or "?tag=bar" — drop the leading "?".
  const param = paramString.replace(/^\?/, '')
  if (!param) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}${param}`
}

function buildSearchUrl(retailer, query) {
  const path = SEARCH_PATH[retailer.id]
  if (!path) return retailer.baseUrl
  const encoded = encodeURIComponent(query)
  return `${retailer.baseUrl}/${path}${encoded}`
}

export function buildAffiliateUrl(component, retailer) {
  if (!component || !retailer) return retailer?.baseUrl || '#'

  const direct = component.affiliateLinks?.[retailer.id]
  const url = isHttpsUrl(direct) ? direct : buildSearchUrl(retailer, component.name || '')

  return appendAffiliateParam(url, retailer.affiliateParam)
}
