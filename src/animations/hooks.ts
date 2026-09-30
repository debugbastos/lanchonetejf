"use client";

import type { RefObject } from "react";
import { EASE, gsap, isRendered, MQ, PLAY_ONCE, useGSAP } from "./gsap";
import { whenPageReady } from "./page-ready";

/**
 * Entrada da página (conteúdo acima da dobra). Marque elementos com `data-hero`:
 *   data-hero            → sobe com fade (use pouco)
 *   data-hero="lines"    → linhas `.line-mask > .line-inner` sobem de dentro da máscara
 *   data-hero="montage"  → linhas entram alternando esquerda/direita (montagem de camadas)
 *   data-hero="media"    → imagem revelada de baixo para cima (clip-path) com recuo de câmera
 *   data-hero="wipe"     → revelação lateral (clip-path da esquerda para a direita)
 * Começa só quando nada cobre a tela (intro/cortina). Ordem = ordem no DOM.
 */
export function usePageIntro(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-hero]", scope.current);
        if (!items.length) return;

        const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.enter } });
        tl.set(items, { visibility: "visible" }, 0);

        items.forEach((el, i) => {
          const at = 0.05 + i * 0.08;
          const kind = el.dataset.hero;
          if (kind === "lines") {
            tl.from(el.querySelectorAll(".line-inner"), { yPercent: 118, duration: 1.1, stagger: 0.08 }, at);
          } else if (kind === "montage") {
            el.querySelectorAll(".line-inner").forEach((line, j) => {
              tl.from(line, { xPercent: j % 2 ? 101 : -101, duration: 1.15, ease: EASE.cut }, at + j * 0.09);
            });
          } else if (kind === "media") {
            tl.fromTo(
              el,
              { clipPath: "inset(100% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: EASE.cut, clearProps: "clipPath" },
              at,
            );
            const img = el.querySelector("img");
            if (img) tl.from(img, { scale: 1.25, duration: 1.9 }, at);
          } else if (kind === "wipe") {
            // clearProps: um clip-path residual cortaria o contorno de foco de links
            tl.fromTo(
              el,
              { clipPath: "inset(0% 100% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: EASE.cut, clearProps: "clipPath" },
              at,
            );
          } else {
            tl.from(el, { y: 22, autoAlpha: 0, duration: 0.9 }, at);
          }
        });

        return whenPageReady(() => tl.play());
      });
    },
    { scope },
  );
}

/**
 * Animações de scroll reutilizáveis. Marque elementos dentro do escopo com:
 *   data-reveal="lines"   → linhas mascaradas sobem em sequência
 *   data-reveal="sweep"   → faixa mostarda varre a linha e deixa o texto (marca-texto)
 *   data-reveal="stagger" → filhos diretos entram em sequência
 *   data-reveal="clip"    → imagem revelada de baixo para cima (dentro de wrapper com overflow)
 *   data-reveal="up"      → sobe com fade (use pouco — prefira as outras linguagens)
 *   data-parallax="8"     → deslocamento vertical (em %) enquanto atravessa a tela; negativo inverte
 */
export function useScrollReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const root = scope.current;
        const pick = (selector: string) => gsap.utils.toArray<HTMLElement>(selector, root).filter(isRendered);

        pick('[data-reveal="up"]').forEach((el) => {
          gsap.from(el, {
            y: 32,
            autoAlpha: 0,
            duration: 1,
            ease: EASE.enter,
            scrollTrigger: { trigger: el, start: "top 88%", ...PLAY_ONCE },
          });
        });

        pick('[data-reveal="lines"]').forEach((el) => {
          gsap.from(el.querySelectorAll(".line-inner"), {
            yPercent: 118,
            duration: 1.1,
            stagger: 0.08,
            ease: EASE.enter,
            scrollTrigger: { trigger: el, start: "top 86%", ...PLAY_ONCE },
          });
        });

        pick('[data-reveal="sweep"]').forEach((el) => {
          const lines = gsap.utils.toArray<HTMLElement>(".sweep-line", el);
          gsap.set(gsap.utils.toArray(".sweep-text", el), { opacity: 0 });
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 80%", ...PLAY_ONCE } });
          lines.forEach((line, i) => {
            const bar = line.querySelector(".sweep-bar");
            const text = line.querySelector(".sweep-text");
            const at = i * 0.14;
            tl.fromTo(bar, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.42, ease: EASE.cut }, at)
              .set(text, { opacity: 1 }, at + 0.42)
              .set(bar, { transformOrigin: "right center" }, at + 0.42)
              .to(bar, { scaleX: 0, duration: 0.42, ease: EASE.cut }, at + 0.42);
          });
        });

        pick('[data-reveal="stagger"]').forEach((el) => {
          gsap.from(el.children, {
            y: 26,
            autoAlpha: 0,
            duration: 0.9,
            stagger: 0.07,
            ease: EASE.enter,
            scrollTrigger: { trigger: el, start: "top 88%", ...PLAY_ONCE },
          });
        });

        pick('[data-reveal="clip"]').forEach((el) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", ...PLAY_ONCE } });
          tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: EASE.cut });
          const img = el.querySelector("img");
          if (img) tl.from(img, { scale: 1.22, duration: 1.8, ease: EASE.enter }, 0);
        });

        pick("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax) || 8;
          gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
    },
    { scope },
  );
}

/**
 * Profundidade com o mouse (desktop). Filhos com `data-depth="12"` deslocam-se até N px
 * na direção oposta ao cursor — o ambiente responde, nada persegue o mouse.
 */
export function useMouseDepth(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop} and ${MQ.finePointer} and ${MQ.motion}`, () => {
        const root = scope.current;
        if (!root) return;
        const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", root).map((el) => ({
          depth: Number(el.dataset.depth) || 8,
          x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3.out" }),
        }));
        const onMove = (e: PointerEvent) => {
          const r = root.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          layers.forEach((l) => {
            l.x(-nx * l.depth);
            l.y(-ny * l.depth);
          });
        };
        const onLeave = () =>
          layers.forEach((l) => {
            l.x(0);
            l.y(0);
          });
        root.addEventListener("pointermove", onMove);
        root.addEventListener("pointerleave", onLeave);
        return () => {
          root.removeEventListener("pointermove", onMove);
          root.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope },
  );
}
