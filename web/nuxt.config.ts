// https://nuxt.com/docs/api/configuration/nuxt-config


export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
})

