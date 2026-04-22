<script setup>
import { computed } from 'vue'
import { ArrowRight, Check, GitCompare } from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import PerformanceBars from './PerformanceBars.vue'
import { formatPriceCHF } from '@/composables/useToast'
import { useCompareStore } from '@/stores/compareStore'

const props = defineProps({
  config: { type: Object, required: true },
  index: { type: Number, default: 0 },
  compact: { type: Boolean, default: false }
})

const compare = useCompareStore()
const inCompare = computed(() => compare.has(props.config.slug))
const cantAdd = computed(() => !inCompare.value && compare.isFull)

const total = computed(() => props.config.totalPrice + props.config.assemblyFee)

const badgeVariant = computed(() => {
  if (!props.config.badge) return 'muted'
  if (props.config.badge.includes('Q/P')) return 'value'
  if (props.config.badge.includes('Top')) return 'popular'
  if (props.config.badge.includes('Nouveau')) return 'new'
  return 'value'
})
</script>

<template>
  <article
    v-motion
    :initial="{ opacity: 0, y: 28 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 380, delay: index * 80 } }"
    class="relative flex flex-col h-full bg-bg-800 border border-border-subtle rounded-2xl p-6 transition-all duration-200 hover:border-primary-500/40 hover:shadow-glow-soft"
  >
    <header class="mb-4">
      <div class="flex items-start justify-between gap-2 mb-2">
        <span class="text-xs uppercase tracking-wider text-text-muted font-semibold">
          {{ config.tier === 'budget' ? 'Entrée' : config.tier === 'mid' ? 'Mid' : config.tier === 'high' ? 'Haut de gamme' : 'Extrême' }}
        </span>
        <AppBadge v-if="config.badge" :variant="badgeVariant">
          {{ config.badge }}
        </AppBadge>
      </div>
      <h3 class="heading-display text-xl sm:text-2xl text-text-primary">{{ config.name }}</h3>
      <p class="mt-1 text-sm text-text-muted line-clamp-2">{{ config.tagline }}</p>
    </header>

    <div class="mb-5">
      <div class="flex items-end justify-between mb-1">
        <span class="text-xs text-text-muted">Total tout compris</span>
        <span class="text-2xl font-bold text-gradient-neon font-mono">
          {{ formatPriceCHF(total) }}
        </span>
      </div>
      <div class="text-[11px] text-text-dim font-mono">
        Composants {{ formatPriceCHF(config.totalPrice) }} + Montage {{ formatPriceCHF(config.assemblyFee) }}
      </div>
    </div>

    <div class="mb-5 flex-1">
      <PerformanceBars :scores="config.performanceScore" compact />
    </div>

    <ul v-if="config.pros?.length && !compact" class="mb-5 space-y-1.5">
      <li
        v-for="(p, i) in config.pros.slice(0, 2)"
        :key="i"
        class="flex items-start gap-2 text-xs text-text-secondary"
      >
        <Check class="w-3.5 h-3.5 text-neon-green flex-shrink-0 mt-0.5" />
        <span>{{ p }}</span>
      </li>
    </ul>

    <div class="flex items-center gap-2">
      <AppButton
        :to="{ name: 'config-detail', params: { slug: config.slug } }"
        variant="secondary"
        class="flex-1"
      >
        Détails
        <ArrowRight class="w-4 h-4" />
      </AppButton>
      <button
        type="button"
        :class="[
          'p-2.5 rounded-lg border transition cursor-pointer',
          inCompare
            ? 'bg-neon-blue/15 border-neon-blue text-neon-blue'
            : 'bg-bg-700 border-border-subtle text-text-secondary hover:border-primary-500/40',
          cantAdd ? 'opacity-50 cursor-not-allowed' : ''
        ]"
        :disabled="cantAdd"
        :aria-pressed="inCompare"
        :aria-label="inCompare ? 'Retirer du comparateur' : 'Ajouter au comparateur'"
        :title="cantAdd ? 'Maximum 3 configurations' : inCompare ? 'Retirer du comparateur' : 'Ajouter au comparateur'"
        @click="compare.toggle(config.slug)"
      >
        <GitCompare class="w-4 h-4" />
      </button>
    </div>
  </article>
</template>
