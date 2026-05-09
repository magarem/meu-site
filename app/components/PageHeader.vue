<template>
  <section v-if="title" :class="['flex flex-col relative pt-4 pb-0 md:pt-0 transition-colors duration-500', alignmentClass, cWidth]">  
    
    <div 
      v-if="tag" 
      class="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 opacity-80 transition-colors duration-500 text-primary"
    >
      <i v-if="tagIcon" :class="[tagIcon, 'text-sm']"></i> 
      {{ tag }}
    </div>

    <h2 
      class="text-3xl md:text-3xl lg:text-4xl font-serif font-bold tracking-tight leading-snug mb-3 transition-colors duration-500 text-text-main"
    >
      {{ title }} 
      
      <span 
        v-if="highlight" 
        class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"
      >
        {{ highlight }}
      </span>
    </h2>

    <p 
      v-if="subtitle" 
      class="text-sm md:text-base font-sans font-normal opacity-70 max-w-[65ch] leading-relaxed transition-colors duration-500 text-text-muted"
    >
      {{ subtitle }}
    </p>

    <div v-if="$slots.default" class="mt-4 md:mt-5 w-full flex" :class="slotAlignmentClass">
      <slot />
    </div>
    
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: { 
    type: String, 
    required: true 
  },
  highlight: { 
    type: String, 
    default: '' 
  },
  subtitle: { 
    type: String, 
    default: '' 
  },
  tag: { 
    type: String, 
    default: '' 
  },
  tagIcon: { 
    type: String, 
    default: '' 
  },
  cWidth: { 
    type: String, 
    default: 'content' 
  },
  BoxAlign: { 
    type: String, 
    default: 'center' 
  }
});

// Computada inteligente para lidar com o alinhamento do Flexbox e Texto
const alignmentClass = computed(() => {
  if (props.BoxAlign === 'left') return 'text-left items-start';
  if (props.BoxAlign === 'right') return 'text-right items-end';
  return 'text-center items-center mx-auto'; // Fallback para centro
});

// Garante que qualquer elemento injetado no <slot /> (como botões) herde o alinhamento
const slotAlignmentClass = computed(() => {
  if (props.BoxAlign === 'left') return 'justify-start';
  if (props.BoxAlign === 'right') return 'justify-end';
  return 'justify-center';
});
</script>