export function useAuth() {
  const token = useCookie<string | null>('auth_token', { sameSite: 'lax' })
  const isLoggedIn = computed(() => !!token.value)

  function authHeaders() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  async function login(apiBase: string, email: string, password: string) {
    const res = await $fetch<{ access_token: string }>(`${apiBase}/auth/login`, {
      method: 'POST',
      body: { email, password },
    })
    token.value = res.access_token
  }

  async function register(apiBase: string, email: string, password: string) {
    await $fetch(`${apiBase}/auth/register`, {
      method: 'POST',
      body: { email, password },
    })
    await login(apiBase, email, password)
  }

  function logout() {
    token.value = null
  }

  return { token, isLoggedIn, authHeaders, login, register, logout }
}
