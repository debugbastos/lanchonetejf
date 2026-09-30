"use client";

import { useRef } from "react";
import { gsap, MQ, PLAY_ONCE, useGSAP } from "@/animations/gsap";
import { useOpenStatus } from "@/hooks/useOpenStatus";
import { cn } from "@/lib/format";

interface NeonSignProps {
  /** Mostra "Abre amanhã às 17:30" / "Fecha à meia-noite" abaixo da placa */
  showDetail?: boolean;
  /** Tamanho da fonte da placa (qualquer valor CSS) */
  size?: string;
  className?: string;
  detailClassName?: string;
}

/**
 * A placa "ABERTO / FECHADO" da lanchonete, em neon — calculada no horário de Juiz de Fora.
 * Liga uma única vez quando entra na tela (como letreiro acendendo). Sem piscar contínuo.
 */
export function NeonSign({ showDetail = true, size = "2.5rem", className, detailClassName }: NeonSignProps) {
  const ref = useRef<HTMLDivElement>(null);
  const status = useOpenStatus();
  const state = status ? (status.aberto ? "aberto" : "fechado") : "idle";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: "top 90%", ...PLAY_ONCE } })
          .fromTo(".neon", { opacity: 0.15 }, { opacity: 1, duration: 0.06 })
          .to(".neon", { opacity: 0.4, duration: 0.07 })
          .to(".neon", { opacity: 1, duration: 0.12 });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("flex flex-col items-start gap-3", className)}>
      <p className="neon" data-state={state} style={{ fontSize: size }} role="status" aria-live="polite">
        <span>{status ? (status.aberto ? "Aberto" : "Fechado") : "Horário"}</span>
        <span className="text-[0.42em] tracking-[0.18em] opacity-80">agora</span>
      </p>
      {showDetail && (
        <p className={cn("min-h-[1.5em] text-sm text-crumb", detailClassName)}>{status ? status.detalhe : " "}</p>
      )}
    </div>
  );
}
