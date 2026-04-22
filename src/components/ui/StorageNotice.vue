<script setup>
import { ref, onMounted } from 'vue'
import { Cookie, X } from 'lucide-vue-next'

const STORAGE_KEY = 'storage_notice_v1'
const visible = ref(false)

onMounted(() => {
  try {
    if (!localStorage.getItem(STORAGE_KEY)) {
      // Slight delay so it doesn't compete with the hero animation.
      setTimeout(() => (visible.value = true), 800)
    }
  } catch {
    /* incognito or storage disabled — nothing to remember anyway */
  }
})

function accept() {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* ignore */
  }
  visible.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div
        v-if="visible"
        class="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:bottom-4 sm:max-w-md z-40"
        role="region"
        aria-label="Information sur le stockage local"
      >
        <div class="glass border border-primary-500/30 rounded-2xl shadow-glow-soft p-4 flex items-start gap-3">
          <span class="flex-shrink-0 w-9 h-9 rounded-lg bg-primary-500/15 text-neon-blue flex items-center justify-center">
            <Cookie class="w-5 h-5" />
          </span>
          <div class="flex-1 text-sm text-text-secondary">
            <p class="text-text-primary font-medium mb-1">Stockage local</p>
            <p class="text-xs leading-relaxed">
              Ce site mémorise votre progression dans le quiz dans votre navigateur uniquement.
              Aucun cookie de suivi, aucun tiers.
              <router-link :to="{ name: 'privacy' }" class="text-neon-blue hover:underline">
                En savoir plus
              </router-link>
            </p>
            <button
              type="button"
              class="mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-400 text-white text-xs font-semibold transition cursor-pointer"
              @click="accept"
            >
              J'ai compris
            </button>
          </div>
          <button
            type="button"
            class="text-text-muted hover:text-text-primary cursor-pointer"
            aria-label="Fermer"
            @click="accept"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
