<script setup>
defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '1rem' },
  rounded: { type: String, default: 'md' }
})
</script>

<template>
  <div
    :class="[
      'skeleton',
      rounded === 'full' ? 'rounded-full' : rounded === 'lg' ? 'rounded-lg' : 'rounded-md'
    ]"
    :style="{ width, height }"
    aria-hidden="true"
  />
</template>
