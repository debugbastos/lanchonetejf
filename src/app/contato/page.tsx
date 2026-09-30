import { ContactChannels } from "@/components/contato/ContactChannels";
import { business } from "@/data/business";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contato",
  description: `Fale com o ${business.nome}: WhatsApp e telefone ${business.telefone}, Instagram @${business.instagram} e endereço em ${business.endereco.cidadeUf}.`,
  path: "/contato",
});

export default function ContatoPage() {
  return <ContactChannels />;
}
