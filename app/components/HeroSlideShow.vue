<template>
  <section class="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
    
    <div class="absolute inset-0 w-full h-full z-0">
      <TransitionGroup name="hero-fade">
        <div
          v-for="(slide, index) in normalizedSlides"
          v-show="currentSlide === index"
          :key="slide.url"
          class="absolute inset-0 w-full h-full"
        >
          <video
            v-if="slide.type === 'video'"
            :src="slide.url"
            autoplay
            muted
            loop
            playsinline
            class="w-full h-full object-cover"
          ></video>
          
          <img
            v-else
            :src="slide.url"
            alt="Hero Background"
            class="w-full h-full object-cover"
          />
        </div>
      </TransitionGroup>
    </div>

    <div class="absolute inset-0 bg-black/50 z-10 transition-opacity duration-1000"></div>

    <AppContainer 
      class="relative z-20 text-center text-white flex flex-col items-center gap-6 px-4 mt-10" 
      :size="cWidth"
    >
      
      <span v-if="tag" class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white/20 text-white border border-white/30 backdrop-blur-sm">
        <i v-if="tagIcon" :class="['pi', tagIcon]"></i> {{ tag }}
      </span>

      <h1 class="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter drop-shadow-lg leading-tight">
        {{ titlePrefix }}
        <span v-if="titleHighlight" class="text-primary drop-shadow-md">
          {{ titleHighlight }}
        </span>
      </h1>

      <p v-if="subtitle" class="text-lg md:text-xl lg:text-2xl font-medium max-w-[60ch] opacity-90 drop-shadow-md leading-relaxed">
        {{ subtitle }}
      </p>

      <div v-if="$slots.default" class="mt-6 flex flex-wrap justify-center gap-4">
        <slot />
      </div>

    </AppContainer>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useMediaUrl } from '~/composables/useMediaUrl';

// Props planificadas com seus respectivos valores padrão
const props = defineProps({
  tag: {
    type: String,
    default: 'Arquitetura JSON-Driven'
  },
  tagIcon: {
    type: String,
    default: 'pi-sparkles'
  },
  titlePrefix: {
    type: String,
    default: 'O Futuro do'
  },
  titleHighlight: {
    type: String,
    default: 'Web Design'
  },
  subtitle: {
    type: String,
    default: 'Faz scroll para baixo e descobre o nosso universo através das páginas principais.'
  },
  cWidth: {
    type: String,
    default: 'content'
  },
  slides: {
    type: Array,
    default: () => [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop",
      "/fundo.mp4", 
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000&auto=format&fit=crop"
    ]
  },
  slideDuration: {
    type: Number,
    default: 5000
  },
  pagePath: {
    type: String,
    default: ''
  }
});

const { resolve: resolveMedia } = useMediaUrl(() => props.pagePath)

// Normalizador (Imagens vs Vídeos)
const normalizedSlides = computed(() => {
  return props.slides.map(slide => {
    if (typeof slide === 'object' && slide !== null && slide.url) {
      return { ...slide, url: resolveMedia(slide.url) };
    }

    const raw = typeof slide === 'string' ? slide : '';
    const isVideo = raw.match(/\.(mp4|webm|ogg)$/i);

    return {
      type: isVideo ? 'video' : 'image',
      url: resolveMedia(raw)
    };
  });
});

// Lógica do Loop
const currentSlide = ref(0);
let slideInterval = null;

onMounted(() => {
  if (normalizedSlides.value && normalizedSlides.value.length > 1) {
    slideInterval = setInterval(() => {
      currentSlide.value = (currentSlide.value + 1) % normalizedSlides.value.length;
    }, props.slideDuration);
  }
});

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval);
  }
});
</script>

<style scoped>
/* Transição perfeita e controlada exclusivamente pelo Vue */
.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 1.5s ease-in-out;
}

.hero-fade-enter-from,
.hero-fade-leave-to {
  opacity: 0;
}
</style>