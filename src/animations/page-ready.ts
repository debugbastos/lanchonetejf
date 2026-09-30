/**
 * Sinal de "página pronta para animar".
 *
 * A entrada de cada página só deve começar quando nada estiver cobrindo a tela:
 * - `data-intro="play"`   → a introdução com a logo está rodando (primeira visita à Home)
 * - `data-transition="cover"` → a cortina da transição de página está fechada
 *
 * Os dois atributos ficam no <html>. Quem cobre a tela chama `releasePage()` ao liberar.
 */

const EVENT = "baiano:page-ready";

type Flag = "intro" | "transition";

export function isPageBlocked(): boolean {
  if (typeof document === "undefined") return false;
  const { intro, transition } = document.documentElement.dataset;
  return intro === "play" || transition === "cover";
}

export function blockPage(flag: Flag): void {
  document.documentElement.dataset[flag] = flag === "intro" ? "play" : "cover";
}

/**
 * Libera a página. `keep` mantém o atributo com outro valor (não bloqueante) —
 * usado pela introdução, que continua visível enquanto faz a saída.
 */
export function releasePage(flag: Flag, keep?: string): void {
  if (keep) document.documentElement.dataset[flag] = keep;
  else delete document.documentElement.dataset[flag];
  if (!isPageBlocked()) window.dispatchEvent(new Event(EVENT));
}

/** Executa `callback` assim que a página estiver visível. Retorna a função de cancelamento. */
export function whenPageReady(callback: () => void): () => void {
  if (!isPageBlocked()) {
    callback();
    return () => {};
  }
  const handler = () => {
    if (isPageBlocked()) return;
    window.removeEventListener(EVENT, handler);
    callback();
  };
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
