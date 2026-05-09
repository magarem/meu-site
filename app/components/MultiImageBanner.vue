<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useMediaUrl } from '~/composables/useMediaUrl';

const props = defineProps({
  images:   { type: Array,  required: true, validator: (v) => v.length > 0 },
  cWidth:   { type: String, default: 'content' },
  pagePath: { type: String, default: '' },
  class:    { type: String, default: '' },
});

const count = computed(() => props.images.length);
const { resolve: resolveImage } = useMediaUrl(() => props.pagePath);

// ── Mobile carousel ───────────────────────────────────────────────────────────
const mobileIndex = ref(0);
const nextMobile  = () => { mobileIndex.value = (mobileIndex.value + 1) % count.value; };
const prevMobile  = () => { mobileIndex.value = (mobileIndex.value - 1 + count.value) % count.value; };

// ── Lightbox ──────────────────────────────────────────────────────────────────
const isLightboxOpen = ref(false);
const currentIndex   = ref(0);
const isPlaying      = ref(false);
let slideshowInterval = null;

const openLightbox    = (i)  => { currentIndex.value = i; isLightboxOpen.value = true; document.body.style.overflow = 'hidden'; };
const closeLightbox   = ()   => { isLightboxOpen.value = false; stopSlideshow(); document.body.style.overflow = ''; };
const nextImage       = ()   => { currentIndex.value = (currentIndex.value + 1) % count.value; };
const prevImage       = ()   => { currentIndex.value = (currentIndex.value - 1 + count.value) % count.value; };
const toggleSlideshow = ()   => isPlaying.value ? stopSlideshow() : startSlideshow();
const startSlideshow  = ()   => { isPlaying.value = true;  slideshowInterval = setInterval(nextImage, 3000); };
const stopSlideshow   = ()   => { isPlaying.value = false; if (slideshowInterval) clearInterval(slideshowInterval); };

const handleKeydown = (e) => {
  if (!isLightboxOpen.value) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowRight') { stopSlideshow(); nextImage(); }
  if (e.key === 'ArrowLeft')  { stopSlideshow(); prevImage(); }
};
onMounted(()   => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => { window.removeEventListener('keydown', handleKeydown); stopSlideshow(); });
</script>

<template>
  <AppContainer :size="cWidth" :class="['w-full', props.class]">

    <!-- ═══════════════════════════════════════════════════════════════
         MOBILE  — single image carousel with counter
    ════════════════════════════════════════════════════════════════════ -->
    <div class="md:hidden relative aspect-[4/3] rounded-2xl overflow-hidden">
      <img :src="resolveImage(images[mobileIndex])" alt="Foto" class="w-full h-full object-cover" />

      <template v-if="count > 1">
        <button @click.stop="prevMobile" class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-black rounded-full flex items-center justify-center shadow-md transition-all active:scale-95">
          <i class="pi pi-angle-left text-sm"></i>
        </button>
        <button @click.stop="nextMobile" class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-black rounded-full flex items-center justify-center shadow-md transition-all active:scale-95">
          <i class="pi pi-angle-right text-sm"></i>
        </button>
        <div class="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {{ mobileIndex + 1 }} / {{ count }}
        </div>
      </template>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         DESKTOP  — Airbnb-style grids
    ════════════════════════════════════════════════════════════════════ -->

    <!-- ── 1 image ───────────────────────────────────────────────── -->
    <div
      v-if="count === 1"
      class="hidden md:block relative rounded-2xl overflow-hidden h-[55vh] cursor-pointer group"
      @click="openLightbox(0)"
    >
      <img :src="resolveImage(images[0])" alt="Foto" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
    </div>

    <!-- ── 2 images ──────────────────────────────────────────────── -->
    <div
      v-else-if="count === 2"
      class="hidden md:grid grid-cols-2 gap-2 h-[55vh] relative rounded-2xl overflow-hidden"
    >
      <div class="relative overflow-hidden group cursor-pointer" @click="openLightbox(0)">
        <img :src="resolveImage(images[0])" alt="Foto 1" class="w-full h-full object-cover transition-all duration-700 group-hover:brightness-90 group-hover:scale-105" />
      </div>
      <div class="relative overflow-hidden group cursor-pointer" @click="openLightbox(1)">
        <img :src="resolveImage(images[1])" alt="Foto 2" class="w-full h-full object-cover transition-all duration-700 group-hover:brightness-90 group-hover:scale-105" />
      </div>
    </div>

    <!-- ── 3 images ──────────────────────────────────────────────── -->
    <div
      v-else-if="count === 3"
      class="hidden md:grid gap-2 h-[55vh] relative rounded-2xl overflow-hidden"
      style="grid-template-columns: 2fr 1fr; grid-template-rows: 1fr 1fr;"
    >
      <div class="row-span-2 relative overflow-hidden group cursor-pointer" @click="openLightbox(0)">
        <img :src="resolveImage(images[0])" alt="Foto 1" class="w-full h-full object-cover transition-all duration-700 group-hover:brightness-90 group-hover:scale-105" />
      </div>
      <div class="relative overflow-hidden group cursor-pointer" @click="openLightbox(1)">
        <img :src="resolveImage(images[1])" alt="Foto 2" class="w-full h-full object-cover transition-all duration-700 group-hover:brightness-90 group-hover:scale-105" />
      </div>
      <div class="relative overflow-hidden group cursor-pointer" @click="openLightbox(2)">
        <img :src="resolveImage(images[2])" alt="Foto 3" class="w-full h-full object-cover transition-all duration-700 group-hover:brightness-90 group-hover:scale-105" />
      </div>
    </div>

    <!-- ── 4 images ──────────────────────────────────────────────── -->
    <div
      v-else-if="count === 4"
      class="hidden md:grid gap-2 h-[55vh] relative rounded-2xl overflow-hidden"
      style="grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 1fr 1fr;"
    >
      <div class="row-span-2 relative overflow-hidden group cursor-pointer" @click="openLightbox(0)">
        <img :src="resolveImage(images[0])" alt="Foto 1" class="w-full h-full object-cover transition-all duration-700 group-hover:brightness-90 group-hover:scale-105" />
      </div>
      <div v-for="(img, i) in images.slice(1)" :key="i"
        :class="['relative overflow-hidden group cursor-pointer', i === 2 ? 'col-span-2' : '']"
        @click="openLightbox(i + 1)"
      >
        <img :src="resolveImage(img)" :alt="`Foto ${i + 2}`" class="w-full h-full object-cover transition-all duration-700 group-hover:brightness-90 group-hover:scale-105" />
      </div>
    </div>

    <!-- ── 5+ images — Airbnb classic mosaic ─────────────────────── -->
    <div
      v-else
      class="hidden md:grid gap-2 h-[55vh] relative rounded-2xl overflow-hidden"
      style="grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 1fr 1fr;"
    >
      <div class="row-span-2 relative overflow-hidden group cursor-pointer" @click="openLightbox(0)">
        <img :src="resolveImage(images[0])" alt="Foto principal" class="w-full h-full object-cover transition-all duration-700 group-hover:brightness-90 group-hover:scale-105" />
      </div>
      <div v-for="(img, i) in images.slice(1, 5)" :key="i" class="relative overflow-hidden group cursor-pointer" @click="openLightbox(i + 1)">
        <img :src="resolveImage(img)" :alt="`Foto ${i + 2}`" class="w-full h-full object-cover transition-all duration-700 group-hover:brightness-90 group-hover:scale-105" />
        <div v-if="i === 3 && count > 5" class="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold">
          +{{ count - 5 }}
        </div>
      </div>
    </div>

    <!-- ── LIGHTBOX ───────────────────────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isLightboxOpen" class="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex items-center justify-center">
          <div class="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-50">
            <div class="text-white/80 font-black tracking-widest text-xs bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/10">
              {{ currentIndex + 1 }} / {{ count }}
            </div>
            <div class="flex items-center gap-4">
              <button @click="toggleSlideshow" class="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-primary text-white rounded-full transition-all active:scale-90">
                <i :class="['pi text-xl', isPlaying ? 'pi-pause' : 'pi-play']"></i>
              </button>
              <button @click="closeLightbox" class="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-red-500 text-white rounded-full transition-all active:scale-90">
                <i class="pi pi-times text-xl"></i>
              </button>
            </div>
          </div>
          <button @click.stop="stopSlideshow(); prevImage()" class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-white/20 text-white rounded-full transition-all hover:-translate-x-1 z-50 border border-white/10">
            <i class="pi pi-chevron-left text-2xl"></i>
          </button>
          <div class="w-full h-full flex items-center justify-center p-4 md:p-20" @click.self="closeLightbox">
            <img :src="resolveImage(images[currentIndex])" class="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] select-none animate-in zoom-in-95 duration-300" alt="Zoomed" />
          </div>
          <button @click.stop="stopSlideshow(); nextImage()" class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-white/20 text-white rounded-full transition-all hover:translate-x-1 z-50 border border-white/10">
            <i class="pi pi-chevron-right text-2xl"></i>
          </button>
        </div>
      </Transition>
    </Teleport>

  </AppContainer>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
