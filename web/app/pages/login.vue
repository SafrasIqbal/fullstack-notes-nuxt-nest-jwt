<script setup lang="ts">
const config = useRuntimeConfig()
const apiBase = config.public.apiBase || 'http://localhost:4000'

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const busy = ref(false)

const { login, register } = useAuth()

async function doLogin() {
  error.value = null
  busy.value = true
  try {
    await login(apiBase, email.value, password.value)
    await navigateTo('/')
  } catch (e: any) {
    error.value = e?.data?.message || 'Login failed'
  } finally {
    busy.value = false
  }
}

async function doRegister() {
  error.value = null
  busy.value = true
  try {
    await register(apiBase, email.value, password.value)
    await navigateTo('/')
  } catch (e: any) {
    error.value = e?.data?.message || 'Register failed'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <main style="max-width:520px;margin:60px auto;font-family:system-ui;">
    <h1>Login</h1>

    <div style="display:flex;flex-direction:column;gap:10px;margin:16px 0;">
      <input v-model="email" placeholder="email" style="padding:10px;" />
      <input v-model="password" type="password" placeholder="password (min 8 chars)" style="padding:10px;" />
      <div style="display:flex;gap:10px;">
        <button @click="doLogin" :disabled="busy" style="padding:10px 14px;">Login</button>
        <button @click="doRegister" :disabled="busy" style="padding:10px 14px;">Register</button>
      </div>
      <p v-if="error" style="color:#c00;">{{ error }}</p>
    </div>

    <NuxtLink to="/">← Back</NuxtLink>
  </main>
</template>
