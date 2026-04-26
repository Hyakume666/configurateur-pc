<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { RotateCcw, Layers } from 'lucide-vue-next'
import { useHead } from '@vueuse/head'
import { useQuizStore } from '@/stores/quizStore'
import { useConfigStore } from '@/stores/configStore'
import { useQuiz } from '@/composables/useQuiz'
import ConfigCardFeatured from '@/components/config/ConfigCardFeatured.vue'
import ConfigCard from '@/components/config/ConfigCard.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const quizStore = useQuizStore()
const configStore = useConfigStore()
const { rankConfigs, summarizeAnswers } = useQuiz()

useHead({
  title: 'Vos configurations recommandées | Loïc.config'
})

const matches = computed(() => {
  if (configStore.topMatches.length) return configStore.topMatches
  if (quizStore.completed) return rankConfigs(quizStore.answers)
  return []
})

const summary = computed(() => summarizeAnswers(quizStore.answers))

function restart() {
  quizStore.reset()
  configStore.setTopMatches([])
  router.push({ name: 'quiz' })
}
</script>

<template>
  <div class="min-h-screen pb-20">
    <header class="relative pt-16 sm:pt-24 pb-12">
      <div class="absolute inset-0 bg-gradient-hero opacity-60 pointer-events-none" />
      <div class="container-page relative">
        <div class="max-w-3xl">
          <span class="text-xs uppercase tracking-widest text-neon-blue font-semibold">
            Quiz terminé
          </span>
          <h1 class="heading-display text-3xl sm:text-5xl text-text-primary mt-2 mb-4">
            Votre configuration idéale
          </h1>
          <p class="text-text-secondary mb-4">
            Voici les 3 meilleures configurations pour vous, basées sur vos réponses.
          </p>
          <div v-if="summary.length" class="flex flex-wrap gap-2">
            <span
              v-for="(s, i) in summary"
              :key="i"
              class="text-xs px-3 py-1 rounded-full bg-bg-700 border border-border-subtle text-text-secondary"
            >
              {{ s }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <main class="container-page">
      <div v-if="matches[0]" class="mb-12">
        <ConfigCardFeatured :config="matches[0]" :reasons="matches[0]._reasons || []" />
      </div>

      <div class="grid gap-5 grid-cols-1 md:grid-cols-2">
        <ConfigCard
          v-for="(c, i) in matches.slice(1)"
          :key="c.id"
          :config="c"
          :index="i"
        />
      </div>

      <div v-if="!matches.length" class="text-center py-20">
        <p class="text-text-muted mb-4">Aucune configuration disponible.</p>
        <AppButton :to="{ name: 'quiz' }" variant="primary">Faire le quiz</AppButton>
      </div>

      <div class="mt-16 flex flex-wrap items-center justify-center gap-3">
        <AppButton variant="ghost" @click="restart">
          <RotateCcw class="w-4 h-4" />
          Retenter le quiz
        </AppButton>
        <AppButton :to="{ name: 'configs' }" variant="secondary">
          <Layers class="w-4 h-4" />
          Voir toutes les configs
        </AppButton>
      </div>
    </main>
  </div>
</template>
