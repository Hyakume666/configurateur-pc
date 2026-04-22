<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  size: { type: String, default: 'md' },
  closeOnBackdrop: { type: Boolean, default: true }
})

const emit = defineEmits(['close'])

const dialogRef = ref(null)
const previouslyFocused = ref(null)

function close() {
  emit('close')
}

function getFocusable() {
  if (!dialogRef.value) return []
  return Array.from(
    dialogRef.value.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  )
}

function trapFocus(e) {
  const focusable = getFocusable()
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

function onKey(e) {
  if (!props.open) return
  if (e.key === 'Escape') close()
  if (e.key === 'Tab') trapFocus(e)
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})

watch(
  () => props.open,
  async (val) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = val ? 'hidden' : ''

    if (val) {
      previouslyFocused.value = document.activeElement
      await nextTick()
      const focusable = getFocusable()
      if (focusable.length) focusable[0].focus()
    } else if (previouslyFocused.value && typeof previouslyFocused.value.focus === 'function') {
      previouslyFocused.value.focus()
      previouslyFocused.value = null
    }
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
          ref="dialogRef"
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
          :aria-label="title || undefined"
        >
          <header v-if="title || $slots.header" class="flex items-center justify-between gap-4 px-6 py-4 border-b border-border-subtle">
            <slot name="header">
              <h2 class="text-lg sm:text-xl font-semibold text-text-primary">{{ title }}</h2>
            </slot>
            <button
              type="button"
              class="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-700 transition cursor-pointer"
              aria-label="Fermer la fenêtre"
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
