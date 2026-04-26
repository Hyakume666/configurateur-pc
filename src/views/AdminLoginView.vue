<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const password = ref('')
const error = ref(false)

function submit() {
  if (password.value === import.meta.env.VITE_ADMIN_PASSWORD) {
    sessionStorage.setItem('admin_auth', import.meta.env.VITE_ADMIN_PASSWORD)
    router.push('/admin')
  } else {
    error.value = true
    password.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-bg-900 px-4">
    <form
      class="w-full max-w-sm bg-bg-800 border border-border-default rounded-2xl p-8 flex flex-col gap-6"
      @submit.prevent="submit"
    >
      <h1 class="text-xl font-bold text-text-primary text-center">Accès Admin</h1>

      <div class="flex flex-col gap-2">
        <label class="text-xs text-text-secondary font-medium uppercase tracking-wider">
          Mot de passe
        </label>
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          class="bg-bg-700 border border-border-default rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary-500 transition-colors"
          :class="error ? 'border-red-500' : ''"
          autofocus
        />
        <p v-if="error" class="text-xs text-red-400">Mot de passe incorrect.</p>
      </div>

      <AppButton type="submit" variant="primary" class="w-full">
        Connexion
      </AppButton>
    </form>
  </div>
</template>
