// Dynamic Open Graph SVG image per config — /og/<slug>.svg
// Returns an SVG card sized 1200x630 with the config name, tagline, price.
//
// SVG works as og:image on Discord, Slack, LinkedIn, Telegram, WhatsApp.
// Twitter/X requires PNG — for that platform a static fallback is used in <meta>.

import configs from '../../src/data/configs.json'

function escapeXml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function fmtPrice(value) {
  return Math.round(value).toLocaleString('fr-CH').replace(/[  ]/g, ' ')
}

function wrapText(text, maxChars) {
  const words = String(text).split(' ')
  const lines = []
  let line = ''
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxChars) {
      if (line) lines.push(line)
      line = w
    } else {
      line = (line + ' ' + w).trim()
    }
  }
  if (line) lines.push(line)
  return lines.slice(0, 2)
}

function tierLabel(tier) {
  return (
    {
      budget: 'Entrée de gamme',
      mid: 'Mid range',
      high: 'Haut de gamme',
      extreme: 'Extreme'
    }[tier] || tier
  )
}

export async function onRequestGet({ params }) {
  const slug = String(params.slug || '').replace(/[^a-z0-9-]/gi, '')
  const config = configs.find((c) => c.slug === slug)

  if (!config) {
    return new Response('Not found', { status: 404 })
  }

  const total = config.totalPrice + config.assemblyFee
  const taglineLines = wrapText(config.tagline, 48)
  const name = escapeXml(config.name)
  const tier = escapeXml(tierLabel(config.tier))
  const badge = config.badge ? escapeXml(config.badge) : null
  const price = `${fmtPrice(total)} CHF`

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#05060a"/>
      <stop offset="1" stop-color="#10141f"/>
    </linearGradient>
    <linearGradient id="text-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#00e5ff"/>
      <stop offset="1" stop-color="#a855f7"/>
    </linearGradient>
    <radialGradient id="glow-tl" cx="0.15" cy="0.2" r="0.5">
      <stop offset="0" stop-color="#00a3ff" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#00a3ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow-br" cx="0.85" cy="0.85" r="0.5">
      <stop offset="0" stop-color="#a855f7" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#a855f7" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M60 0H0V60" fill="none" stroke="rgba(0,229,255,0.06)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow-tl)"/>
  <rect width="1200" height="630" fill="url(#glow-br)"/>

  <!-- Brand -->
  <g transform="translate(80, 80)">
    <rect width="56" height="56" rx="14" fill="url(#text-grad)"/>
    <text x="33" y="40" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
          font-size="32" font-weight="800" fill="#fff" text-anchor="middle">L</text>
    <text x="78" y="40" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
          font-size="22" font-weight="700" fill="#f8fafc">Loïc<tspan fill="#00e5ff">.config</tspan></text>
  </g>

  <!-- Tier + badge -->
  <g transform="translate(80, 200)">
    <rect rx="8" ry="8" width="${tier.length * 12 + 30}" height="32" fill="rgba(0,229,255,0.15)" stroke="rgba(0,229,255,0.4)" stroke-width="1"/>
    <text x="15" y="22" font-family="system-ui, sans-serif" font-size="14" font-weight="700"
          fill="#00e5ff" letter-spacing="1">${tier.toUpperCase()}</text>
    ${
      badge
        ? `<g transform="translate(${tier.length * 12 + 50}, 0)">
            <rect rx="8" ry="8" width="${badge.length * 11 + 30}" height="32" fill="rgba(255,43,214,0.15)" stroke="rgba(255,43,214,0.4)" stroke-width="1"/>
            <text x="15" y="22" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#ff2bd6" letter-spacing="1">${badge.toUpperCase()}</text>
           </g>`
        : ''
    }
  </g>

  <!-- Title -->
  <text x="80" y="320" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
        font-size="78" font-weight="800" fill="#f8fafc">${name}</text>

  <!-- Tagline -->
  ${taglineLines
    .map(
      (line, i) =>
        `<text x="80" y="${380 + i * 38}" font-family="system-ui, sans-serif" font-size="28" font-weight="400" fill="#cbd5e1">${escapeXml(line)}</text>`
    )
    .join('\n  ')}

  <!-- Price -->
  <g transform="translate(80, ${480 + (taglineLines.length - 1) * 38})">
    <text font-family="system-ui, sans-serif" font-size="16" fill="#94a3b8" letter-spacing="2">PRIX TOTAL TOUT COMPRIS</text>
    <text y="68" font-family="system-ui, -apple-system, Segoe UI, Roboto, monospace" font-size="84" font-weight="800" fill="url(#text-grad)">${price}</text>
  </g>

  <!-- Footer -->
  <text x="1120" y="600" font-family="system-ui, sans-serif" font-size="18" font-weight="500"
        fill="#64748b" text-anchor="end">pc.loicbarthoulot.ch</text>
</svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      'Access-Control-Allow-Origin': '*'
    }
  })
}
