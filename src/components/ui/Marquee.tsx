"use client";

import { Fragment, useRef, type ReactNode } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/animations/gsap";
import { cn } from "@/lib/format";

interface MarqueeProps {
  items: string[];
  className?: string;
  duration?: number;
  /** Elemento entre os itens (padrão: estrela de 8 pontas) */
  separator?: ReactNode;
  /** Repetições de cada sequência (para textos curtos preencherem a largura) */
  repeat?: number;
}

/** Faixa horizontal contínua. Acelera levemente com a velocidade do scroll; pausa fora da tela. Decorativa. */
export function Marquee({ items, className, duration = 38, separator, repeat = 3 }: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const loop = gsap.to(track.current, { xPercent: -50, ease: "none", duration, repeat: -1 });
        const settle = gsap.to(loop, { timeScale: 1, duration: 0.8, ease: "power2.out", paused: true });
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
          onUpdate: (self) => {
            const boost = gsap.utils.clamp(1, 4, 1 + Math.abs(self.getVelocity()) / 900);
            loop.timeScale(boost);
            settle.invalidate().restart();
          },
        });
      });
    },
    { scope: root },
  );

  const sep = separator ?? (
    <svg viewBox="0 0 24 24" className="size-[0.32em] shrink-0" aria-hidden="true">
      <path d="M12 0l2.4 7.2L21.6 4.8 16.8 12l4.8 7.2-7.2-2.4L12 24l-2.4-7.2-7.2 2.4L7.2 12 2.4 4.8l7.2 2.4z" fill="currentColor" />
    </svg>
  );

  const sequence = (copy: number) => (
    <div className="flex shrink-0 items-center" key={copy}>
      {Array.from({ length: repeat }, (_, r) =>
        items.map((item, i) => (
          <Fragment key={`${copy}-${r}-${i}`}>
            <span className="px-[0.3em]">{item}</span>
            {sep}
          </Fragment>
        )),
      )}
    </div>
  );

  return (
    <div ref={root} aria-hidden="true" className={cn("overflow-hidden whitespace-nowrap", className)}>
      <div ref={track} className="flex w-max will-change-transform">
        {sequence(0)}
        {sequence(1)}
      </div>
    </div>
  );
}
