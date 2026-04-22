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

Variables :

- **Front (Vite)** : `VITE_LEAD_API_URL=/api/lead` (défaut). Mettre vide → mode démo.
- **Serveur (Cloudflare)** : `BREVO_API_KEY`, `OWNER_EMAIL`, `ALLOWED_ORIGIN` — configurés dans le dashboard Cloudflare Pages, jamais dans `.env` local.

> En `npm run dev`, le formulaire est en mode démo (pas de Pages Function). Pour tester le proxy en local : `wrangler pages dev dist` (voir section déploiement).

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

## Liens d'affiliation — workflow

Chaque composant dans [`src/data/components.json`](src/data/components.json) a un objet `affiliateLinks` :

```json
"affiliateLinks": {
  "ldlc": "https://www.ldlc.com/fiche/PB00601234.html",
  "digitec": "https://www.digitec.ch/fr/s1/product/.../12345678",
  "amazon": "https://www.amazon.fr/dp/B0CXZL3W4F"
}
```

Deux modes pris en charge automatiquement par [`src/utils/affiliateUrl.js`](src/utils/affiliateUrl.js) :

1. **URL directe (recommandé)** — colle la fiche produit complète. La fonction d'affiliation ajoute automatiquement le paramètre `?affil=` ou `?tag=` du retailer.
2. **Recherche fallback** — si l'URL n'est pas une `https://...` valide, le système construit une URL de recherche du type `digitec.ch/search?q=<nom du composant>` qui débouche toujours sur des résultats valides.

### Migration vers de vraies URLs

Pour chaque composant, ouvre `components.json` et remplace les URLs de recherche par les fiches produit réelles :

1. Va sur `digitec.ch`, cherche le composant exact
2. Ouvre la fiche produit, copie l'URL canonique
3. Colle dans `affiliateLinks.digitec`
4. Idem pour LDLC et Amazon (si pertinent — Amazon.ch a souvent un catalogue plus restreint en composants PC)

Pas besoin de redéployer côté code : Cloudflare Pages rebuild automatique sur `git push`.

### Affiliation côté retailer

- **LDLC** — programme via [Awin](https://www.awin.com) (anciennement Affiliate Window) ou direct LDLC. Param attendu : `?affil=<id>`
- **Digitec / Galaxus** — programme [Galaxus Partners](https://www.galaxus.ch/fr/page/conditions-de-participation-au-programme-d-affiliation-galaxus-12977). Param : `?affil=<id>`
- **Amazon.ch** — Amazon Associates (compte amazon.fr accepté pour amazon.ch). Param : `?tag=<id>-21`

Mets les vrais paramètres dans [`src/data/retailers.json`](src/data/retailers.json) une fois les comptes activés.

## Tracking affilié

Aucune dépendance externe. Chaque clic sur un bouton revendeur est stocké en `localStorage` sous la clé `affiliate_clicks` (max 500 derniers événements). Format :

```json
{ "componentId": "cpu_ryzen_5_5600", "retailerId": "digitec", "timestamp": 1719500000000, "configSlug": "sweet-spot" }
```

La page `/admin` affiche les stats agrégées (clics par revendeur, top composants, série temporelle 30j, vues par config).

## Architecture lead form

Le formulaire `LeadForm` POST vers `/api/lead` (relatif). En production sur Cloudflare Pages, cet endpoint est servi par la **Pages Function** [`functions/api/lead.js`](functions/api/lead.js) qui :

1. Vérifie l'origine (`ALLOWED_ORIGIN`)
2. Limite la taille du body (16 KB)
3. Valide tous les champs (email/name/phone regex stricts, slug whitelist, prix borné)
4. Détecte le honeypot `website` côté serveur
5. Rate-limit 5 envois/h par IP (in-memory par isolate Worker)
6. Construit le HTML email avec escape complet
7. Relaie vers Brevo avec `BREVO_API_KEY` (secret serveur, jamais exposé)

La clé Brevo est en variable d'environnement Cloudflare (chiffrée), elle n'apparaît jamais dans le bundle client.

## Déploiement — Cloudflare Pages + Brevo + DNS Infomaniak

### 1. Pousser le code sur GitHub

Le repo doit être public ou bien Cloudflare doit avoir accès via app GitHub.

### 2. Créer compte Cloudflare

[https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) — gratuit, juste email + password.

### 3. Connecter le repo à Cloudflare Pages

1. Dashboard Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Autoriser GitHub, sélectionner le repo `configurateur-pc`
3. **Build settings** :
   - Framework preset : **Vue (Vite)**
   - Build command : `npm run build`
   - Build output directory : `dist`
   - Root directory : *(laisser vide si repo à la racine)*
4. **Environment variables** (production) :
   ```
   BREVO_API_KEY        = xkeysib-...           ← Encrypted (clic "Encrypt")
   OWNER_EMAIL          = loic@loicbarthoulot.ch
   ALLOWED_ORIGIN       = https://pc.loicbarthoulot.ch
   ```
5. **Save and Deploy** → premier build (~2 min)

L'URL temporaire sera `<projet>.pages.dev`. Vérifier que ça marche.

### 4. Domaine custom `pc.loicbarthoulot.ch`

#### Côté Cloudflare Pages
1. Projet Pages → **Custom domains** → **Set up a custom domain**
2. Saisir `pc.loicbarthoulot.ch` → Continue
3. Cloudflare affiche un enregistrement **CNAME** à créer (du type `<projet>.pages.dev`)

#### Côté Infomaniak (DNS)
1. Manager Infomaniak → **Web & Domaines** → **Domaines** → cliquer `loicbarthoulot.ch` → **Modifier la zone DNS**
2. Ajouter un enregistrement :
   - Type : **CNAME**
   - Sous-domaine : `pc`
   - Cible : `<projet>.pages.dev` (valeur fournie par Cloudflare)
   - TTL : 3600 (par défaut)
3. Sauvegarder. Propagation DNS : 5 min à 1h.

#### Retour Cloudflare Pages
- L'onglet Custom domains passera de "Pending" → "Active" automatiquement
- Cloudflare provisionne aussi le certificat TLS Let's Encrypt (gratuit)

### 5. Tester en live

`https://pc.loicbarthoulot.ch` → quiz, choix d'une config, formulaire → email reçu sur `OWNER_EMAIL`.

Si erreur 502 : vérifier les variables d'env Cloudflare et la clé Brevo.
Si erreur 403 : `ALLOWED_ORIGIN` ne correspond pas à l'URL réelle.

### 6. Déploiements futurs

Tout `git push` sur `main` → build + deploy auto (~1-2 min). Branches autres → preview environment URL séparée.

### Développement local du proxy lead

Pour tester `functions/api/lead.js` en local, installer Wrangler :

```bash
npm i -g wrangler
wrangler pages dev dist --compatibility-date=2024-09-01
```

Wrangler servira le build + Pages Functions sur `http://localhost:8788`. Les variables d'env locales : créer `.dev.vars` à la racine avec `BREVO_API_KEY=...` etc (gitignored automatiquement).

## Accessibilité

- Mode sombre par défaut (color-scheme: dark, contraste WCAG AA respecté)
- `prefers-reduced-motion` désactive toutes les animations
- Navigation clavier (flèches, Enter, Tab) sur le quiz
- Focus visible sur tous les éléments interactifs
- Tous les boutons / liens / cards ont `cursor-pointer`

## Licence

Propriétaire — tous droits réservés à Loïc Barthoulot.
