<script setup>
import { computed, ref, resolveComponent } from 'vue';
import { useMediaUrl } from '~/composables/useMediaUrl';
import { useRoute } from 'vue-router';
import MultiImageBanner from '~/components/MultiImageBanner.vue';

const route = useRoute();
const previewCookie = useCookie('preview_layer');
const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl || '';
const siteName = config.public.siteName || '';

// 1. Caminho limpo dinâmico
const targetUrl = computed(() => {
  const s = route.params.slug;
  if (!s || s.length === 0) return '';
  return Array.isArray(s) ? s.join('/') : s;
});


// 2. Fetch page data — static key + separate Vue watch (the useAsyncData
// `watch` option fires during route transitions and corrupts data state).
const { data: pageData, pending, error, refresh } = await useAsyncData(
  'page-content',
  () => $fetch('/api/content', {
    query: {
      path: targetUrl.value,
      version: route.query.version || previewCookie.value
    }
  })
);

watch(
  [() => route.path, () => route.query.version, previewCookie],
  () => refresh()
);

// 3. Unwrap inner data envelope
const pageContent = computed(() => pageData.value?.data || {});

// 3b. Blocks
const allBlocks = computed(() => pageContent.value?.blocks || []);

// 4. Resolve component
const getDynamicComponent = (name) => {
  if (!name) return null;
  const comp = resolveComponent(name);
  return typeof comp === 'string' ? null : comp;
};

// 5. Images
const topImages = computed(() => {
  const img = pageContent.value?.image;
  if (!img) return [];
  return Array.isArray(img) ? img : [img];
});

const sideImages = computed(() => {
  const img = pageContent.value?.sideimages;
  if (!img) return [];
  return Array.isArray(img) ? img : [img];
});

const sidePosition = computed(() => pageContent.value?.sideimages_position || 'right');

const { resolve: resolveImg } = useMediaUrl(() => targetUrl.value);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

// 6. Share
const linkCopied = ref(false);
const copyLink = async () => {
  await navigator.clipboard.writeText(window.location.href);
  linkCopied.value = true;
  setTimeout(() => { linkCopied.value = false; }, 2000);
};

// 7. Breadcrumbs
const breadcrumbs = computed(() => {
  const parts = route.path.split('/').filter(Boolean);
  return [
    { label: 'Início', path: '/' },
    ...parts.map((part, idx) => ({
      label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
      path: '/' + parts.slice(0, idx + 1).join('/'),
    })),
  ];
});

// ── SEO ──────────────────────────────────────────────────────

function resolveImage(img) {
  if (!img) return undefined;
  const src = Array.isArray(img) ? img[0] : img;
  if (!src) return undefined;
  if (src.startsWith('http')) return src;
  if (siteUrl) return `${siteUrl}/api/media?path=${encodeURIComponent(src)}`;
  return undefined;
}

const seoTitle = computed(() =>
  pageContent.value?.seo?.meta_title || pageContent.value?.title || siteName
);
const seoDesc = computed(() =>
  pageContent.value?.seo?.meta_description || pageContent.value?.description || ''
);
const seoImage = computed(() =>
  resolveImage(pageContent.value?.seo?.og_image || pageContent.value?.image)
);
const canonicalUrl = computed(() =>
  pageContent.value?.seo?.canonical || (siteUrl ? `${siteUrl}${route.path}` : '')
);
const isArticle = computed(() => pageContent.value?.layout === 'post');

useSeoMeta({
  title: () => seoTitle.value,
  titleTemplate: (t) => t === siteName ? t : `${t} | ${siteName}`,
  description: () => seoDesc.value,
  keywords: () => pageContent.value?.seo?.keywords || undefined,
  robots: () => pageContent.value?.seo?.robots || 'index, follow',
  ogSiteName: siteName,
  ogType: () => isArticle.value ? 'article' : 'website',
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDesc.value,
  ogImage: () => seoImage.value,
  ogUrl: () => canonicalUrl.value,
  twitterCard: () => seoImage.value ? 'summary_large_image' : 'summary',
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDesc.value,
  twitterImage: () => seoImage.value,
  articlePublishedTime: () => isArticle.value ? pageContent.value?.date || undefined : undefined,
  articleAuthor: () => isArticle.value ? pageContent.value?.author || undefined : undefined,
});

// Canonical + JSON-LD
useHead(computed(() => {
  if (!pageContent.value) return {};

  const schemaType = pageContent.value?.seo?.schema_type
    || (isArticle.value ? 'Article' : 'WebPage');

  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: seoTitle.value,
    description: seoDesc.value,
    url: canonicalUrl.value || undefined,
    ...(seoImage.value ? { image: seoImage.value } : {}),
    ...(pageContent.value?.date ? { datePublished: pageContent.value.date, dateModified: pageContent.value.date } : {}),
    ...(pageContent.value?.author ? { author: { '@type': 'Person', name: pageContent.value.author } } : {}),
    ...(route.path !== '/' ? {
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: siteUrl || '/' },
          ...route.path.split('/').filter(Boolean).map((part, idx, parts) => ({
            '@type': 'ListItem',
            position: idx + 2,
            name: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
            item: `${siteUrl}/${parts.slice(0, idx + 1).join('/')}`,
          })),
        ],
      },
    } : {}),
  };

  return {
    link: canonicalUrl.value ? [{ rel: 'canonical', href: canonicalUrl.value }] : [],
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(schema) }],
  };
}));
</script>

<template>
  <div class="w-full transition-colors duration-500">

    <!-- ── Loading ─────────────────────────────────────────────── -->
    <div v-if="pending" class="flex items-center justify-center min-h-[60vh]">
      <div class="flex flex-col items-center gap-4">
        <div class="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span class="tracking-widest uppercase text-sm font-medium text-text-muted animate-pulse">
          Carregando...
        </span>
      </div>
    </div>

    <!-- ── Error ────────────────────────────────────────────────── -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-6 text-center">
      <div class="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
        <i class="pi pi-exclamation-triangle text-2xl text-red-500"></i>
      </div>
      <div>
        <h2 class="text-xl font-bold text-text-main">Página não encontrada</h2>
        <p class="text-text-muted text-sm mt-1">{{ targetUrl }}</p>
      </div>
      <button
        @click="refresh"
        class="px-5 py-2.5 rounded-botao border border-border text-sm font-medium text-text-muted hover:text-text-main hover:border-primary transition-all"
      >
        <i class="pi pi-refresh mr-2"></i> Tentar novamente
      </button>
    </div>

    <!-- ── Page ─────────────────────────────────────────────────── -->
    <template v-else-if="pageData">

      <!-- ── Page header: breadcrumbs + title ─────────────────────── -->
      <div class="w-full py-5 md:py-6">
        <AppContainer size="content">

          <nav class="flex items-center gap-1.5 text-text-muted text-[10px] font-medium uppercase tracking-widest mb-2">
            <NuxtLink to="/" class="hover:text-primary transition-colors">Início</NuxtLink>
            <template v-for="(crumb, i) in breadcrumbs.slice(1)" :key="i">
              <i class="pi pi-angle-right opacity-30 text-[9px]"></i>
              <NuxtLink
                v-if="i < breadcrumbs.length - 2"
                :to="crumb.path"
                class="hover:text-primary transition-colors"
              >{{ crumb.label }}</NuxtLink>
              <span v-else class="text-text-main">{{ crumb.label }}</span>
            </template>
          </nav>

          <div class="flex items-start justify-between gap-4">
            <div>
              <h1 class="text-lg md:text-xl font-semibold text-text-main leading-snug">
                {{ pageContent.title }}
              </h1>
              <p v-if="pageContent.description" class="mt-1 text-text-muted text-sm max-w-2xl leading-relaxed">
                {{ pageContent.description }}
              </p>
            </div>
            <button
              class="flex items-center gap-1.5 text-xs font-medium underline underline-offset-2 transition-colors shrink-0 mt-0.5"
              :class="linkCopied ? 'text-primary' : 'text-text-muted hover:text-text-main'"
              @click="copyLink"
            >
              <i :class="['pi text-sm', linkCopied ? 'pi-check' : 'pi-link']"></i>
              {{ linkCopied ? 'Link copiado' : 'Compartilhar' }}
            </button>
          </div>

        </AppContainer>
      </div>

      <!-- ── Cover image (top) ─────────────────────────────────────── -->
      <multi-image-banner
        v-if="topImages.length > 0"
        :images="topImages"
        :pagePath="targetUrl"
        cWidth="content"
      />

      <!-- ── Content + Side images ────────────────────────────────── -->
      <AppContainer size="content" class="py-12 md:py-11">
        <div :class="sideImages.length > 0
          ? `grid grid-cols-1 items-start gap-10 md:gap-14 ${sidePosition === 'left' ? 'md:grid-cols-[300px_1fr]' : 'md:grid-cols-[1fr_300px]'}`
          : ''">

          <!-- Side images — left position -->
          <aside
            v-if="sideImages.length > 0 && sidePosition === 'left'"
            class="flex flex-col gap-3 md:sticky md:top-24 order-first"
          >
            <img
              v-for="(img, i) in sideImages"
              :key="i"
              :src="resolveImg(img)"
              :alt="`Imagem ${i + 1}`"
              class="w-full rounded-2xl object-cover border border-border shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
              @click="lightboxIndex = i; lightboxOpen = true"
            />
          </aside>

          <!-- Main blocks -->
          <main class="flex flex-col gap-10 md:gap-16 min-w-0">
            <template v-for="block in allBlocks" :key="block.id">
              <component
                v-if="getDynamicComponent(block.componentName)"
                :is="getDynamicComponent(block.componentName)"
                v-bind="block.props"
                :id="block.id"
                :page-path="targetUrl"
              />
              <div v-else class="p-5 bg-red-500/10 text-red-500 rounded-cartao border border-red-500/20 text-center text-sm">
                ⚠️ Componente <strong>{{ block.componentName }}</strong> não encontrado.
              </div>
            </template>
          </main>

          <!-- Side images — right position (default) -->
          <aside
            v-if="sideImages.length > 0 && sidePosition !== 'left'"
            class="flex flex-col gap-3 md:sticky md:top-24"
          >
            <img
              v-for="(img, i) in sideImages"
              :key="i"
              :src="resolveImg(img)"
              :alt="`Imagem ${i + 1}`"
              class="w-full rounded-2xl object-cover border border-border shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
              @click="lightboxIndex = i; lightboxOpen = true"
            />
          </aside>

        </div>
      </AppContainer>

      <!-- Lightbox -->
      <Teleport to="body">
        <Transition name="fade">
          <div
            v-if="lightboxOpen"
            class="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center"
            @click.self="lightboxOpen = false"
          >
            <button @click="lightboxOpen = false" class="absolute top-5 right-5 w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all">
              <i class="pi pi-times text-lg"></i>
            </button>
            <button v-if="sideImages.length > 1" @click="lightboxIndex = (lightboxIndex - 1 + sideImages.length) % sideImages.length" class="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all">
              <i class="pi pi-chevron-left"></i>
            </button>
            <img :src="resolveImg(sideImages[lightboxIndex])" class="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl" />
            <button v-if="sideImages.length > 1" @click="lightboxIndex = (lightboxIndex + 1) % sideImages.length" class="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all">
              <i class="pi pi-chevron-right"></i>
            </button>
          </div>
        </Transition>
      </Teleport>

    </template>

  </div>

</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>