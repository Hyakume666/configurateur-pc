<script setup>
import { ref } from 'vue'
import {
  ArrowRight,
  Shield,
  Zap,
  MapPin,
  ListChecks,
  Sparkles,
  ShoppingCart,
  Wrench,
  Headset,
  Banknote,
  ChevronDown,
  Cpu
} from 'lucide-vue-next'
import { useHead } from '@vueuse/head'
import AppButton from '@/components/ui/AppButton.vue'
import ConfigCard from '@/components/config/ConfigCard.vue'
import { useConfigs } from '@/composables/useConfigs'

const SITE_URL = 'https://pc.loicbarthoulot.ch'

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Loïc.config',
  description: 'Configurateur et assembleur de PC gaming sur mesure en Suisse romande',
  url: SITE_URL,
  email: 'contact@loicbarthoulot.ch',
  areaServed: { '@type': 'AdministrativeArea', name: 'Suisse romande' },
  founder: { '@type': 'Person', name: 'Loïc Barthoulot' },
  priceRange: 'CHF 690 – 5 650'
}

useHead({
  title: 'Configurateur PC Gaming Suisse | Loïc Barthoulot',
  link: [{ rel: 'canonical', href: SITE_URL }],
  meta: [
    {
      name: 'description',
      content:
        'Configurateur PC Gaming sur mesure en Suisse romande. Répondez à 5 questions, obtenez la configuration idéale, assemblage professionnel inclus.'
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: SITE_URL },
    { property: 'og:title', content: 'Configurateur PC Gaming Suisse | Loïc Barthoulot' },
    { property: 'og:description', content: 'Trouvez votre PC gaming parfait en 5 questions. Assemblé en Suisse romande.' },
    { property: 'og:site_name', content: 'Loïc.config' },
    { property: 'og:locale', content: 'fr_CH' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(orgJsonLd)
    }
  ]
})

const { popular } = useConfigs()

const trustBadges = [
  { icon: Shield, label: 'Garantie composants' },
  { icon: Zap, label: 'Assemblage pro' },
  { icon: MapPin, label: 'Livraison Suisse' }
]

const steps = [
  {
    icon: ListChecks,
    title: 'Répondez à 5 questions',
    description: 'Usage, budget, niveau, priorité — moins de 2 minutes.'
  },
  {
    icon: Sparkles,
    title: 'Découvrez votre config',
    description: 'Nos algorithmes vous proposent les 3 meilleures options.'
  },
  {
    icon: ShoppingCart,
    title: 'Commandez avec Loïc',
    description: 'Devis personnalisé, assemblage pro, livraison Suisse romande.'
  }
]

const trustTiles = [
  { icon: Wrench, title: 'Assemblage professionnel', desc: 'Cable management, tests stress, OS prêt à booter.' },
  { icon: Shield, title: 'Composants garantis', desc: 'Garantie constructeur sur chaque pièce, neuves uniquement.' },
  { icon: Headset, title: 'Support 3 mois inclus', desc: 'Aide technique gratuite après la livraison.' },
  { icon: Banknote, title: 'Prix Swiss market', desc: 'Tarifs alignés Digitec, sans marge cachée.' }
]

const faq = [
  { q: "Quels sont les délais d'assemblage ?", a: "3 à 5 jours ouvrés à compter de la réception des composants." },
  { q: "Puis-je fournir mes propres composants ?", a: "Oui, devis personnalisé selon les pièces fournies et celles à compléter." },
  { q: "Y a-t-il une garantie ?", a: "Garantie constructeur sur chaque composant + 3 mois de support technique inclus." },
  { q: "Livrez-vous hors de Neuchâtel ?", a: "Oui, dans toute la Suisse romande. Livraison hors Suisse romande sur devis." },
  { q: "Comment passer commande ?", a: "Choisissez une configuration, cliquez sur \"Je veux cette configuration\" et remplissez le formulaire." }
]

const openFaq = ref(null)
function toggle(i) {
  openFaq.value = openFaq.value === i ? null : i
}
</script>

<template>
  <div class="min-h-screen">
    <!-- HERO -->
    <section class="relative min-h-screen flex items-center overflow-hidden">
      <div class="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div class="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-neon-blue rounded-full animate-particles-drift" />
        <div class="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-neon-violet rounded-full animate-particles-drift" style="animation-delay: -3s" />
        <div class="absolute bottom-1/4 left-1/2 w-1 h-1 bg-neon-pink rounded-full animate-particles-drift" style="animation-delay: -6s" />
        <div class="absolute top-2/3 right-1/4 w-2 h-2 bg-neon-blue rounded-full animate-particles-drift" style="animation-delay: -9s" />
      </div>

      <div class="container-page relative z-10 py-20 sm:py-28">
        <div
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          class="max-w-4xl"
        >
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-xs font-medium text-neon-blue mb-6">
            <Cpu class="w-3.5 h-3.5" />
            Configurateur PC Suisse romande
          </div>

          <h1 class="heading-display text-4xl sm:text-5xl lg:text-7xl text-text-primary leading-[1.05] mb-5">
            Votre PC Gaming
            <span class="block text-gradient-neon">sur mesure,</span>
            assemblé en Suisse romande
          </h1>

          <p class="text-lg sm:text-xl text-text-secondary max-w-2xl mb-8">
            Répondez à 5 questions et découvrez la configuration parfaite pour vous.
            Composants premium, montage professionnel, prix Swiss market.
          </p>

          <div class="flex flex-wrap gap-3 mb-10">
            <AppButton :to="{ name: 'quiz' }" variant="primary" size="xl">
              Configurer mon PC
              <ArrowRight class="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </AppButton>
            <AppButton :to="{ name: 'configs' }" variant="ghost" size="xl">
              Voir toutes les configs
            </AppButton>
          </div>

          <div class="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-text-muted">
            <div
              v-for="(b, i) in trustBadges"
              :key="i"
              class="inline-flex items-center gap-2"
            >
              <component :is="b.icon" class="w-4 h-4 text-neon-blue" />
              <span>{{ b.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="absolute bottom-6 left-1/2 -translate-x-1/2 text-text-muted hover:text-neon-blue transition cursor-pointer"
        aria-label="Faire défiler"
        @click="$refs.howSection?.scrollIntoView({ behavior: 'smooth' })"
      >
        <ChevronDown class="w-7 h-7 animate-bounce" />
      </button>
    </section>

    <!-- HOW IT WORKS -->
    <section ref="howSection" class="py-20 sm:py-28 relative">
      <div class="container-page">
        <header class="text-center max-w-2xl mx-auto mb-14">
          <span class="text-xs uppercase tracking-widest text-neon-blue font-semibold">Comment ça marche</span>
          <h2 class="heading-display text-3xl sm:text-4xl text-text-primary mt-2">
            3 étapes vers votre PC idéal
          </h2>
        </header>

        <div class="relative grid md:grid-cols-3 gap-8 lg:gap-6">
          <div class="hidden md:block absolute top-8 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-primary-500/0 via-primary-500/40 to-primary-500/0" />
          <div
            v-for="(s, i) in steps"
            :key="i"
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: i * 120 } }"
            class="relative text-center"
          >
            <div class="relative inline-flex w-16 h-16 mx-auto items-center justify-center rounded-2xl bg-bg-800 border border-primary-500/30 text-neon-blue mb-4 shadow-glow-soft">
              <component :is="s.icon" class="w-7 h-7" />
              <span class="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-neon-violet text-white text-xs font-bold flex items-center justify-center font-mono">
                {{ i + 1 }}
              </span>
            </div>
            <h3 class="heading-display text-xl text-text-primary mb-2">{{ s.title }}</h3>
            <p class="text-sm text-text-muted max-w-xs mx-auto">{{ s.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- POPULAR CONFIGS -->
    <section class="py-20 sm:py-24 bg-bg-900/40 relative">
      <div class="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div class="container-page relative">
        <header class="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <span class="text-xs uppercase tracking-widest text-neon-violet font-semibold">Configs populaires</span>
            <h2 class="heading-display text-3xl sm:text-4xl text-text-primary mt-2">
              Nos configurations stars
            </h2>
          </div>
          <AppButton :to="{ name: 'configs' }" variant="ghost">
            Voir toutes les configurations
            <ArrowRight class="w-4 h-4" />
          </AppButton>
        </header>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <ConfigCard
            v-for="(c, i) in popular"
            :key="c.id"
            :config="c"
            :index="i"
          />
        </div>
      </div>
    </section>

    <!-- WHY US -->
    <section class="py-20 sm:py-24">
      <div class="container-page">
        <header class="text-center max-w-2xl mx-auto mb-14">
          <span class="text-xs uppercase tracking-widest text-neon-blue font-semibold">Pourquoi nous</span>
          <h2 class="heading-display text-3xl sm:text-4xl text-text-primary mt-2">
            Un service premium, sans détour
          </h2>
        </header>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="(t, i) in trustTiles"
            :key="i"
            v-motion
            :initial="{ opacity: 0, y: 24 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 380, delay: i * 80 } }"
            class="group p-6 rounded-2xl bg-bg-800 border border-border-subtle hover:border-primary-500/40 hover:shadow-glow-soft transition-all duration-200"
          >
            <div class="w-12 h-12 rounded-xl bg-primary-500/10 text-neon-blue flex items-center justify-center mb-4 group-hover:bg-primary-500/15 transition">
              <component :is="t.icon" class="w-6 h-6" />
            </div>
            <h3 class="font-semibold text-text-primary mb-1.5">{{ t.title }}</h3>
            <p class="text-sm text-text-muted">{{ t.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-20 sm:py-24 bg-bg-900/40">
      <div class="container-page max-w-3xl">
        <header class="text-center mb-10">
          <span class="text-xs uppercase tracking-widest text-neon-pink font-semibold">FAQ</span>
          <h2 class="heading-display text-3xl sm:text-4xl text-text-primary mt-2">
            Questions fréquentes
          </h2>
        </header>

        <div class="space-y-3">
          <div
            v-for="(item, i) in faq"
            :key="i"
            class="rounded-xl bg-bg-800 border border-border-subtle overflow-hidden"
          >
            <button
              type="button"
              class="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-bg-700/50 transition cursor-pointer"
              :aria-expanded="openFaq === i"
              @click="toggle(i)"
            >
              <span class="font-medium text-text-primary">{{ item.q }}</span>
              <ChevronDown
                :class="[
                  'w-5 h-5 text-neon-blue flex-shrink-0 transition-transform duration-200',
                  openFaq === i ? 'rotate-180' : ''
                ]"
              />
            </button>
            <Transition name="faq">
              <div v-if="openFaq === i" class="px-5 pb-4 text-sm text-text-secondary border-t border-border-subtle pt-3">
                {{ item.a }}
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA FOOTER -->
    <section class="py-20 sm:py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-neon-violet/10 pointer-events-none" />
      <div class="container-page relative text-center max-w-2xl">
        <h2 class="heading-display text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-4">
          Prêt à <span class="text-gradient-neon">configurer</span> ?
        </h2>
        <p class="text-text-secondary mb-8">
          Quiz rapide, 5 questions, recommandation instantanée.
        </p>
        <AppButton :to="{ name: 'quiz' }" variant="neon" size="xl">
          Lancer le quiz
          <ArrowRight class="w-5 h-5" />
        </AppButton>
      </div>
    </section>
  </div>
</template>

<style scoped>
.faq-enter-active, .faq-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.faq-enter-from, .faq-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.faq-enter-to, .faq-leave-from {
  opacity: 1;
  max-height: 300px;
}
</style>
