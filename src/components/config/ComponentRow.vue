<script setup>
import { computed } from 'vue'
import { Cpu, MemoryStick, HardDrive, CircuitBoard, Plug, Box, Wind, MonitorPlay } from 'lucide-vue-next'
import retailers from '@/data/retailers.json'
import AffiliateBadge from './AffiliateBadge.vue'
import { formatPriceCHF } from '@/composables/useToast'

const props = defineProps({
  component: { type: Object, required: true },
  configSlug: { type: String, default: null },
  index: { type: Number, default: 0 }
})

const iconMap = {
  cpu: Cpu,
  gpu: MonitorPlay,
  ram: MemoryStick,
  storage: HardDrive,
  motherboard: CircuitBoard,
  psu: Plug,
  case: Box,
  cooling: Wind
}

const typeLabel = {
  cpu: 'Processeur',
  gpu: 'Carte graphique',
  ram: 'Mémoire vive',
  storage: 'Stockage',
  motherboard: 'Carte mère',
  psu: 'Alimentation',
  case: 'Boîtier',
  cooling: 'Refroidissement'
}

const Icon = computed(() => iconMap[props.component.type] || Box)
</script>

<template>
  <tr
    v-motion
    :initial="{ opacity: 0, y: 12 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 280, delay: index * 60 } }"
    class="group border-b border-border-subtle/60 hover:bg-bg-700/40 transition-colors"
  >
    <td class="py-4 px-3 sm:px-4 align-top">
      <div class="flex items-center gap-3">
        <span class="w-9 h-9 rounded-lg bg-bg-700 text-primary-300 flex items-center justify-center group-hover:text-neon-blue group-hover:shadow-glow-soft transition">
          <component :is="Icon" class="w-4 h-4" />
        </span>
        <div class="text-xs uppercase tracking-wide text-text-muted font-semibold">
          {{ typeLabel[component.type] || component.type }}
        </div>
      </div>
    </td>
    <td class="py-4 px-3 sm:px-4 align-top">
      <div class="font-medium text-text-primary">{{ component.name }}</div>
      <div v-if="component.brand" class="text-xs text-text-muted">{{ component.brand }}</div>
    </td>
    <td class="py-4 px-3 sm:px-4 align-top text-right font-mono text-neon-blue text-sm whitespace-nowrap">
      {{ formatPriceCHF(component.price) }}
    </td>
    <td class="py-4 px-3 sm:px-4 align-top">
      <div class="flex flex-wrap gap-2 justify-end">
        <AffiliateBadge
          v-for="r in retailers"
          :key="r.id"
          :retailer="r"
          :component="component"
          :config-slug="configSlug"
        />
      </div>
    </td>
  </tr>
</template>
