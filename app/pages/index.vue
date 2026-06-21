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
          <div class="relative group/editblock">
            <div v-if="isPreview && isInIframe" class="absolute inset-0 z-[9997] pointer-events-none border-2 border-indigo-400 opacity-0 group-hover/editblock:opacity-100 transition-opacity duration-150"></div>
            <component
              v-if="getDynamicComponent(block.componentName)"
              :is="getDynamicComponent(block.componentName)"
              v-bind="block.props"
              :id="block.id"
              page-path="home"
            />
            <div v-else class="p-6 my-4 mx-auto max-w-2xl bg-red-500/10 text-red-500 rounded-cartao border border-red-500/20 text-center">
              ⚠️ Componente Hero <strong>{{ block.componentName }}</strong> não foi encontrado. Verifique o nome exato no JSON e na pasta components.
            </div>
            <button
              v-if="isPreview && isInIframe"
              class="absolute top-3 right-3 z-[9998] opacity-0 group-hover/editblock:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-sm text-white text-xs font-semibold border border-white/20 hover:bg-indigo-600 hover:border-indigo-400 shadow-xl cursor-pointer"
              @click.stop="editBlock(block)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 flex-shrink-0">
                <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
              </svg>
              {{ block.label || block.componentName }}
            </button>
          </div>
        </template>
      </section>

      <main id="content-zone" class="w-full transition-colors duration-500"
        :style="{ paddingTop: pageVerticalPadding, paddingBottom: pageVerticalPadding }">

        <div class="flex flex-col" :style="{ gap: blocksGap }">
          <template v-for="(block, index) in contentBlocks" :key="'content-' + index">
            <div class="relative group/editblock w-full">
              <div v-if="isPreview && isInIframe" class="absolute inset-0 z-[9997] pointer-events-none border-2 border-indigo-400 opacity-0 group-hover/editblock:opacity-100 transition-opacity duration-150"></div>
              <component
                v-if="getDynamicComponent(block.componentName)"
                :is="getDynamicComponent(block.componentName)"
                v-bind="block.props"
                :id="block.id"
                page-path="home"
              />
              <div v-else class="p-6 my-4 mx-auto w-full bg-red-500/10 text-red-500 rounded-cartao border border-red-500/20 text-center">
                ⚠️ Componente de Conteúdo <strong>{{ block.componentName }}</strong> não foi encontrado. Verifique o nome exato no JSON e na pasta components.
              </div>
              <button
                v-if="isPreview && isInIframe"
                class="absolute top-3 right-3 z-[9998] opacity-0 group-hover/editblock:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-sm text-white text-xs font-semibold border border-white/20 hover:bg-indigo-600 hover:border-indigo-400 shadow-xl cursor-pointer"
                @click.stop="editBlock(block)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 flex-shrink-0">
                  <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                </svg>
                {{ block.label || block.componentName }}
              </button>
            </div>
          </template>
        </div>

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

const isInIframe = ref(false)
onMounted(() => { isInIframe.value = window !== window.parent })
const isPreview = computed(() => !!(route.query.version || previewCookie.value))

function editBlock(block) {
  if (!isInIframe.value) return
  const blockIndex = allBlocks.value.indexOf(block)
  window.parent.postMessage({ type: 'sirius:editBlock', blockId: block.id, blockIndex, pagePath: 'home' }, '*')
}
const siteUrl = config.public.siteUrl || '';
const siteName = config.public.siteName || '';

definePageMeta({ layout: 'topbar-glass' });

const { data: siteConfig } = await useAsyncData('site-config', () => $fetch('/api/site-config'));
const BLOCKS_GAP_MAP = { none: '0px', sm: '12px', md: '24px', lg: '48px', xl: '80px' }
const PAGE_PADDING_MAP = { none: '0px', sm: '24px', md: '48px', lg: '80px', xl: '128px' }
const blocksGap = computed(() => BLOCKS_GAP_MAP[siteConfig.value?.blocksGap] || BLOCKS_GAP_MAP.md)
const pageVerticalPadding = computed(() => PAGE_PADDING_MAP[siteConfig.value?.pageVerticalPadding] || '0px')

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
  const list = Array.isArray(rawData) ? rawData : (rawData.blocks || []);
  return list.filter(b => b.active !== false);
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