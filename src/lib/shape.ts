/**
 * Raio de um ARCO (topo em semicírculo, base levemente arredondada) para um elemento
 * de proporção conhecida. `aspect` = largura / altura.
 * Ex.: aspect 0.75 → "50% 50% 1.5rem 1.5rem / 37.5% 37.5% 1.5rem 1.5rem"
 */
export function archRadius(aspect: number, foot = "1.5rem"): string {
  const v = `${(aspect * 50).toFixed(3)}%`;
  return `50% 50% ${foot} ${foot} / ${v} ${v} ${foot} ${foot}`;
}
