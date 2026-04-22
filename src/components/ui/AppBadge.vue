<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'new' },
  size: { type: String, default: 'md' }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'new':
      return 'bg-neon-green/15 text-neon-green border border-neon-green/40'
    case 'popular':
      return 'bg-neon-pink/15 text-neon-pink border border-neon-pink/40'
    case 'value':
      return 'bg-neon-blue/15 text-neon-blue border border-neon-blue/40'
    case 'extreme':
      return 'bg-neon-violet/15 text-neon-violet border border-neon-violet/40'
    case 'muted':
      return 'bg-bg-700 text-text-secondary border border-border-subtle'
    default:
      return 'bg-bg-700 text-text-secondary border border-border-subtle'
  }
})

const sizeClasses = computed(() =>
  props.size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
)
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-wide',
      variantClasses,
      sizeClasses
    ]"
  >
    <slot />
  </span>
</template>
