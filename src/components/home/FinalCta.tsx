"use client";

import Image from "next/image";
import { useRef } from "react";
import { MessageCircle } from "lucide-react";
import { EASE, gsap, MQ, PLAY_ONCE, useGSAP } from "@/animations/gsap";
import { useMouseDepth } from "@/animations/hooks";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { business } from "@/data/business";
import { photos } from "@/data/images";
import { archRadius } from "@/lib/shape";
import { whatsappPedidoGeral } from "@/lib/whatsapp";

/**
 * Fechamento da Home: fundo mostarda (a parede amarela da casa).
 * Linguagem própria: ESCALA — o chamado cresce enquanto a seção entra e o "vazado" se preenche.
 */
export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  useMouseDepth(ref);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 20%", scrub: 0.6 } })
          .fromTo(".fc-l1", { scale: 0.62, transformOrigin: "0% 100%" }, { scale: 1, ease: "none" }, 0)
          .fromTo(".fc-l2", { scale: 0.62, xPercent: 18, transformOrigin: "0% 100%" }, { scale: 1, xPercent: 0, ease: "none" }, 0)
          .fromTo(".fc-fill", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0.35);
        gsap.fromTo(
          ".fc-photo",
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: EASE.cut,
            scrollTrigger: { trigger: ".fc-photo", start: "top 85%", ...PLAY_ONCE },
          },
        );
        gsap.from(".fc-fade", {
          y: 24,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: EASE.enter,
          scrollTrigger: { trigger: ".fc-cta", start: "top 92%", ...PLAY_ONCE },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} data-hide-fab aria-labelledby="home-pedido" className="relative overflow-clip bg-mustard text-ink">
      <div className="container-site grid items-end gap-14 py-24 sm:py-32 lg:grid-cols-12 lg:gap-8 lg:py-36">
        <div className="lg:col-span-7">
          <p className="eyebrow">Hambúrguer e cachorro-quente em Juiz de Fora</p>
          <h2 id="home-pedido" className="mt-6 display text-[clamp(4rem,21vw,13rem)] leading-[0.86]">
            <span className="fc-l1 block">Bateu a</span>
            <span className="fc-l2 relative block">
              <span className="text-outline [--outline-color:var(--color-ink)]">fome?</span>
              <span aria-hidden className="fc-fill absolute inset-0 text-ketchup">
                fome?
              </span>
            </span>
          </h2>
          <p className="serif-accent mt-4 text-[clamp(2rem,7vw,4.5rem)] leading-none text-ink">Peça agora.</p>

          <div className="fc-cta mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-7">
            <div className="fc-fade">
              <ButtonLink
                href={whatsappPedidoGeral}
                variant="dark"
                size="lg"
                magnetic
                icon={<MessageCircle aria-hidden className="size-5" strokeWidth={2.2} />}
              >
                Pedir pelo WhatsApp
              </ButtonLink>
            </div>
            <a href={business.telefoneLink} className="fc-fade link-underline eyebrow text-[12px] text-ink">
              ou ligue {business.telefone}
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:col-span-4 lg:col-start-9 lg:max-w-none" data-depth="14">
          <div
            className="fc-photo relative aspect-[0.8] overflow-hidden bg-mustard-deep"
            style={{ borderRadius: archRadius(0.8, "2rem") }}
          >
            <Image
              src={photos.momentoBaiano.src}
              alt={photos.momentoBaiano.alt}
              fill
              sizes="(min-width: 1024px) 32vw, 90vw"
              className="object-cover object-[42%_18%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
