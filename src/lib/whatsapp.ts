import { business } from "@/data/business";

export const MENSAGEM_PEDIDO_GERAL = "Olá! Vim pelo site do Lanches do Baiano e gostaria de fazer um pedido.";
export const MENSAGEM_CONTATO = "Olá! Vim pelo site do Lanches do Baiano e gostaria de falar com vocês.";

/**
 * Estrutura de um pedido enviado pelo WhatsApp.
 * `quantidade` e `observacao` já são suportados para futuras evoluções do cardápio
 * (hoje a interface envia apenas o produto).
 */
export interface PedidoWhatsApp {
  produto: string;
  quantidade?: number;
  observacao?: string;
}

export function mensagemPedido({ produto, quantidade, observacao }: PedidoWhatsApp): string {
  const item = quantidade && quantidade > 1 ? `${quantidade}x ${produto}` : produto;
  let mensagem = `Olá! Vim pelo site do Lanches do Baiano e gostaria de pedir: ${item}.`;
  if (observacao?.trim()) mensagem += `\nObservação: ${observacao.trim()}`;
  return mensagem;
}

export function mensagemConsultaCategoria(nomeCategoria: string): string {
  return `Olá! Vim pelo site do Lanches do Baiano e gostaria de saber as opções de ${nomeCategoria}.`;
}

/** Link wa.me para o número oficial, com mensagem opcional pré-preenchida */
export function whatsappLink(mensagem?: string): string {
  const base = `https://wa.me/${business.whatsapp}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

export const whatsappPedidoGeral = whatsappLink(MENSAGEM_PEDIDO_GERAL);
