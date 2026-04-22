const STORAGE_KEY = 'affiliate_clicks'
const MAX_EVENTS = 500

function readEvents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function writeEvents(events) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch {
    /* quota */
  }
}

export function useAffiliates() {
  function trackClick(componentId, retailerId, configSlug = null) {
    const events = readEvents()
    events.push({
      componentId,
      retailerId,
      timestamp: Date.now(),
      configSlug
    })
    if (events.length > MAX_EVENTS) {
      events.splice(0, events.length - MAX_EVENTS)
    }
    writeEvents(events)
  }

  function getEvents() {
    return readEvents()
  }

  function clearEvents() {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem('config_views')
    } catch {
      /* ignore */
    }
  }

  function buildAffiliateUrl(component, retailer) {
    const link = component?.affiliateLinks?.[retailer.id]
    if (!link) return retailer.baseUrl
    if (link.includes('?')) return `${link}&${retailer.affiliateParam.slice(1)}`
    return `${link}${retailer.affiliateParam}`
  }

  return { trackClick, getEvents, clearEvents, buildAffiliateUrl }
}
