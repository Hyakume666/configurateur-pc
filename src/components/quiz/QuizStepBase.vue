<script setup>
import { computed } from 'vue'
import questions from '@/data/questions.json'
import { useQuizStore } from '@/stores/quizStore'
import QuizOptionCard from './QuizOptionCard.vue'

const props = defineProps({
  stepId: { type: Number, required: true }
})

const store = useQuizStore()

const question = computed(() => questions.find((q) => q.id === props.stepId))

const selectedValue = computed(() => store.answers[question.value.key])

function isSelected(option) {
  if (question.value.type === 'multi') {
    return (selectedValue.value || []).includes(option.id)
  }
  return selectedValue.value === option.id
}

function handleSelect(option) {
  if (question.value.type === 'multi') {
    store.toggleMulti(question.value.key, option.id, option.exclusive === true)
  } else {
    store.setAnswer(question.value.key, option.id)
  }
}
</script>

<template>
  <div class="w-full">
    <header class="mb-8 text-center">
      <h2 class="heading-display text-2xl sm:text-3xl lg:text-4xl text-text-primary">
        {{ question.question }}
      </h2>
      <p v-if="question.subtitle" class="mt-2 text-sm sm:text-base text-text-muted">
        {{ question.subtitle }}
      </p>
    </header>

    <div
      :class="[
        'grid gap-3 sm:gap-4',
        question.options.length <= 3
          ? 'grid-cols-1 sm:grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-' + Math.min(question.options.length, 3)
      ]"
    >
      <QuizOptionCard
        v-for="(opt, idx) in question.options"
        :key="opt.id"
        :option="opt"
        :index="idx"
        :selected="isSelected(opt)"
        @select="handleSelect"
      />
    </div>

    <p v-if="question.type === 'multi'" class="mt-4 text-xs text-text-muted text-center">
      Sélection multiple — vous pouvez aussi passer cette étape.
    </p>
  </div>
</template>
