<template>
  <section :class="['w-full', cWidth]">
    <div 
      class="bg-[var(--theme-brand)] p-10 md:p-16 text-center text-white flex flex-col items-center gap-8 shadow-xl relative overflow-hidden" 
      :style="{ borderRadius: 'var(--theme-radius-card, 1.5rem)' }"
    >
      <!-- Efeito visual decorativo de fundo -->
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <!-- Título Principal -->
      <h2 class="text-3xl md:text-5xl font-black tracking-tight relative z-10">
        {{ title }}
      </h2>
      
      <!-- Subtítulo -->
      <p v-if="subtitle" class="text-lg md:text-xl opacity-90 max-w-[50ch] relative z-10 leading-relaxed">
        {{ subtitle }}
      </p>
      
      <!-- Botão (NuxtLink) com animação no hover -->
      <NuxtLink 
        :to="buttonLink" 
        class="mt-4 inline-flex items-center justify-center bg-white text-[var(--theme-brand)] font-bold text-sm uppercase tracking-wider px-8 py-4 hover:scale-105 hover:shadow-lg transition-all shadow-md relative z-10 active:scale-95 group" 
        :style="{ borderRadius: 'var(--theme-radius-btn, 0.75rem)' }"
      >
        {{ buttonText }} 
        <i class="pi pi-arrow-right ml-3 text-lg transition-transform group-hover:translate-x-2"></i>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Pronto para inovar?'
  },
  subtitle: {
    type: String,
    default: 'Junta-te a nós e transforma a forma como constróis na web com sistemas de design centralizados.'
  },
  buttonText: {
    type: String,
    default: 'Falar Connosco'
  },
  buttonLink: {
    type: String,
    default: '/contactos'
  },
  cWidth: {
    type: String,
    default: 'cw-1'
  }
});
</script>