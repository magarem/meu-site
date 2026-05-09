<template>
  <!-- Removi o p-8 daqui da raiz e adicionei overflow-hidden para a imagem respeitar os cantos arredondados -->
  <div
    class="flex flex-col rounded-[var(--theme-radius-card,1rem)] border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:!border-[var(--theme-brand)] group cursor-default overflow-hidden"
    :style="{
      backgroundColor: 'color-mix(in srgb, var(--theme-text) 2%, transparent)',
      borderColor: 'color-mix(in srgb, var(--theme-text) 8%, transparent)'
    }"
  >
    <!-- ✨ NOVO: Slot para Imagens (Fica colado às bordas do topo) ✨ -->
    <slot name="image" />

    <!-- Área de Conteúdo (Recebe o padding aqui dinamicamente) -->
    <div :class="['flex flex-col gap-5 h-full', contentPadding]">
      
      <!-- Ícone do Cartão (Opcional) -->
      <div 
        v-if="icon" 
        class="w-14 h-14 rounded-xl bg-[var(--theme-brand)]/10 text-[var(--theme-brand)] flex items-center justify-center transition-colors duration-300 group-hover:bg-[var(--theme-brand)] group-hover:text-white shrink-0"
      >
        <i :class="['pi text-2xl', icon]"></i>
      </div>
      
      <!-- Título -->
      <h2 
        v-if="title" 
        class="text-2xl font-bold transition-colors duration-300" 
        :style="{ color: 'var(--theme-heading-text, var(--theme-text))' }"
      >
        {{ title }}
      </h2>
      
      <!-- Descrição -->
      <p 
        v-if="description" 
        class="text-base leading-relaxed opacity-90 transition-colors duration-300 flex-1" 
        :style="{ color: 'var(--theme-text)' }"
      >
        {{ description }}
      </p>

      <!-- Slot para conteúdo extra no fundo -->
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: false
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  // ✨ NOVO: Permite alterar o padding dependendo de onde usamos o cartão
  contentPadding: {
    type: String,
    default: 'p-8'
  }
});
</script>