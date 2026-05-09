<template>
  <section class="w-full py-24 md:py-32 overflow-hidden relative group">
    
    <div class="absolute inset-0 z-0 transition-colors duration-500 bg-text-main"></div>

    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30 pointer-events-none mix-blend-screen">
      <div class="absolute -top-[30%] -right-[10%] w-[60%] h-[80%] rounded-full blur-[140px] transition-colors duration-500 bg-primary"></div>
      <div class="absolute -bottom-[30%] -left-[10%] w-[60%] h-[80%] rounded-full blur-[140px] transition-colors duration-500 bg-primary"></div>
    </div>

    <div :class="['relative z-10 flex flex-col items-center text-center px-4 mx-auto', ctaConfig.cWidth]">
      
      <h2 class="text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tighter mb-6 drop-shadow-lg leading-[1.1] max-w-[15ch] transition-colors duration-500 text-bg-base">
        {{ ctaConfig.title }}
      </h2>

      <p 
        v-if="ctaConfig.subtitle" 
        class="text-lg md:text-xl max-w-[55ch] mb-12 font-sans font-medium leading-relaxed transition-colors duration-500 text-bg-base opacity-80"
      >
        {{ ctaConfig.subtitle }}
      </p>

      <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <NuxtLink 
          :to="ctaConfig.buttonLink" 
          class="cta-button inline-flex items-center justify-center px-10 py-5 text-white font-sans font-black text-sm uppercase tracking-[0.15em] rounded-botao transition-all duration-300 hover:scale-105 active:scale-95 group/btn bg-primary hover:bg-bg-base hover:text-text-main"
        >
          {{ ctaConfig.buttonText }} 
          <i class="pi pi-arrow-right ml-4 text-lg transition-transform group-hover/btn:translate-x-2"></i>
        </NuxtLink>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
});

// O seu sistema brilhante de fallbacks!
const ctaConfig = computed(() => ({
  title: 'Pronto para dar vida à tua ideia?',
  subtitle: 'Junta-te às marcas inovadoras que já transformaram a sua presença digital connosco. O teu próximo grande projeto começa agora.',
  buttonText: 'Iniciar Projeto',
  buttonLink: '/contact',
  // 🧹 FAXINA: Alterado de 'cw-1' para 'w-full' para fluir com o AppContainer da página!
  cWidth: 'w-full',
  ...props.config 
}));
</script>

<style scoped>
/* ✨ MÁGICA DA SOMBRA DINÂMICA ✨
  Mantivemos o CSS puro aqui, lendo perfeitamente as variáveis oficiais 
  declaradas no nosso ficheiro global main.css.
*/
.cta-button {
  box-shadow: 0 0 30px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.cta-button:hover {
  /* 🧹 FAXINA: Atualizado para var(--color-bg-base) para evitar bugs na inversão de sombra */
  box-shadow: 0 0 45px color-mix(in srgb, var(--color-bg-base) 50%, transparent);
}
</style>