<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, required: true },
  max: { type: Number, default: 100 },
  label: { type: String, default: '' },
  color: { type: String, default: 'blue' },
  delay: { type: Number, default: 0 },
  showValue: { type: Boolean, default: true },
  height: { type: String, default: 'h-2' }
})

const pct = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)))

const colorClass = computed(() => {
  switch (props.color) {
    case 'violet':
      return 'from-neon-violet to-primary-500'
    case 'pink':
      return 'from-neon-pink to-neon-violet'
    case 'green':
      return 'from-neon-green to-primary-400'
    case 'orange':
      return 'from-orange-500 to-neon-pink'
    default:
      return 'from-primary-500 to-neon-blue'
  }
})
</script>

<template>
  <div class="w-full">
    <div v-if="label || showValue" class="flex items-center justify-between mb-1.5 text-xs">
      <span class="text-text-secondary font-medium">{{ label }}</span>
      <span v-if="showValue" class="text-text-muted font-mono">{{ Math.round(pct) }}</span>
    </div>
    <div :class="['relative w-full overflow-hidden bg-bg-700 rounded-full', height]">
      <div
        v-motion
        :initial="{ width: '0%' }"
        :enter="{ width: `${pct}%`, transition: { duration: 800, delay } }"
        :class="[
          'h-full bg-gradient-to-r rounded-full',
          colorClass
        ]"
        :style="{ width: '0%' }"
      />
    </div>
  </div>
</template>
