<script setup>
import { useHead } from '@vueuse/head'
import { ChevronLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import QuizWrapper from '@/components/quiz/QuizWrapper.vue'

useHead({
  title: 'Quiz — Configurez votre PC sur mesure',
  meta: [
    { name: 'description', content: 'Configurez votre PC sur mesure en 5 questions. Recommandation immédiate.' }
  ]
})

const router = useRouter()
</script>

<template>
  <div class="min-h-screen relative overflow-hidden flex flex-col">
    <div class="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
    <div class="absolute inset-0 bg-gradient-hero opacity-50 pointer-events-none" />

    <header class="container-page py-6 relative z-10">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-neon-blue transition cursor-pointer"
        @click="router.push({ name: 'home' })"
      >
        <ChevronLeft class="w-4 h-4" />
        Retour à l'accueil
      </button>
    </header>

    <main class="flex-1 container-page py-8 sm:py-14 relative z-10 flex items-center">
      <QuizWrapper class="w-full" />
    </main>
  </div>
</template>
