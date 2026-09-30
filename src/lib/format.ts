const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 24.9 → "R$ 24,90"; null → "Consulte" */
export function formatarPreco(preco: number | null): string {
  if (preco === null || Number.isNaN(preco)) return "Consulte";
  return moeda.format(preco).replace(/ /g, " ");
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
