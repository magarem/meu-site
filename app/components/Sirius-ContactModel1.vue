<template>
  <AppContainer size="content" class="mb-20">
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 transition-colors duration-500">
      
      <div class="flex flex-col gap-6 lg:col-span-1">
        <div
          v-for="(info, index) in contactInfo"
          :key="index"
          class="flex flex-col p-6 rounded-cartao border border-border bg-bg-muted transition-all duration-500 ease-out group shadow-sm hover:shadow-xl hover:-translate-y-2"
        >
          <div class="flex items-start gap-4">
            
            <div
              class="w-12 h-12 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl transition-all duration-500 ease-out group-hover:bg-primary group-hover:text-bg-base group-hover:scale-105 group-hover:shadow-lg"
            >
              <i :class="info.icon"></i>
            </div>
            
            <div>
              <h3 class="font-bold font-sans text-lg mb-1 transition-colors duration-500 text-text-main group-hover:text-primary">
                {{ info.title }}
              </h3>
              <p
                class="text-sm text-text-muted leading-relaxed transition-colors duration-500"
                v-html="info.content"
              ></p>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 relative overflow-hidden flex flex-col p-8 md:p-10 rounded-cartao border border-border bg-bg-muted shadow-sm transition-all duration-500">
        
        <h2 class="text-2xl font-serif font-bold mb-8 transition-colors duration-500 text-text-main">
          {{ formTitle }}
        </h2>

        <Transition name="fade-slide" mode="out-in">
          
          <div v-if="isSubmitted" class="flex flex-col items-center justify-center text-center py-12 gap-4">
            
            <div class="w-20 h-20 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-4xl mb-4 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <i class="pi pi-check"></i>
            </div>
            
            <h3 class="text-2xl font-bold text-text-main">{{ successConfig.title || 'Mensagem Enviada!' }}</h3>
            <p class="text-text-muted max-w-[40ch] leading-relaxed">{{ successConfig.message || 'Obrigado pelo seu contacto. Responderemos o mais breve possível.' }}</p>
            
            <button
              @click="handleReset"
              class="mt-6 px-8 py-3 border border-border rounded-botao text-text-main hover:bg-bg-base hover:shadow-md hover:-translate-y-1 active:scale-95 transition-all duration-500 ease-out font-bold tracking-wider uppercase text-sm"
            >
              {{ successConfig.resetLabel || 'Enviar nova mensagem' }}
            </button>
          </div>

          <form v-else @submit.prevent="handleSubmit" class="flex flex-col gap-6 w-full">
            
            <div v-for="field in formSchema" :key="field.name" class="flex flex-col gap-2">
              
              <label :for="field.name" class="text-sm font-bold text-text-muted ml-1">
                {{ field.label }} <span v-if="field.required" class="text-red-500">*</span>
              </label>

              <textarea
                v-if="field.type === 'textarea'"
                :id="field.name"
                v-model="form[field.name]"
                :required="field.required"
                :placeholder="field.placeholder"
                rows="4"
                class="w-full px-5 py-4 rounded-botao border border-border bg-bg-base text-text-main focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-500 ease-out resize-y placeholder:text-text-muted hover:border-primary/50"
              ></textarea>

              <input
                v-else
                :type="field.type || 'text'"
                :id="field.name"
                v-model="form[field.name]"
                :required="field.required"
                :placeholder="field.placeholder"
                class="w-full px-5 py-4 rounded-botao border border-border bg-bg-base text-text-main focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-500 ease-out placeholder:text-text-muted hover:border-primary/50"
              />
            </div>

            <button
              type="submit"
              class="mt-4 w-full md:w-auto self-start px-10 py-4 bg-primary text-white font-bold tracking-widest uppercase text-sm rounded-botao hover:bg-text-main hover:text-bg-base hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 active:scale-95 transition-all duration-500 ease-out flex items-center justify-center gap-3 group/btn"
            >
              {{ submitConfig.label || 'Enviar Mensagem' }}
              <i class="pi pi-send transition-transform duration-500 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"></i>
            </button>

          </form>

        </Transition>

      </div>
    </section>
  </AppContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  contactInfo: { type: Array, required: true },
  formTitle: { type: String, default: "Envia-nos uma mensagem" },
  formSchema: { type: Array, required: true },
  submitConfig: { type: Object, required: true },
  successConfig: { type: Object, required: true },
});

const isSubmitted = ref(false);
const form = ref({});

onMounted(() => {
  if (props.formSchema) {
    props.formSchema.forEach(field => {
      form.value[field.name] = '';
    });
  }
});

const handleSubmit = async () => {
  // Simula um envio para uma API
  await new Promise(resolve => setTimeout(resolve, 400));
  isSubmitted.value = true;
};

const handleReset = () => {
  Object.keys(form.value).forEach(key => {
    form.value[key] = '';
  });
  isSubmitted.value = false;
};
</script>

<style scoped>
/* A magia da transição continua intacta e limpa no CSS isolado! */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.98);
}
</style>