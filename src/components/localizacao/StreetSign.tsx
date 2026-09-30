"use client";

import { useRef } from "react";
import { EASE, gsap, MQ, useGSAP } from "@/animations/gsap";
import { whenPageReady } from "@/animations/page-ready";
import { business } from "@/data/business";

/** "Av. Doutor Simeão de Faria, 665" → { via: "Av.", nome: "Doutor Simeão de Faria", numero: "665" } */
function splitAddress(rua: string) {
  const match = rua.match(/^(\S+)\s+(.+?),\s*(\S+)$/);
  if (!match) return { via: "", nome: rua, numero: "" };
  return { via: match[1], nome: match[2], numero: match[3] };
}

/**
 * Placas de rua esmaltadas (referência urbana brasileira) com o endereço real.
 * Entram balançando como placa pendurada; no desktop inclinam levemente com o mouse.
 */
export function StreetSign() {
  const ref = useRef<HTMLDivElement>(null);
  const { via, nome, numero } = splitAddress(business.endereco.rua);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const plates = gsap.utils.toArray<HTMLElement>(".ss-plate", ref.current);
        gsap.set(plates, { rotateX: -75, autoAlpha: 0, transformPerspective: 900, transformOrigin: "50% 0%" });
        const cancel = whenPageReady(() => {
          gsap.to(plates, { rotateX: 0, autoAlpha: 1, duration: 1.3, stagger: 0.14, ease: EASE.enter, delay: 0.35 });
        });
        return cancel;
      });

      mm.add(`${MQ.finePointer} and ${MQ.motion} and ${MQ.desktop}`, () => {
        const el = ref.current;
        if (!el) return;
        const rx = gsap.quickTo(el, "rotateX", { duration: 0.8, ease: "power3.out" });
        const ry = gsap.quickTo(el, "rotateY", { duration: 0.8, ease: "power3.out" });
        gsap.set(el, { transformPerspective: 900 });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 12);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="flex max-w-xl flex-wrap items-stretch gap-3 [transform-style:preserve-3d]">
      <p aria-hidden className="ss-plate relative flex min-w-0 flex-1 basis-64 flex-col justify-center rounded-2xl bg-bone px-5 py-4 text-ink shadow-[0_24px_50px_-24px_rgb(0_0_0/0.8)] outline-2 -outline-offset-[7px] outline-ink/80 sm:px-7 sm:py-5">
        <span className="eyebrow text-[10px] text-ink-soft">{via}</span>
        <span className="display mt-1 text-[clamp(1.8rem,7.5vw,2.9rem)] font-extrabold leading-[0.92]">{nome}</span>
      </p>
      {numero && (
        <p aria-hidden className="ss-plate relative flex flex-col items-center justify-center rounded-2xl bg-mustard px-5 py-4 text-ink shadow-[0_24px_50px_-24px_rgb(0_0_0/0.8)] outline-2 -outline-offset-[7px] outline-ink/80 sm:px-6">
          <span className="eyebrow text-[10px]">Nº</span>
          <span className="display text-[clamp(2.6rem,10vw,4rem)] leading-none">{numero}</span>
        </p>
      )}
      <span className="sr-only">
        {business.endereco.rua}, {business.endereco.cidadeUf}, CEP {business.endereco.cep}
      </span>
    </div>
  );
}
