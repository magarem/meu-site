<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

// Os três pilares do Header
import SiteHeaderLogo from '~/components/SiteHeaderLogo.vue';
import SiteHeaderMenu from '~/components/SiteHeaderMenu.vue';
import SiteHeaderExtra from '~/components/SiteHeaderExtra.vue';

const route = useRoute();
const previewCookie = useCookie('preview_layer');

const componentMap = {
  SiteHeaderLogo,
  SiteHeaderMenu,
  SiteHeaderExtra
};

const props = defineProps({
  isGlass: { type: Boolean, default: false }
});

// Busca a estrutura (blocos, largura) do CMS
const { data: topbarResponse, pending: topbarPending } = useAsyncData(
  `global-topbar-${route.query.version || previewCookie.value || 'base'}`,
  () => $fetch('/api/content', {
    query: {
      path: '_global/_topbar',
      version: route.query.version || previewCookie.value
    }
  })
);

const topbarConfig = computed(() => topbarResponse.value?.data || null);

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => isMobileMenuOpen.value = !isMobileMenuOpen.value;
const closeMobileMenu = () => isMobileMenuOpen.value = false;

const handleResize = () => {
  if (window.innerWidth >= 768 && isMobileMenuOpen.value) closeMobileMenu();
};

const handleScroll = () => {
  if (props.isGlass) isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  if (props.isGlass) window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (props.isGlass) window.removeEventListener('scroll', handleScroll);
});

const glassClasses = computed(() => {
  if (!props.isGlass) return ''; 
  
  if (isScrolled.value || isMobileMenuOpen.value) {
    return 'bg-bg-base text-text-main shadow-lg backdrop-blur-xl border-b border-border';
  }
  
  return 'bg-transparent text-white border-b border-white/10';
});

const getAlignClass = (align) => {
  switch (align) {
    case 'center': return 'justify-center';
    case 'right': return 'justify-end';
    case 'left':
    default: return 'justify-start';
  }
};
</script>

<template>
  <header
    v-if="topbarConfig"
    :class="[
      /* 1. Removemos o 'flex items-center' daqui para não esmagar o container */
      'w-full shrink-0 transition-all duration-500 z-50 px-7',
      !isGlass ? 'sticky top-0 bg-bg-base text-text-main shadow-sm border-b border-border' : 'fixed top-0 left-0',
      glassClasses
    ]"
    :style="{ height: topbarConfig.height || '80px' }"
  >
    <AppContainer 
      size="content" 
      class="flex items-center h-full"
    >
      
      <div 
        v-for="block in topbarConfig.blocks" 
        :key="block.id"
        :class="['flex-1 flex items-center', getAlignClass(block.align)]"
      >
        <component
          v-if="block.active !== false"
          :is="componentMap[block.componentName]"
          :is-glass="props.isGlass"
          :is-scrolled="isScrolled"
          :is-mobile-menu-open="isMobileMenuOpen"
          :topbar-config="topbarConfig"
          v-bind="block.props"
          @toggle-menu="toggleMobileMenu"
          @close-menu="closeMobileMenu"
        />
      </div>

    </AppContainer>
  </header>
</template>