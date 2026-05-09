<template>
  <div class="min-h-screen flex flex-col bg-bg-base text-text-main font-sans transition-colors duration-500 w-full relative">
    
    <SiteHeader :is-glass="false" />

    <main class="flex-1 w-full flex flex-col px-7">
       <slot />
    </main>

    <Footer />

  </div>
</template>

<script setup>
// Sem lógica extra! O layout apenas orquestra as peças.
// O CSS (main.css) trata das cores, e os componentes tratam dos dados.
</script>