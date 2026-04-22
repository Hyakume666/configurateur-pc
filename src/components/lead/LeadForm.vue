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
  excludedTypes: []
})

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

const isValid = computed(
  () =>
    form.firstName.trim() &&
    form.lastName.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
)

function buildHtmlBody() {
  const upgradesHtml = selectedUpgradesDetails.value.length
    ? `<ul>${selectedUpgradesDetails.value
        .map((u) => `<li>${u.name} (+${formatPriceCHF(u.priceAdd)})</li>`)
        .join('')}</ul>`
    : '<em>Aucune option supplémentaire</em>'

  const excludedHtml = form.hasSomeComponents && form.excludedTypes.length
    ? `<p><strong>Composants déjà possédés :</strong> ${form.excludedTypes.join(', ')}</p>`
    : ''

  return `
    <h2>Nouvelle demande — ${props.config.name}</h2>
    <p><strong>Client :</strong> ${form.firstName} ${form.lastName}</p>
    <p><strong>Email :</strong> ${form.email}</p>
    ${form.phone ? `<p><strong>Téléphone :</strong> ${form.phone}</p>` : ''}
    <hr/>
    <h3>Configuration demandée</h3>
    <p><strong>${props.config.name}</strong> — ${props.config.tagline}</p>
    <p><strong>Prix de base :</strong> ${formatPriceCHF(props.config.totalPrice + props.config.assemblyFee)}</p>
    <p><strong>Total avec options :</strong> ${formatPriceCHF(totalWithUpgrades.value)}</p>
    <h4>Options sélectionnées</h4>
    ${upgradesHtml}
    ${excludedHtml}
    <p><strong>Souhaite que je commande les composants :</strong> ${form.wantsSourcing ? 'Oui' : 'Non'}</p>
    ${form.message ? `<hr/><h3>Message du client</h3><p>${form.message.replace(/\n/g, '<br/>')}</p>` : ''}
  `
}

async function submit() {
  if (!isValid.value || status.value === 'loading') return
  status.value = 'loading'
  error.value = null

  const apiKey = import.meta.env.VITE_BREVO_API_KEY
  const ownerEmail = import.meta.env.VITE_OWNER_EMAIL

  const payload = {
    sender: { email: ownerEmail || 'noreply@configurateur-pc.ch', name: 'Configurateur PC' },
    to: [{ email: ownerEmail, name: 'Loïc Barthoulot' }],
    replyTo: { email: form.email, name: `${form.firstName} ${form.lastName}` },
    subject: `Nouvelle demande — ${props.config.name} — ${form.firstName} ${form.lastName}`,
    htmlContent: buildHtmlBody()
  }

  if (!apiKey || !ownerEmail) {
    console.warn('[LeadForm] VITE_BREVO_API_KEY ou VITE_OWNER_EMAIL manquant — mode démo, soumission simulée.')
    setTimeout(() => (status.value = 'success'), 800)
    return
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Brevo ${res.status}: ${body}`)
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

  <form v-else class="space-y-5" @submit.prevent="submit">
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
