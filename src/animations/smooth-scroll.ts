/**
 * Instância única do Lenis + helpers de rolagem.
 * O Lenis só existe quando o usuário NÃO pede movimento reduzido; os helpers
 * caem para a rolagem nativa automaticamente.
 */
import type Lenis from "lenis";
import { prefersReducedMotion } from "./gsap";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null): void {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}

export function stopScroll(): void {
  instance?.stop();
}

export function startScroll(): void {
  instance?.start();
}

/** Altura ocupada pelo header fixo (e pela navegação de categorias, quando presente) */
export function stickyOffset(): number {
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  const subnav = document.querySelector<HTMLElement>("[data-sticky-subnav]");
  return (header?.offsetHeight ?? 0) + (subnav?.offsetHeight ?? 0);
}

interface ScrollOptions {
  offset?: number;
  immediate?: boolean;
}

export function scrollToTarget(target: string | HTMLElement | number, { offset = 0, immediate = false }: ScrollOptions = {}): void {
  if (instance) {
    instance.scrollTo(target, { offset, immediate, force: true, duration: immediate ? 0 : 1.2 });
    return;
  }

  let top: number;
  if (typeof target === "number") {
    top = target;
  } else {
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;
    top = el.getBoundingClientRect().top + window.scrollY + offset;
  }
  window.scrollTo({ top, behavior: immediate || prefersReducedMotion() ? "auto" : "smooth" });
}
