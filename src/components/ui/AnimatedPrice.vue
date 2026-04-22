<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { formatPriceCHF } from '@/composables/useToast'

const props = defineProps({
  value: { type: Number, required: true },
  duration: { type: Number, default: 380 },
  format: { type: Function, default: formatPriceCHF }
})

const display = ref(props.value)
let rafId = null

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

function tween(from, to) {
  if (rafId) cancelAnimationFrame(rafId)
  if (reduceMotion || from === to) {
    display.value = to
    return
  }
  const start = performance.now()
  const delta = to - from
  function step(now) {
    const elapsed = now - start
    const t = Math.min(1, elapsed / props.duration)
    display.value = from + delta * easeOutCubic(t)
    if (t < 1) rafId = requestAnimationFrame(step)
    else display.value = to
  }
  rafId = requestAnimationFrame(step)
}

watch(
  () => props.value,
  (newVal, oldVal) => {
    tween(oldVal ?? newVal, newVal)
  }
)

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <span aria-live="polite">{{ format(display) }}</span>
</template>
