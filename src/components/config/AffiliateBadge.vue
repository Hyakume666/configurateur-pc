<script setup>
import { ref } from 'vue'
import { ExternalLink } from 'lucide-vue-next'
import { useAffiliates } from '@/composables/useAffiliates'

const props = defineProps({
  retailer: { type: Object, required: true },
  component: { type: Object, required: true },
  configSlug: { type: String, default: null }
})

const { trackClick, buildAffiliateUrl } = useAffiliates()
const shaking = ref(false)

function handleClick() {
  trackClick(props.component.id, props.retailer.id, props.configSlug)
  shaking.value = true
  setTimeout(() => (shaking.value = false), 400)
}
</script>

<template>
  <a
    :href="buildAffiliateUrl(component, retailer)"
    target="_blank"
    rel="nofollow noopener sponsored"
    :class="[
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer',
      'border-border-default text-text-secondary hover:text-text-primary hover:border-primary-500/40 hover:bg-bg-700',
      shaking ? 'animate-shake' : ''
    ]"
    :style="{ '--retailer-color': retailer.color }"
    :title="`Acheter chez ${retailer.name}`"
    @click="handleClick"
  >
    <span
      class="inline-block w-2 h-2 rounded-full"
      :style="{ background: retailer.color }"
      aria-hidden="true"
    />
    {{ retailer.name }}
    <ExternalLink class="w-3 h-3 opacity-70" />
  </a>
</template>
