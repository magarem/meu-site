<template>
  <footer
    class="w-full shrink-0 transition-colors duration-500 relative z-10 mt-auto border-t border-border bg-bg-muted text-text-main pt-16 pb-10"
  >
    <AppContainer 
      size="content" 
      class="flex flex-col md:flex-row justify-between items-center gap-8"
    >

      <div class="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
        <span class="transition-colors duration-500 font-serif text-2xl font-black text-primary">
          SIRIUS STUDIO
        </span>
        <p class="text-text-muted text-sm mt-2 transition-colors hover:text-text-main duration-300">
          © {{ new Date().getFullYear() }} Sirius Studio. Todos os direitos reservados.
        </p>
      </div>

      <div class="flex flex-col items-center md:items-end gap-5">
        
        <div class="flex gap-6 font-medium text-text-muted text-sm">
          <NuxtLink to="/privacidade" class="hover:text-primary transition-colors duration-300">Privacidade</NuxtLink>
          <NuxtLink to="/termos" class="hover:text-primary transition-colors duration-300">Termos</NuxtLink>
          <NuxtLink to="/contactos" class="hover:text-primary transition-colors duration-300">Suporte</NuxtLink>
        </div>
        
        <div class="flex gap-3">
          <a href="#" aria-label="Instagram" class="w-10 h-10 flex items-center justify-center rounded-full bg-text-main text-bg-base transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white hover:shadow-lg">
            <i class="pi pi-instagram text-lg"></i>
          </a>
          <a href="#" aria-label="LinkedIn" class="w-10 h-10 flex items-center justify-center rounded-full bg-text-main text-bg-base transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white hover:shadow-lg">
            <i class="pi pi-linkedin text-lg"></i>
          </a>
          <a href="#" aria-label="Twitter" class="w-10 h-10 flex items-center justify-center rounded-full bg-text-main text-bg-base transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white hover:shadow-lg">
            <i class="pi pi-twitter text-lg"></i>
          </a>
        </div>

      </div>

    </AppContainer>
  </footer>
</template>