"use client";

import { useRef } from "react";
import { MessageCircle } from "lucide-react";
import { useScrollReveal } from "@/animations/hooks";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { Marquee } from "@/components/ui/Marquee";
import { business } from "@/data/business";
import { whatsappPedidoGeral } from "@/lib/whatsapp";

/** Fechamento do Sobre: faixa do Instagram oficial (letreiro correndo) + convite para o cardápio. */
export function SobreClosing() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);

  return (
    <div ref={ref}>
      <section aria-labelledby="sobre-instagram" className="bg-night py-20 sm:py-28">
        <h2 id="sobre-instagram" className="sr-only">
          Instagram oficial do Lanches do Baiano
        </h2>
        <p className="eyebrow container-site text-mustard">Acompanhe o Baiano</p>
        <a
          href={business.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="media"
          data-cursor-label="Abrir"
          className="group mt-8 block border-y border-line transition-colors duration-500 hover:bg-mustard"
        >
          <span className="sr-only">@{business.instagram} no Instagram (abre em nova aba)</span>
          <Marquee
            duration={30}
            separator={<InstagramIcon className="size-[0.5em] shrink-0 text-mustard transition-colors duration-500 group-hover:text-ink" />}
            className="py-5 display text-[clamp(3.5rem,12vw,9rem)] text-bone transition-colors duration-500 group-hover:text-ink"
            items={[`@${business.instagram}`]}
          />
        </a>
      </section>

      <section aria-labelledby="sobre-cta" className="bg-night pb-28 pt-8 sm:pb-36">
        <div className="container-site flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="sobre-cta" data-reveal="lines" className="display text-[clamp(3rem,12vw,7.5rem)] text-bone">
            <span className="line-mask">
              <span className="line-inner">Agora que você</span>
            </span>
            <span className="line-mask">
              <span className="line-inner">
                conhece, <em className="serif-accent text-mustard">bateu a fome?</em>
              </span>
            </span>
          </h2>
          <div data-reveal="stagger" className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href="/cardapio" size="lg" magnetic>
              Ver cardápio
            </ButtonLink>
            <ButtonLink
              href={whatsappPedidoGeral}
              variant="outline"
              size="lg"
              magnetic
              icon={<MessageCircle aria-hidden className="size-4" strokeWidth={2.2} />}
            >
              Pedir agora
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
