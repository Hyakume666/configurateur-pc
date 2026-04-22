<script setup>
import { computed } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { Cpu, Mail } from 'lucide-vue-next'
import AppToast from '@/components/ui/AppToast.vue'
import StorageNotice from '@/components/ui/StorageNotice.vue'
import CompareTray from '@/components/config/CompareTray.vue'

const route = useRoute()

const isQuizRoute = computed(() => route.name === 'quiz')

const navItems = [
  { name: 'home', label: 'Accueil' },
  { name: 'quiz', label: 'Quiz' },
  { name: 'configs', label: 'Configurations' }
]
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bg-950 text-text-primary">
    <!-- HEADER (hidden on quiz for immersion) -->
    <header v-if="!isQuizRoute" class="sticky top-0 z-40 glass border-b border-border-subtle/60">
      <div class="container-page flex items-center justify-between h-16">
        <RouterLink :to="{ name: 'home' }" class="inline-flex items-center gap-2 group">
          <span class="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-neon-violet flex items-center justify-center shadow-glow-soft group-hover:shadow-neon-blue transition">
            <Cpu class="w-5 h-5 text-white" />
          </span>
          <span class="heading-display text-base sm:text-lg text-text-primary">
            Loïc<span class="text-gradient-neon">.config</span>
          </span>
        </RouterLink>

        <nav class="hidden sm:flex items-center gap-1">
          <RouterLink
            v-for="n in navItems"
            :key="n.name"
            :to="{ name: n.name }"
            class="px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-800 transition cursor-pointer"
            active-class="text-neon-blue"
          >
            {{ n.label }}
          </RouterLink>
        </nav>

        <RouterLink
          :to="{ name: 'quiz' }"
          class="sm:hidden text-sm text-neon-blue font-medium cursor-pointer"
        >
          Quiz
        </RouterLink>
      </div>
    </header>

    <main class="flex-1">
      <RouterView v-slot="{ Component, route: r }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="r.fullPath" />
        </Transition>
      </RouterView>
    </main>

    <!-- FOOTER -->
    <footer v-if="!isQuizRoute" class="border-t border-border-subtle bg-bg-900 mt-auto">
      <div class="container-page py-10 grid sm:grid-cols-3 gap-8 text-sm">
        <div>
          <RouterLink :to="{ name: 'home' }" class="inline-flex items-center gap-2 mb-3">
            <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-neon-violet flex items-center justify-center">
              <Cpu class="w-4 h-4 text-white" />
            </span>
            <span class="heading-display text-text-primary">Loïc<span class="text-gradient-neon">.config</span></span>
          </RouterLink>
          <p class="text-text-muted text-xs leading-relaxed max-w-xs">
            Configurateur de PC gaming sur mesure, assemblé en Suisse romande.
          </p>
        </div>
        <div>
          <h4 class="text-xs uppercase tracking-wider text-text-secondary font-semibold mb-3">Navigation</h4>
          <ul class="space-y-2 text-text-muted">
            <li><RouterLink :to="{ name: 'home' }" class="hover:text-neon-blue transition">Accueil</RouterLink></li>
            <li><RouterLink :to="{ name: 'quiz' }" class="hover:text-neon-blue transition">Quiz</RouterLink></li>
            <li><RouterLink :to="{ name: 'configs' }" class="hover:text-neon-blue transition">Configurations</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4 class="text-xs uppercase tracking-wider text-text-secondary font-semibold mb-3">Contact</h4>
          <a
            href="mailto:contact@loic-config.ch"
            class="inline-flex items-center gap-2 text-text-muted hover:text-neon-blue transition"
          >
            <Mail class="w-4 h-4" />
            contact@loic-config.ch
          </a>
          <p class="mt-3 text-xs text-text-dim">Suisse romande, Neuchâtel</p>
        </div>
      </div>
      <div class="border-t border-border-subtle/60">
        <div class="container-page py-4 text-xs text-text-dim flex flex-wrap items-center justify-between gap-3">
          <span>© {{ new Date().getFullYear() }} Loïc Barthoulot — Tous droits réservés</span>
          <nav class="flex items-center gap-4">
            <RouterLink :to="{ name: 'legal' }" class="hover:text-neon-blue transition">
              Mentions légales
            </RouterLink>
            <RouterLink :to="{ name: 'privacy' }" class="hover:text-neon-blue transition">
              Confidentialité
            </RouterLink>
            <span class="text-text-dim/70">Liens d'achat sponsorisés</span>
          </nav>
        </div>
      </div>
    </footer>

    <AppToast />
    <StorageNotice />
    <CompareTray v-if="!isQuizRoute" />
  </div>
</template>

<style scoped>
.page-enter-active, .page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
