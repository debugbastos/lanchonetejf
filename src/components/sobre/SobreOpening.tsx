"use client";

import Image from "next/image";
import { useRef } from "react";
import { useMouseDepth, usePageIntro } from "@/animations/hooks";
import { BulbRow } from "@/components/ui/BulbRow";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { business } from "@/data/business";
import { photos } from "@/data/images";

/** Abertura do Sobre: página dividida — o título se monta em camadas, a foto entra num corte lateral. */
export function SobreOpening() {
  const ref = useRef<HTMLElement>(null);
  usePageIntro(ref);
  useMouseDepth(ref);

  return (
    <section ref={ref} className="relative overflow-clip bg-night">
      <div className="grid lg:min-h-[100svh] lg:grid-cols-2">
        <div className="flex flex-col justify-center px-site pb-14 pt-32 lg:py-36 lg:pr-14">
          <SectionLabel data-hero index="01" label="Sobre o Baiano" />
          <h1 data-hero="montage" className="mt-8 display text-[clamp(4rem,19vw,10.5rem)] text-bone lg:text-[min(9.6vw,10.5rem)]">
            <span className="line-mask">
              <span className="line-inner">Feito pra</span>
            </span>
            <span className="line-mask">
              <span className="line-inner">matar a</span>
            </span>
            <span className="line-mask">
              <span className="line-inner text-mustard">fome.</span>
            </span>
          </h1>
          <p data-hero className="mt-9 max-w-md text-lg leading-relaxed text-crumb">
            O {business.nome} é hambúrguer e cachorro-quente em {business.endereco.cidade}: lanche generoso, montado pra quem
            chega com fome e quer sair satisfeito.
          </p>
        </div>

        <div data-hero="wipe" className="relative min-h-[72svh] overflow-hidden bg-smoke lg:min-h-0">
          <div className="absolute -inset-[4%]" data-depth="-18">
            <Image
              src={photos.lanchesComRefrigerantes.src}
              alt={photos.lanchesComRefrigerantes.alt}
              fill
              preload
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div aria-hidden className="absolute inset-0 bg-linear-to-t from-night/70 via-transparent to-night/20" />
          <div className="absolute inset-x-6 bottom-6 flex items-center gap-4 sm:inset-x-10 sm:bottom-10">
            <BulbRow count={9} mode="on" className="w-36" size={6} />
            <p className="eyebrow text-bone">{business.endereco.cidadeUf}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
