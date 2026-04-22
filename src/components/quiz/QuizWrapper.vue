<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-vue-next'
import { useQuizStore } from '@/stores/quizStore'
import { useQuiz } from '@/composables/useQuiz'
import { useConfigStore } from '@/stores/configStore'
import AppButton from '@/components/ui/AppButton.vue'
import QuizStep1 from './QuizStep1.vue'
import QuizStep2 from './QuizStep2.vue'
import QuizStep3 from './QuizStep3.vue'
import QuizStep4 from './QuizStep4.vue'
import QuizStep5 from './QuizStep5.vue'

const router = useRouter()
const store = useQuizStore()
const configStore = useConfigStore()
const { rankConfigs } = useQuiz()

const stepComponents = { 1: QuizStep1, 2: QuizStep2, 3: QuizStep3, 4: QuizStep4, 5: QuizStep5 }
const currentComponent = computed(() => stepComponents[store.currentStep])

const isLast = computed(() => store.currentStep === store.totalSteps)

const motionVariants = computed(() => {
  const dir = store.direction === 'next' ? 1 : -1
  return {
    initial: { opacity: 0, x: 50 * dir },
    enter: { opacity: 1, x: 0, transition: { duration: 320 } }
  }
})

function handleNext() {
  if (!store.isStepValid && store.currentQuestion?.type !== 'multi') return
  if (isLast.value) {
    finish()
  } else {
    store.next()
  }
}

function finish() {
  const matches = rankConfigs(store.answers)
  configStore.setTopMatches(matches)
  store.completed = true
  store.persist()
  router.push({ name: 'results' })
}

function handlePrev() {
  store.previous()
}

function handleRestart() {
  store.reset()
}

function onKey(e) {
  if (e.key === 'Enter') handleNext()
  if (e.key === 'ArrowLeft') handlePrev()
  if (e.key === 'ArrowRight' && (store.isStepValid || store.currentQuestion?.type === 'multi'))
    handleNext()
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="w-full max-w-5xl mx-auto">
    <header class="mb-10">
      <div class="flex items-center justify-between mb-3 text-sm">
        <span class="text-text-muted font-mono">
          Question <span class="text-neon-blue font-semibold">{{ store.currentStep }}</span> / {{ store.totalSteps }}
        </span>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-text-muted hover:text-neon-blue transition cursor-pointer"
          @click="handleRestart"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          Recommencer
        </button>
      </div>
      <div class="relative h-1.5 w-full bg-bg-700 rounded-full overflow-hidden">
        <div
          class="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 via-neon-blue to-neon-violet rounded-full transition-all duration-500 ease-spring"
          :style="{ width: `${store.progress}%` }"
        />
      </div>
    </header>

    <div class="relative min-h-[420px]">
      <Transition name="step" mode="out-in">
        <div :key="store.currentStep">
          <div
            v-motion
            :initial="motionVariants.initial"
            :enter="motionVariants.enter"
          >
            <component :is="currentComponent" />
          </div>
        </div>
      </Transition>
    </div>

    <nav class="mt-10 flex items-center justify-between gap-3">
      <AppButton
        variant="ghost"
        size="md"
        :disabled="store.currentStep === 1"
        @click="handlePrev"
      >
        <ChevronLeft class="w-5 h-5" />
        Précédent
      </AppButton>
      <AppButton
        variant="primary"
        size="lg"
        :disabled="!store.isStepValid && store.currentQuestion?.type !== 'multi'"
        @click="handleNext"
      >
        {{ isLast ? 'Voir mes résultats' : 'Suivant' }}
        <ChevronRight class="w-5 h-5" />
      </AppButton>
    </nav>
  </div>
</template>

<style scoped>
.step-enter-active, .step-leave-active { transition: opacity 0.18s ease; }
.step-enter-from, .step-leave-to { opacity: 0; }
</style>
