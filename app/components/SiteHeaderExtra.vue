<script setup>
import { ref, onMounted } from 'vue';

defineProps({
  isGlass: Boolean,
  isScrolled: Boolean,
  isMobileMenuOpen: Boolean
});

defineEmits(['toggle-menu']);

const isDark = ref(false);

// Função mestre para aplicar o tema
const applyTheme = (dark) => {
  isDark.value = dark;
  if (dark) {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
  }
};

onMounted(() => {
  // 1. Verifica se já existe preferência salva
  const savedTheme = localStorage.theme;
  // 2. Verifica preferência do sistema operativo
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    applyTheme(true);
  } else {
    applyTheme(false);
  }
});

const toggleTheme = () => {
  applyTheme(!isDark.value);
};
</script>

<template>
  <div 
    class="flex items-center gap-2 md:gap-4 relative z-50 transition-colors duration-500" 
    :class="(isGlass && !isScrolled && !isMobileMenuOpen) ? 'text-white' : 'text-text-muted'"
  >
    <button 
      @click="toggleTheme" 
      class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 transition-all duration-300" 
      aria-label="Mudar Tema"
    >
      <i :class="[
        'pi text-lg md:text-xl transition-all duration-500', 
        isDark ? 'pi-sun rotate-180 text-accent' : 'pi-moon text-text-main'
      ]"></i>
    </button>

    <button 
      class="hidden md:inline-flex px-6 py-2.5 rounded-botao font-bold uppercase tracking-widest hover:scale-105 transition-all duration-300 shadow-md active:scale-95 bg-primary text-white font-sans text-xs md:text-sm"
    >
      Começar
    </button>

    <button 
      class="md:hidden flex items-center justify-center w-12 h-12 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all duration-300"
      @click="$emit('toggle-menu')"
    >
      <i :class="['pi text-2xl transition-transform duration-500', isMobileMenuOpen ? 'pi-times rotate-90' : 'pi-bars']"></i>
    </button>
  </div>
</template>