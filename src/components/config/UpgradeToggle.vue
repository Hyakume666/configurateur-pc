<script setup>
import { computed } from 'vue'
import { Plus, Check } from 'lucide-vue-next'
import { formatPriceCHF } from '@/composables/useToast'

const props = defineProps({
  upgrade: { type: Object, required: true },
  active: { type: Boolean, default: false }
})

const emit = defineEmits(['toggle'])

const priceLabel = computed(() => `+${formatPriceCHF(props.upgrade.priceAdd)}`)
</script>

<template>
  <button
    type="button"
    :class="[
      'w-full flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 text-left cursor-pointer',
      active
        ? 'border-neon-blue bg-neon-blue/5 shadow-glow-soft'
        : 'border-border-subtle bg-bg-800 hover:border-primary-500/40 hover:bg-bg-700'
    ]"
    :aria-pressed="active"
    @click="emit('toggle', upgrade.id)"
  >
    <span
      :class="[
        'mt-0.5 inline-flex w-9 h-9 rounded-lg items-center justify-center transition-colors flex-shrink-0',
        active ? 'bg-neon-blue text-bg-950' : 'bg-bg-700 text-text-secondary'
      ]"
    >
      <Check v-if="active" class="w-4 h-4 stroke-[3]" />
      <Plus v-else class="w-4 h-4" />
    </span>
    <div class="flex-1 min-w-0">
      <div class="flex items-baseline justify-between gap-2">
        <h4 class="font-semibold text-text-primary">{{ upgrade.name }}</h4>
        <span
          v-motion
          :initial="{ scale: 0.8, opacity: 0 }"
          :visible="{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 280, damping: 18 } }"
          :class="[
            'text-sm font-mono font-semibold whitespace-nowrap',
            active ? 'text-neon-blue' : 'text-text-muted'
          ]"
        >
          {{ priceLabel }}
        </span>
      </div>
      <p v-if="upgrade.description" class="mt-1 text-sm text-text-muted">{{ upgrade.description }}</p>
    </div>
  </button>
</template>
