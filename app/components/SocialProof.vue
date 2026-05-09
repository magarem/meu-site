<template>
  <section 
    class="w-full py-12 md:py-10 border-y border-border bg-bg-muted/50 overflow-hidden transition-colors duration-500"
  >
    <div :class="['flex flex-col items-center gap-8 mx-auto', cWidth]">
      
      <h3 
        v-if="title" 
        class="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-center px-4 transition-colors duration-500 text-text-muted"
      >
        {{ title }}
      </h3>

      <div class="relative w-full flex overflow-hidden group mask-edges">
        <div class="flex items-center gap-16 md:gap-24 w-max animate-marquee group-hover:[animation-play-state:paused]">
          
          <div class="flex items-center gap-16 md:gap-24 min-w-max px-8">
            <template v-for="(logo, index) in displayLogos" :key="'orig-' + index">
              <img 
                v-if="logo.type === 'image'" 
                :src="logo.src" 
                :alt="logo.alt || 'Logo de cliente'" 
                class="h-8 md:h-10 object-contain opacity-40 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" 
              />
              <div 
                v-else 
                class="text-xl md:text-2xl font-black uppercase tracking-tighter opacity-30 hover:opacity-100 transition-all duration-500 cursor-default text-text-main"
              >
                {{ logo.name }}
              </div>
            </template>
          </div>

          <div class="flex items-center gap-16 md:gap-24 min-w-max px-8">
            <template v-for="(logo, index) in displayLogos" :key="'dup-' + index">
              <img 
                v-if="logo.type === 'image'" 
                :src="logo.src" 
                :alt="logo.alt || 'Logo de cliente'" 
                class="h-8 md:h-10 object-contain opacity-40 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" 
              />
              <div 
                v-else 
                class="text-xl md:text-2xl font-black uppercase tracking-tighter opacity-30 hover:opacity-100 transition-all duration-500 cursor-default text-text-main"
              >
                {{ logo.name }}
              </div>
            </template>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Empresas que confiam em nós'
  },
  cWidth: {
    type: String,
    // 🧹 FAXINA: De 'cw-1' para 'w-full' (porque este bloco já é injetado dentro do AppContainer, se for no miolo)
    default: 'w-full' 
  },
  logos: {
    type: Array,
    default: () => []
  }
});

// O seu fallback inteligente mantém-se intocável!
const fallbackLogos = [
  { type: 'text', name: 'SIRIUS' },
  { type: 'text', name: 'NEXUS' },
  { type: 'text', name: 'QUANTUM' },
  { type: 'text', name: 'ECLIPSE' },
  { type: 'text', name: 'NOVA' },
  { type: 'text', name: 'PULSAR' }
];

const displayLogos = computed(() => {
  return props.logos && props.logos.length > 0 ? props.logos : fallbackLogos;
});
</script>

<style scoped>
/* A máscara de desvanecimento e a animação ficam puras no CSS, perfeitas e isoladas! */
.mask-edges {
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 35s linear infinite;
  will-change: transform; /* Excelente prática de otimização de performance GPU! */
}
</style>