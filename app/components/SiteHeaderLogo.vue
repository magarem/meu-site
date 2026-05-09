<script setup>
import { computed } from 'vue';

const props = defineProps({
  isGlass: Boolean,
  isScrolled: Boolean,
  isMobileMenuOpen: Boolean,
  brandName: { type: String, default: 'SIRIUS' },
  signature: { type: String, default: 'STUDIO' },
  variation: { type: String, default: 'signature' }, 
});

const initialLetter = computed(() => props.brandName.charAt(0).toUpperCase());

// ✨ Lógica para o modo Glass: Se estiver no topo de uma imagem, o logo DEVE ser branco
// independentemente do tema atual, para garantir legibilidade.
const forceWhiteText = computed(() => {
  return props.isGlass && !props.isScrolled && !props.isMobileMenuOpen;
});
</script>

<template>
  <NuxtLink 
    to="/" 
    class="flex items-center gap-3 relative z-50 hover:opacity-80 transition-all duration-300 group shrink-0" 
  >
    <div 
      v-if="variation === 'icon-text' || variation === 'minimal'"
      class="flex items-center justify-center w-10 h-10 rounded-xl font-black text-xl shadow-md transition-all duration-500 group-hover:scale-105"
      :class="forceWhiteText ? 'bg-white text-gray-900' : 'bg-primary text-white'"
    >
      {{ initialLetter }}
    </div>

    <div v-if="variation !== 'minimal'" class="flex flex-col items-start justify-center">
      
      <span 
        class="transition-colors duration-500 leading-none font-serif font-black text-3xl md:text-4xl tracking-tight mb-1"
        :class="forceWhiteText ? 'text-white drop-shadow-md' : 'text-text-main'"
      >
        {{ brandName }}
      </span>
      
      <span 
        v-if="variation === 'signature' && signature"
        class="text-[0.6rem] md:text-xs font-medium tracking-[0.3em] uppercase transition-colors duration-500"
        :class="forceWhiteText ? 'text-white opacity-90' : 'text-text-muted'"
      >
        {{ signature }}
      </span>

    </div>
  </NuxtLink>
</template>