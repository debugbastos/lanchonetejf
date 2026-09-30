import { LocationHero } from "@/components/localizacao/LocationHero";
import { OpeningHours } from "@/components/localizacao/OpeningHours";
import { business } from "@/data/business";
import { pageMetadata } from "@/lib/seo";

const { rua, cidadeUf, cep } = business.endereco;

export const metadata = pageMetadata({
  title: "Localização e horário",
  description: `${business.nome} na ${rua}, ${cidadeUf} (CEP ${cep}). Veja o mapa, como chegar e o horário de funcionamento.`,
  path: "/localizacao",
});

export default function LocalizacaoPage() {
  return (
    <>
      <LocationHero />
      <OpeningHours />
    </>
  );
}
