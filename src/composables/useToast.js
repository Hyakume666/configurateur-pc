import { ref } from 'vue'

const toasts = ref([])
let nextId = 1

export function useToast() {
  function show(message, options = {}) {
    const id = nextId++
    const toast = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration ?? 3500
    }
    toasts.value.push(toast)
    if (toast.duration > 0) {
      setTimeout(() => dismiss(id), toast.duration)
    }
    return id
  }

  function dismiss(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    toasts,
    show,
    dismiss,
    success: (msg, opts) => show(msg, { ...opts, type: 'success' }),
    error: (msg, opts) => show(msg, { ...opts, type: 'error' }),
    info: (msg, opts) => show(msg, { ...opts, type: 'info' })
  }
}

export function formatPriceCHF(value) {
  if (value === null || value === undefined) return '—'
  const rounded = Math.round(value)
  return `${rounded.toLocaleString('fr-CH').replace(/ | /g, ' ')} CHF`
}
