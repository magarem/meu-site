<script setup>
defineProps({ count: { type: Number, default: 0 } });
defineEmits(['click']);
</script>

<template>
  <button
    class="flex items-center gap-2 bg-white hover:bg-neutral-100 active:scale-95 text-neutral-800 text-xs font-semibold px-4 py-2.5 rounded-lg border border-neutral-300 shadow-sm transition-all"
    @click="$emit('click')"
  >
    <i class="pi pi-images text-sm"></i>
    Mostrar todas as fotos
    <span v-if="count > 1" class="text-neutral-400 font-normal">({{ count }})</span>
  </button>
</template>
