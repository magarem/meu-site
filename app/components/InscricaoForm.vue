<script setup>
const TOTAL_ETAPAS = 3

const etapaAtual = ref(1)
const loading    = ref(false)
const submetido  = ref(false)
const erroMsg    = ref('')

const formData = ref({
  nome:            '',
  email:           '',
  whatsapp:        '',
  nascimento:      '',
  cpf:             '',
  endereco:        '',
  metodoPagamento: 'pix',
})

const opcoesPagamento = [
  { id: 'pix',    label: 'PIX',               detalhe: '10% de desconto no pagamento à vista' },
  { id: 'cartao', label: 'Cartão de crédito',  detalhe: 'Parcelamento em até 12x' },
  { id: 'boleto', label: 'Boleto bancário',    detalhe: 'Vencimento em 3 dias úteis' },
]

function proximaEtapa() {
  erroMsg.value = ''
  if (etapaAtual.value === 1) {
    if (!formData.value.nome.trim())     { erroMsg.value = 'Por favor, preencha o seu nome.'; return }
    if (!formData.value.email.trim())    { erroMsg.value = 'Por favor, preencha o seu email.'; return }
    if (!formData.value.whatsapp.trim()) { erroMsg.value = 'Por favor, preencha o seu WhatsApp.'; return }
  }
  etapaAtual.value++
}

function voltarEtapa() {
  erroMsg.value = ''
  etapaAtual.value--
}

async function finalizarInscricao() {
  erroMsg.value = ''
  loading.value = true
  try {
    await $fetch('/api/inscricao', {
      method: 'POST',
      body: { ...formData.value },
    })
    submetido.value = true
  } catch (err) {
    erroMsg.value = err?.data?.statusMessage || 'Erro ao processar inscrição. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center py-0 px-4">

    <!-- Decorative background blobs -->
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      <div class="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/8 blur-3xl" />
    </div>

    <div class="w-full max-w-lg">

      <!-- Header -->
      <div class="text-center mb-8">
        <span class="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-[0.3em] uppercase">
          <i class="pi pi-star-fill text-[10px]" />
          Formação Profissional 2026
        </span>
        <h1 class="text-3xl md:text-4xl font-serif font-bold text-text-main leading-tight mb-2">
          Inscrição em Yogaterapia
        </h1>
        <p class="text-text-muted text-sm">
          Preencha o formulário abaixo para garantir a sua vaga.
        </p>
      </div>

      <!-- Card -->
      <div class="bg-bg-base border border-border rounded-cartao shadow-xl shadow-black/5 overflow-hidden">

        <!-- Progress bar -->
        <div v-if="!submetido" class="h-1 bg-border">
          <div
            class="h-full bg-primary transition-all duration-500"
            :style="{ width: `${(etapaAtual / TOTAL_ETAPAS) * 100}%` }"
          />
        </div>

        <div class="p-8">

          <!-- Step indicator -->
          <p v-if="!submetido" class="text-[10px] uppercase tracking-[0.25em] text-text-muted font-black mb-6">
            Passo {{ etapaAtual }} de {{ TOTAL_ETAPAS }}
          </p>

          <Transition name="step-fade" mode="out-in">

            <!-- ── STEP 1 — Dados pessoais ── -->
            <div v-if="!submetido && etapaAtual === 1" key="step1" class="flex flex-col gap-5">
              <h2 class="text-lg font-serif font-bold text-text-main">Dados pessoais</h2>

              <div class="flex flex-col gap-1.5">
                <label class="field-label">Nome completo</label>
                <input v-model="formData.nome" type="text" placeholder="O seu nome completo" class="form-input" />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="field-label">Email</label>
                <input v-model="formData.email" type="email" placeholder="seu@email.com" class="form-input" />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="field-label">WhatsApp</label>
                <input v-model="formData.whatsapp" type="tel" placeholder="(00) 00000-0000" class="form-input" />
              </div>

              <p v-if="erroMsg" class="text-sm text-red-500 flex items-center gap-1.5">
                <i class="pi pi-exclamation-circle" /> {{ erroMsg }}
              </p>

              <button class="btn-primary mt-2" @click="proximaEtapa">
                Próximo <i class="pi pi-chevron-right text-xs" />
              </button>
            </div>

            <!-- ── STEP 2 — Dados complementares ── -->
            <div v-else-if="!submetido && etapaAtual === 2" key="step2" class="flex flex-col gap-5">
              <h2 class="text-lg font-serif font-bold text-text-main">Dados complementares</h2>

              <div class="flex flex-col gap-1.5">
                <label class="field-label">Data de nascimento</label>
                <input v-model="formData.nascimento" type="date" class="form-input" />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="field-label">CPF</label>
                <input v-model="formData.cpf" type="text" placeholder="000.000.000-00" class="form-input" />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="field-label">Endereço completo</label>
                <input v-model="formData.endereco" type="text" placeholder="Rua, número, cidade, estado" class="form-input" />
              </div>

              <p v-if="erroMsg" class="text-sm text-red-500 flex items-center gap-1.5">
                <i class="pi pi-exclamation-circle" /> {{ erroMsg }}
              </p>

              <div class="grid grid-cols-2 gap-3 mt-2">
                <button class="btn-ghost" @click="voltarEtapa">
                  <i class="pi pi-chevron-left text-xs" /> Voltar
                </button>
                <button class="btn-primary" @click="proximaEtapa">
                  Próximo <i class="pi pi-chevron-right text-xs" />
                </button>
              </div>
            </div>

            <!-- ── STEP 3 — Pagamento ── -->
            <div v-else-if="!submetido && etapaAtual === 3" key="step3" class="flex flex-col gap-5">
              <h2 class="text-lg font-serif font-bold text-text-main">Método de pagamento</h2>

              <!-- Pricing box -->
              <div class="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-2">
                <div class="flex justify-between text-sm text-text-muted">
                  <span>Valor integral</span>
                  <span class="line-through">R$ 2.000</span>
                </div>
                <div class="flex justify-between font-black text-xl text-primary">
                  <span>À vista (PIX)</span>
                  <span>R$ 1.800</span>
                </div>
                <div class="flex justify-between font-semibold text-text-main">
                  <span>Parcelado</span>
                  <span>12× R$ 180</span>
                </div>
              </div>

              <!-- Payment options -->
              <div class="flex flex-col gap-2">
                <button
                  v-for="opt in opcoesPagamento"
                  :key="opt.id"
                  class="payment-option"
                  :class="{ 'payment-option--active': formData.metodoPagamento === opt.id }"
                  @click="formData.metodoPagamento = opt.id"
                >
                  <div class="flex-1 text-left">
                    <span class="font-bold text-sm text-text-main block">{{ opt.label }}</span>
                    <span class="text-xs text-text-muted">{{ opt.detalhe }}</span>
                  </div>
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                    :class="formData.metodoPagamento === opt.id ? 'border-primary' : 'border-border'"
                  >
                    <div v-if="formData.metodoPagamento === opt.id" class="w-2.5 h-2.5 rounded-full bg-primary" />
                  </div>
                </button>
              </div>

              <p v-if="erroMsg" class="text-sm text-red-500 flex items-center gap-1.5">
                <i class="pi pi-exclamation-circle" /> {{ erroMsg }}
              </p>

              <div class="grid grid-cols-2 gap-3 mt-2">
                <button class="btn-ghost" :disabled="loading" @click="voltarEtapa">
                  <i class="pi pi-chevron-left text-xs" /> Voltar
                </button>
                <button class="btn-success" :disabled="loading" @click="finalizarInscricao">
                  <i v-if="loading" class="pi pi-spin pi-spinner" />
                  <i v-else class="pi pi-lock text-xs" />
                  {{ loading ? 'A enviar…' : 'Finalizar' }}
                </button>
              </div>
            </div>

            <!-- ── SUCCESS ── -->
            <div v-else-if="submetido" key="success" class="text-center py-8 flex flex-col items-center gap-4">
              <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <i class="pi pi-check text-4xl text-green-600" />
              </div>
              <h2 class="text-2xl font-serif font-bold text-text-main">Inscrição enviada!</h2>
              <p class="text-text-muted leading-relaxed max-w-sm">
                Recebemos a sua inscrição. Em breve entraremos em contacto pelo email e WhatsApp
                indicados para confirmar os próximos passos.
              </p>
              <NuxtLink to="/">
                <button class="btn-primary mt-2">
                  <i class="pi pi-home text-xs" /> Voltar ao início
                </button>
              </NuxtLink>
            </div>

          </Transition>
        </div>
      </div>

      <!-- Reassurance note -->
      <p class="text-center text-xs text-text-muted mt-5 flex items-center justify-center gap-1.5">
        <i class="pi pi-shield text-primary" />
        Os seus dados estão seguros e nunca serão partilhados.
      </p>

    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.field-label {
  @apply text-[10px] uppercase tracking-widest font-black text-text-muted;
}

.form-input {
  @apply w-full rounded-botao border-2 border-border bg-bg-muted px-4 py-3.5
         text-text-main font-semibold text-sm placeholder:text-text-muted/50
         focus:outline-none focus:border-primary focus:bg-bg-base
         transition-all duration-200;
}

.btn-primary {
  @apply w-full flex items-center justify-center gap-2 rounded-botao
         bg-primary text-white font-black tracking-widest uppercase text-xs
         px-6 py-4 transition-all duration-200
         hover:opacity-90 hover:scale-[1.01] active:scale-100
         disabled:opacity-50 disabled:pointer-events-none;
}

.btn-ghost {
  @apply w-full flex items-center justify-center gap-2 rounded-botao
         border-2 border-border text-text-muted font-bold text-xs uppercase tracking-widest
         px-6 py-4 transition-all duration-200
         hover:border-text-muted hover:text-text-main
         disabled:opacity-50 disabled:pointer-events-none;
}

.btn-success {
  @apply w-full flex items-center justify-center gap-2 rounded-botao
         bg-green-600 text-white font-black tracking-widest uppercase text-xs
         px-6 py-4 transition-all duration-200
         hover:bg-green-700 hover:scale-[1.01] active:scale-100
         disabled:opacity-50 disabled:pointer-events-none;
}

.payment-option {
  @apply flex items-center gap-4 w-full rounded-xl border-2 border-border bg-bg-muted
         px-4 py-3.5 cursor-pointer transition-all duration-200
         hover:border-primary/40 hover:bg-bg-base;
}

.payment-option--active {
  @apply border-primary bg-primary/5 shadow-sm;
}

.step-fade-enter-active,
.step-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.step-fade-enter-from {
  opacity: 0;
  transform: translateX(16px);
}
.step-fade-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
</style>
