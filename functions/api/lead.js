// Cloudflare Pages Function — POST /api/lead
// Proxies validated lead submissions to Brevo. Brevo API key stays server-side.
//
// Bound env (set in Cloudflare Pages → Settings → Environment variables):
//   BREVO_API_KEY  (encrypted secret)
//   OWNER_EMAIL    (your inbox address)
//   ALLOWED_ORIGIN (e.g. https://pc.loicbarthoulot.ch)

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,24}$/
const NAME_RE = /^[\p{L}\p{M}'\- ]{1,60}$/u
const PHONE_RE = /^[+\d\s().\-]{6,30}$/
const SLUG_RE = /^[a-z0-9-]{1,60}$/

const MAX_BODY_BYTES = 16 * 1024 // 16 KB hard cap
const RATE_LIMIT_PER_HOUR = 5

function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function stripCtrl(s = '') {
  return String(s).replace(/[\r\n\t\0]/g, ' ').trim()
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store'
    }
  })
}

function buildHtmlBody(data) {
  const e = escapeHtml
  const upgrades = Array.isArray(data.upgrades) ? data.upgrades : []
  const upgradesHtml = upgrades.length
    ? `<ul>${upgrades
        .map((u) => `<li>${e(stripCtrl(u.name))} (+${e(stripCtrl(String(u.priceAdd)))} CHF)</li>`)
        .join('')}</ul>`
    : '<em>Aucune option supplémentaire</em>'

  const excluded = Array.isArray(data.excludedTypes) ? data.excludedTypes : []
  const excludedHtml = excluded.length
    ? `<p><strong>Composants déjà possédés :</strong> ${e(excluded.join(', '))}</p>`
    : ''

  const messageHtml = data.message
    ? `<hr/><h3>Message du client</h3><p>${escapeHtml(stripCtrl(data.message)).replace(/\n/g, '<br/>')}</p>`
    : ''

  return `
    <h2>Nouvelle demande — ${e(stripCtrl(data.configName))}</h2>
    <p><strong>Client :</strong> ${e(stripCtrl(data.firstName))} ${e(stripCtrl(data.lastName))}</p>
    <p><strong>Email :</strong> ${e(stripCtrl(data.email))}</p>
    ${data.phone ? `<p><strong>Téléphone :</strong> ${e(stripCtrl(data.phone))}</p>` : ''}
    <hr/>
    <h3>Configuration demandée</h3>
    <p><strong>${e(stripCtrl(data.configName))}</strong> (slug: <code>${e(stripCtrl(data.configSlug))}</code>)</p>
    <p><strong>Total avec options :</strong> ${e(stripCtrl(String(data.totalPrice)))} CHF</p>
    <h4>Options sélectionnées</h4>
    ${upgradesHtml}
    ${excludedHtml}
    <p><strong>Souhaite que je commande les composants :</strong> ${data.wantsSourcing ? 'Oui' : 'Non'}</p>
    ${messageHtml}
    <hr/>
    <p style="color:#888;font-size:11px">IP origine: ${e(stripCtrl(data.clientIp || '?'))}</p>
  `
}

function validate(data) {
  const errors = []
  if (!data || typeof data !== 'object') return ['payload must be object']
  if (!NAME_RE.test(stripCtrl(data.firstName || ''))) errors.push('firstName invalid')
  if (!NAME_RE.test(stripCtrl(data.lastName || ''))) errors.push('lastName invalid')
  if (!EMAIL_RE.test(stripCtrl(data.email || ''))) errors.push('email invalid')
  if (data.phone && !PHONE_RE.test(stripCtrl(data.phone))) errors.push('phone invalid')
  if (data.message && String(data.message).length > 2000) errors.push('message too long')
  if (!data.configSlug || !SLUG_RE.test(String(data.configSlug))) errors.push('configSlug invalid')
  if (!data.configName || String(data.configName).length > 100) errors.push('configName invalid')
  if (typeof data.totalPrice !== 'number' || data.totalPrice < 0 || data.totalPrice > 99999)
    errors.push('totalPrice invalid')
  return errors
}

// Simple in-memory rate limit per Worker isolate.
// For stronger guarantees use Cloudflare KV or Durable Objects.
const rateMap = new Map()
function rateLimited(ip) {
  const now = Date.now()
  const oneHourAgo = now - 60 * 60 * 1000
  const recent = (rateMap.get(ip) || []).filter((t) => t > oneHourAgo)
  if (recent.length >= RATE_LIMIT_PER_HOUR) return true
  recent.push(now)
  rateMap.set(ip, recent)
  // garbage-collect occasionally
  if (rateMap.size > 5000) rateMap.clear()
  return false
}

export async function onRequestOptions({ env }) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  })
}

export async function onRequestPost({ request, env }) {
  const origin = env.ALLOWED_ORIGIN || '*'

  // Origin check
  const reqOrigin = request.headers.get('Origin')
  if (env.ALLOWED_ORIGIN && reqOrigin && reqOrigin !== env.ALLOWED_ORIGIN) {
    return jsonResponse({ error: 'forbidden' }, 403, origin)
  }

  // Body size
  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse({ error: 'payload too large' }, 413, origin)
  }

  let data
  try {
    data = await request.json()
  } catch {
    return jsonResponse({ error: 'invalid json' }, 400, origin)
  }

  // Honeypot: client attached field that must be empty
  if (data.website) {
    // Pretend success to avoid signaling bots
    return jsonResponse({ ok: true }, 200, origin)
  }

  // Validation
  const errors = validate(data)
  if (errors.length) {
    return jsonResponse({ error: 'validation failed', details: errors }, 400, origin)
  }

  // Rate limit per IP
  const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown'
  if (rateLimited(clientIp)) {
    return jsonResponse({ error: 'rate limited' }, 429, origin)
  }

  if (!env.BREVO_API_KEY || !env.OWNER_EMAIL) {
    return jsonResponse({ error: 'server not configured' }, 500, origin)
  }

  const safeFirst = stripCtrl(data.firstName)
  const safeLast = stripCtrl(data.lastName)
  const safeEmail = stripCtrl(data.email)
  const safeConfigName = stripCtrl(data.configName)

  const payload = {
    sender: { email: env.OWNER_EMAIL, name: 'Configurateur PC' },
    to: [{ email: env.OWNER_EMAIL, name: 'Loïc Barthoulot' }],
    replyTo: { email: safeEmail, name: `${safeFirst} ${safeLast}`.slice(0, 120) },
    subject: `Nouvelle demande — ${safeConfigName} — ${safeFirst} ${safeLast}`.slice(0, 180),
    htmlContent: buildHtmlBody({ ...data, clientIp })
  }

  const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!brevoRes.ok) {
    const text = await brevoRes.text()
    return jsonResponse(
      { error: 'brevo_error', status: brevoRes.status, body: text.slice(0, 200) },
      502,
      origin
    )
  }

  return jsonResponse({ ok: true }, 200, origin)
}
