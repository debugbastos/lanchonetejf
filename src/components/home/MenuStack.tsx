"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/animations/gsap";
import { useScrollReveal } from "@/animations/hooks";
import { BulbRow } from "@/components/ui/BulbRow";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { photos, type SiteImage } from "@/data/images";
import { categorias, type CategoriaId } from "@/data/menu";
import { cn } from "@/lib/format";

type Visual =
  | { kind: "photo"; image: SiteImage; position?: string }
  | { kind: "round"; image: SiteImage }
  | { kind: "type"; tone: "mustard" | "cream" };

/** Como cada categoria aparece na vitrine (só fotos oficiais; sem foto, tipografia) */
const visuals: Record<CategoriaId, Visual> = {
  hamburgueres: { kind: "photo", image: photos.hamburguerDuploCheddarBacon, position: "50% 55%" },
  "cachorro-quente": { kind: "round", image: photos.cachorroQuente },
  acompanhamentos: { kind: "type", tone: "mustard" },
  bebidas: { kind: "type", tone: "cream" },
  combos: { kind: "photo", image: photos.lanchesComRefrigerantes, position: "50% 40%" },
};

function LayerVisual({ visual, nome }: { visual: Visual; nome: string }) {
  if (visual.kind === "photo") {
    return (
      <>
        <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-[1.04]">
          <Image
            src={visual.image.src}
            alt={visual.image.alt}
            fill
            sizes="(min-width: 1024px) 60vw, 92vw"
            className="object-cover"
            style={{ objectPosition: visual.position }}
          />
        </div>
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-night/90 via-night/15 to-transparent" />
      </>
    );
  }
  if (visual.kind === "round") {
    return (
      <div className="absolute inset-0 bg-ketchup">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgb(245_179_36/0.4),transparent_60%)]" />
        <div className="absolute left-1/2 top-[36%] w-[min(58%,20rem)] -translate-x-1/2 -translate-y-1/2">
          <div className="overflow-hidden rounded-full border-[6px] border-mustard/85 shadow-[0_30px_70px_-24px_rgb(0_0_0/0.65)] transition-transform duration-700 ease-[var(--ease-brand)] group-hover:-rotate-3 group-hover:scale-105">
            <Image
              src={visual.image.src}
              alt={visual.image.alt}
              width={visual.image.width}
              height={visual.image.height}
              sizes="(min-width: 1024px) 20rem, 58vw"
              className="aspect-square h-auto w-full object-cover"
            />
          </div>
        </div>
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-night/70 to-transparent" />
      </div>
    );
  }
  const mustard = visual.tone === "mustard";
  return (
    <div className={cn("absolute inset-0 flex flex-col justify-center gap-[0.12em] overflow-hidden px-6 pb-28", mustard ? "bg-mustard" : "bg-cream")}>
      {[0, 1, 2].map((row) => (
        <p
          key={row}
          aria-hidden
          className={cn(
            "display whitespace-nowrap text-[clamp(3rem,13vw,9rem)] leading-[0.86] transition-transform duration-700 ease-[var(--ease-brand)]",
            row === 1 ? "text-ink group-hover:translate-x-[4%]" : "text-outline [--outline-color:var(--color-ink)] opacity-45",
            row === 0 && "group-hover:-translate-x-[4%]",
            row === 2 && "group-hover:-translate-x-[6%]",
          )}
        >
          {nome}
        </p>
      ))}
      <BulbRow count={9} mode="on" className="mt-6 max-w-xs [--bulb-off:rgb(26_18_13/0.25)]" />
    </div>
  );
}

/**
 * Prévia do cardápio: "Bateu a fome?" + as categorias como camadas que se empilham ao rolar
 * (sticky), cada nova cobrindo a anterior — a montagem do lanche. Não lista produtos.
 */
export function MenuStack() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".ms-layer", ref.current);
      const indexItems = gsap.utils.toArray<HTMLElement>(".ms-index-item", ref.current);

      // Índice lateral acompanha a camada que está na tela
      items.forEach((layer, i) => {
        ScrollTrigger.create({
          trigger: layer,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (!self.isActive) return;
            indexItems.forEach((item, j) => item.toggleAttribute("data-active", j === i));
          },
        });
      });

      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // A camada coberta recua e escurece — profundidade de pilha
        items.forEach((layer, i) => {
          const next = items[i + 1];
          if (!next) return;
          gsap
            .timeline({ scrollTrigger: { trigger: next, start: "top bottom", end: "top 25%", scrub: true } })
            .to(layer.querySelector(".ms-card"), { scale: 0.9, ease: "none" }, 0)
            .to(layer.querySelector(".ms-dim"), { opacity: 0.62, ease: "none" }, 0);
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      aria-labelledby="home-cardapio"
      className="relative bg-night [--stack-step:0.7rem] [--stack-top:5.5rem] lg:[--stack-step:1.25rem] lg:[--stack-top:16svh]"
    >
      <div className="container-site grid gap-14 py-24 sm:py-32 lg:grid-cols-12 lg:gap-12 lg:py-40">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[16svh]">
            <SectionLabel data-reveal="up" index="02" label="Cardápio" />
            <h2 id="home-cardapio" data-reveal="lines" className="mt-7 display text-[clamp(3.4rem,15vw,7.25rem)] text-bone">
              <span className="line-mask">
                <span className="line-inner">Bateu a</span>
              </span>
              <span className="line-mask">
                <span className="line-inner text-mustard">fome?</span>
              </span>
            </h2>
            <p data-reveal="up" className="mt-7 max-w-sm text-base leading-relaxed text-crumb sm:text-lg">
              Hambúrgueres, cachorro-quente, acompanhamentos, bebidas e combos. O cardápio completo está a um toque.
            </p>

            <ol className="mt-10 hidden border-t border-line lg:block">
              {categorias.map((c, i) => (
                <li key={c.id}>
                  <TransitionLink
                    href={`/cardapio#${c.id}`}
                    data-active={i === 0 ? "" : undefined}
                    className="ms-index-item group/idx relative flex items-center gap-4 border-b border-line py-3 text-crumb transition-colors hover:text-bone data-[active]:text-bone"
                  >
                    <span className="serif-accent w-7 text-sm">0{i + 1}</span>
                    <span className="display text-2xl font-bold tracking-wide">{c.nome}</span>
                    <span
                      aria-hidden
                      className="ml-auto size-2 scale-0 rounded-full bg-mustard shadow-[0_0_10px_rgb(245_179_36/0.8)] transition-transform duration-300 group-data-[active]/idx:scale-100"
                    />
                  </TransitionLink>
                </li>
              ))}
            </ol>

            <div data-reveal="up" className="mt-10">
              <ButtonLink href="/cardapio" magnetic>
                Ver cardápio completo
              </ButtonLink>
            </div>
          </div>
        </div>

        <ol aria-label="Categorias do cardápio" className="flex flex-col gap-[10svh] pb-[6svh] lg:col-span-8 lg:gap-[14svh]">
          {categorias.map((c, i) => (
            <li
              key={c.id}
              className="ms-layer sticky"
              style={{ top: `calc(var(--stack-top) + ${i} * var(--stack-step))` }}
            >
              <TransitionLink
                href={`/cardapio#${c.id}`}
                data-cursor="media"
                data-cursor-label="Ver"
                className="ms-card group relative block h-[60svh] min-h-[22rem] origin-top overflow-hidden rounded-[28px] bg-smoke lg:h-[68svh]"
              >
                <LayerVisual visual={visuals[c.id]} nome={c.nome} />
                <span className="absolute inset-x-0 bottom-0 block min-w-0 p-6 sm:p-8">
                  <span className={cn("serif-accent block text-xl", visuals[c.id].kind === "type" ? "text-ink" : "text-mustard")}>
                    0{i + 1}
                  </span>
                  <span
                    className={cn(
                      "display block text-[clamp(1.9rem,8.6vw,4.75rem)]",
                      visuals[c.id].kind === "type" ? "text-ink" : "text-bone",
                    )}
                  >
                    {c.nome}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="absolute right-5 top-5 grid size-12 place-items-center rounded-full bg-mustard text-ink transition-transform duration-500 ease-[var(--ease-brand)] group-hover:rotate-45 sm:right-7 sm:top-7"
                >
                  <ArrowUpRight className="size-5" strokeWidth={2.2} />
                </span>
                <span aria-hidden className="ms-dim pointer-events-none absolute inset-0 bg-night opacity-0" />
              </TransitionLink>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
