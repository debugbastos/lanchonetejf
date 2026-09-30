"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/animations/gsap";

/**
 * Cursor próprio (desktop com mouse e movimento permitido): ponto mostarda preciso + anel com leve atraso.
 * - links/botões: o anel abre e o ponto some
 * - [data-cursor="media"] + data-cursor-label: vira um selo mostarda com o rótulo ("Ver", "Pedir")
 * - fora da janela ou sobre iframes: some (o cursor nativo do iframe assume)
 * Em toque ou com movimento reduzido, nada disso existe e o cursor nativo permanece.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;
    const mm = gsap.matchMedia();

    mm.add(`${MQ.finePointer} and ${MQ.motion}`, () => {
      const root = document.documentElement;
      gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.42, ease: "power3.out" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.42, ease: "power3.out" });
      let shown = false;

      const show = (x: number, y: number) => {
        gsap.set([dot, ring], { x, y });
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.25 });
        root.classList.add("has-custom-cursor");
        shown = true;
      };
      const hide = () => {
        gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });
        shown = false;
      };

      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        if (!shown) show(e.clientX, e.clientY);
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      };

      const over = (e: PointerEvent) => {
        const target = e.target as Element | null;
        if (target?.closest("iframe")) {
          hide();
          return;
        }
        const media = target?.closest<HTMLElement>("[data-cursor='media']");
        const interactive = target?.closest("a, button, [role='tab'], summary, label, input, select, textarea");
        const state = media ? "media" : interactive ? "link" : "idle";
        ring.dataset.state = state;
        dot.dataset.state = state;
        label.textContent = media?.dataset.cursorLabel ?? "";
      };

      const down = () => gsap.to(ring, { scale: 0.85, duration: 0.15 });
      const up = () => gsap.to(ring, { scale: 1, duration: 0.3, ease: "power3.out" });

      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerover", over, { passive: true });
      window.addEventListener("pointerdown", down);
      window.addEventListener("pointerup", up);
      root.addEventListener("pointerleave", hide);
      window.addEventListener("blur", hide);

      return () => {
        root.classList.remove("has-custom-cursor");
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerover", over);
        window.removeEventListener("pointerdown", down);
        window.removeEventListener("pointerup", up);
        root.removeEventListener("pointerleave", hide);
        window.removeEventListener("blur", hide);
      };
    });
  });

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        data-state="idle"
        className="group/ring pointer-events-none invisible fixed left-0 top-0 z-[81] hidden [@media(hover:hover)_and_(pointer:fine)]:block"
      >
        <div className="grid size-9 place-items-center rounded-full border border-bone/60 mix-blend-difference transition-[width,height,background-color,border-color] duration-300 ease-[var(--ease-brand)] group-data-[state=link]/ring:size-16 group-data-[state=link]/ring:border-bone group-data-[state=media]/ring:size-24 group-data-[state=media]/ring:border-transparent group-data-[state=media]/ring:bg-mustard group-data-[state=media]/ring:mix-blend-normal">
          <span
            ref={labelRef}
            className="eyebrow text-[10px] text-ink opacity-0 transition-opacity duration-200 group-data-[state=media]/ring:opacity-100"
          />
        </div>
      </div>
      <div
        ref={dotRef}
        aria-hidden="true"
        data-state="idle"
        className="pointer-events-none invisible fixed left-0 top-0 z-[82] hidden size-1.5 rounded-full bg-mustard transition-[opacity,transform] duration-200 data-[state=link]:scale-0 data-[state=media]:scale-0 [@media(hover:hover)_and_(pointer:fine)]:block"
      />
    </>
  );
}
