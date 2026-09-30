# Lanches do Baiano — site oficial

Site do **Lanches do Baiano | Hambúrguer e Cachorro Quente** — Av. Doutor Simeão de Faria, 665, Juiz de Fora - MG.

Next.js 16 · React 19 · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis · Lucide.

## Rodando localmente

Requer Node.js 20.9 ou superior.

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:3000
npm run build      # build de produção
npm run start      # servidor de produção (depois do build)
npm run lint
```

## Antes de publicar

Defina a URL pública do site (usada em SEO, sitemap, robots e Open Graph):

```bash
NEXT_PUBLIC_SITE_URL=https://www.seudominio.com.br
```

Na Vercel: *Project Settings → Environment Variables*. Sem ela, o site usa `http://localhost:3000` nos metadados.

## Páginas

Conceito visual: **"o letreiro acende"** — o arco, as lâmpadas e as camadas da própria logo
guiam fotografia, tipografia e movimento (detalhes em `CLAUDE.md`).

| Rota | Conteúdo |
|---|---|
| `/` | Intro curta, Hero em arco que abre em tela cheia, prévias (A casa, Cardápio em camadas, Letreiro com localização/contato) e CTA de pedido |
| `/sobre` | Abertura editorial + capítulos em rolo horizontal + Instagram oficial |
| `/cardapio` | Quadro de preços com abas por categoria (link direto: `/cardapio#bebidas`) e pedido por item no WhatsApp |
| `/localizacao` | Placas de rua com o endereço, mapa, rota e horário com placa neon ABERTO/FECHADO em tempo real |
| `/contato` | WhatsApp e Instagram em destaque, telefone, endereço e horário |

## Como cadastrar o cardápio

Edite **somente** `src/data/menu.ts`, na lista `produtos`:

```ts
export const produtos: ProdutoCardapio[] = [
  {
    id: "x-bacon",                 // único, sem espaços
    nome: "X-Bacon",
    categoria: "hamburgueres",     // hamburgueres | cachorro-quente | acompanhamentos | bebidas | combos
    descricao: "Pão, hambúrguer, queijo e bacon",  // opcional
    preco: 25.9,                   // número em reais; use null para mostrar "Consulte"
    disponivel: true,              // false mostra "Indisponível no momento" e esconde o botão Pedir
    // imagem: "/assets/cardapio/x-bacon.jpg",     // opcional (miniatura redonda)
  },
];
```

O botão **Pedir** de cada item abre o WhatsApp com
"Olá! Vim pelo site do Lanches do Baiano e gostaria de pedir: X-Bacon."

## Dados da empresa

Nome, WhatsApp, telefone, Instagram, endereço, mapa e horários ficam em `src/data/business.ts`.
O status ABERTO/FECHADO é calculado no fuso de Juiz de Fora a partir desses horários.

## Regras do projeto

Veja `CLAUDE.md` (arquitetura, identidade visual, animação, acessibilidade e checklist).
