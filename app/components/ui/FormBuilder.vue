<template>
  <div class="relative w-full h-full">
    
    <Transition name="fade">
      <div 
        v-if="isSubmitted" 
        class="absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-xl text-center p-8 rounded-2xl transition-colors duration-300"
        :style="{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 90%, transparent)' }"
      >
        <div class="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg border border-green-500/20">
          <i :class="successConfig?.icon || 'pi pi-check'"></i>
        </div>
        <h3 class="text-3xl font-black mb-2" :style="{ color: 'var(--theme-heading-text, var(--theme-text))' }">
          {{ successConfig?.title || 'Recebido!' }}
        </h3>
        <p class="text-base opacity-80 max-w-md transition-colors" :style="{ color: 'var(--theme-text)' }">
          {{ successConfig?.message }}
        </p>
        <button @click="$emit('reset')" class="sirius-btn-secondary mt-8 !px-8">
          {{ successConfig?.buttonLabel || 'Voltar' }}
        </button>
      </div>
    </Transition>

    <form @submit.prevent="$emit('submit')" class="flex flex-col gap-6 relative z-10 mt-4">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="field in schema" 
          :key="field.name"
          :class="field.fullWidth ? 'md:col-span-2' : 'md:col-span-1'"
        >
          <UiInput
            :id="field.name"
            :type="field.type || 'text'"
            :label="field.label"
            :placeholder="field.placeholder"
            :required="field.required"
            :rows="field.rows"
            v-model="model[field.name]"
          />
        </div>
      </div>

      <div v-if="submitConfig" class="flex items-center justify-between mt-2 flex-wrap gap-4">
        <p 
          v-if="submitConfig.terms" 
          class="text-xs opacity-60 max-w-[40ch] transition-colors" 
          :style="{ color: 'var(--theme-text)' }"
        >
          {{ submitConfig.terms }}
        </p>
        
        <button type="submit" class="sirius-btn-primary w-full md:w-auto">
          {{ submitConfig.label || 'Enviar' }} 
          <i v-if="submitConfig.icon" :class="[submitConfig.icon, 'ml-2']"></i>
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
const model = defineModel({ type: Object, required: true });

defineProps({
  schema: { type: Array, required: true },
  submitConfig: {
    type: Object,
    default: () => ({ label: 'Enviar', icon: '', terms: '' })
  },
  // Controle de exibição da tela de sucesso
  isSubmitted: { type: Boolean, default: false },
  // Textos da tela de sucesso
  successConfig: {
    type: Object,
    default: () => ({
      title: 'Sucesso!',
      message: 'Operação realizada com sucesso.',
      icon: 'pi pi-check',
      buttonLabel: 'Voltar'
    })
  }
});

// Emite eventos pro pai: quando envia e quando reseta
defineEmits(['submit', 'reset']);
</script>

<style scoped>
/* Movido para cá para garantir que o componente anime sozinho */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, backdrop-filter 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0);
}
</style>