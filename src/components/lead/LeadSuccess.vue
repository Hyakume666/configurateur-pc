<script setup>
import { CheckCircle2 } from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'

defineProps({
  configName: { type: String, default: '' }
})

const emit = defineEmits(['close'])
</script>

<template>
  <div class="text-center py-6">
    <div
      v-motion
      :initial="{ scale: 0, rotate: -90 }"
      :enter="{
        scale: 1,
        rotate: 0,
        transition: { type: 'spring', stiffness: 200, damping: 14 }
      }"
      class="mx-auto mb-5 w-16 h-16 rounded-full bg-neon-green/15 text-neon-green flex items-center justify-center shadow-glow-soft"
    >
      <CheckCircle2 class="w-9 h-9" />
    </div>
    <h3 class="heading-display text-2xl text-text-primary mb-2">Demande envoyée !</h3>
    <p class="text-text-secondary max-w-md mx-auto">
      Merci pour votre intérêt pour la configuration
      <span class="text-neon-blue font-semibold">{{ configName }}</span>.
      Je vous répondrai sous 24–48h ouvrés.
    </p>
    <AppButton class="mt-6" variant="secondary" @click="emit('close')">Fermer</AppButton>
  </div>
</template>
