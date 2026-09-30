"use client";

import { useRef } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { gsap, MQ, useGSAP } from "@/animations/gsap";
import { useScrollReveal } from "@/animations/hooks";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { NeonSign } from "@/components/ui/NeonSign";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { business } from "@/data/business";
import { MENSAGEM_CONTATO, whatsappLink } from "@/lib/whatsapp";

/**
 * Localização + contato, em forma de letreiro: o endereço atravessa a tela com o scroll
 * (tipografia cinética), a placa neon diz se está aberto e o bloco ketchup chama para conversar.
 * Só um resumo — mapa, horários e canais completos ficam nas páginas próprias.
 */
export function VisitSign() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const track = ref.current?.querySelector<HTMLElement>(".vs-track");
        if (!track) return;
        gsap.fromTo(
          track,
          { x: () => window.innerWidth * 0.08 },
          {
            x: () => -(track.scrollWidth - window.innerWidth * 0.6),
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true },
          },
        );
        gsap.from(".vs-card", {
          yPercent: 12,
          rotate: -2,
          ease: "none",
          scrollTrigger: { trigger: ".vs-card", start: "top bottom", end: "top 45%", scrub: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="home-visita" className="relative overflow-clip bg-night pb-24 pt-20 sm:pb-32 lg:pb-40 lg:pt-28">
      <div aria-hidden className="vs-track flex w-max items-center gap-[0.3em] whitespace-nowrap display text-[clamp(5rem,19vw,17rem)] leading-none">
        <span className="text-bone">Av. Doutor Simeão de Faria</span>
        <span className="text-mustard">665</span>
        <span className="text-outline [--outline-color:var(--color-crumb)]">Juiz de Fora</span>
        <span className="serif-accent text-[0.6em] text-mustard">mg</span>
      </div>

      <div className="container-site mt-16 grid gap-6 lg:mt-24 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <SectionLabel data-reveal="up" index="03" label="Onde estamos" />
          <h2 id="home-visita" data-reveal="lines" className="mt-7 display text-[clamp(2.9rem,11vw,6rem)] text-bone">
            <span className="line-mask">
              <span className="line-inner">Vem encontrar</span>
            </span>
            <span className="line-mask">
              <span className="line-inner">a gente.</span>
            </span>
          </h2>
          <div data-reveal="up" className="mt-10">
            <NeonSign size="clamp(2.4rem, 7vw, 3.75rem)" />
          </div>
          <p data-reveal="up" className="mt-6 max-w-sm text-lg leading-relaxed text-crumb">
            {business.endereco.rua}
            <br />
            {business.endereco.cidadeUf}
          </p>
          <div data-reveal="up" className="mt-9 flex flex-col items-start gap-3 sm:flex-row">
            <ButtonLink href="/localizacao" magnetic>
              Ver localização
            </ButtonLink>
            <ButtonLink href={business.mapa.abrirUrl} variant="outline">
              Google Maps
            </ButtonLink>
          </div>
        </div>

        <div className="mt-12 lg:col-span-5 lg:mt-24">
          <article
            aria-labelledby="home-contato"
            className="vs-card relative flex flex-col gap-10 overflow-hidden rounded-[32px] bg-ketchup p-7 text-paper sm:p-10"
          >
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full border-[26px] border-paper/10" />
            <div className="relative">
              <SectionLabel index="04" label="Contato" tone="paper" />
              <h2 id="home-contato" className="mt-6 display text-[clamp(2.6rem,9vw,4.25rem)]">
                Quer falar com a gente?
              </h2>
            </div>
            <ul className="relative flex flex-col border-t border-paper/25">
              <li>
                <a
                  href={whatsappLink(MENSAGEM_CONTATO)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/c flex min-h-14 items-center justify-between gap-4 border-b border-paper/25 py-3"
                >
                  <span className="flex items-center gap-3">
                    <MessageCircle aria-hidden className="size-5" strokeWidth={2} />
                    <span className="display text-2xl font-bold sm:text-3xl">{business.telefone}</span>
                  </span>
                  <ArrowUpRight aria-hidden className="size-5 transition-transform duration-500 group-hover/c:rotate-45" />
                  <span className="sr-only"> (WhatsApp, abre em nova aba)</span>
                </a>
              </li>
              <li>
                <a
                  href={business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/c flex min-h-14 items-center justify-between gap-4 border-b border-paper/25 py-3"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <InstagramIcon className="size-5 shrink-0" />
                    <span className="display min-w-0 text-2xl font-bold [overflow-wrap:anywhere] sm:text-3xl">@{business.instagram}</span>
                  </span>
                  <ArrowUpRight aria-hidden className="size-5 shrink-0 transition-transform duration-500 group-hover/c:rotate-45" />
                  <span className="sr-only"> (Instagram, abre em nova aba)</span>
                </a>
              </li>
            </ul>
            <div className="relative">
              <ButtonLink href="/contato" variant="light" magnetic>
                Entrar em contato
              </ButtonLink>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
