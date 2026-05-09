<template>
  <div class="flex flex-col gap-2">
    <label :for="id" class="font-bold opacity-80 uppercase tracking-wider text-[10px]" :style="{ color: 'var(--theme-text)' }">
      {{ label }}
    </label>

    <textarea
      v-if="type === 'textarea'"
      :id="id"
      v-model="model"
      :rows="rows"
      :required="required"
      :placeholder="placeholder"
      class="border border-transparent focus:border-[var(--theme-brand)] rounded-xl p-4 outline-none transition-all w-full resize-none bg-[color-mix(in_srgb,var(--theme-text)_5%,transparent)] focus:bg-[var(--theme-bg)] shadow-inner"
      :style="{ color: 'var(--theme-text)' }"
    ></textarea>

    <input
      v-else
      :type="type"
      :id="id"
      v-model="model"
      :required="required"
      :placeholder="placeholder"
      class="border border-transparent focus:border-[var(--theme-brand)] rounded-xl p-4 outline-none transition-all w-full bg-[color-mix(in_srgb,var(--theme-text)_5%,transparent)] focus:bg-[var(--theme-bg)] shadow-inner"
      :style="{ color: 'var(--theme-text)' }"
    />
  </div>
</template>

<script setup>
// O defineModel() é a forma moderna (Vue 3.4+) de gerir v-model
const model = defineModel();

defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: 'text' }, // Pode ser 'text', 'email', 'textarea', etc.
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
  rows: { type: [Number, String], default: 5 } // Usado apenas se for textarea
});
</script>