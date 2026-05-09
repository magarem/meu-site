<script setup>
defineProps({
  isGlass: Boolean,
  isScrolled: Boolean,
  isMobileMenuOpen: Boolean,
  topbarConfig: Object,
  menuItems: { type: Array, default: () => [] }
});

defineEmits(['close-menu']);
</script>

<template>
  <nav class="hidden md:flex items-center gap-8 tracking-wide transition-colors duration-500">
    
    <NuxtLink 
      v-for="(item, index) in menuItems" 
      :key="`desktop-${index}`"
      :to="item.path" 
      class="relative py-2 group transition-colors duration-500 font-medium"
      :class="(isGlass && !isScrolled) ? 'text-white' : 'text-text-muted hover:text-primary'"
    >
      <span class="group-hover:opacity-70 transition-opacity">
        {{ item.label }}
      </span>
      <span class="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
    </NuxtLink>

  </nav>

  <Transition name="mobile-menu">
    <div 
      v-if="isMobileMenuOpen" 
      class="md:hidden absolute top-full left-0 w-full flex flex-col items-center py-6 shadow-2xl border-b border-border backdrop-blur-xl transition-all duration-500 bg-bg-base text-text-main"
    >
      <nav class="flex flex-col w-full px-6 gap-2">
        
        <NuxtLink 
          v-for="(item, index) in menuItems" 
          :key="`mobile-${index}`"
          :to="item.path" 
          class="flex items-center justify-between w-full p-4 rounded-cartao hover:bg-bg-muted transition-all duration-300 group font-sans text-lg font-bold text-text-muted hover:text-text-main"
          @click="$emit('close-menu')"
        >
          <span>{{ item.label }}</span>
          <i class="pi pi-arrow-right opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-sm text-primary"></i>
        </NuxtLink>

        <div class="mt-4 pt-4 border-t border-border w-full">
          <button 
            class="w-full px-6 py-4 rounded-botao text-white font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 bg-primary font-sans"
          >
            Começar Projeto <i class="pi pi-sparkles"></i>
          </button>
        </div>

      </nav>
    </div>
  </Transition>
</template>

<style scoped>
/* A animação nativa do Vue continua intacta e maravilhosa! */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.95);
}
</style>