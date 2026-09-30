"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/animations/gsap";
import { usePageIntro } from "@/animations/hooks";
import { whenPageReady } from "@/animations/page-ready";
import { ButtonLink } from "./ButtonLink";

/** Dígitos 5×7 em lâmpadas de letreiro */
const DIGITS: Record<string, string[]> = {
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
};

function BulbDigit({ digit }: { digit: string }) {
  return (
    <div className="grid grid-cols-5 gap-[calc(var(--bulb)*0.55)]">
      {DIGITS[digit].flatMap((row, r) =>
        row.split("").map((on, c) => (
          <span key={`${r}-${c}`} className={on === "1" ? "bulb nf-on" : "bulb"} data-lit={on === "1" ? "true" : undefined} />
        )),
      )}
    </div>
  );
}

/** 404 na linguagem da casa: o número aceso em lâmpadas — "Essa página saiu do cardápio." */
export function NotFoundContent() {
  const ref = useRef<HTMLElement>(null);
  usePageIntro(ref);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const on = gsap.utils.toArray<HTMLElement>(".nf-on", ref.current);
        gsap.set(on, { "--lit": 0 });
        return whenPageReady(() => {
          gsap.to(on, { "--lit": 1, duration: 0.2, ease: "none", stagger: { each: 0.018, from: "random" }, delay: 0.2 });
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative grid min-h-[100svh] place-items-center overflow-clip bg-night pb-16 pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_40%_at_50%_38%,rgb(245_179_36/0.12),transparent_70%)]"
      />
      <div className="container-site relative flex flex-col items-center text-center">
        <p className="sr-only">Erro 404</p>
        <div aria-hidden className="flex gap-[calc(var(--bulb)*2.2)] [--bulb:clamp(7px,2.4vw,16px)]">
          <BulbDigit digit="4" />
          <BulbDigit digit="0" />
          <BulbDigit digit="4" />
        </div>
        <h1 data-hero="lines" className="mx-auto mt-12 max-w-4xl display text-[clamp(2.8rem,11vw,6.5rem)] text-bone">
          <span className="line-mask">
            <span className="line-inner">Essa página saiu</span>
          </span>
          <span className="line-mask">
            <span className="line-inner text-mustard">do cardápio.</span>
          </span>
        </h1>
        <p data-hero className="mx-auto mt-6 max-w-md text-base leading-relaxed text-crumb sm:text-lg">
          O endereço pode ter mudado ou não existe mais. Que tal voltar para o que interessa?
        </p>
        <div data-hero className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg" magnetic>
            Voltar ao início
          </ButtonLink>
          <ButtonLink href="/cardapio" variant="outline" size="lg" magnetic>
            Ver cardápio
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
