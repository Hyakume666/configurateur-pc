<script setup>
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
import { getIcon } from '@/utils/icons'

const props = defineProps({
  option: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  index: { type: Number, default: 0 }
})

const emit = defineEmits(['select'])

const Icon = computed(() => getIcon(props.option.icon))
</script>

<template>
  <button
    type="button"
    :class="[
      'group relative text-left rounded-2xl border-2 p-5 sm:p-6 transition-all duration-200 cursor-pointer w-full',
      selected
        ? 'border-neon-blue bg-neon-blue/5 shadow-neon-blue'
        : 'border-border-subtle bg-bg-800 hover:border-primary-500/50 hover:bg-bg-700'
    ]"
    v-motion
    :initial="{ opacity: 0, y: 24 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 320, delay: index * 80 } }"
    :hovered="{ scale: 1.02, transition: { type: 'spring', stiffness: 250, damping: 18 } }"
    :tapped="{ scale: 0.97 }"
    :aria-pressed="selected"
    @click="emit('select', option)"
  >
    <Transition name="check">
      <div
        v-if="selected"
        class="absolute top-3 right-3 w-7 h-7 rounded-full bg-neon-blue text-bg-950 flex items-center justify-center"
        v-motion
        :initial="{ scale: 0, rotate: -90 }"
        :enter="{ scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 320, damping: 18 } }"
      >
        <Check class="w-4 h-4 stroke-[3]" />
      </div>
    </Transition>

    <div class="flex items-start gap-4">
      <div
        :class="[
          'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
          selected ? 'bg-neon-blue/15 text-neon-blue' : 'bg-bg-700 text-primary-300 group-hover:bg-primary-500/15 group-hover:text-primary-300'
        ]"
      >
        <component :is="Icon" class="w-6 h-6" />
      </div>
      <div class="min-w-0 flex-1">
        <h3 class="text-base sm:text-lg font-semibold text-text-primary leading-tight">
          {{ option.label }}
        </h3>
        <p v-if="option.sublabel" class="mt-1 text-sm text-text-muted">{{ option.sublabel }}</p>
      </div>
    </div>
  </button>
</template>

<style scoped>
.check-enter-active, .check-leave-active { transition: all 0.18s ease; }
.check-enter-from, .check-leave-to { opacity: 0; transform: scale(0.5); }
</style>
