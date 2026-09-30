"use client";

import { useOpenStatus } from "@/hooks/useOpenStatus";
import { cn } from "@/lib/format";

interface StatusBadgeProps {
  showDetail?: boolean;
  tone?: "dark" | "light";
  className?: string;
}

/** Status compacto (ponto + "Aberto agora"), para barras e rodapés. A versão de destaque é o NeonSign. */
export function StatusBadge({ showDetail = true, tone = "dark", className }: StatusBadgeProps) {
  const status = useOpenStatus();

  return (
    <span
      className={cn(
        "eyebrow inline-flex min-h-9 items-center gap-2.5 tracking-[0.16em]",
        tone === "dark" ? "text-bone" : "text-ink",
        className,
      )}
      aria-live="polite"
    >
      <span aria-hidden className="relative flex size-2 shrink-0">
        {status?.aberto && <span className="absolute inset-0 animate-ping rounded-full bg-leaf opacity-60" />}
        <span
          className={cn(
            "relative size-2 rounded-full",
            status ? (status.aberto ? "bg-leaf" : "bg-ember") : "bg-crumb/40",
          )}
        />
      </span>
      {status ? (
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span>{status.aberto ? "Aberto agora" : "Fechado agora"}</span>
          {showDetail && (
            <span className={cn("font-medium tracking-[0.04em] normal-case", tone === "dark" ? "text-crumb" : "text-ink-soft")}>
              · {status.detalhe}
            </span>
          )}
        </span>
      ) : (
        <span className="opacity-0">Aberto agora</span>
      )}
    </span>
  );
}
