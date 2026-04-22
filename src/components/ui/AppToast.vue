<script setup>
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const { toasts, dismiss } = useToast()

const iconFor = (type) => {
  if (type === 'success') return CheckCircle2
  if (type === 'error') return AlertCircle
  return Info
}

const colorFor = (type) => {
  if (type === 'success') return 'border-neon-green/40 text-neon-green'
  if (type === 'error') return 'border-red-500/50 text-red-400'
  return 'border-neon-blue/40 text-neon-blue'
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed top-4 right-4 z-[60] flex flex-col gap-2 w-full max-w-sm pointer-events-none"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          :class="[
            'glass rounded-xl border px-4 py-3 flex items-start gap-3 shadow-lg pointer-events-auto',
            colorFor(t.type)
          ]"
          v-motion
          :initial="{ opacity: 0, x: 30 }"
          :enter="{ opacity: 1, x: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } }"
          :leave="{ opacity: 0, x: 30 }"
          role="status"
        >
          <component :is="iconFor(t.type)" class="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div class="flex-1 text-sm text-text-primary">{{ t.message }}</div>
          <button
            type="button"
            class="text-text-muted hover:text-text-primary cursor-pointer"
            aria-label="Fermer"
            @click="dismiss(t.id)"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(30px); }
</style>
