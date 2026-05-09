<template>
  <section class="py-16 md:py-14 flex flex-col gap-16 md:gap-12 transition-colors duration-500">
    
    <PageHeader
      tag="O que dizem sobre nós"
      tagIcon="pi pi-star-fill"
      :title="title"
      highlight="Sirius Studio"
      :subtitle="subtitle"
    />

    <div :class="['flex flex-col gap-12 mx-auto', cWidth]">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <div 
          v-for="(review, index) in displayReviews" 
          :key="index" 
          class="flex flex-col h-full relative z-0 overflow-hidden group p-6 md:p-8 rounded-cartao border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-bg-muted border-border"
        >
          <div class="absolute inset-0 rounded-cartao border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 border-primary"></div>
          
          <i class="pi pi-quote-right absolute -bottom-4 -right-4 text-9xl opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 z-[-1] pointer-events-none text-primary"></i>
          
          <div class="flex gap-1 text-amber-400 mb-6 relative z-20">
            <i v-for="star in review.rating || 5" :key="star" class="pi pi-star-fill text-sm drop-shadow-sm"></i>
          </div>
          
          <p class="text-base md:text-lg italic opacity-90 mb-8 flex-1 leading-relaxed transition-colors duration-500 relative z-20 font-sans text-text-main">
            "{{ review.text }}"
          </p>
          
          <div class="flex items-center gap-4 mt-auto pt-6 border-t transition-colors duration-500 relative z-20 border-border">
            
            <div class="relative">
              <img 
                :src="review.avatar" 
                :alt="review.name" 
                class="w-12 h-12 rounded-full object-cover transition-all duration-300 shadow-sm border-2 border-transparent"
              />
              <div class="absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border-primary"></div>

              <div class="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center border-2 transition-colors duration-500 border-bg-base">
                <i class="pi pi-check text-[8px] font-bold"></i>
              </div>
            </div>
            
            <div class="flex flex-col">
              <span class="font-bold text-sm transition-colors duration-500 text-primary font-sans">
                {{ review.name }}
              </span>
              <span class="text-xs font-medium transition-colors duration-500 text-text-muted">
                {{ review.role }}
              </span>
            </div>

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
    default: 'Histórias de Sucesso'
  },
  subtitle: {
    type: String,
    default: 'Descobre como ajudámos marcas ambiciosas a escalar e a transformar a sua presença digital de forma impactante.'
  },
  cWidth: {
    type: String,
    // 🧹 FAXINA: O cw-1 passa oficialmente a w-full, permitindo ao AppContainer comandar a largura.
    default: 'w-full' 
  },
  reviews: {
    type: Array,
    default: () => []
  }
});

const fallbackReviews = [
  {
    rating: 5,
    text: "A transformação foi incrível. Em apenas 3 meses duplicámos a nossa taxa de conversão online.",
    name: "Ana Silva",
    role: "CMO, TechNova",
    avatar: "https://i.pravatar.cc/150?img=47"
  },
  {
    rating: 5,
    text: "O nível de detalhe e profissionalismo desta equipa é algo que raramente se encontra no mercado atual.",
    name: "Ricardo Mendes",
    role: "Fundador, StartUp UX",
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  {
    rating: 5,
    text: "Não entregaram apenas um site, entregaram uma máquina de vendas perfeitamente oleada e esteticamente perfeita.",
    name: "Sofia Costa",
    role: "Diretora Criativa, Estúdio B",
    avatar: "https://i.pravatar.cc/150?img=5"
  }
];

const displayReviews = computed(() => {
  return props.reviews && props.reviews.length > 0 ? props.reviews : fallbackReviews;
});
</script>