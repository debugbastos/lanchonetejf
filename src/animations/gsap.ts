/**
 * Ponto único de importação do GSAP no projeto.
 * Sempre importe `gsap`, `ScrollTrigger` e `useGSAP` daqui para garantir o registro dos plugins.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/**
 * Curvas da marca — rápido → suave → preciso.
 * enter: entradas longas e decididas · cut: cortes/cortinas (fatias) · soft: microinterações
 */
export const EASE = {
  enter: "expo.out",
  inOut: "power3.inOut",
  cut: "power4.inOut",
  soft: "power2.out",
} as const;

/**
 * Reveal que toca uma única vez ao entrar na tela.
 * Use no lugar de `once: true`: triggers `once` que já nascem ativos se destroem durante o
 * refresh de outro trigger e corrompem a lista interna do ScrollTrigger
 * ("Cannot read properties of undefined (reading 'end')").
 */
export const PLAY_ONCE = { toggleActions: "play none none none" } as const;

/** Elementos sem layout (display: none, ex.: versões só-mobile no desktop) não recebem animação de scroll */
export function isRendered(el: Element): boolean {
  return el.getClientRects().length > 0;
}

/** Media queries usadas com gsap.matchMedia() */
export const MQ = {
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023.98px)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(MQ.reduce).matches;
}

export { gsap, ScrollTrigger, useGSAP };
