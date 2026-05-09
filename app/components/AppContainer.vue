<template>
  <div 
    class="mx-auto "
    :class="{
      'max-w-site': size === 'site',
      'max-w-content': size === 'content',
      'max-w-copy': size === 'copy'
    }"
  >
    <slot />
  </div>
</template>

<script setup>
// Propriedade 'size' com valor padrão 'content'
defineProps({
  size: {
    type: String,
    default: 'content', 
    validator: (value) => ['site', 'content', 'copy'].includes(value)
  }
})
</script>