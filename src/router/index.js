import { createRouter, createWebHistory } from 'vue-router'
import { useQuizStore } from '@/stores/quizStore'
import { useConfigStore } from '@/stores/configStore'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Configurateur PC Gaming Suisse | Loïc Barthoulot' }
  },
  {
    path: '/quiz',
    name: 'quiz',
    component: () => import('@/views/QuizView.vue'),
    meta: { title: 'Quiz — Configurez votre PC sur mesure' }
  },
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
  {
    path: '/configs',
    name: 'configs',
    component: () => import('@/views/CatalogueView.vue'),
    meta: { title: 'Toutes nos configurations PC' }
  },
  {
    path: '/comparateur',
    name: 'compare',
    component: () => import('@/views/CompareView.vue'),
    meta: { title: 'Comparer des configurations' }
  },
  {
    path: '/config/:slug',
    name: 'config-detail',
    component: () => import('@/views/ConfigDetailView.vue'),
    props: true,
    meta: { title: 'Détails configuration' }
  },
  {
    path: '/admin-login',
    name: 'admin-login',
    component: () => import('@/views/AdminLoginView.vue'),
    meta: { title: 'Admin — Connexion' }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/AdminView.vue'),
    meta: { title: 'Admin — Statistiques' },
    beforeEnter: () => {
      const pwd = import.meta.env.VITE_ADMIN_PASSWORD
      if (pwd && sessionStorage.getItem('admin_auth') !== pwd) return '/admin-login'
    }
  },
  {
    path: '/mentions-legales',
    name: 'legal',
    component: () => import('@/views/LegalView.vue'),
    meta: { title: 'Mentions légales' }
  },
  {
    path: '/confidentialite',
    name: 'privacy',
    component: () => import('@/views/PrivacyView.vue'),
    meta: { title: 'Politique de confidentialité' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page introuvable' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title
  }
})

export default router
