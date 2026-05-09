<script setup>
import { computed } from 'vue';
import { parse } from 'marked';
import { useMediaUrl } from '~/composables/useMediaUrl';

const props = defineProps({
  /**
   * Texto Markdown limpo (sem Frontmatter)
   */
  content: {
    type: String,
    default: ''
  },
  /**
   * Título do Artigo
   */
  title: {
    type: String,
    default: ''
  },
  /**
   * Imagem de topo (Banner Principal)
   */
  topImage: {
    type: String,
    default: ''
  },
  /**
   * Lista de imagens para a coluna lateral
   */
  sideImages: {
    type: Array,
    default: () => []
  },
  /**
   * Nome do autor
   */
  author: {
    type: String,
    default: ''
  },
  /**
   * Data de publicação ou atualização
   */
  date: {
    type: [String, Date],
    default: ''
  },
  /**
   * Largura do contentor (cw-0, cw-1, cw-2, cw-3)
   * Agora consome diretamente o que está no main.css
   */
  cWidth: {
    type: String,
    default: 'cw-1'
  },
  pending: {
    type: Boolean,
    default: false
  },
  error: {
    type: Object,
    default: null
  },
  pagePath: {
    type: String,
    default: ''
  }
});

// Conversão do Markdown para HTML
const renderedHtml = computed(() => {
  if (!props.content || props.pending || props.error) return '';
  return parse(props.content);
});

// Formatação de data amigável
const formattedDate = computed(() => {
  if (!props.date) return '';
  try {
    const d = new Date(props.date);
    return d.toLocaleDateString('pt-PT', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (e) {
    return props.date;
  }
});

const { resolve: resolveImg } = useMediaUrl(() => props.pagePath);
</script>

<template>
  <!-- 
    ✨ O segredo: a classe 'content-component' não define larguras. 
    Ela deixa a classe 'cWidth' (vinda da prop e definida no main.css) 
    comandar o max-width e o margin-inline: auto.
  -->
  <div :class="['content-component', cWidth, { 'is-loading': pending }]">
    
  
    <!-- 2. BANNER PRINCIPAL (TOP IMAGE) -->
    <figure v-if="topImage && !pending" class="main-banner">
      <img :src="resolveImg(topImage)" alt="Destaque editorial" />
    </figure>

    <!-- 3. TEXTO -->
    <main v-if="!pending && !error">
      <article class="text-column">
        <div class="prose content-body" v-html="renderedHtml"></div>
      </article>
    </main>

    <!-- FEEDBACK DE ESTADOS -->
    <div v-if="pending" class="status-overlay">
      <i class="pi pi-spin pi-spinner"></i>
    </div>
    
    <div v-else-if="error" class="error-box">
      <i class="pi pi-exclamation-circle"></i>
      <p>Não foi possível carregar o conteúdo.</p>
    </div>

  </div>
</template>

<style scoped>
/* Referenciamos o CSS global para que o compilador do Tailwind saiba os limites de tema */
@reference "~/assets/css/main.css";

.content-component {
  /* Variáveis de estilo internas */
  --c-brand: #d97706;
  --c-text: #1a1a1a;
  --c-heading: #111827;
  --radius: 1.5rem;
  --sidebar-w: 280px;
  --gap: 4rem;

  font-family: 'Inter', system-ui, sans-serif;
  color: var(--c-text);
  line-height: 1.8;
  padding-bottom: 5rem;
  transition: opacity 0.5s ease;
  
  /* Importante: NÃO definimos width ou max-width aqui.
     A utilidade global 'cw-x' (vinda da prop) tratará disso.
  */
}

/* 1. Topbar Styling */
.content-topbar {
  margin-bottom: 1.0rem;
  text-align: left;
}
.meta-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.author-tag { color: var(--c-brand); }
.date-tag { opacity: 0.4; }
.meta-separator { opacity: 0.2; }

.main-title {
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.04em;
  color: var(--c-heading);
}

.accent-line {
  width: 60px;
  height: 4px;
  background: var(--c-brand);
  margin-top: 1.5rem;
  border-radius: 2px;
}

/* 2. Main Banner Styling */
.main-banner {
  width: 100%;
  height: clamp(250px, 40vh, 450px);
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 4rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
  margin-left: 0;
  margin-right: 0;
}
.main-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Text Column */
.text-column {
  flex: 1;
  min-width: 0;
}
.content-body {
  font-size: 1.125rem;
  max-width: none;
}

/* Typography Overrides */
:deep(h2) {
  font-size: 1.85rem;
  font-weight: 800;
  margin-top: 3.5rem;
  margin-bottom: 1.5rem;
  color: var(--c-heading);
  letter-spacing: -0.02em;
}
:deep(p) { margin-bottom: 1.75rem; }
:deep(blockquote) {
  border-left: 5px solid var(--c-brand);
  padding: 1.5rem 2rem;
  background: #fdfbf7;
  font-style: italic;
  font-size: 1.25rem;
  margin: 3rem 0;
  border-radius: 0 1rem 1rem 0;
}

/* Feedback Box */
.status-overlay { @apply flex justify-center py-20 text-3xl; color: var(--c-brand); }
.error-box { @apply text-center p-12 border-2 border-dashed border-red-100 rounded-3xl text-red-500; }

/* Note: Removi as media queries de padding-inline porque o seu 'main.css' 
   já as inclui dentro das utilidades cw-0, cw-1, etc.
*/
</style>