"use client";

import { useRef } from "react";
import { Navigation } from "lucide-react";
import { EASE, gsap, MQ, PLAY_ONCE, useGSAP } from "@/animations/gsap";
import { usePageIntro } from "@/animations/hooks";
import { whenPageReady } from "@/animations/page-ready";
import { BulbRow } from "@/components/ui/BulbRow";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { business } from "@/data/business";
import { StreetSign } from "./StreetSign";

/**
 * Localização: título + placas de rua + ações à esquerda; o mapa oficial nasce como um sol
 * (arco da logo) — revelação circular a partir da base.
 */
export function LocationHero() {
  const ref = useRef<HTMLElement>(null);
  usePageIntro(ref);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const frame = ref.current?.querySelector<HTMLElement>(".map-sun");
        if (!frame) return;
        gsap.set(frame, { clipPath: "circle(0% at 50% 100%)" });
        return whenPageReady(() => {
          gsap.to(frame, {
            clipPath: "circle(145% at 50% 100%)",
            duration: 1.6,
            ease: EASE.cut,
            scrollTrigger: { trigger: frame, start: "top 92%", ...PLAY_ONCE },
          });
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="loc-titulo" className="relative overflow-clip bg-night pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(50%_60%_at_72%_100%,rgb(245_179_36/0.12),transparent_70%)]"
      />
      <div className="container-site relative grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6 xl:col-span-5">
          <SectionLabel data-hero index="03" label="Localização" />
          <h1 id="loc-titulo" data-hero="montage" className="mt-7 display text-[clamp(3.6rem,16vw,8.5rem)] text-bone">
            <span className="line-mask">
              <span className="line-inner">Vem encontrar</span>
            </span>
            <span className="line-mask">
              <span className="line-inner text-mustard">a gente.</span>
            </span>
          </h1>

          <div className="mt-10">
            <StreetSign />
          </div>

          <p data-hero className="mt-6 text-crumb">
            {business.nomeCompleto}
            <br />
            {business.endereco.cidadeUf} · CEP {business.endereco.cep}
          </p>

          <div data-hero className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={business.mapa.abrirUrl} size="lg" magnetic>
              Abrir no Google Maps
            </ButtonLink>
            <ButtonLink
              href={business.mapa.rotaUrl}
              variant="outline"
              size="lg"
              magnetic
              icon={<Navigation aria-hidden className="size-4" strokeWidth={2.2} />}
            >
              Traçar rota
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-6 xl:col-span-7">
          <div className="relative lg:sticky lg:top-28">
            <div className="map-sun relative overflow-hidden rounded-[28px] bg-smoke ring-1 ring-line">
              <iframe
                src={business.mapa.embedUrl}
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: 20, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa com a localização do ${business.nome} na ${business.endereco.rua}, ${business.endereco.cidade}`}
                className="h-[400px] w-full sm:h-[460px] lg:h-[min(70svh,620px)]"
              />
            </div>
            <div className="mt-5 flex items-center justify-between gap-4">
              <BulbRow count={12} className="w-[min(60%,18rem)]" size={6} />
              <p className="eyebrow text-crumb">Juiz de Fora · MG</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
