<script setup>
import { Home, Cpu } from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'
</script>

<template>
  <div class="min-h-screen relative flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
    <div class="absolute inset-0 bg-gradient-hero opacity-50 pointer-events-none" />

    <div
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      class="container-page relative text-center max-w-xl"
    >
      <div class="text-[6rem] sm:text-[10rem] heading-display text-gradient-neon leading-none mb-2">
        404
      </div>
      <h1 class="heading-display text-2xl sm:text-3xl text-text-primary mb-3">
        Page introuvable
      </h1>
      <p class="text-text-muted mb-8">
        La page que vous cherchez n'existe pas, ou a été déplacée. Mais on a sûrement
        une configuration parfaite à vous proposer.
      </p>
      <div class="flex flex-wrap items-center justify-center gap-3">
        <AppButton :to="{ name: 'home' }" variant="primary">
          <Home class="w-5 h-5" />
          Retour à l'accueil
        </AppButton>
        <AppButton :to="{ name: 'quiz' }" variant="ghost">
          <Cpu class="w-5 h-5" />
          Faire le quiz
        </AppButton>
      </div>
    </div>
  </div>
</template>
