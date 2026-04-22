<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { GitCompare, X, Trash2 } from 'lucide-vue-next'
import { useCompareStore } from '@/stores/compareStore'
import { useConfigs } from '@/composables/useConfigs'
import AppButton from '@/components/ui/AppButton.vue'
import { formatPriceCHF } from '@/composables/useToast'

const compare = useCompareStore()
const { getConfig } = useConfigs()
const router = useRouter()

const items = computed(() =>
  compare.slugs.map((slug) => getConfig(slug)).filter(Boolean)
)

function go() {
  router.push({ name: 'compare' })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="tray">
      <div
        v-if="items.length"
        class="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:bottom-4 sm:max-w-md z-30"
      >
        <div class="glass border border-primary-500/30 rounded-2xl shadow-glow-soft p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-text-primary text-sm inline-flex items-center gap-2">
              <GitCompare class="w-4 h-4 text-neon-blue" />
              Comparer ({{ items.length }}/{{ compare.max }})
            </h3>
            <button
              type="button"
              class="text-text-muted hover:text-text-primary inline-flex items-center gap-1 text-xs cursor-pointer"
              aria-label="Vider la liste de comparaison"
              @click="compare.clear()"
            >
              <Trash2 class="w-3.5 h-3.5" />
              Vider
            </button>
          </div>

          <ul class="space-y-1.5 mb-3">
            <li
              v-for="c in items"
              :key="c.slug"
              class="flex items-center gap-2 text-sm bg-bg-900/60 rounded-lg px-3 py-2"
            >
              <span class="flex-1 min-w-0">
                <span class="block truncate text-text-primary font-medium">{{ c.name }}</span>
                <span class="block text-xs text-text-muted font-mono">
                  {{ formatPriceCHF(c.totalPrice + c.assemblyFee) }}
                </span>
              </span>
              <button
                type="button"
                class="text-text-muted hover:text-red-400 transition cursor-pointer"
                :aria-label="`Retirer ${c.name}`"
                @click="compare.remove(c.slug)"
              >
                <X class="w-4 h-4" />
              </button>
            </li>
          </ul>

          <AppButton
            variant="primary"
            size="sm"
            full-width
            :disabled="items.length < 2"
            @click="go"
          >
            <GitCompare class="w-4 h-4" />
            {{ items.length < 2 ? 'Sélectionnez au moins 2 configs' : 'Voir la comparaison' }}
          </AppButton>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.tray-enter-active, .tray-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.tray-enter-from, .tray-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
