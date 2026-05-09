<template>
  <div class="min-h-screen flex flex-col bg-bg-base text-text-main font-sans transition-colors duration-500 w-full relative">
    
    <SiteHeader :is-glass="true" />

    <main class="flex-1 w-full flex flex-col">
       <slot />
    </main>

    <Footer />

  </div>
</template>

<script setup>
// 🧹 LIMPEZA TOTAL CONFIRMADA!
// O CSS global e as variáveis nativas resolvem tudo.
</script>