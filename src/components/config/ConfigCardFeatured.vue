<script setup>
import { computed } from 'vue'
import { ArrowRight, Check, Sparkles } from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import PerformanceBars from './PerformanceBars.vue'
import { formatPriceCHF } from '@/composables/useToast'

const props = defineProps({
  config: { type: Object, required: true },
  reasons: { type: Array, default: () => [] }
})

const total = computed(() => props.config.totalPrice + props.config.assemblyFee)
</script>

<template>
  <article
    v-motion
    :initial="{ opacity: 0, scale: 0.92, y: 20 }"
    :enter="{
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 200, damping: 18, delay: 100 }
    }"
    class="relative bg-gradient-to-br from-bg-800 via-bg-800 to-bg-900 rounded-3xl p-6 sm:p-8 glow-border shadow-neon-blue overflow-hidden"
  >
    <div class="absolute -top-20 -right-20 w-64 h-64 bg-neon-blue/15 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-neon-violet/10 rounded-full blur-3xl pointer-events-none" />

    <div class="relative">
      <div class="flex flex-wrap items-center gap-2 mb-3">
        <AppBadge variant="value" class="!text-sm">
          <Sparkles class="w-3.5 h-3.5" />
          Recommandé pour vous
        </AppBadge>
        <AppBadge v-if="config.badge" variant="popular">{{ config.badge }}</AppBadge>
      </div>

      <h2 class="heading-display text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-2">
        {{ config.name }}
      </h2>
      <p class="text-base sm:text-lg text-text-secondary max-w-2xl">{{ config.tagline }}</p>

      <div class="mt-6 grid lg:grid-cols-2 gap-6 items-end">
        <div>
          <div class="text-sm text-text-muted mb-1">Prix total tout compris</div>
          <div class="text-4xl sm:text-5xl font-bold text-gradient-neon font-mono">
            {{ formatPriceCHF(total) }}
          </div>
          <div class="mt-1 text-xs text-text-dim font-mono">
            Composants {{ formatPriceCHF(config.totalPrice) }} + Montage pro {{ formatPriceCHF(config.assemblyFee) }}
          </div>
        </div>
        <PerformanceBars :scores="config.performanceScore" />
      </div>

      <ul v-if="reasons.length" class="mt-6 flex flex-wrap gap-2">
        <li
          v-for="(r, i) in reasons.slice(0, 3)"
          :key="i"
          class="inline-flex items-center gap-1.5 text-xs text-neon-blue bg-neon-blue/10 border border-neon-blue/30 rounded-full px-3 py-1"
        >
          <Check class="w-3 h-3" />
          {{ r }}
        </li>
      </ul>

      <ul v-if="config.pros?.length" class="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-2">
        <li
          v-for="(p, i) in config.pros"
          :key="i"
          class="flex items-start gap-2 text-sm text-text-secondary"
        >
          <Check class="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />
          <span>{{ p }}</span>
        </li>
      </ul>

      <div class="mt-8 flex flex-wrap gap-3">
        <AppButton
          :to="{ name: 'config-detail', params: { slug: config.slug } }"
          variant="primary"
          size="lg"
        >
          Découvrir cette configuration
          <ArrowRight class="w-5 h-5" />
        </AppButton>
      </div>
    </div>
  </article>
</template>
