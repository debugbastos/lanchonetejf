/**
 * CARDÁPIO — fonte única de dados da página /cardapio.
 *
 * Os componentes visuais leem apenas este arquivo. Para atualizar o cardápio,
 * edite somente a lista `produtos` abaixo — nenhum componente precisa mudar.
 *
 * IMPORTANTE: cadastre apenas produtos, preços e descrições reais do Lanches do Baiano.
 */

export type CategoriaId = "hamburgueres" | "cachorro-quente" | "acompanhamentos" | "bebidas" | "combos";

export interface CategoriaCardapio {
  id: CategoriaId;
  nome: string;
  /** Nome usado nas mensagens de WhatsApp ("gostaria de saber as opções de …") */
  nomeMensagem: string;
}

export interface ProdutoCardapio {
  /** Identificador único, sem espaços (ex.: "x-bacon") */
  id: string;
  nome: string;
  categoria: CategoriaId;
  /** Opcional. Ingredientes ou descrição curta */
  descricao?: string;
  /**
   * Preço em reais como número (ex.: 24.9 → "R$ 24,90").
   * Use `null` enquanto o preço não estiver definido — a interface exibe "Consulte".
   */
  preco: number | null;
  /** Opcional. Caminho de uma foto em /public (ex.: "/assets/cardapio/x-bacon.jpg") */
  imagem?: string;
  /** `false` mantém o item visível como "Indisponível" e desativa o pedido */
  disponivel: boolean;
}

export const categorias: CategoriaCardapio[] = [
  { id: "hamburgueres", nome: "Hambúrgueres", nomeMensagem: "hambúrgueres" },
  { id: "cachorro-quente", nome: "Cachorro-quente", nomeMensagem: "cachorro-quente" },
  { id: "acompanhamentos", nome: "Acompanhamentos", nomeMensagem: "acompanhamentos" },
  { id: "bebidas", nome: "Bebidas", nomeMensagem: "bebidas" },
  { id: "combos", nome: "Combos", nomeMensagem: "combos" },
];

/**
 * Produtos do cardápio.
 *
 * Formato de cada item (os valores abaixo são apenas o modelo do formato):
 *
 * {
 *   id: "identificador-do-produto",
 *   nome: "Nome do produto",
 *   categoria: "hamburgueres",
 *   descricao: "Ingredientes do produto",
 *   preco: 0,
 *   disponivel: true,
 * },
 *
 * Enquanto uma categoria não tiver itens, a página mostra um aviso
 * com link para consultar as opções pelo WhatsApp.
 */
export const produtos: ProdutoCardapio[] = [];

export function produtosDaCategoria(id: CategoriaId): ProdutoCardapio[] {
  return produtos.filter((p) => p.categoria === id);
}
