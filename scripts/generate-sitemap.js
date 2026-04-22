// Generates public/sitemap.xml from configs.json before each build.
// Wire-up: package.json "build" runs `node scripts/generate-sitemap.js && vite build`.

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

const SITE_URL = process.env.SITE_URL || 'https://pc.loicbarthoulot.ch'

async function main() {
  const root = fileURLToPath(new URL('..', import.meta.url))
  const configs = JSON.parse(await readFile(resolve(root, 'src/data/configs.json'), 'utf8'))
  const today = new Date().toISOString().split('T')[0]

  const staticUrls = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/quiz', priority: '0.9', changefreq: 'monthly' },
    { loc: '/configs', priority: '0.8', changefreq: 'weekly' },
    { loc: '/mentions-legales', priority: '0.2', changefreq: 'yearly' },
    { loc: '/confidentialite', priority: '0.2', changefreq: 'yearly' }
  ]

  const configUrls = configs.map((c) => ({
    loc: `/config/${c.slug}`,
    priority: '0.7',
    changefreq: 'weekly'
  }))

  const all = [...staticUrls, ...configUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`

  await writeFile(resolve(root, 'public/sitemap.xml'), xml, 'utf8')
  console.log(`✓ sitemap.xml generated (${all.length} urls)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
