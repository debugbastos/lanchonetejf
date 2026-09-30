"use client";

import Image from "next/image";
import { useRef } from "react";
import { MessageCircle } from "lucide-react";
import { useMouseDepth, usePageIntro } from "@/animations/hooks";
import { BulbRow } from "@/components/ui/BulbRow";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { photos } from "@/data/images";
import { archRadius } from "@/lib/shape";
import { whatsappPedidoGeral } from "@/lib/whatsapp";

/** Abertura do cardápio: faixa escura curta — o quadro de preços (claro) sobe por cima dela. */
export function MenuHero() {
  const ref = useRef<HTMLElement>(null);
  usePageIntro(ref);
  useMouseDepth(ref);

  return (
    <section ref={ref} className="relative overflow-clip bg-night pb-24 pt-28 sm:pt-32 lg:pb-36 lg:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_60%_at_78%_30%,rgb(245_179_36/0.14),transparent_70%)]"
      />
      <div className="container-site relative grid items-end gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SectionLabel data-hero index="02" label="Cardápio" />
          <h1 data-hero="montage" className="mt-7 display text-[clamp(4rem,19vw,11.5rem)] text-bone">
            <span className="line-mask">
              <span className="line-inner">Cardápio</span>
            </span>
            <span className="line-mask">
              <span className="line-inner">
                <em className="serif-accent text-[0.8em] text-mustard">do</em> Baiano
              </span>
            </span>
          </h1>
          <p data-hero className="mt-7 max-w-lg text-base leading-relaxed text-crumb sm:text-lg">
            Escolha a categoria, toque em pedir e finalize direto no WhatsApp.
          </p>
          <div data-hero className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ButtonLink
              href={whatsappPedidoGeral}
              magnetic
              icon={<MessageCircle aria-hidden className="size-4" strokeWidth={2.2} />}
            >
              Pedir pelo WhatsApp
            </ButtonLink>
            <StatusBadge />
          </div>
        </div>

        <div className="hidden lg:col-span-4 lg:block" data-depth="14">
          <div
            data-hero="media"
            className="relative ml-auto aspect-[0.74] w-[min(100%,22rem)] overflow-hidden bg-smoke"
            style={{ borderRadius: archRadius(0.74) }}
          >
            <Image
              src={photos.hamburguerDuploCheddarFrente.src}
              alt={photos.hamburguerDuploCheddarFrente.alt}
              fill
              preload
              sizes="22rem"
              className="object-cover"
            />
          </div>
          <BulbRow count={11} className="ml-auto mt-5 w-[min(100%,22rem)]" />
        </div>
      </div>
    </section>
  );
}
