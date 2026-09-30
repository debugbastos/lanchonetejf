import type { Metadata } from "next";
import { NotFoundContent } from "@/components/ui/NotFoundContent";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "Essa página saiu do cardápio. Volte ao início ou veja o cardápio do Lanches do Baiano.",
};

export default function NotFound() {
  return <NotFoundContent />;
}
