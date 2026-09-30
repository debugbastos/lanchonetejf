"use client";

import { useRef } from "react";
import { EASE, gsap, MQ, PLAY_ONCE, useGSAP } from "@/animations/gsap";
import { useScrollReveal } from "@/animations/hooks";
import { NeonSign } from "@/components/ui/NeonSign";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { business } from "@/data/business";
import { useOpenStatus } from "@/hooks/useOpenStatus";
import { cn } from "@/lib/format";

/** Horário de abertura do primeiro dia aberto da semana (vem de business.ts) */
const ABERTURA = business.horarios.find((h) => !h.fechado && h.abre)?.abre ?? "";

/**
 * Quadro de horários: placa neon ABERTO/FECHADO em tempo real + a semana, com o dia de hoje
 * aceso (lâmpada) e a quarta-feira marcada como fechada.
 */
export function OpeningHours({ id = "horario" }: { id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const status = useOpenStatus();
  useScrollReveal(ref);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(".oh-row", {
          xPercent: (i) => (i % 2 ? 6 : -6),
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.06,
          ease: EASE.enter,
          scrollTrigger: { trigger: ".oh-list", start: "top 85%", ...PLAY_ONCE },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-28 overflow-clip border-t border-line bg-char py-20 sm:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <SectionLabel data-reveal="up" label="Horário de funcionamento" />
          <h2 id={`${id}-titulo`} data-reveal="lines" className="mt-7 display text-[clamp(3rem,12vw,6.5rem)] text-bone">
            <span className="line-mask">
              <span className="line-inner">O letreiro</span>
            </span>
            <span className="line-mask">
              <span className="line-inner">
                acende às <span className="text-mustard">{ABERTURA}</span>
              </span>
            </span>
          </h2>
          <div className="mt-10">
            <NeonSign size="clamp(2.4rem, 8vw, 3.75rem)" detailClassName="text-base" />
          </div>
          <p data-reveal="up" className="mt-6 max-w-sm text-sm leading-relaxed text-crumb">
            Status calculado automaticamente pelo horário de Juiz de Fora (horário de Brasília).
          </p>
        </div>

        <ul className="oh-list flex flex-col lg:col-span-7">
          {business.horarios.map((h) => {
            const hoje = status?.hoje === h.dia;
            return (
              <li
                key={h.dia}
                aria-current={hoje ? "date" : undefined}
                className={cn(
                  "oh-row flex items-center justify-between gap-4 border-b border-line px-2 py-4 transition-colors sm:px-4 sm:py-5",
                  hoje && "rounded-2xl border-transparent bg-smoke ring-1 ring-mustard/50",
                )}
              >
                <span className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <span className="bulb" data-lit={hoje ? "true" : undefined} aria-hidden />
                  <span className={cn("display text-2xl font-bold sm:text-3xl", hoje ? "text-bone" : "text-bone/80")}>
                    <span aria-hidden className="sm:hidden">
                      {h.abreviacao}
                    </span>
                    <span className="max-sm:sr-only">{h.nome}</span>
                  </span>
                  {hoje && <span className="eyebrow rounded-full bg-mustard px-2.5 py-1 text-[10px] text-ink">Hoje</span>}
                </span>
                <span
                  className={cn(
                    "shrink-0 display text-2xl font-extrabold tabular sm:text-3xl",
                    h.fechado ? "text-ember" : "text-bone",
                  )}
                >
                  {h.fechado ? "Fechado" : `${h.abre} – ${h.fecha}`}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
