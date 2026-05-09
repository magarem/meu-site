<template>
  <div :class="['w-full mx-auto', cWidth]">
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <UiCard
        v-for="(item, index) in items"
        :key="index"
        :title="item.title"
        :description="item.description"
        content-padding="p-6 md:p-8"
        class="!cursor-pointer h-full"
        @click="openModal(index)"
      >
        <template #image>
          <div
            class="w-full h-64 md:h-72 overflow-hidden relative bg-black/5 shrink-0 border-b border-black/5 group"
          >
            <div
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center text-white"
            >
              <i
                class="pi pi-search-plus text-4xl transform scale-50 group-hover:scale-100 transition-transform duration-300"
              ></i>
            </div>
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-0"
            />
          </div>
        </template>
      </UiCard>
    </section>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isModalOpen"
          class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-lg"
        >
          <div
            class="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 text-white"
          >
            <div class="flex items-center gap-6">
              <span
                class="text-sm font-bold opacity-70 uppercase tracking-widest"
              >
                {{ currentIndex + 1 }} / {{ items.length }}
              </span>
              <button
                @click.stop="toggleSlideshow"
                class="flex items-center gap-2 hover:text-[var(--theme-brand)] transition-colors"
              >
                <i
                  :class="isSlideshowRunning ? 'pi pi-pause' : 'pi pi-play'"
                ></i>
                <span class="text-sm font-bold uppercase tracking-wider">{{
                  isSlideshowRunning ? "Pausar" : "Slideshow"
                }}</span>
              </button>
            </div>

            <button
              @click.stop="closeModal"
              class="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-[var(--theme-brand)] transition-colors"
            >
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>

          <button
            @click.stop="prevImage"
            class="absolute left-4 md:left-10 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-[var(--theme-brand)] hover:scale-110 transition-all text-white backdrop-blur-md"
          >
            <i class="pi pi-chevron-left text-2xl"></i>
          </button>
          <button
            @click.stop="nextImage"
            class="absolute right-4 md:right-10 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-[var(--theme-brand)] hover:scale-110 transition-all text-white backdrop-blur-md"
          >
            <i class="pi pi-chevron-right text-2xl"></i>
          </button>

          <div
            class="w-full h-full p-4 md:p-24 flex flex-col items-center justify-center relative cursor-auto"
            @click.self="closeModal"
          >
            <Transition name="slide-fade" mode="out-in">
              <img
                v-if="currentItem && currentItem.image"
                :key="currentIndex"
                :src="currentItem.image"
                :alt="currentItem.title"
                class="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
              />
            </Transition>

            <div
              v-if="currentItem"
              class="mt-8 text-center text-white max-w-2xl"
            >
              <h3 class="text-3xl font-black mb-2">{{ currentItem.title }}</h3>
              <p class="text-lg opacity-80">{{ currentItem.description }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from "vue";
// O Nuxt faz auto-import, mas se precisar importar manualmente o UiCard:
// import UiCard from "~/components/ui/Card.vue";

const props = defineProps({
  // A prop Mágica: Agora o componente recebe os dados de fora
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  cWidth: {
    type: String,
    default: 'cw-1' // Fallback de segurança para o tamanho padrão
  }
});

// 🚀 ESTADO DO MODAL & SLIDESHOW
const isModalOpen = ref(false);
const currentIndex = ref(0);
const isSlideshowRunning = ref(false);
let slideshowTimer = null;

const currentItem = computed(() => props.items[currentIndex.value]);

const openModal = (index) => {
  currentIndex.value = index;
  isModalOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = "";
  stopSlideshow();
};

const nextImage = () => {
  if (currentIndex.value < props.items.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0;
  }
};

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = props.items.length - 1;
  }
};

const startSlideshow = () => {
  isSlideshowRunning.value = true;
  slideshowTimer = setInterval(() => {
    nextImage();
  }, 3500);
};

const stopSlideshow = () => {
  isSlideshowRunning.value = false;
  if (slideshowTimer) {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
  }
};

const toggleSlideshow = () => {
  if (isSlideshowRunning.value) {
    stopSlideshow();
  } else {
    startSlideshow();
  }
};

onUnmounted(() => {
  stopSlideshow();
  document.body.style.overflow = "";
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from {
  transform: translateX(20px) scale(0.98);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-20px) scale(0.98);
  opacity: 0;
}
</style>
