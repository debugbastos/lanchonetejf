# CLAUDE.md — Lanches do Baiano

Site oficial do **Lanches do Baiano | Hambúrguer e Cachorro Quente** (Juiz de Fora - MG).
Leia este arquivo inteiro antes de alterar qualquer coisa.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (tokens em `src/styles/globals.css`, bloco `@theme`)
- **GSAP 3** + **ScrollTrigger** + `@gsap/react` (`useGSAP`)
- **Lenis** (smooth scroll)
- **Lucide React** (ícones; o v1 não tem ícones de marcas — Instagram é `components/ui/InstagramIcon.tsx`)

> O Next 16 tem mudanças de API. Antes de usar uma API do Next, confira `node_modules/next/dist/docs/`.
> Ex.: `<Image preload>` substitui `priority`; `Link` tem `onNavigate`.

Comandos: `npm run dev` · `npm run build` · `npm run start` · `npm run lint` · `npm run typecheck`

## Conceito: "o letreiro acende"

Tudo nasce de três elementos da própria logo:

| Motivo | Origem na logo | Onde aparece |
|---|---|---|
| **Arco** | a janela em arco atrás do hambúrguer | janelas de foto (`archRadius()`), Hero, fotos de destaque |
| **Lâmpadas** | a fileira de pontos sob "BAIANO" | intro, `BulbRow`, régua do cardápio, progresso do rolo, 404, dia de hoje |
| **Camadas** | a montagem do lanche | transição de página e menu mobile (fatias), vitrine empilhada da Home, títulos em "montagem" |

Distribuição de intensidade: **espetáculo concentrado na abertura** (intro + Hero), **cardápio calmo**
(quadro creme, para ler e escolher), fechamento em mostarda.

## Arquitetura

```
src/
  app/                 rotas (/, /sobre, /cardapio, /localizacao, /contato), not-found, sitemap, robots, ícones, OG
  components/
    layout/            Header (cápsula), MobileMenu (fatias), Footer, FloatingWhatsApp (só mobile)
    providers/         SmoothScrollProvider (Lenis), PageTransitionProvider (cortina em fatias)
    ui/                ButtonLink, TransitionLink, SectionLabel, StatusBadge, NeonSign, BulbRow,
                       Marquee, RotatingBadge, Magnetic, Cursor, InstagramIcon, NotFoundContent
    home/              Intro, Hero, HouseIntro, MenuStack, VisitSign, FinalCta
    cardapio/          MenuHero, MenuBoard (abas), MenuItem
    sobre/             SobreOpening, SobreReel (rolo horizontal), SobreClosing
    localizacao/       LocationHero, StreetSign (placas), OpeningHours
    contato/           ContactChannels
    seo/               JsonLd (schema.org)
  animations/          gsap.ts (registro, EASE, MQ, PLAY_ONCE, isRendered), hooks.ts (usePageIntro,
                       useScrollReveal, useMouseDepth), page-ready.ts, smooth-scroll.ts
  data/                business.ts, menu.ts, navigation.ts, images.ts  ← FONTE ÚNICA de dados
  hooks/               useOpenStatus (ABERTO/FECHADO), useHashCategory (aba do cardápio ↔ URL)
  lib/                 whatsapp.ts, hours.ts, format.ts, seo.ts, shape.ts (archRadius)
  styles/globals.css   tokens, utilitários e CSS global
public/assets/         brand/ (logo oficial) e fotos/ (fotos oficiais)
```

- `app/*/page.tsx` são **Server Components**: exportam `metadata` (via `pageMetadata()`) e compõem seções.
- `"use client"` só em componentes com estado, efeitos ou GSAP.
- **A Home é porta de entrada**: só prévias que levam às páginas. Nunca coloque ali cardápio completo,
  mapa, horários completos ou lista de contatos.

## Regras de conteúdo (inegociáveis)

1. **Não inventar dados**: produtos, preços, ingredientes, avaliações, depoimentos, seguidores, prêmios,
   datas, história, delivery, formas de pagamento, métodos de preparo. Textos de marca descrevem apenas o
   que as fotos mostram ou o que está em `business.ts`.
2. Dados institucionais vêm de `src/data/business.ts`. **Nunca** digite endereço/telefone/horário direto
   num componente (derive: ex. `ABERTURA` em `OpeningHours`).
3. Cardápio: `src/data/menu.ts`. Categoria sem itens mostra "Itens em atualização" + consulta no WhatsApp.
4. WhatsApp sempre via `lib/whatsapp.ts`. Número `5532988588079`.
   Geral: "Olá! Vim pelo site do Lanches do Baiano e gostaria de fazer um pedido."
   Produto: "Olá! Vim pelo site do Lanches do Baiano e gostaria de pedir: [PRODUTO]."
5. Instagram oficial: `https://instagram.com/lanchesdobaianojf` — só link para o perfil.
6. Sem Lorem Ipsum, sem TODO, sem botão decorativo: todo elemento clicável tem destino real.

## Assets

- **Logo**: `public/assets/brand/logo-lanches-do-baiano.png` — arquivo do cliente apenas recortado do fundo
  preto (máscara elíptica que segue a forma real; 668×687). Nunca redesenhe, recolora ou distorça
  (sempre `h-* w-auto`).
- **Fotos**: só as fornecidas (`src/data/images.ts` com dimensões e `alt`). `cachorro-quente-detalhe.jpg`
  é um recorte pequeno (360 px): só em círculos pequenos/médios.

## Identidade visual

- Tokens: `night` #0b0907 (fundo), `char`/`smoke`/`line` (superfícies escuras), `bone` (texto claro),
  `crumb` (texto secundário no escuro), `cream`/`paper` (superfícies claras), `ink`/`ink-soft` (texto no
  claro), `rule` (fios no claro), `mustard` #f5b324 (logo), `ketchup` #d42a1f, `ember`, `leaf` (aberto).
- Contraste: texto pequeno sobre `ketchup` sempre `paper`; `ketchup` como texto só grande (preços,
  títulos) ou sobre `cream`; `crumb` sobre `night` passa AA.
- Tipografia: `display` (Big Shoulders, caixa alta, 800–900), `serif-accent` (Fraunces itálico SOFT/WONK,
  só palavras de destaque e numerais), `font-sans` (Schibsted Grotesk), `eyebrow` (rótulos).
- Botões: `ButtonLink` (variantes por fundo: `primary`/`outline` no escuro, `outlineDark` no creme,
  `dark` na mostarda, `light` no ketchup). Microinteração padrão: rótulo que "rola" + seta.

## Linguagens de movimento (uma por seção — não repita)

| Onde | Linguagem |
|---|---|
| Intro | lâmpadas acendem em sequência, logo liga (uma oscilação), tela abre em fatias |
| Hero | corte (clip) revelando o arco + câmera recua/respira; título em camadas alternadas engrossando (peso variável); **pin: o arco abre em tela cheia** |
| A casa (creme) | marca-texto mostarda varrendo o título + parallax em velocidades diferentes + mouse |
| Cardápio (Home) | **camadas empilhadas** (sticky) com a anterior recuando e escurecendo |
| Letreiro | **endereço atravessando a tela** com o scroll + placa neon que liga |
| CTA final | **escala** do título + contorno que se preenche |
| Rodapé | letras do letreiro sobem uma a uma |
| Sobre | abertura dividida (corte lateral) + **rolo horizontal fixo** com lâmpadas de progresso |
| Localização | placas de rua balançando (inclinam com o mouse) + mapa nascendo como sol |
| Contato | canais gigantes que se preenchem de mostarda no hover |
| Transição | 6 fatias alternando os lados (~0,45 s cobrir, ~0,55 s revelar) |

## Animação — regras técnicas

- Importe sempre de `@/animations/gsap`. Todo GSAP em React dentro de `useGSAP(() => {...}, { scope })`.
- Use `gsap.matchMedia()` com `MQ.motion`; layout com `MQ.desktop`/`MQ.mobile`.
- **`prefers-reduced-motion`**: sem Lenis, intro, cursor, pins ou parallax; conteúdo visível na hora.
  Layouts que só existem com movimento (rolo horizontal) usam `motion-safe:lg:` nas classes.
- **Nunca `once: true` em ScrollTrigger** — use `...PLAY_ONCE`. Filtre elementos ocultos com `isRendered`.
- **Camadas aninhadas**: entrada, scroll e mouse nunca animam a mesma propriedade no mesmo elemento
  (ver `Hero.tsx`: `.h-frame > .h-reveal > .h-cam > .h-breathe > .h-photo`).
- Não coloque `transition-transform` (CSS) em elemento que o GSAP anima.
- Estado "instantâneo" = `gsap.set` (um `gsap.to` com duração 0 só aplica no próximo quadro).
- **Lógica nunca depende do fim de uma animação** (aba em segundo plano pausa o GSAP): ex. a troca de
  aba do cardápio usa `setTimeout`, a animação é só visual.
- `clip-path` de entrada em links é limpo ao final (`clearProps`) para não cortar o contorno de foco.
- Entradas de página: `data-hero` (`"lines" | "montage" | "media" | "wipe"`) + `usePageIntro(ref)`.
  Reveals: `data-reveal="lines" | "sweep" | "stagger" | "clip" | "up"` e `data-parallax` + `useScrollReveal(ref)`.
  Mouse: `data-depth="12"` + `useMouseDepth(ref)` (só desktop com mouse).
- Loops contínuos (respiração, marquee, órbitas) pausam fora da tela.

## CSS — armadilhas conhecidas

- CSS fora de `@layer` vence utilitários do Tailwind v4. Componentes que precisam aceitar utilitários
  (ex.: `.bulb` com `max-sm:hidden`) ficam em `@layer components`.
- Não passe `hidden`/`absolute` por `className` para componentes cuja base já tem `inline-flex`/`relative`:
  envolva num wrapper (`<div className="hidden xl:block">`).
- `.line-mask` tem folga vertical para acentos e cedilha em títulos com entrelinha curta.

## Responsividade

- Testar **320, 360, 375, 390, 414, 430, 480, 540, 640, 768, 820, 1024, 1280, 1440, 1920, 2560**.
- Zero overflow horizontal e nenhum rótulo cortado dentro de botão. Títulos grandes usam `clamp()` com
  mínimo que caiba em 288 px úteis e, no desktop, tamanho ligado à coluna (`lg:text-[min(6vw,…)]`).
- Composições próprias para mobile; alvos de toque ≥ 44 px; hover nunca é necessário.

## Acessibilidade

- Um `h1` por página; headings em ordem; `alt` em toda imagem (decorativas `alt=""`/`aria-hidden`).
- Foco visível mostarda; skip link; links externos com `(abre em nova aba)` em `sr-only`.
- Abas do cardápio: `role=tablist/tab/tabpanel`, `aria-selected`, tabindex itinerante, setas/Home/End.
- Menu mobile: `aria-expanded`, Esc fecha, fundo `inert`. Página atual: `aria-current`.

## SEO

- `pageMetadata({ title, description, path })` por página; `NEXT_PUBLIC_SITE_URL` define a URL canônica.
- JSON-LD `FastFoodRestaurant` só com dados de `business.ts`.

## Checklist antes de concluir

- [ ] `npm run lint`, `npm run typecheck` e `npm run build` sem erros/avisos
- [ ] Rotas abrem; links internos/externos corretos; WhatsApp com número e mensagem certos
- [ ] Sem overflow e sem rótulo cortado nas larguras da lista; console sem erros rolando todas as páginas
- [ ] Funciona com `prefers-reduced-motion` e com a aba em segundo plano
- [ ] Nenhum dado inventado; nenhum asset substituído
