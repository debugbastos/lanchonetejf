import { SobreClosing } from "@/components/sobre/SobreClosing";
import { SobreOpening } from "@/components/sobre/SobreOpening";
import { SobreReel } from "@/components/sobre/SobreReel";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sobre",
  description:
    "Conheça o Lanches do Baiano, hambúrguer e cachorro-quente em Juiz de Fora - MG. Lanche caprichado, feito pra matar a fome.",
  path: "/sobre",
});

export default function SobrePage() {
  return (
    <>
      <SobreOpening />
      <SobreReel />
      <SobreClosing />
    </>
  );
}
