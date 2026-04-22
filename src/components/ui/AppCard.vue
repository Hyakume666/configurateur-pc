<script setup>
defineProps({
  glow: { type: Boolean, default: false },
  hover: { type: Boolean, default: false },
  padding: { type: String, default: 'md' }
})
</script>

<template>
  <div
    :class="[
      'relative rounded-2xl bg-bg-800 border transition-all duration-200',
      glow ? 'border-transparent glow-border shadow-glow-soft' : 'border-border-subtle',
      hover ? 'hover:border-primary-500/40 hover:shadow-glow-soft' : '',
      padding === 'sm' ? 'p-4' : padding === 'lg' ? 'p-8' : 'p-6'
    ]"
  >
    <slot />
  </div>
</template>
