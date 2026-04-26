<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { ChevronLeft, ShoppingBag, Check, X, Gamepad2 } from 'lucide-vue-next'
import { useConfigs } from '@/composables/useConfigs'
import { useConfigStore } from '@/stores/configStore'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AnimatedPrice from '@/components/ui/AnimatedPrice.vue'
import PerformanceRadar from '@/components/config/PerformanceRadar.vue'
import ComponentRow from '@/components/config/ComponentRow.vue'
import UpgradeToggle from '@/components/config/UpgradeToggle.vue'
import LeadForm from '@/components/lead/LeadForm.vue'
import { formatPriceCHF } from '@/composables/useToast'

const props = defineProps({
  slug: { type: String, required: true }
})

const router = useRouter()
const { getConfig, getComponents, computeTotal } = useConfigs()
const configStore = useConfigStore()

const config = computed(() => getConfig(props.slug))
const components = computed(() => getComponents(config.value))

const selectedUpgrades = ref([])
const showLeadModal = ref(false)

const total = computed(() => computeTotal(config.value, selectedUpgrades.value))
const upgradeAdd = computed(() =>
  total.value - (config.value.totalPrice + config.value.assemblyFee)
)

const SITE_URL = 'https://pc.loicbarthoulot.ch'

const productJsonLd = computed(() => {
  if (!config.value) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: config.value.name,
    description: config.value.tagline,
    brand: { '@type': 'Brand', name: 'Loïc.config' },
    sku: config.value.id,
    category: 'PC Gaming sur mesure',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CHF',
      price: config.value.totalPrice + config.value.assemblyFee,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Person', name: 'Loïc Barthoulot' },
      url: `${SITE_URL}/config/${config.value.slug}`
    }
  }
})

const breadcrumbJsonLd = computed(() => {
  if (!config.value) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: SITE_URL
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Configurations',
        item: `${SITE_URL}/configs`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: config.value.name,
        item: `${SITE_URL}/config/${config.value.slug}`
      }
    ]
  }
})

useHead({
  title: () => (config.value ? `${config.value.name} — ${config.value.tagline}` : 'Configuration'),
  link: [
    { rel: 'canonical', href: () => `${SITE_URL}/config/${props.slug}` }
  ],
  meta: [
    { name: 'description', content: () => config.value?.tagline || 'Configuration PC sur mesure' },
    { property: 'og:type', content: 'product' },
    { property: 'og:url', content: () => `${SITE_URL}/config/${props.slug}` },
    { property: 'og:title', content: () => config.value?.name || 'Configuration' },
    { property: 'og:description', content: () => config.value?.tagline || '' },
    { property: 'og:site_name', content: 'Loïc.config' },
    { property: 'og:locale', content: 'fr_CH' },
    { property: 'og:image', content: () => `${SITE_URL}/og/${props.slug}.svg` },
    { property: 'og:image:type', content: 'image/svg+xml' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: () => config.value?.name || 'Configuration' },
    { name: 'twitter:description', content: () => config.value?.tagline || '' },
    { name: 'twitter:image', content: () => `${SITE_URL}/og/${props.slug}.svg` }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: () => JSON.stringify(productJsonLd.value)
    },
    {
      type: 'application/ld+json',
      children: () => JSON.stringify(breadcrumbJsonLd.value)
    }
  ]
})

onMounted(() => {
  if (!config.value) {
    router.replace({ name: 'not-found' })
    return
  }
  configStore.trackConfigView(props.slug)
})

function toggleUpgrade(id) {
  if (selectedUpgrades.value.includes(id)) {
    selectedUpgrades.value = selectedUpgrades.value.filter((u) => u !== id)
  } else {
    selectedUpgrades.value = [...selectedUpgrades.value, id]
  }
}
</script>

<template>
  <div v-if="config" class="min-h-screen pb-20">
    <!-- HERO -->
    <section class="relative pt-12 sm:pt-20 pb-12 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-hero opacity-70 pointer-events-none" />
      <div class="container-page relative">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-neon-blue transition mb-6 cursor-pointer"
          @click="router.back()"
        >
          <ChevronLeft class="w-4 h-4" />
          Retour
        </button>

        <div class="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-3">
              <AppBadge v-if="config.badge" variant="popular">{{ config.badge }}</AppBadge>
              <AppBadge variant="muted">
                {{ config.tier === 'budget' ? 'Entrée' : config.tier === 'mid' ? 'Mid range' : config.tier === 'high' ? 'Haut de gamme' : 'Extrême' }}
              </AppBadge>
            </div>
            <h1 class="heading-display text-4xl sm:text-5xl lg:text-6xl text-text-primary mb-4">
              {{ config.name }}
            </h1>
            <p class="text-lg text-text-secondary mb-6 max-w-xl">{{ config.tagline }}</p>

            <AppCard padding="md">
              <div class="space-y-2 text-sm">
                <div class="flex items-center justify-between">
                  <span class="text-text-muted">Composants</span>
                  <span class="font-mono text-text-secondary">{{ formatPriceCHF(config.totalPrice) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-text-muted">Montage professionnel</span>
                  <span class="font-mono text-text-secondary">{{ formatPriceCHF(config.assemblyFee) }}</span>
                </div>
                <div v-if="upgradeAdd > 0" class="flex items-center justify-between text-neon-blue">
                  <span>Options sélectionnées</span>
                  <span class="font-mono">+{{ formatPriceCHF(upgradeAdd) }}</span>
                </div>
                <div class="border-t border-border-subtle pt-3 mt-3 flex items-center justify-between">
                  <span class="font-semibold text-text-primary">Total</span>
                  <span class="text-2xl font-bold text-gradient-neon font-mono">
                    <AnimatedPrice :value="total" />
                  </span>
                </div>
              </div>

              <AppButton
                class="mt-5"
                variant="primary"
                size="lg"
                full-width
                @click="showLeadModal = true"
              >
                <ShoppingBag class="w-5 h-5" />
                Je veux cette configuration
              </AppButton>
            </AppCard>
          </div>

          <AppCard glow padding="md">
            <h3 class="text-sm uppercase tracking-wider text-neon-blue font-semibold mb-1">
              Profil de performance
            </h3>
            <p class="text-xs text-text-muted mb-3">Scores 0–100 par catégorie</p>
            <PerformanceRadar :scores="config.performanceScore" />
          </AppCard>
        </div>
      </div>
    </section>

    <!-- COMPONENTS -->
    <section class="py-12">
      <div class="container-page">
        <header class="mb-6">
          <h2 class="heading-display text-2xl sm:text-3xl text-text-primary">Composants</h2>
          <p class="text-sm text-text-muted">Cliquez sur un revendeur pour acheter directement.</p>
        </header>

        <AppCard padding="sm" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-xs uppercase tracking-wide text-text-muted border-b border-border-subtle">
                <th class="text-left py-3 px-3 sm:px-4 font-semibold">Type</th>
                <th class="text-left py-3 px-3 sm:px-4 font-semibold">Composant</th>
                <th class="text-right py-3 px-3 sm:px-4 font-semibold">Prix</th>
                <th class="text-right py-3 px-3 sm:px-4 font-semibold">Acheter chez</th>
              </tr>
            </thead>
            <tbody>
              <ComponentRow
                v-for="(c, i) in components"
                :key="c.id"
                :component="c"
                :config-slug="config.slug"
                :index="i"
              />
            </tbody>
          </table>
        </AppCard>
      </div>
    </section>

    <!-- GAMES -->
    <section v-if="config.targetGames?.length" class="py-12 bg-bg-900/40">
      <div class="container-page">
        <header class="mb-6">
          <h2 class="heading-display text-2xl sm:text-3xl text-text-primary">
            <Gamepad2 class="inline-block w-7 h-7 text-neon-violet mr-2 -mt-1" />
            Performances en jeu
          </h2>
          <p class="text-sm text-text-muted">FPS et qualité attendus sur les titres clés.</p>
        </header>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(g, i) in config.targetGames"
            :key="i"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 380, delay: i * 80 } }"
            class="relative p-5 rounded-2xl bg-bg-800 border border-border-subtle hover:border-neon-violet/40 transition overflow-hidden"
          >
            <div class="absolute -top-12 -right-12 w-32 h-32 bg-neon-violet/10 rounded-full blur-2xl" />
            <div class="relative">
              <h3 class="font-semibold text-text-primary mb-3">{{ g.name }}</h3>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs px-2 py-0.5 rounded bg-neon-blue/15 text-neon-blue font-mono font-semibold">
                  {{ g.fps }}
                </span>
              </div>
              <p class="text-xs text-text-muted">{{ g.settings }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PROS / CONS -->
    <section v-if="config.pros?.length || config.cons?.length" class="py-12">
      <div class="container-page">
        <div class="grid md:grid-cols-2 gap-5">
          <AppCard v-if="config.pros?.length">
            <h3 class="font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-neon-green/15 text-neon-green flex items-center justify-center">
                <Check class="w-4 h-4" />
              </span>
              Points forts
            </h3>
            <ul class="space-y-2">
              <li
                v-for="(p, i) in config.pros"
                :key="i"
                class="flex items-start gap-2 text-sm text-text-secondary"
              >
                <Check class="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />
                <span>{{ p }}</span>
              </li>
            </ul>
          </AppCard>

          <AppCard v-if="config.cons?.length">
            <h3 class="font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center">
                <X class="w-4 h-4" />
              </span>
              À considérer
            </h3>
            <ul class="space-y-2">
              <li
                v-for="(c, i) in config.cons"
                :key="i"
                class="flex items-start gap-2 text-sm text-text-secondary"
              >
                <X class="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <span>{{ c }}</span>
              </li>
            </ul>
          </AppCard>
        </div>
      </div>
    </section>

    <!-- UPGRADES -->
    <section v-if="config.upgrades?.length" class="py-12 bg-bg-900/40">
      <div class="container-page max-w-4xl">
        <header class="mb-6">
          <h2 class="heading-display text-2xl sm:text-3xl text-text-primary">Personnaliser cette config</h2>
          <p class="text-sm text-text-muted">Améliorations optionnelles, prix mis à jour en temps réel.</p>
        </header>

        <div class="space-y-3">
          <UpgradeToggle
            v-for="u in config.upgrades"
            :key="u.id"
            :upgrade="u"
            :active="selectedUpgrades.includes(u.id)"
            @toggle="toggleUpgrade"
          />
        </div>

        <div class="mt-8 flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-bg-800 border border-border-default">
          <div>
            <div class="text-xs uppercase tracking-wide text-text-muted">Total avec options</div>
            <div class="text-3xl font-bold text-gradient-neon font-mono">
              <AnimatedPrice :value="total" />
            </div>
          </div>
          <AppButton variant="primary" size="lg" @click="showLeadModal = true">
            Demander un devis avec ces options
          </AppButton>
        </div>
      </div>
    </section>

    <!-- LEAD MODAL -->
    <AppModal
      :open="showLeadModal"
      title="Demander cette configuration"
      size="lg"
      @close="showLeadModal = false"
    >
      <LeadForm
        :config="config"
        :selected-upgrades="selectedUpgrades"
        @close="showLeadModal = false"
      />
    </AppModal>
  </div>
</template>
