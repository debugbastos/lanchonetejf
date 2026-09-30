"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/animations/gsap";
import { releasePage } from "@/animations/page-ready";
import { startScroll, stopScroll } from "@/animations/smooth-scroll";
import { logo } from "@/data/images";

const BULBS = 11;
const BANDS = 6;

/**
 * "O letreiro acende" (~1,9 s, só na primeira visita à Home na sessão):
 * as lâmpadas acendem em sequência, a logo liga com uma única oscilação e a tela
 * se abre em fatias direto para o Hero. A parte acesa é CSS (roda antes da hidratação);
 * a saída é GSAP. Qualquer toque/tecla pula. Com movimento reduzido não existe.
 */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || document.documentElement.dataset.intro !== "play") return;
      try {
        sessionStorage.setItem("baiano:intro", "1");
      } catch {
        /* navegação privada: a intro apenas volta a tocar */
      }
      stopScroll();

      const bands = gsap.utils.toArray<HTMLElement>(".it-band", el);
      const exit = gsap
        .timeline({
          paused: true,
          onComplete: () => {
            releasePage("intro");
            startScroll();
          },
        })
        .call(() => {
          el.style.pointerEvents = "none";
          releasePage("intro", "exit");
        })
        .to(".it-content", { autoAlpha: 0, scale: 0.94, duration: 0.3, ease: "power2.in" }, 0)
        .to(bands, { xPercent: (i) => (i % 2 ? -101 : 101), duration: 0.6, ease: "power4.inOut", stagger: 0.035 }, 0.12);

      // A parte em CSS começou na primeira pintura; a saída começa ~1,3 s depois dela.
      const hold = Math.max(0, 1.3 - performance.now() / 1000);
      const starter = gsap.delayedCall(hold, () => exit.play());

      const skip = () => {
        starter.kill();
        exit.timeScale(1.5).play();
      };
      const events: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "wheel", "touchstart"];
      events.forEach((type) => window.addEventListener(type, skip, { once: true, passive: true }));

      return () => {
        events.forEach((type) => window.removeEventListener(type, skip));
        starter.kill();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden="true" className="intro-overlay fixed inset-0 z-[95]">
      <div className="absolute inset-0 flex flex-col overflow-hidden">
        {Array.from({ length: BANDS }, (_, i) => (
          <div key={i} className="it-band relative -mb-px flex-1 bg-night" />
        ))}
      </div>

      <div className="it-content absolute inset-0 grid place-items-center px-6">
        <div className="relative flex flex-col items-center gap-8">
          <div className="intro-glow pointer-events-none absolute left-1/2 top-[38%] size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(245_179_36/0.3),transparent_65%)]" />
          <Image
            src={logo.src}
            width={logo.width}
            height={logo.height}
            alt=""
            sizes="220px"
            preload
            className="intro-logo relative h-auto w-[min(46vw,210px)]"
          />
          <div className="relative flex gap-3">
            {Array.from({ length: BULBS }, (_, i) => (
              <span key={i} className="bulb intro-bulb" style={{ ["--i" as string]: i }} />
            ))}
          </div>
          <p className="intro-caption eyebrow relative text-center text-crumb">Hambúrguer &amp; Cachorro-quente · Juiz de Fora</p>
        </div>
      </div>
    </div>
  );
}
