🌌 Sirius Studio: Architecture Guide

Bem-vindo ao motor do Sirius Studio, um ecossistema construído em Nuxt 4 e Tailwind CSS v4 focado numa filosofia 100% JSON-Driven. Este projeto foi desenhado para ser escalável, onde o design e os dados estão separados da lógica de programação.

🏗️ Arquitetura Modular

A nossa estrutura de componentes segue uma lógica de Design Atómico e Separação de Preocupações, facilitando a manutenção e a reutilização de código entre diferentes projetos.

1. components/ui/ (Os "Burros" / Genéricos)

Estes são os blocos de construção básicos (Ex: Card.vue, Button.vue, Content.vue).

Independência: Não conhecem o contexto da página.

Prop-Driven: Tudo o que exibem vem através de props.

Portabilidade: Podem ser copiados para qualquer outro projeto Sirius e funcionarão instantaneamente.

2. components/structure/ (O Esqueleto)

Componentes que definem a navegação e a moldura do site (Ex: SiteHeader.vue, SiteFooter.vue).

Conectividade: Estão ligados ao config/theme.json e à lógica de Dark Mode.

Layout-Specific: Definem a experiência global de navegação do utilizador.

3. components/sections/ (Blocos de Página)

Componentes de alto nível que ocupam secções inteiras (Ex: HeroSlideshow.vue, QuickNavigation.vue).

Composição: Muitas vezes utilizam vários componentes ui/ lá dentro.

🧠 O Cérebro: config/theme.json

O ficheiro config/theme.json é o ponto único de verdade para a identidade visual do site. Em vez de hardcodear cores e tamanhos no CSS, injetamos estas definições como Variáveis CSS Nativas no :root do documento através do app.vue.

Vantagens desta abordagem:

Mudanças em Tempo Real: Alterar a cor da marca ou o limite de largura das páginas (cw-1) demora segundos e reflete-se em todos os componentes.

Sincronização Dark Mode: As variáveis permitem que o tema mude dinamicamente entre modos claro e escuro sem redundância de código.

Configuração de Layout: Define as margens móveis e as larguras máximas de leitura (Content Widths) de forma centralizada.

Estrutura Principal:

global.colors: Define a paleta de cores primária e de fundo.

global.layout: Controla os limites cw-0 a cw-3 usados no nosso sistema de grelha.

components.article: Configurações específicas para o motor editorial (fontes, tamanhos de letra, raios de imagem).

🚀 Fluxo de Dados e Renderização

O Sirius Studio utiliza uma rota "apanha-tudo" (pages/[...slug].vue) que atua como um Renderer Dinâmico.

Request: O Nuxt interceta o URL.

Fetch: A API server/api/content.get.ts localiza o ficheiro .json ou .md correspondente na pasta public/data/.

Hydrate: O conteúdo é mapeado para componentes Vue específicos.

Style: O componente Content.vue consome o Markdown e aplica os estilos definidos no layout prop, respeitando as variáveis do theme.json.

🛠️ Comandos de Desenvolvimento

Para iniciar o ambiente de desenvolvimento:

npx nuxi dev


Para gerar a versão de produção (Static Site Generation):

npx nuxi generate


© 2026 Sirius Studio • Elevando a web através de dados estruturados.# meu-site
