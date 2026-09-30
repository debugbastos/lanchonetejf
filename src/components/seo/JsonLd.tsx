import { business, siteUrl } from "@/data/business";
import { logo } from "@/data/images";

const DIAS_SCHEMA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Dados estruturados do negócio (schema.org) — somente informações reais do arquivo business.ts */
export function JsonLd() {
  const abertos = business.horarios.filter((h) => !h.fechado && h.abre && h.fecha);

  const data = {
    "@context": "https://schema.org",
    "@type": "FastFoodRestaurant",
    name: business.nomeCompleto,
    alternateName: business.nome,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image.jpg`,
    logo: `${siteUrl}${logo.src}`,
    telephone: "+55 32 98858-8079",
    servesCuisine: ["Hambúrguer", "Cachorro-quente"],
    address: {
      "@type": "PostalAddress",
      streetAddress: business.endereco.rua,
      addressLocality: business.endereco.cidade,
      addressRegion: business.endereco.estado,
      postalCode: business.endereco.cep,
      addressCountry: business.endereco.pais,
    },
    hasMap: business.mapa.abrirUrl,
    sameAs: [business.instagramUrl],
    openingHoursSpecification: abertos.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${DIAS_SCHEMA[h.dia]}`,
      opens: h.abre,
      closes: h.fecha === "00:00" ? "23:59" : h.fecha,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
