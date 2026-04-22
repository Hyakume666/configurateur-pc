<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  size: { type: String, default: 'md' },
  closeOnBackdrop: { type: Boolean, default: true }
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}

function onKey(e) {
  if (e.key === 'Escape' && props.open) close()
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

watch(
  () => props.open,
  (val) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = val ? 'hidden' : ''
  }
)
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        @click.self="closeOnBackdrop && close()"
      >
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.95 }"
          :enter="{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 22 } }"
          :leave="{ opacity: 0, scale: 0.95 }"
          :class="[
            'relative w-full glass border border-border-default rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto',
            size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-3xl' : 'max-w-xl'
          ]"
          role="dialog"
          aria-modal="true"
        >
          <header v-if="title || $slots.header" class="flex items-center justify-between gap-4 px-6 py-4 border-b border-border-subtle">
            <slot name="header">
              <h2 class="text-lg sm:text-xl font-semibold text-text-primary">{{ title }}</h2>
            </slot>
            <button
              type="button"
              class="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-700 transition cursor-pointer"
              aria-label="Fermer"
              @click="close"
            >
              <X class="w-5 h-5" />
            </button>
          </header>
          <div class="px-6 py-5">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="px-6 py-4 border-t border-border-subtle bg-bg-900/50">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
