import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    sitesApiUrl: 'http://localhost:3010',
    siteId: 'meu-site',
    public: {
      siteId: 'meu-site',
      cmsEditorUrl: 'http://localhost:3001',
      // Set NUXT_PUBLIC_SITE_URL in production (e.g. https://meu-site.com)
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || '',
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || 'Meu Site',
    },
  },

  nitro: {
    preset: 'bun'
  },

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'pt-BR' },
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'stylesheet', href: 'https://unpkg.com/primeicons/primeicons.css' },
      ],
    }
  },
  
  components: {
    dirs: [
      {
        path: '~/components',
        global: true 
      }
    ]
  },
  
  css: ['~/assets/css/main.css'],
  
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})