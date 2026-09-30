"use client";

import { useRef } from "react";
import { gsap, MQ, PLAY_ONCE, useGSAP } from "@/animations/gsap";
import { cn } from "@/lib/format";

interface BulbRowProps {
  count?: number;
  /** "view": acende em sequência ao entrar na tela · "on": sempre acesa */
  mode?: "view" | "on";
  /** Percorre a fileira de novo quando o mouse passa (desktop) */
  chaseOnHover?: boolean;
  className?: string;
  size?: number;
}

/**
 * Fileira de lâmpadas — a linha de pontos do emblema da logo, como letreiro de lanchonete.
 * Decorativa (aria-hidden). Com movimento reduzido, fica acesa sem animação.
 */
export function BulbRow({ count = 11, mode = "view", chaseOnHover = false, className, size = 7 }: BulbRowProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const bulbs = gsap.utils.toArray<HTMLElement>(".bulb", ref.current);
      const mm = gsap.matchMedia();

      mm.add(MQ.reduce, () => {
        gsap.set(bulbs, { "--lit": 1 });
      });

      mm.add(MQ.motion, () => {
        if (mode === "on") {
          gsap.set(bulbs, { "--lit": 1 });
        } else {
          gsap.fromTo(
            bulbs,
            { "--lit": 0 },
            {
              "--lit": 1,
              duration: 0.25,
              stagger: 0.05,
              ease: "power1.out",
              scrollTrigger: { trigger: ref.current, start: "top 92%", ...PLAY_ONCE },
            },
          );
        }

        if (!chaseOnHover) return;
        const el = ref.current?.closest<HTMLElement>("[data-bulb-host]") ?? ref.current;
        if (!el) return;
        const chase = () => {
          gsap
            .timeline()
            .to(bulbs, { "--lit": 0.15, duration: 0.12, stagger: 0.035, ease: "none" })
            .to(bulbs, { "--lit": 1, duration: 0.2, stagger: 0.035, ease: "none" }, 0.12);
        };
        el.addEventListener("pointerenter", chase);
        return () => el.removeEventListener("pointerenter", chase);
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("flex items-center justify-between gap-[var(--bulb-gap,0.55rem)]", className)}
      style={{ ["--bulb" as string]: `${size}px` }}
    >
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="bulb" />
      ))}
    </div>
  );
}
