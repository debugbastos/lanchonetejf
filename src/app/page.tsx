import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { HouseIntro } from "@/components/home/HouseIntro";
import { Intro } from "@/components/home/Intro";
import { MenuStack } from "@/components/home/MenuStack";
import { VisitSign } from "@/components/home/VisitSign";

/**
 * Home = porta de entrada. Espetáculo concentrado na abertura, prévias com linguagens
 * próprias e o chamado final. Nada de cardápio completo, mapa ou lista de contatos aqui.
 */
export default function HomePage() {
  return (
    <>
      <Intro />
      <Hero />
      <HouseIntro />
      <MenuStack />
      <VisitSign />
      <FinalCta />
    </>
  );
}
