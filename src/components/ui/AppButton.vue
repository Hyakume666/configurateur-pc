<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: false },
  as: { type: String, default: 'button' },
  to: { type: [String, Object], default: null },
  href: { type: String, default: null }
})

const emit = defineEmits(['click'])

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 ease-spring select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-400 hover:to-primary-500 shadow-glow-soft hover:shadow-neon-blue active:scale-[0.97]'
    case 'secondary':
      return 'bg-bg-700 text-text-primary border border-border-default hover:bg-bg-600 hover:border-primary-500/40 active:scale-[0.97]'
    case 'ghost':
      return 'text-text-secondary hover:text-text-primary hover:bg-bg-800 active:scale-[0.97]'
    case 'neon':
      return 'bg-bg-900 border border-neon-blue text-neon-blue hover:bg-neon-blue/10 hover:shadow-neon-blue active:scale-[0.97]'
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-500 active:scale-[0.97]'
    default:
      return ''
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm'
    case 'lg':
      return 'px-6 py-3 text-base sm:text-lg'
    case 'xl':
      return 'px-8 py-4 text-lg sm:text-xl'
    default:
      return 'px-4 py-2.5 text-sm sm:text-base'
  }
})

const computedTag = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return props.as
})

function handleClick(e) {
  if (props.disabled || props.loading) {
    e.preventDefault()
    return
  }
  emit('click', e)
}
</script>

<template>
  <component
    :is="computedTag"
    :type="computedTag === 'button' ? type : undefined"
    :to="to"
    :href="href"
    :disabled="disabled || loading"
    :class="[
      baseClasses,
      variantClasses,
      sizeClasses,
      fullWidth ? 'w-full' : ''
    ]"
    v-motion
    :hovered="{ scale: 1.04, transition: { type: 'spring', stiffness: 280, damping: 18 } }"
    :tapped="{ scale: 0.96 }"
    @click="handleClick"
  >
    <span v-if="loading" class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
    <slot />
  </component>
</template>
