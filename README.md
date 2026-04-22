# Configurateur PC Gaming Suisse

Application Vue 3 de configuration de PC gaming sur mesure pour le marché Suisse romand. Quiz personnalisé en 5 questions, recommandations algorithmiques, liens affiliés (LDLC, Digitec, Amazon.ch) et génération de leads via formulaire intégré (Brevo Transactional API).

## Stack

- **Vue 3** (Composition API + `<script setup>`)
- **Vite** (build / dev server)
- **Vue Router 4** (URLs SEO-friendly)
- **Pinia** (state management)
- **Tailwind CSS** (dark mode only, design system cyberpunk)
- **@vueuse/motion** (animations spring physics)
- **@vueuse/head** (meta tags par page)
- **Lucide Vue Next** (icônes — jamais d'emoji)
- **Chart.js** + **vue-chartjs** (radar perf + admin charts)
- **Brevo API** (envoi de leads)

## Installation

```bash
npm install
```

## Configuration de l'environnement

```bash
cp .env.example .env
```

Éditez `.env` :

```env
VITE_BREVO_API_KEY=xkeysib-...
VITE_OWNER_EMAIL=loic@example.ch
```

> Sans clé API, le formulaire de lead reste fonctionnel en mode démo (simule la soumission). Idéal pour le développement local.

## Scripts

```bash
npm run dev       # Dev server sur http://localhost:5173
npm run build     # Build production dans /dist
npm run preview   # Prévisualisation du build
npm run lint      # ESLint
npm run format    # Prettier
```

## Structure

```
src/
  assets/                    # SVG logos, retailers
  components/
    ui/                      # AppButton, AppCard, AppModal, AppToast, RangeSlider, ProgressBar...
    quiz/                    # Quiz wrapper + 5 steps + option card
    config/                  # ConfigCard, ConfigCardFeatured, ComponentRow, AffiliateBadge, PerformanceRadar, PerformanceBars, UpgradeToggle
    lead/                    # LeadForm + LeadSuccess
  composables/
    useQuiz.js               # Algorithme de scoring
    useConfigs.js            # Filtrage / accès configs
    useAffiliates.js         # Tracking clics affiliés (localStorage)
    useToast.js              # Toasts + formatPriceCHF
  data/
    questions.json           # 5 questions du quiz
    configs.json             # 8 configurations PC pré-remplies
    components.json          # ~50 composants avec liens affiliés
    retailers.json           # LDLC, Digitec, Amazon.ch
  stores/
    quizStore.js             # State du quiz (persisté en localStorage)
    configStore.js           # Configs + tracking vues
  views/
    HomeView.vue             # Landing : hero, how it works, popular, why us, FAQ
    QuizView.vue             # Quiz immersif, 5 étapes
    ResultsView.vue          # Top 3 résultats + featured card
    ConfigDetailView.vue     # /config/:slug — détails complets
    AdminView.vue            # /admin — stats internes (sans auth)
    NotFoundView.vue
  router/
    index.js
  main.js
  style.css                  # Tailwind + design system globals
```

## Routes

| Route             | Vue                  | Description                                   |
| ----------------- | -------------------- | --------------------------------------------- |
| `/`               | HomeView             | Landing page                                  |
| `/quiz`           | QuizView             | Quiz 5 questions                              |
| `/results`        | ResultsView          | Top 3 résultats personnalisés                 |
| `/configs`        | ResultsView (showAll) | Catalogue complet                             |
| `/config/:slug`   | ConfigDetailView     | Détail d'une configuration                    |
| `/admin`          | AdminView            | Statistiques (caché, exclu de robots.txt)     |
| `/*`              | NotFoundView         | 404                                           |

## Ajouter une nouvelle configuration

Toutes les données vivent dans `src/data/`. Pour ajouter une config :

1. **Composants** — vérifier que tous les composants existent dans `src/data/components.json`. Sinon, en ajouter avec :

```json
{
  "id": "cpu_nouveau",
  "name": "AMD Ryzen 9 9900X3D",
  "type": "cpu",
  "brand": "AMD",
  "model": "Ryzen 9 9900X3D",
  "price": 599,
  "specs": { "cores": 12, "threads": 24, "boost": "5.5 GHz", "socket": "AM5" },
  "affiliateLinks": {
    "ldlc": "https://www.ldlc.com/...",
    "digitec": "https://www.digitec.ch/...",
    "amazon": "https://www.amazon.fr/..."
  }
}
```

2. **Configuration** — ajouter une entrée dans `src/data/configs.json` :

```json
{
  "id": "ma_config",
  "slug": "ma-config",
  "name": "Ma Config",
  "tier": "high",
  "usage": ["fps", "rpg"],
  "tagline": "Description courte",
  "totalPrice": 2000,
  "assemblyFee": 180,
  "performanceScore": { "gaming": 90, "creation": 70, "office": 95, "value": 75, "future": 80 },
  "components": ["cpu_nouveau", "gpu_rtx_4080_super", "..."],
  "pros": ["Avantage 1", "Avantage 2"],
  "cons": ["Inconvénient"],
  "targetGames": [{ "name": "Cyberpunk 2077", "fps": "100+ FPS", "settings": "Ultra 1440p" }],
  "badge": null,
  "upgrades": [
    { "id": "ram_64", "name": "Passer à 64GB", "description": "...", "priceAdd": 180, "componentReplaces": "ram_32_ddr5_6000" }
  ]
}
```

Le `slug` doit être unique : il devient l'URL `/config/<slug>`.

## Algorithme de recommandation

`useQuiz.scoreConfig()` attribue un score sur 100 par config :

- **+40** si l'usage de la config inclut l'usage choisi
- **+30** si le prix total tombe dans le budget choisi (+15 si dépassement ≤ 15%, +10 si en dessous)
- **+0 à 20** selon l'alignement avec la priorité (mappée vers `performanceScore.gaming/creation/value/future`)
- **+10** bonus si le tier match le niveau technique (débutant → budget, expert → high/extreme)

Les 3 configs avec le score le plus élevé sont retournées.

## Tracking affilié

Aucune dépendance externe. Chaque clic sur un bouton revendeur est stocké en `localStorage` sous la clé `affiliate_clicks` (max 500 derniers événements). Format :

```json
{ "componentId": "cpu_ryzen_5_5600", "retailerId": "digitec", "timestamp": 1719500000000, "configSlug": "sweet-spot" }
```

La page `/admin` affiche les stats agrégées (clics par revendeur, top composants, série temporelle 30j, vues par config).

## Brevo Transactional Email

Le formulaire `LeadForm` envoie un POST direct vers `https://api.brevo.com/v3/smtp/email` avec la clé API en header `api-key`.

⚠️ **Sécurité** : exposer une clé API Brevo côté front est risqué. En production, configurer la clé API en mode "transactional only" et restreindre les IPs autorisées dans le dashboard Brevo, ou passer par un proxy/serverless function.

## Déploiement

### Vercel

```bash
npm i -g vercel
vercel
```

Configurer dans le dashboard Vercel :

- **Build command** : `npm run build`
- **Output directory** : `dist`
- **Environment variables** : `VITE_BREVO_API_KEY`, `VITE_OWNER_EMAIL`

Ajouter un `vercel.json` pour le SPA fallback :

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### GitHub Pages

Ajouter dans `vite.config.js` :

```js
export default defineConfig({
  base: '/configurateur-pc/',
  // ...
})
```

Build + push vers une branche `gh-pages`.

## Accessibilité

- Mode sombre par défaut (color-scheme: dark, contraste WCAG AA respecté)
- `prefers-reduced-motion` désactive toutes les animations
- Navigation clavier (flèches, Enter, Tab) sur le quiz
- Focus visible sur tous les éléments interactifs
- Tous les boutons / liens / cards ont `cursor-pointer`

## Licence

Propriétaire — tous droits réservés à Loïc Barthoulot.
