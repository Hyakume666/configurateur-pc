# SEO + Mobile UX — Design Spec

**Date:** 2026-04-26  
**Scope:** Approche 2 — SEO patches + mobile nav  
**Stack:** Vue 3 · Vite · Tailwind · @vueuse/head · Cloudflare Pages

---

## Objectif

Améliorer le référencement Google et l'UX mobile du configurateur PC gaming suisse sans refactoriser l'architecture existante. Deux axes : données structurées JSON-LD et navigation mobile.

---

## 1. SEO — JSON-LD

### 1.1 WebSite + SearchAction (HomeView.vue)

Ajouter un second bloc `ld+json` à côté du `LocalBusiness` existant :

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Loïc.config",
  "url": "https://pc.loicbarthoulot.ch",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://pc.loicbarthoulot.ch/configs?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

**Pourquoi :** Ouvre l'éligibilité au sitelinks searchbox dans la SERP Google. La page `/configs` devra lire le paramètre `?q=` et filtrer (ou l'ignorer silencieusement si non implémenté — Google tolère ça).

### 1.2 BreadcrumbList (ConfigDetailView.vue)

Ajouter dans le `useHead` existant un troisième bloc `ld+json` calculé :

```
Home (/) > Configurations (/configs) > [config.name] (/config/:slug)
```

Apparaît sous l'URL dans la SERP — signal de hiérarchie pour Googlebot.

### 1.3 Meta description CatalogueView (CatalogueView.vue)

Ajouter `useHead` avec `title` + `meta description`. Actuellement manquant — page non indexable correctement.

Suggestion :
- title: `Toutes nos configurations PC Gaming — Loïc.config`
- description: `Parcourez toutes nos configurations PC gaming sur mesure disponibles en Suisse romande. Budget, mid-range, haut de gamme.`

---

## 2. SEO — Route Guard Fix

### 2.1 ResultsView redirect (router/index.js)

**Problème actuel :** `onMounted` dans `ResultsView.vue` redirige vers `/quiz` si le quiz n'est pas complété → le composant monte, rendu vide visible, puis redirect. Flash visible + mauvais signal pour crawlers.

**Fix :** Déplacer la logique dans `beforeEnter` du router :

```js
{
  path: '/results',
  name: 'results',
  component: () => import('@/views/ResultsView.vue'),
  beforeEnter: () => {
    const quizStore = useQuizStore()
    const configStore = useConfigStore()
    if (!quizStore.completed && !configStore.topMatches.length) {
      return { name: 'quiz' }
    }
  }
}
```

Supprimer le bloc `onMounted` correspondant dans `ResultsView.vue`.

**Contrainte :** `useQuizStore()` et `useConfigStore()` appelés *à l'intérieur* de la fonction `beforeEnter` (pas au top-level du fichier router) pour éviter la dépendance circulaire. Pinia est déjà initialisé quand le guard s'exécute.

---

## 3. Mobile — Navigation

### 3.1 Hamburger menu (App.vue)

**Problème actuel :** Sur mobile (`< sm`), seul un lien "Quiz" est affiché. "Configurations" et "Accueil" ne sont accessibles que via le footer — perte de conversion.

**Solution :** Remplacer le lien "Quiz" mobile par un bouton hamburger. Au clic, slide-down d'un panel nav sous le header.

**Comportement :**
- Bouton : icône `Menu` (lucide) quand fermé, `X` quand ouvert
- Panel : `absolute top-full left-0 right-0`, fond `glass`, `border-b border-border-subtle/60`
- Items : les 3 routes (`home`, `quiz`, `configs`), full-width, padding vertical ≥ 44px (touch target)
- `active-class` : `text-neon-blue` (cohérent avec nav desktop)
- Fermeture : backdrop `div` fixe semi-transparent derrière le panel (plus simple qu'un composable click-outside) OU changement de route (`router.afterEach`)
- Desktop (`sm:`) : nav horizontale inchangée

**État :** `ref(false)` local dans `App.vue` — pas de store.

### 3.2 QuizWrapper min-height (QuizWrapper.vue)

`min-h-[420px]` → `min-h-[320px] sm:min-h-[420px]`

Sur écrans 390px avec barre d'adresse + header sticky, 420px de hauteur minimum pour la zone question dépasse le viewport visible. 320px laisse de l'espace pour progress bar + boutons nav.

---

## Fichiers modifiés

| Fichier | Changement |
|---|---|
| `src/views/HomeView.vue` | + `WebSite` JSON-LD |
| `src/views/ConfigDetailView.vue` | + `BreadcrumbList` JSON-LD |
| `src/views/CatalogueView.vue` | + `useHead` title + description |
| `src/views/ResultsView.vue` | - bloc `onMounted` redirect |
| `src/router/index.js` | + `beforeEnter` sur `/results` |
| `src/App.vue` | hamburger mobile + click-outside |
| `src/components/quiz/QuizWrapper.vue` | min-h responsive |

---

## Hors scope

- PWA Service Worker (décision B — manifest suffisant)
- Sitemap dynamique (Approche 3)
- FAQ schema
- Open Graph images réelles
- Audit exhaustif de toutes les pages mobile
