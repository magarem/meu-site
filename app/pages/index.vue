<template>
  <div>
    
    <div v-if="pending" class="flex items-center justify-center min-h-[50vh] p-20">
      <span class="animate-pulse tracking-widest uppercase text-lg md:text-xl font-medium text-text-muted">
        Carregando layout...
      </span>
    </div>

    <div v-else-if="error" class="text-center py-24 text-red-500 flex flex-col items-center gap-4">
      <i class="pi pi-exclamation-triangle text-4xl"></i>
      <p class="text-lg">Erro ao carregar os dados da página.</p>
      <button @click="refresh" class="text-sm underline opacity-70 hover:opacity-100 transition-opacity">
        Tentar novamente
      </button>
    </div>

    <div v-else class="w-full">
      
      <section id="hero-zone" class="w-full">
        <template v-for="(block, index) in heroBlocks" :key="'hero-' + index">
          <component
            v-if="getDynamicComponent(block.componentName)"
            :is="getDynamicComponent(block.componentName)"
            v-bind="block.props"
            page-path="home"
          />
          <div v-else class="p-6 my-4 mx-auto max-w-2xl bg-red-500/10 text-red-500 rounded-cartao border border-red-500/20 text-center">
            ⚠️ Componente Hero <strong>{{ block.componentName }}</strong> não foi encontrado. Verifique o nome exato no JSON e na pasta components.
          </div>
        </template>
      </section>

      <main id="content-zone" class="w-full py-16 md:py-20 px-5 transition-colors duration-500">
        
        <AppContainer size="content" class="flex flex-col gap-16 md:gap-15">
          <template v-for="(block, index) in contentBlocks" :key="'content-' + index">
            <div class="w-full">
              <component
                v-if="getDynamicComponent(block.componentName)"
                :is="getDynamicComponent(block.componentName)"
                v-bind="block.props"
                page-path="home"
              />
              <div v-else class="p-6 my-4 mx-auto w-full bg-red-500/10 text-red-500 rounded-cartao border border-red-500/20 text-center">
                ⚠️ Componente de Conteúdo <strong>{{ block.componentName }}</strong> não foi encontrado. Verifique o nome exato no JSON e na pasta components.
              </div>
            </div>
          </template>
        </AppContainer>

      </main>

    </div>
  </div>
</template>

<script setup>
import { computed, resolveComponent, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const previewCookie = useCookie('preview_layer');
const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl || '';
const siteName = config.public.siteName || '';

definePageMeta({ layout: 'topbar-glass' });

const { data: response, pending, error, refresh } = await useAsyncData(
  `home-page-data-${route.query.version || previewCookie.value || 'base'}`,
  () => $fetch('/api/content', {
    query: {
      path: 'home',
      t: Date.now(),
      version: route.query.version || previewCookie.value
    }
  }),
  { server: true, lazy: false }
);

watch(() => route.query.version, () => refresh());

const allBlocks = computed(() => {
  const rawData = response.value?.data || {};
  return Array.isArray(rawData) ? rawData : (rawData.blocks || []);
});
const heroBlocks = computed(() =>
  allBlocks.value.filter(b => b.isHero === true || b.isHero === 'true')
);
const contentBlocks = computed(() =>
  allBlocks.value.filter(b => !b.isHero || b.isHero === 'false')
);
const getDynamicComponent = (name) => {
  if (!name) return null;
  const comp = resolveComponent(name);
  return typeof comp === 'string' ? null : comp;
};

// ── SEO ──────────────────────────────────────────────────────

function resolveImage(img) {
  if (!img) return undefined;
  const src = Array.isArray(img) ? img[0] : img;
  if (!src) return undefined;
  if (src.startsWith('http')) return src;
  if (siteUrl) return `${siteUrl}/api/media?path=${encodeURIComponent(src)}`;
  return undefined;
}

const pageData = computed(() => response.value?.data || {});
const seoTitle = computed(() =>
  pageData.value?.seo?.meta_title || pageData.value?.title || siteName
);
const seoDesc = computed(() =>
  pageData.value?.seo?.meta_description || pageData.value?.description || ''
);
const seoImage = computed(() =>
  resolveImage(pageData.value?.seo?.og_image || pageData.value?.image)
);
const canonicalUrl = computed(() =>
  pageData.value?.seo?.canonical || (siteUrl ? `${siteUrl}/` : '')
);

useSeoMeta({
  title: () => seoTitle.value,
  titleTemplate: '%s',
  description: () => seoDesc.value,
  keywords: () => pageData.value?.seo?.keywords || undefined,
  robots: () => pageData.value?.seo?.robots || 'index, follow',
  ogSiteName: siteName,
  ogType: 'website',
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDesc.value,
  ogImage: () => seoImage.value,
  ogUrl: () => canonicalUrl.value,
  twitterCard: () => seoImage.value ? 'summary_large_image' : 'summary',
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDesc.value,
  twitterImage: () => seoImage.value,
});

useHead(computed(() => ({
  link: canonicalUrl.value ? [{ rel: 'canonical', href: canonicalUrl.value }] : [],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': pageData.value?.seo?.schema_type || 'WebSite',
        name: seoTitle.value,
        description: seoDesc.value,
        url: siteUrl || undefined,
        ...(seoImage.value ? { image: seoImage.value } : {}),
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteName,
        url: siteUrl || undefined,
      }),
    },
  ],
})));
</script>