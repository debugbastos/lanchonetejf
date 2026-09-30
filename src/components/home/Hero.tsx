"use client";

import Image from "next/image";
import { useRef } from "react";
import { MessageCircle } from "lucide-react";
import { EASE, gsap, MQ, ScrollTrigger, useGSAP } from "@/animations/gsap";
import { useMouseDepth } from "@/animations/hooks";
import { whenPageReady } from "@/animations/page-ready";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { NeonSign } from "@/components/ui/NeonSign";
import { RotatingBadge } from "@/components/ui/RotatingBadge";
import { business } from "@/data/business";
import { photos } from "@/data/images";
import { whatsappPedidoGeral } from "@/lib/whatsapp";

const hero = photos.hamburguerBaconCheddar;
const BULBS = 13;

const lines = [
  <>O lanche</>,
  <>
    que a <em className="serif-accent text-[1.02em] text-mustard">noite</em>
  </>,
  <>pede.</>,
];

/**
 * Hero "o lanche que a noite pede".
 * O arco da logo vira janela: a foto é revelada num corte, a câmera recua e depois respira;
 * o título se monta em camadas (linhas alternando os lados, engrossando ao assentar);
 * as lâmpadas acendem e o selo gira. No desktop, o scroll abre o arco em tela cheia.
 *
 * Camadas aninhadas para que entrada, scroll e mouse nunca disputem a mesma propriedade:
 * .h-frame (geometria/pin) > .h-reveal (clip de entrada) > .h-cam (zoom do scroll)
 * > .h-breathe (respiração) > .h-photo (zoom de entrada + mouse)
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  useMouseDepth(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ motion: MQ.motion, desktop: MQ.desktop, fine: MQ.finePointer }, (ctx) => {
        const { motion, desktop, fine } = ctx.conditions as Record<string, boolean>;
        if (!motion) return;
        const q = gsap.utils.selector(root);

        // 1) Entrada
        const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.enter } });
        tl.set(q("[data-hero]"), { visibility: "visible" }, 0)
          .fromTo(q(".h-light"), { opacity: 0 }, { opacity: 1, duration: 1.8, ease: "power2.out" }, 0)
          .fromTo(q(".h-reveal"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.35, ease: EASE.cut }, 0)
          .fromTo(q(".h-photo"), { scale: 1.4 }, { scale: 1, duration: 2.3 }, 0)
          .fromTo(q(".h-sweep"), { xPercent: -140 }, { xPercent: 140, duration: 1.5, ease: "power2.inOut" }, 0.95);
        q(".h-line-in").forEach((line, i) => {
          tl.from(line, { xPercent: i % 2 ? 102 : -102, duration: 1.15, ease: EASE.cut }, 0.22 + i * 0.1);
          // no desktop as letras "engrossam" ao assentar (peso variável 200 → 900)
          if (desktop) tl.from(line, { fontWeight: 200, duration: 1.5, ease: "power2.out" }, 0.4 + i * 0.1);
        });
        tl.fromTo(q(".h-bulb"), { "--lit": 0 }, { "--lit": 1, duration: 0.22, stagger: 0.05, ease: "none" }, 0.95)
          .from(q(".h-seal-in"), { scale: 0.4, rotate: -120, autoAlpha: 0, duration: 1.3 }, 0.85)
          .from(q(".h-fade"), { y: 22, autoAlpha: 0, duration: 0.9, stagger: 0.07 }, 0.95);

        const cancel = whenPageReady(() => tl.play());

        // 2) Câmera viva: aproximação lenta e contínua (só enquanto o Hero está na tela)
        const breathe = gsap.to(q(".h-breathe"), { scale: 1.06, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 });
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? breathe.play() : breathe.pause()),
        });

        if (desktop) {
          // 3) Momento: o arco se abre em tela cheia enquanto as camadas do título se afastam
          const frame = q(".h-frame")[0] as HTMLElement;
          const section = root.current as HTMLElement;
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "+=140%",
                pin: true,
                scrub: 0.8,
                invalidateOnRefresh: true,
                anticipatePin: 1,
              },
            })
            .to(
              frame,
              {
                left: 0,
                top: 0,
                width: () => section.clientWidth,
                height: () => section.clientHeight,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                ease: "power2.inOut",
                duration: 1,
              },
              0,
            )
            .to(q(".h-cam"), { scale: 1.14, duration: 1 }, 0)
            .to(q(".h-line-out"), { xPercent: (i) => (i % 2 ? 70 : -70), autoAlpha: 0, duration: 0.6 }, 0)
            .to(q(".h-ui-out"), { y: -48, autoAlpha: 0, duration: 0.3, stagger: 0.03 }, 0)
            .fromTo(q(".h-shade"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.4)
            .from(q(".h-cap-in"), { yPercent: 115, duration: 0.28, stagger: 0.06 }, 0.52)
            // pausa: a foto cheia com a legenda fica na tela um instante antes de soltar
            .to({}, { duration: 0.3 });
        } else {
          // Mobile: sem pin — só um parallax curto da janela
          gsap.to(q(".h-cam"), {
            yPercent: 8,
            scale: 1.06,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          });
        }

        if (desktop && fine) {
          // A luz acompanha o cursor, devagar
          const light = q(".h-light")[0];
          const lx = gsap.quickTo(light, "--lx", { duration: 1.4, ease: "power3.out" });
          const ly = gsap.quickTo(light, "--ly", { duration: 1.4, ease: "power3.out" });
          const onMove = (e: PointerEvent) => {
            lx((e.clientX / window.innerWidth) * 100);
            ly((e.clientY / window.innerHeight) * 100);
          };
          window.addEventListener("pointermove", onMove, { passive: true });
          return () => {
            cancel();
            window.removeEventListener("pointermove", onMove);
          };
        }
        return cancel;
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="hero-titulo"
      className="relative isolate flex min-h-[100svh] flex-col overflow-clip bg-night pb-10 pt-24 lg:block lg:h-[100svh] lg:min-h-[40rem] lg:p-0"
    >
      {/* Luz quente sobre o balcão — segue o mouse no desktop */}
      <div
        aria-hidden
        className="h-light pointer-events-none absolute inset-0 -z-10 [--lx:62] [--ly:28] bg-[radial-gradient(38%_48%_at_calc(var(--lx)*1%)_calc(var(--ly)*1%),rgb(245_179_36/0.17),transparent_72%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-linear-to-t from-char to-transparent" />

      {/* Palco: janela em arco + selo + lâmpadas */}
      <div className="hero-stage">
        <div data-hero className="h-frame hero-frame">
          <div className="h-reveal absolute inset-0">
            <div className="h-cam absolute inset-0">
              <div className="h-breathe absolute inset-0">
                <div className="h-photo absolute -inset-[5%]" data-depth="-16">
                  <Image
                    src={hero.src}
                    alt={hero.alt}
                    fill
                    preload
                    quality={85}
                    sizes="(min-width: 1024px) 100vw, 80vw"
                    className="object-cover object-[50%_45%]"
                  />
                </div>
              </div>
            </div>
            <div
              aria-hidden
              className="h-sweep pointer-events-none absolute inset-y-0 -left-1/2 w-[200%] bg-[linear-gradient(100deg,transparent_42%,rgb(255_236_200/0.34)_50%,transparent_58%)] mix-blend-soft-light"
            />
            <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgb(0_0_0/0.55)]" />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-night/85 to-transparent lg:hidden" />
            <div aria-hidden className="h-shade pointer-events-none absolute inset-0 bg-linear-to-t from-night/90 via-night/35 to-night/20 opacity-0" />
          </div>

          {/* Legenda do momento em tela cheia (desktop, com movimento) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[14%] hidden flex-col items-center px-8 text-center motion-safe:lg:flex">
            <p className="line-mask">
              <span className="h-cap-in line-inner eyebrow text-mustard">Lanches do Baiano · Juiz de Fora</span>
            </p>
            <p className="mt-5 display text-[min(6.4vw,11svh)] text-bone">
              {["Pão dourado.", "Queijo escorrendo.", "Bacon no ponto."].map((t) => (
                <span key={t} className="line-mask">
                  <span className="h-cap-in line-inner">{t}</span>
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="hero-seal" data-depth="22">
          <div data-hero className="h-ui-out">
            <div className="h-seal-in">
              <RotatingBadge text="Lanches do Baiano · Juiz de Fora · " className="w-full" />
            </div>
          </div>
        </div>

        <div className="hero-bulbs h-ui-out" aria-hidden>
          {Array.from({ length: BULBS }, (_, i) => (
            <span key={i} data-lit="true" className="bulb h-bulb" />
          ))}
        </div>
      </div>

      {/* Título em camadas */}
      <div className="relative z-30 -mt-14 px-site lg:absolute lg:left-0 lg:top-[19svh] lg:mt-0">
        <div className="h-ui-out">
          <p data-hero className="h-fade eyebrow mb-5 hidden text-crumb lg:block">
            Hambúrguer &amp; cachorro-quente — {business.endereco.cidadeUf}
          </p>
        </div>
        <h1
          id="hero-titulo"
          data-hero
          className="display whitespace-nowrap text-[15vw] text-bone [text-shadow:0_6px_40px_rgb(11_9_7/0.55)] lg:text-[min(10.8vw,18svh,10rem)]"
        >
          {lines.map((line, i) => (
            <span key={i} className="h-line-out block">
              <span className="block" data-depth={6 + i * 3}>
                <span className="line-mask">
                  <span className="h-line-in line-inner">{line}</span>
                </span>
              </span>
            </span>
          ))}
        </h1>
      </div>

      {/* Base: promessa + CTAs */}
      <div className="relative z-30 mt-7 px-site lg:absolute lg:bottom-[6svh] lg:left-0 lg:mt-0 lg:max-w-[40rem]">
        <div className="h-ui-out">
          <p data-hero className="h-fade max-w-sm text-base leading-relaxed text-crumb sm:text-lg">
            Hambúrguer e cachorro-quente do jeito que a fome manda, aqui em Juiz de Fora.
          </p>
        </div>
        <div className="h-ui-out">
          <div data-hero className="h-fade mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/cardapio" size="lg" magnetic fullWidth className="sm:w-auto" wrapperClassName="sm:w-auto">
              Ver cardápio
            </ButtonLink>
            <ButtonLink
              href={whatsappPedidoGeral}
              variant="outline"
              size="lg"
              magnetic
              fullWidth
              className="sm:w-auto"
              wrapperClassName="sm:w-auto"
              icon={<MessageCircle aria-hidden className="size-4" strokeWidth={2.2} />}
            >
              Pedir agora
            </ButtonLink>
          </div>
        </div>
        <div className="h-ui-out mt-6 lg:hidden">
          <div data-hero className="h-fade">
            <NeonSign size="1.6rem" detailClassName="text-xs" />
          </div>
        </div>
      </div>

      {/* Coluna lateral (desktop largo): placa neon + hoje */}
      <div
        className="absolute right-[max(clamp(1rem,4.5vw,3.5rem),calc((100vw-96rem)/2+3.5rem))] top-[22svh] z-30 hidden w-max max-w-[14rem] xl:block"
        data-depth="5"
      >
        <div className="h-ui-out">
          <div data-hero className="h-fade flex flex-col gap-5">
            <NeonSign size="clamp(1.5rem, 1.9vw, 2.1rem)" detailClassName="text-xs" />
            <p className="text-sm leading-relaxed text-crumb">
              {business.endereco.rua}
              <br />
              {business.endereco.cidadeUf}
            </p>
          </div>
        </div>
      </div>

      {/* Indicador de scroll (desktop) */}
      <div className="absolute bottom-[6svh] right-0 z-30 hidden px-site lg:block">
        <div className="h-ui-out">
          <div data-hero aria-hidden className="h-fade flex items-center gap-3">
            <span className="eyebrow text-[10px] text-crumb">Role</span>
            <span className="relative h-10 w-px overflow-hidden bg-bone/15">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_1.8s_ease-in-out_infinite] bg-mustard" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
