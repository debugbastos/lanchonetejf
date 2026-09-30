"use client";

import { useMemo, useSyncExternalStore } from "react";
import { statusFuncionamento, type StatusFuncionamento } from "@/lib/hours";

/** Atualiza a cada 30 s e ao voltar para a aba — sem recarregar a página. */
function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 30_000);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    window.clearInterval(timer);
    document.removeEventListener("visibilitychange", onChange);
  };
}

function snapshot(): string {
  const s = statusFuncionamento();
  return `${s.aberto ? 1 : 0}|${s.hoje}|${s.detalhe}`;
}

function serverSnapshot(): string | null {
  return null;
}

/**
 * Status ABERTO/FECHADO calculado no fuso de Juiz de Fora.
 * Retorna `null` no servidor e na hidratação (o horário depende do relógio do visitante).
 */
export function useOpenStatus(): StatusFuncionamento | null {
  const key = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return useMemo(() => {
    if (!key) return null;
    const [aberto, hoje, detalhe] = key.split("|");
    return { aberto: aberto === "1", hoje: Number(hoje), detalhe };
  }, [key]);
}
