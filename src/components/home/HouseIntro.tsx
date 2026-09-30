"use client";

import Image from "next/image";
import { useRef } from "react";
import { useMouseDepth, useScrollReveal } from "@/animations/hooks";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { photos } from "@/data/images";
import { cn } from "@/lib/format";
import { archRadius } from "@/lib/shape";

/**
 * Ponte editorial (clara, calma): a promessa da casa e o convite para o Sobre.
 * Linguagem própria: marca-texto mostarda varrendo o título + fotos em velocidades
 * diferentes (profundidade) que respondem ao mouse.
 */
export function HouseIntro() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);
  useMouseDepth(ref);

  return (
    <section ref={ref} aria-labelledby="home-casa" className="relative overflow-clip bg-cream text-ink">
      <div className="container-site grid items-center gap-20 py-24 sm:py-32 lg:grid-cols-12 lg:gap-10 lg:py-40">
        <div className="lg:col-span-6">
          <SectionLabel data-reveal="up" index="01" label="A casa" tone="ketchup" />
          <h2 id="home-casa" data-reveal="sweep" className="mt-8 display text-[clamp(3.4rem,15vw,8.75rem)]">
            {["Feito pra", "matar a", "fome."].map((t, i) => (
              <span key={t} className="sweep-line relative block w-fit">
                <span className={cn("sweep-text block", i === 2 && "text-ketchup")}>{t}</span>
                <span aria-hidden className="sweep-bar absolute inset-x-[-0.06em] inset-y-[8%] origin-left scale-x-0 bg-mustard" />
              </span>
            ))}
          </h2>
          <p data-reveal="up" className="mt-9 max-w-md text-lg leading-relaxed text-ink-soft">
            O Lanches do Baiano é hambúrguer e cachorro-quente em Juiz de Fora: lanche generoso, montado pra quem chega com
            fome e quer sair satisfeito.
          </p>
          <div data-reveal="up" className="mt-10">
            <ButtonLink href="/sobre" variant="outlineDark" magnetic>
              Conhecer o Baiano
            </ButtonLink>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md pb-16 lg:col-span-6 lg:max-w-none lg:pb-0 lg:pl-10">
          <div data-depth="10" className="relative ml-auto w-[82%]">
            <div
              className="relative aspect-[0.78] overflow-hidden bg-rule"
              style={{ borderRadius: archRadius(0.78) }}
            >
              <div data-reveal="clip" className="absolute inset-0">
                <div data-parallax="-7" className="absolute inset-x-0 -inset-y-[9%]">
                  <Image
                    src={photos.lancheNaMao.src}
                    alt={photos.lancheNaMao.alt}
                    fill
                    sizes="(min-width: 1024px) 38vw, 80vw"
                    className="object-cover object-[45%_50%]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div data-depth="24" className="absolute bottom-0 left-0 w-[48%] lg:-bottom-12 lg:left-0">
            <div data-parallax="16" className="relative">
              <div className="aspect-square overflow-hidden rounded-full border-[6px] border-cream bg-rule">
                <div data-reveal="clip" className="relative size-full">
                  <Image
                    src={photos.momentoBaiano.src}
                    alt={photos.momentoBaiano.alt}
                    fill
                    sizes="(min-width: 1024px) 20vw, 45vw"
                    className="object-cover object-[45%_25%]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
