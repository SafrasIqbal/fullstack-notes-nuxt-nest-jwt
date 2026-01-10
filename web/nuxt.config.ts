// https://nuxt.com/docs/api/configuration/nuxt-config


export default defineNuxtConfig({
  runtimeConfig: {
    apiBaseInternal: process.env.API_BASE_INTERNAL || "http://api:4000/api",
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "/api",
    },
  },
})
