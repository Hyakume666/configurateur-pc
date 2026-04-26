# SEO + Mobile UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter JSON-LD structuré (WebSite + BreadcrumbList), corriger le flash du route guard `/results`, et implémenter le menu hamburger mobile.

**Architecture:** Modifications ciblées sur 5 fichiers existants — aucune nouvelle abstraction. Le hamburger est géré par un `ref` local dans `App.vue` avec backdrop div pour fermeture. Les JSON-LD s'ajoutent dans les `useHead()` existants via des blocs `script` supplémentaires.

**Tech Stack:** Vue 3 · @vueuse/head · Vue Router 4 · Pinia · Tailwind CSS · Lucide Vue

---

## Fichiers touchés

| Fichier | Rôle dans ce plan |
|---|---|
| `src/views/HomeView.vue` | + `WebSite` JSON-LD (second bloc ld+json) |
| `src/views/ConfigDetailView.vue` | + `BreadcrumbList` JSON-LD (computed) |
| `src/views/ResultsView.vue` | - `onMounted` redirect (remplacé par beforeEnter) |
| `src/router/index.js` | + `beforeEnter` sur route `/results` |
| `src/App.vue` | hamburger mobile (Menu/X + panel + backdrop) |
| `src/components/quiz/QuizWrapper.vue` | `min-h-[420px]` → `min-h-[320px] sm:min-h-[420px]` |

---

## Task 1 — WebSite JSON-LD sur Home

**Fichier :** `src/views/HomeView.vue`

La page Home a déjà un bloc `ld+json` pour `LocalBusiness`. On ajoute un second objet `WebSite` avec `SearchAction` dans le même tableau `script` de `useHead`.

- [ ] **Step 1.1 — Lire le bloc useHead existant**

Ouvrir `src/views/HomeView.vue`. Le tableau `script` de `useHead` est aux environs de la ligne 59-64 :

```js
script: [
  {
    type: 'application/ld+json',
    children: JSON.stringify(orgJsonLd)
  }
]
```

- [ ] **Step 1.2 — Ajouter la constante websiteJsonLd**

Dans le `<script setup>`, après la définition de `orgJsonLd`, ajouter :

```js
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Loïc.config',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/configs?q={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
}
```

- [ ] **Step 1.3 — Ajouter le second bloc dans useHead**

Remplacer le tableau `script` pour y inclure les deux objets :

```js
script: [
  {
    type: 'application/ld+json',
    children: JSON.stringify(orgJsonLd)
  },
  {
    type: 'application/ld+json',
    children: JSON.stringify(websiteJsonLd)
  }
]
```

- [ ] **Step 1.4 — Vérifier**

Lancer `npm run dev`, ouvrir `http://localhost:5173`, inspecter le HTML source (`Ctrl+U`) et chercher `"@type":"WebSite"`. Doit apparaître dans un `<script type="application/ld+json">`.

- [ ] **Step 1.5 — Commit**

```bash
git add src/views/HomeView.vue
git commit -m "feat(seo): add WebSite + SearchAction JSON-LD on home"
```

---

## Task 2 — BreadcrumbList JSON-LD sur ConfigDetail

**Fichier :** `src/views/ConfigDetailView.vue`

La page config detail a déjà `productJsonLd` computed. On ajoute `breadcrumbJsonLd` computed dans le même `useHead`.

- [ ] **Step 2.1 — Ajouter la computed breadcrumbJsonLd**

Dans `<script setup>`, après `productJsonLd`, ajouter :

```js
const breadcrumbJsonLd = computed(() => {
  if (!config.value) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: SITE_URL
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Configurations',
        item: `${SITE_URL}/configs`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: config.value.name,
        item: `${SITE_URL}/config/${config.value.slug}`
      }
    ]
  }
})
```

- [ ] **Step 2.2 — Ajouter le bloc dans useHead**

Le `useHead` existant a déjà un tableau `script` avec `productJsonLd`. Ajouter un second élément :

```js
script: [
  {
    type: 'application/ld+json',
    children: () => JSON.stringify(productJsonLd.value)
  },
  {
    type: 'application/ld+json',
    children: () => JSON.stringify(breadcrumbJsonLd.value)
  }
]
```

- [ ] **Step 2.3 — Vérifier**

Naviguer vers `http://localhost:5173/config/sweet-spot-gaming` (ou tout autre slug valide), inspecter le source HTML, chercher `"@type":"BreadcrumbList"`. Vérifier que les 3 `ListItem` ont position 1, 2, 3 et les bons `item` URLs.

- [ ] **Step 2.4 — Commit**

```bash
git add src/views/ConfigDetailView.vue
git commit -m "feat(seo): add BreadcrumbList JSON-LD on config detail pages"
```

---

## Task 3 — Route guard fix pour /results

**Fichiers :** `src/router/index.js` · `src/views/ResultsView.vue`

**Problème :** `onMounted` dans `ResultsView.vue` redirige vers `/quiz` si le quiz n'est pas complété, mais le composant monte déjà → flash d'une page vide. Le `beforeEnter` du router bloque la navigation avant le montage.

- [ ] **Step 3.1 — Ajouter les imports stores dans router/index.js**

En haut de `src/router/index.js`, après les imports Vue Router existants, ajouter :

```js
import { useQuizStore } from '@/stores/quizStore'
import { useConfigStore } from '@/stores/configStore'
```

- [ ] **Step 3.2 — Ajouter beforeEnter sur la route results**

Dans le tableau `routes`, trouver la route `/results` et lui ajouter `beforeEnter` :

```js
{
  path: '/results',
  name: 'results',
  component: () => import('@/views/ResultsView.vue'),
  meta: { title: 'Vos configurations recommandées' },
  beforeEnter: () => {
    const quizStore = useQuizStore()
    const configStore = useConfigStore()
    if (!quizStore.completed && !configStore.topMatches.length) {
      return { name: 'quiz' }
    }
  }
},
```

> **Important :** `useQuizStore()` et `useConfigStore()` sont appelés *à l'intérieur* de la fonction (pas au top-level) pour éviter la dépendance circulaire avec Pinia. Pinia est déjà initialisé quand le guard s'exécute.

- [ ] **Step 3.3 — Supprimer le bloc onMounted dans ResultsView.vue**

Dans `src/views/ResultsView.vue`, supprimer le bloc `onMounted` suivant (lignes ~30-34) :

```js
onMounted(() => {
  if (!quizStore.completed && !configStore.topMatches.length) {
    router.replace({ name: 'quiz' })
  }
})
```

Supprimer aussi les imports devenus inutiles si `onMounted` était le seul utilisateur. Vérifier les imports en haut du fichier — `onMounted` peut être retiré de l'import `vue`. `router` peut être retiré si non utilisé ailleurs dans ce composant (vérifier la fonction `restart()` — elle utilise `router.push`, donc garder l'import `useRouter`).

- [ ] **Step 3.4 — Vérifier**

Dans le navigateur, naviguer directement vers `http://localhost:5173/results` sans avoir complété le quiz. Doit rediriger immédiatement vers `/quiz` sans flash de contenu vide.

- [ ] **Step 3.5 — Commit**

```bash
git add src/router/index.js src/views/ResultsView.vue
git commit -m "fix(router): move results redirect to beforeEnter, remove onMounted flash"
```

---

## Task 4 — Hamburger menu mobile

**Fichier :** `src/App.vue`

**Problème :** Sur mobile (`< sm`), seul le lien "Quiz" est affiché (`sm:hidden`). "Accueil" et "Configurations" sont inaccessibles sans scroller jusqu'au footer.

**Solution :** Remplacer le lien "Quiz" mobile par un bouton hamburger (☰/✕) qui ouvre un panel full-width sous le header. Un backdrop semi-transparent ferme le panel au clic en dehors.

- [ ] **Step 4.1 — Ajouter les imports nécessaires**

Dans `<script setup>` de `src/App.vue`, ajouter les imports manquants :

```js
import { computed, ref } from 'vue'
import { RouterView, RouterLink, useRoute, useRouter } from 'vue-router'
import { Cpu, Mail, Menu, X } from 'lucide-vue-next'
```

> `Menu` et `X` sont les icônes lucide pour hamburger ouvert/fermé. `useRouter` est nécessaire pour `router.afterEach`.

- [ ] **Step 4.2 — Ajouter l'état et le watcher de route**

Après `const route = useRoute()`, ajouter :

```js
const router = useRouter()
const mobileNavOpen = ref(false)

router.afterEach(() => {
  mobileNavOpen.value = false
})
```

- [ ] **Step 4.3 — Remplacer le lien Quiz mobile par le bouton hamburger**

Dans le `<template>`, trouver et remplacer le bloc `sm:hidden` actuel :

```html
<!-- AVANT -->
<RouterLink
  :to="{ name: 'quiz' }"
  class="sm:hidden text-sm text-neon-blue font-medium cursor-pointer"
>
  Quiz
</RouterLink>
```

Par le bouton hamburger :

```html
<!-- APRÈS -->
<button
  type="button"
  class="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-800 transition cursor-pointer"
  :aria-label="mobileNavOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
  :aria-expanded="mobileNavOpen"
  @click="mobileNavOpen = !mobileNavOpen"
>
  <X v-if="mobileNavOpen" class="w-5 h-5" />
  <Menu v-else class="w-5 h-5" />
</button>
```

- [ ] **Step 4.4 — Ajouter le panel mobile et le backdrop**

Juste après la balise fermante `</div>` du `container-page` (qui contient logo + nav desktop + bouton hamburger), et avant `</header>`, ajouter :

```html
<!-- Backdrop -->
<Transition name="fade">
  <div
    v-if="mobileNavOpen"
    class="sm:hidden fixed inset-0 z-30 bg-bg-950/60"
    @click="mobileNavOpen = false"
  />
</Transition>

<!-- Panel mobile -->
<Transition name="slide-down">
  <nav
    v-if="mobileNavOpen"
    class="sm:hidden absolute top-full left-0 right-0 z-40 glass border-b border-border-subtle/60 py-2"
    aria-label="Navigation mobile"
  >
    <RouterLink
      v-for="n in navItems"
      :key="n.name"
      :to="{ name: n.name }"
      class="flex items-center px-6 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-800 transition cursor-pointer"
      active-class="text-neon-blue"
    >
      {{ n.label }}
    </RouterLink>
  </nav>
</Transition>
```

> Le `z-30` du backdrop est sous le `z-40` du header sticky (`z-40`) — le backdrop est positionné `fixed` donc il couvre tout sauf le header lui-même. Le panel est en `absolute top-full` donc il sort sous le header.

- [ ] **Step 4.5 — Ajouter les transitions CSS**

Dans la section `<style scoped>` de `App.vue` (qui contient déjà `.page-enter-active`), ajouter :

```css
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-down-enter-active, .slide-down-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
```

- [ ] **Step 4.6 — Vérifier sur mobile**

Dans Chrome DevTools, passer en mode responsive 390px (iPhone 14). Vérifier :
- Bouton hamburger visible à droite du logo
- Clic ouvre le panel avec les 3 liens (Accueil, Quiz, Configurations)
- Clic sur un lien ferme le panel et navigue
- Clic sur le backdrop ferme le panel
- Sur `sm:` (≥ 640px) : nav desktop horizontale visible, hamburger absent

- [ ] **Step 4.7 — Commit**

```bash
git add src/App.vue
git commit -m "feat(mobile): hamburger nav menu with backdrop and transitions"
```

---

## Task 5 — QuizWrapper min-height responsive

**Fichier :** `src/components/quiz/QuizWrapper.vue`

Sur écrans 390px, `min-h-[420px]` pour la zone de question + progress bar + boutons nav dépasse le viewport visible avec la barre d'adresse du navigateur.

- [ ] **Step 5.1 — Modifier la classe min-h**

Dans `src/components/quiz/QuizWrapper.vue`, trouver le `div` avec `class="relative min-h-[420px]"` (ligne ~105) et le modifier :

```html
<!-- AVANT -->
<div class="relative min-h-[420px]">

<!-- APRÈS -->
<div class="relative min-h-[320px] sm:min-h-[420px]">
```

- [ ] **Step 5.2 — Vérifier**

Dans Chrome DevTools à 390px, naviguer vers `/quiz`. La zone de question ne doit pas dépasser le viewport. Tester avec la barre d'adresse simulée (mode mobile DevTools).

- [ ] **Step 5.3 — Commit**

```bash
git add src/components/quiz/QuizWrapper.vue
git commit -m "fix(mobile): reduce quiz min-height on small screens"
```

---

## Task 6 — Push final

- [ ] **Step 6.1 — Vérifier l'état git**

```bash
git log --oneline -6
git status
```

Doit montrer 5 nouveaux commits depuis la baseline, working tree propre.

- [ ] **Step 6.2 — Push**

```bash
git push
```

Cloudflare Pages déploie automatiquement sur push vers `main`.

- [ ] **Step 6.3 — Valider en production**

Après déploiement (~1 min) :
1. Ouvrir `https://pc.loicbarthoulot.ch` → inspecter source → vérifier `"@type":"WebSite"`
2. Ouvrir `https://pc.loicbarthoulot.ch/config/sweet-spot-gaming` → vérifier `"@type":"BreadcrumbList"`
3. Sur mobile réel (ou DevTools 390px) : vérifier hamburger menu fonctionnel
4. Naviguer directement vers `https://pc.loicbarthoulot.ch/results` → doit rediriger vers `/quiz` immédiatement

- [ ] **Step 6.4 — Google Rich Results Test (optionnel)**

Soumettre `https://pc.loicbarthoulot.ch/config/sweet-spot-gaming` sur `https://search.google.com/test/rich-results` pour valider le `BreadcrumbList` et le `Product` JSON-LD.
