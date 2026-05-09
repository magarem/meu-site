<template>
  <section :class="['py-0 transition-colors duration-500', cWidth]">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <div
        v-for="(link, index) in displayLinks"
        :key="index"
        class="relative flex flex-col h-full p-8 rounded-cartao border border-border bg-bg-muted transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group" 
      >
        <div class="flex flex-col items-center text-center gap-5 h-full relative z-0">
          
          <NuxtLink :to="link.to" class="absolute inset-0 z-10" :aria-label="link.title"></NuxtLink>

          <div class="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-bg-base">
            <i :class="['pi', link.icon]"></i>
          </div>
          
          <div>
            <h3 class="font-bold font-sans text-2xl mb-2 transition-colors duration-500 text-text-main group-hover:text-primary">
              {{ link.title }}
            </h3>
            <p class="text-sm text-text-muted leading-relaxed transition-colors duration-500">
              {{ link.description }}
            </p>
          </div>
          
          <span class="font-bold font-sans text-sm tracking-wider uppercase mt-auto group-hover:underline relative z-20 transition-colors duration-500 text-primary">
            {{ link.ctaText }} &rarr;
          </span>

        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  cWidth: {
    type: String,
    // 🧹 FAXINA: Atualizado de 'cw-1' para 'w-full' para respeitar o AppContainer pai
    default: 'w-full'
  },
  links: {
    type: Array,
    default: () => []
  }
});

// 🛡️ Fallbacks
const defaultLinks = [
  {
    icon: 'pi-bolt',
    title: 'Rapidez e Eficiência',
    description: 'Os nossos processos são otimizados para entregar resultados no menor tempo possível.',
    ctaText: 'Descobrir Mais',
    to: '/servicos'
  },
  {
    icon: 'pi-shield',
    title: 'Segurança Total',
    description: 'Garantimos a proteção dos seus dados com as mais avançadas tecnologias de encriptação.',
    ctaText: 'Ver Protocolos',
    to: '/seguranca'
  },
  {
    icon: 'pi-chart-line',
    title: 'Crescimento Real',
    description: 'Estratégias baseadas em dados concretos para escalar o seu negócio rapidamente.',
    ctaText: 'Ver Casos',
    to: '/portfolio'
  }
];

const displayLinks = computed(() => {
  return props.links && props.links.length > 0 ? props.links : defaultLinks;
});
</script>