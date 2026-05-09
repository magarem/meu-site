<script setup>
defineProps({
  breadcrumbs:  { type: Array,  default: () => [] },
  title:        { type: String, default: '' },
  description:  { type: String, default: '' },
});
</script>

<template>
  <div>
    <nav
      v-if="breadcrumbs.length"
      class="flex items-center flex-wrap gap-1.5 text-white/55 text-[11px] font-semibold uppercase tracking-widest mb-3"
    >
      <NuxtLink to="/" class="hover:text-white transition-colors pointer-events-auto" @click.stop>Início</NuxtLink>
      <template v-for="(crumb, i) in breadcrumbs" :key="i">
        <i class="pi pi-angle-right opacity-50 text-[10px]"></i>
        <NuxtLink
          v-if="i < breadcrumbs.length - 1"
          :to="crumb.path"
          class="hover:text-white transition-colors pointer-events-auto"
          @click.stop
        >{{ crumb.label }}</NuxtLink>
        <span v-else class="text-white">{{ crumb.label }}</span>
      </template>
    </nav>

    <h1 class="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight drop-shadow-lg max-w-4xl">
      {{ title }}
    </h1>

    <p v-if="description" class="mt-2 text-white/75 text-sm md:text-base max-w-2xl leading-relaxed">
      {{ description }}
    </p>
  </div>
</template>
