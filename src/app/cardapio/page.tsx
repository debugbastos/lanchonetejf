import { MenuBoard } from "@/components/cardapio/MenuBoard";
import { MenuHero } from "@/components/cardapio/MenuHero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cardápio",
  description:
    "Cardápio do Lanches do Baiano em Juiz de Fora: hambúrgueres, cachorro-quente, acompanhamentos, bebidas e combos. Peça pelo WhatsApp.",
  path: "/cardapio",
});

export default function CardapioPage() {
  return (
    <>
      <MenuHero />
      <MenuBoard />
    </>
  );
}
