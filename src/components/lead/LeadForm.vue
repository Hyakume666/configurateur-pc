<script setup>
import { ref, reactive, computed } from 'vue'
import { Mail, Phone, User, MessageSquare, AlertCircle } from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'
import LeadSuccess from './LeadSuccess.vue'
import { formatPriceCHF } from '@/composables/useToast'

const props = defineProps({
  config: { type: Object, required: true },
  selectedUpgrades: { type: Array, default: () => [] }
})

const emit = defineEmits(['close'])

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
  wantsSourcing: false,
  hasSomeComponents: false,
  excludedTypes: [],
  // honeypot — must stay empty; bots auto-fill
  website: ''
})

const formStartedAt = Date.now()
const MIN_FILL_MS = 2500

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,24}$/
const NAME_RE = /^[\p{L}\p{M}'\- ]{1,60}$/u
const PHONE_RE = /^[+\d\s().-]{6,30}$/

// Endpoint for the lead proxy. Default is Cloudflare Pages Function at /api/lead.
// Set VITE_LEAD_API_URL='' to force demo mode (no network call).
const LEAD_API_URL = import.meta.env.VITE_LEAD_API_URL ?? '/api/lead'

function stripCtrl(s = '') {
  return String(s).replace(/[\r\n\t\0]/g, ' ').trim()
}

const componentTypes = [
  { id: 'cpu', label: 'Processeur' },
  { id: 'gpu', label: 'Carte graphique' },
  { id: 'ram', label: 'Mémoire vive' },
  { id: 'storage', label: 'Stockage' },
  { id: 'motherboard', label: 'Carte mère' },
  { id: 'psu', label: 'Alimentation' },
  { id: 'case', label: 'Boîtier' }
]

const status = ref('idle')
const error = ref(null)

const selectedUpgradesDetails = computed(() => {
  if (!props.config?.upgrades) return []
  return props.config.upgrades.filter((u) => props.selectedUpgrades.includes(u.id))
})

const totalWithUpgrades = computed(() => {
  let t = props.config.totalPrice + props.config.assemblyFee
  selectedUpgradesDetails.value.forEach((u) => (t += u.priceAdd))
  return t
})

const isValid = computed(() => {
  const first = stripCtrl(form.firstName)
  const last = stripCtrl(form.lastName)
  const email = stripCtrl(form.email)
  if (!NAME_RE.test(first) || !NAME_RE.test(last)) return false
  if (!EMAIL_RE.test(email)) return false
  if (form.phone && !PHONE_RE.test(stripCtrl(form.phone))) return false
  return true
})

async function submit() {
  if (!isValid.value || status.value === 'loading') return

  // Honeypot — bots fill hidden fields. Fake success, no network call.
  if (form.website) {
    status.value = 'success'
    return
  }

  // Anti-bot timing — humans need > MIN_FILL_MS to fill the form.
  if (Date.now() - formStartedAt < MIN_FILL_MS) {
    status.value = 'success'
    return
  }

  status.value = 'loading'
  error.value = null

  const payload = {
    firstName: stripCtrl(form.firstName),
    lastName: stripCtrl(form.lastName),
    email: stripCtrl(form.email),
    phone: form.phone ? stripCtrl(form.phone) : '',
    message: form.message || '',
    wantsSourcing: !!form.wantsSourcing,
    excludedTypes: form.hasSomeComponents ? form.excludedTypes : [],
    configSlug: props.config.slug,
    configName: props.config.name,
    totalPrice: totalWithUpgrades.value,
    upgrades: selectedUpgradesDetails.value.map((u) => ({
      id: u.id,
      name: u.name,
      priceAdd: u.priceAdd
    })),
    website: form.website // honeypot relayed; server also rejects if filled
  }

  // Demo mode: empty endpoint => simulate success.
  if (!LEAD_API_URL) {
    console.warn('[LeadForm] VITE_LEAD_API_URL vide — mode démo, soumission simulée.')
    setTimeout(() => (status.value = 'success'), 600)
    return
  }

  try {
    const res = await fetch(LEAD_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      let detail = ''
      try {
        const body = await res.json()
        detail = body.error || body.details?.join(', ') || ''
      } catch {
        detail = `HTTP ${res.status}`
      }
      if (res.status === 429) throw new Error('Trop de tentatives. Réessayez dans 1h.')
      if (res.status === 400) throw new Error(`Champs invalides : ${detail}`)
      throw new Error(`Erreur serveur (${res.status}): ${detail}`)
    }
    status.value = 'success'
  } catch (e) {
    error.value = e.message || 'Erreur inconnue'
    status.value = 'error'
  }
}

function reset() {
  status.value = 'idle'
  error.value = null
}
</script>

<template>
  <LeadSuccess v-if="status === 'success'" :config-name="config.name" @close="emit('close')" />

  <form v-else class="space-y-5" autocomplete="on" novalidate @submit.prevent="submit">
    <!-- Honeypot — hidden from real users via aria + position. Bots fill it. -->
    <div aria-hidden="true" class="absolute left-[-9999px] w-px h-px overflow-hidden" tabindex="-1">
      <label>
        Site web (laisser vide)
        <input
          v-model="form.website"
          type="text"
          name="website"
          tabindex="-1"
          autocomplete="off"
        />
      </label>
    </div>

    <div class="rounded-xl bg-bg-900 border border-border-subtle p-4">
      <p class="text-sm text-text-secondary">
        Vous demandez la configuration
        <span class="text-neon-blue font-semibold">{{ config.name }}</span>
      </p>
      <p class="mt-1 text-xl font-bold text-gradient-neon font-mono">
        {{ formatPriceCHF(totalWithUpgrades) }}
      </p>
      <p v-if="selectedUpgradesDetails.length" class="mt-1 text-xs text-text-muted">
        Avec {{ selectedUpgradesDetails.length }} option{{ selectedUpgradesDetails.length > 1 ? 's' : '' }} sélectionnée{{ selectedUpgradesDetails.length > 1 ? 's' : '' }}
      </p>
    </div>

    <div class="grid sm:grid-cols-2 gap-4">
      <label class="block">
        <span class="text-sm font-medium text-text-secondary mb-1.5 block">Prénom *</span>
        <div class="relative">
          <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            v-model="form.firstName"
            type="text"
            required
            autocomplete="given-name"
            maxlength="60"
            class="w-full pl-9 pr-3 py-2.5 bg-bg-900 border border-border-subtle rounded-lg text-text-primary placeholder-text-dim focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition"
          />
        </div>
      </label>
      <label class="block">
        <span class="text-sm font-medium text-text-secondary mb-1.5 block">Nom *</span>
        <input
          v-model="form.lastName"
          type="text"
          required
          autocomplete="family-name"
          maxlength="60"
          class="w-full px-3 py-2.5 bg-bg-900 border border-border-subtle rounded-lg text-text-primary placeholder-text-dim focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition"
        />
      </label>
    </div>

    <label class="block">
      <span class="text-sm font-medium text-text-secondary mb-1.5 block">Email *</span>
      <div class="relative">
        <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          v-model="form.email"
          type="email"
          required
          autocomplete="email"
          maxlength="160"
          class="w-full pl-9 pr-3 py-2.5 bg-bg-900 border border-border-subtle rounded-lg text-text-primary placeholder-text-dim focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition"
        />
      </div>
    </label>

    <label class="block">
      <span class="text-sm font-medium text-text-secondary mb-1.5 block">Téléphone</span>
      <div class="relative">
        <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          v-model="form.phone"
          type="tel"
          autocomplete="tel"
          placeholder="+41 ..."
          maxlength="30"
          pattern="[+\d\s().\-]{6,30}"
          class="w-full pl-9 pr-3 py-2.5 bg-bg-900 border border-border-subtle rounded-lg text-text-primary placeholder-text-dim focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition"
        />
      </div>
    </label>

    <label class="block">
      <span class="text-sm font-medium text-text-secondary mb-1.5 block">Message libre</span>
      <div class="relative">
        <MessageSquare class="absolute left-3 top-3 w-4 h-4 text-text-muted" />
        <textarea
          v-model="form.message"
          rows="3"
          placeholder="Précisions, contraintes, délais..."
          maxlength="2000"
          class="w-full pl-9 pr-3 py-2.5 bg-bg-900 border border-border-subtle rounded-lg text-text-primary placeholder-text-dim focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition resize-y"
        />
      </div>
    </label>

    <div class="space-y-3">
      <label class="flex items-start gap-3 cursor-pointer group">
        <input
          v-model="form.wantsSourcing"
          type="checkbox"
          class="mt-0.5 w-4 h-4 rounded border-border-default bg-bg-900 text-neon-blue focus:ring-neon-blue cursor-pointer"
        />
        <span class="text-sm text-text-secondary group-hover:text-text-primary transition">
          Je souhaite que vous commandiez les composants pour moi (service de sourcing inclus)
        </span>
      </label>

      <label class="flex items-start gap-3 cursor-pointer group">
        <input
          v-model="form.hasSomeComponents"
          type="checkbox"
          class="mt-0.5 w-4 h-4 rounded border-border-default bg-bg-900 text-neon-blue focus:ring-neon-blue cursor-pointer"
        />
        <span class="text-sm text-text-secondary group-hover:text-text-primary transition">
          J'ai déjà certains composants
        </span>
      </label>

      <Transition name="reveal">
        <div v-if="form.hasSomeComponents" class="grid grid-cols-2 gap-2 p-3 rounded-lg bg-bg-900 border border-border-subtle">
          <label
            v-for="t in componentTypes"
            :key="t.id"
            class="flex items-center gap-2 text-xs text-text-secondary cursor-pointer hover:text-text-primary transition"
          >
            <input
              v-model="form.excludedTypes"
              type="checkbox"
              :value="t.id"
              class="w-3.5 h-3.5 rounded border-border-default bg-bg-800 text-neon-blue focus:ring-neon-blue cursor-pointer"
            />
            {{ t.label }}
          </label>
        </div>
      </Transition>
    </div>

    <Transition name="reveal">
      <div
        v-if="status === 'error' && error"
        class="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-300"
      >
        <AlertCircle class="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <p class="font-medium">Erreur lors de l'envoi</p>
          <p class="text-xs text-red-400/80 mt-1 break-all">{{ error }}</p>
          <button type="button" class="mt-2 text-xs underline hover:text-red-200 cursor-pointer" @click="reset">
            Réessayer
          </button>
        </div>
      </div>
    </Transition>

    <div class="flex flex-wrap items-center gap-3 pt-2">
      <AppButton type="submit" variant="primary" :loading="status === 'loading'" :disabled="!isValid">
        Envoyer ma demande
      </AppButton>
      <AppButton type="button" variant="ghost" @click="emit('close')">Annuler</AppButton>
    </div>
  </form>
</template>

<style scoped>
.reveal-enter-active, .reveal-leave-active { transition: all 0.2s ease; }
.reveal-enter-from, .reveal-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
