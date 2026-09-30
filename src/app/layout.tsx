import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Fraunces, Schibsted_Grotesk } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Header } from "@/components/layout/Header";
import { PageTransitionProvider } from "@/components/providers/PageTransitionProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { Cursor } from "@/components/ui/Cursor";
import { business, siteUrl } from "@/data/business";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/seo";
import "@/styles/globals.css";

/**
 * Display de letreiro (condensada, variável em peso e tamanho óptico).
 * O next/font não tem métricas de fallback para esta família, então usamos "block"
 * (sem troca de fonte = sem salto de layout nos títulos grandes).
 */
const shoulders = Big_Shoulders({
  subsets: ["latin"],
  variable: "--font-shoulders",
  display: "block",
  axes: ["opsz"],
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "Impact", "sans-serif"],
});
/** Itálico de destaque — só o estilo usado, com os eixos SOFT/WONK */
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK"],
});
/** Texto e interface */
const schibsted = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-schibsted", display: "swap" });

/** Ano do copyright, calculado no servidor */
const ANO = new Date().getFullYear();

/**
 * Roda antes da pintura:
 * - com movimento permitido, marca <html class="js-motion"> (esconde só os elementos de entrada até o GSAP revelar);
 * - na primeira visita à Home na sessão, ativa a introdução com a logo;
 * - rede de segurança: se o JS do app não subir em 4,5 s, tudo volta a ficar visível.
 */
const bootScript = `(function(){var d=document.documentElement;try{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('js-motion');if(location.pathname==='/'&&!sessionStorage.getItem('baiano:intro')){d.dataset.intro='play'}setTimeout(function(){if(!window.__baianoReady){d.classList.remove('js-motion');delete d.dataset.intro}},4500)}catch(e){d.classList.remove('js-motion')}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: DEFAULT_TITLE, template: `%s | ${business.nome}` },
  description: DEFAULT_DESCRIPTION,
  applicationName: business.nome,
  keywords: [
    "Lanches do Baiano",
    "hambúrguer Juiz de Fora",
    "cachorro-quente Juiz de Fora",
    "lanchonete Juiz de Fora",
    "Av. Doutor Simeão de Faria",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: business.nome,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0907",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${shoulders.variable} ${fraunces.variable} ${schibsted.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <SmoothScrollProvider>
          <PageTransitionProvider>
            <Header />
            <main id="conteudo" tabIndex={-1} className="relative outline-none">
              {children}
            </main>
            <Footer year={ANO} />
            <FloatingWhatsApp />
            <Cursor />
          </PageTransitionProvider>
        </SmoothScrollProvider>
        <div className="film-grain" aria-hidden="true" />
        <JsonLd />
      </body>
    </html>
  );
}
