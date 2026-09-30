"use client";

import { useCallback, useSyncExternalStore } from "react";
import { categorias, type CategoriaId } from "@/data/menu";

const EVENT = "baiano:hash";

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

const getHash = () => window.location.hash.slice(1);
const getServerHash = () => "";

function isCategoria(value: string): value is CategoriaId {
  return categorias.some((c) => c.id === value);
}

/**
 * Categoria ativa do cardápio sincronizada com a URL (#bebidas).
 * Links como /cardapio#bebidas abrem direto na categoria; trocar de aba atualiza a URL
 * sem recarregar nem pular a página.
 */
export function useHashCategory(): [CategoriaId, (id: CategoriaId) => void] {
  const hash = useSyncExternalStore(subscribe, getHash, getServerHash);
  const active: CategoriaId = isCategoria(hash) ? hash : categorias[0].id;

  const select = useCallback((id: CategoriaId) => {
    window.history.replaceState(null, "", `#${id}`);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return [active, select];
}
