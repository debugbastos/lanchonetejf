import type { Metadata } from "next";
import { business } from "@/data/business";

export const DEFAULT_TITLE = "Lanches do Baiano | Hambúrguer e Cachorro Quente em Juiz de Fora";
export const DEFAULT_DESCRIPTION =
  "Lanches do Baiano: hambúrguer e cachorro-quente em Juiz de Fora - MG. Veja o cardápio, o horário de funcionamento e peça pelo WhatsApp (32) 98858-8079.";

/** Metadata de página com Open Graph completo (evita perder siteName/locale ao sobrescrever). */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: business.nome,
      title: `${title} | ${business.nome}`,
      description,
      url: path,
    },
    twitter: { card: "summary_large_image", title: `${title} | ${business.nome}`, description },
  };
}
