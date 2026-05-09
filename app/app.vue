<script setup>
const previewCookie = useCookie('preview_layer');
useEditPageHotkey();

const { data: themeFile } = await useFetch('/api/content', {
  key: 'site-theme',
  query: { path: '_global/theme' }
})

const { data: siteConfig } = await useFetch('/api/site-config', { key: 'site-config' })

const gaId = computed(() => siteConfig.value?.googleAnalyticsId || '')

useHead({
  style: [{
    innerHTML: computed(() => {
      const t = themeFile.value?.data
      if (!t) return ''
      const light = Object.entries(t.light ?? {}).map(([k, v]) => `  ${k}: ${v};`).join('\n')
      const dark  = Object.entries(t.dark  ?? {}).map(([k, v]) => `  ${k}: ${v};`).join('\n')
      return `:root {\n${light}\n}${dark ? `\n.dark {\n${dark}\n}` : ''}`
    })
  }],
  script: computed(() => {
    if (!gaId.value) return []
    return [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${gaId.value}`,
        async: true,
      },
      {
        innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId.value}');`,
      },
    ]
  }),
})

const clearPreview = () => {
  previewCookie.value = null;
  window.location.href = '/';
};

// ── Self-hosted analytics beacon ─────────────────────────
function sendBeacon(path) {
  if (previewCookie.value) return
  fetch('/api/beacon', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, ref: document.referrer }),
    keepalive: true,
  }).catch(() => {})
}

const router = useRouter()
router.afterEach((to) => {
  sendBeacon(to.path)
  if (window !== window.parent) {
    window.parent.postMessage({ type: 'sirius:navigate', path: to.path }, '*')
  }
})
onMounted(() => {
  sendBeacon(useRoute().path)
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'sirius:goto') router.push(e.data.path)
  })
})
</script>

<template>
  <div class="min-h-screen transition-colors duration-500">

    <NuxtLoadingIndicator color="var(--color-primary)" :height="3" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <button
      v-if="previewCookie"
      @click="clearPreview"
      class="fixed bottom-6 right-6 z-[99] bg-red-500 text-white px-5 py-3 rounded-full shadow-2xl text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors"
    >
      <i class="pi pi-times mr-2"></i> Sair do Preview
    </button>

  </div>
</template>
