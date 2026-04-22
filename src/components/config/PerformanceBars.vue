<script setup>
import ProgressBar from '@/components/ui/ProgressBar.vue'

defineProps({
  scores: { type: Object, required: true },
  compact: { type: Boolean, default: false }
})

const fields = [
  { key: 'gaming', label: 'Gaming', color: 'blue' },
  { key: 'creation', label: 'Création', color: 'violet' },
  { key: 'office', label: 'Bureautique', color: 'green' }
]
</script>

<template>
  <div :class="['flex flex-col', compact ? 'gap-2' : 'gap-3']">
    <ProgressBar
      v-for="(f, i) in fields"
      :key="f.key"
      :value="scores[f.key] || 0"
      :label="f.label"
      :color="f.color"
      :delay="i * 120"
    />
  </div>
</template>
