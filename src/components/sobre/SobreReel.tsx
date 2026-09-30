"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { EASE, gsap, MQ, PLAY_ONCE, useGSAP } from "@/animations/gsap";
import { useScrollReveal } from "@/animations/hooks";
import { photos, type SiteImage } from "@/data/images";
import { cn } from "@/lib/format";
import { archRadius } from "@/lib/shape";
import { MENSAGEM_CONTATO, whatsappLink } from "@/lib/whatsapp";

interface Chapter {
  n: string;
  title: string;
  text: string;
  image: SiteImage;
  /** "arch" = janela em arco · "round" = foto pequena em círculo sobre ketchup · "rect" = retângulo */
  frame: "arch" | "round" | "rect";
}

const chapters: Chapter[] = [
  {
    n: "01",
    title: "Hambúrguer",
    text: "Pão, carne, queijo e tudo o que vem entre eles, em camadas que não economizam. É lanche pra segurar com as duas mãos.",
    image: photos.hamburguerDuploCheddarBacon,
    frame: "arch",
  },
  {
    n: "02",
    title: "Cachorro-quente",
    text: "Clássico de lanchonete brasileira, montado pra quem gosta de lanche caprichado — do primeiro ao último pedaço.",
    image: photos.cachorroQuente,
    frame: "round",
  },
  {
    n: "03",
    title: "Preparo",
    text: "Queijo derretendo, bacon no ponto, pão dourado. O cuidado na montagem é o que transforma um lanche comum em vontade de repetir.",
    image: photos.hamburguerBaconCheddar,
    frame: "rect",
  },
  {
    n: "04",
    title: "Experiência",
    text: "Parede amarela, lanche na mão e a noite de Juiz de Fora lá fora. O Baiano é lugar de chegar com fome e sair satisfeito.",
    image: photos.momentoBaiano,
    frame: "arch",
  },
  {
    n: "05",
    title: "Atendimento",
    text: "Pedido pelo WhatsApp, conversa direta e sem complicação. Você escolhe, a gente cuida do resto.",
    image: photos.lancheNaMao,
    frame: "rect",
  },
];

function ChapterMedia({ chapter }: { chapter: Chapter }) {
  if (chapter.frame === "round") {
    return (
      <div className="relative grid aspect-[0.8] w-full place-items-center overflow-hidden rounded-[28px] bg-ketchup">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgb(245_179_36/0.4),transparent_62%)]" />
        <div className="sr-media relative w-[62%] overflow-hidden rounded-full border-[6px] border-mustard/85">
          <Image
            src={chapter.image.src}
            alt={chapter.image.alt}
            width={chapter.image.width}
            height={chapter.image.height}
            sizes="(min-width: 1024px) 22rem, 60vw"
            className="aspect-square h-auto w-full object-cover"
          />
        </div>
      </div>
    );
  }
  const aspect = chapter.frame === "arch" ? 0.74 : 0.8;
  return (
    <div
      className="relative w-full overflow-hidden bg-smoke"
      style={{ aspectRatio: aspect, borderRadius: chapter.frame === "arch" ? archRadius(aspect) : "28px" }}
    >
      <div className="sr-media absolute -inset-x-[12%] inset-y-0">
        <Image src={chapter.image.src} alt={chapter.image.alt} fill sizes="(min-width: 1024px) 34vw, 90vw" className="object-cover" />
      </div>
    </div>
  );
}

/**
 * Capítulos da casa em rolo horizontal (desktop): a seção fixa e os capítulos deslizam
 * de lado; as fotos têm parallax próprio e as lâmpadas acendem como barra de progresso.
 * Mobile: sequência vertical com revelações.
 */
export function SobreReel() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const section = ref.current;
        const track = section?.querySelector<HTMLElement>(".sr-track");
        if (!section || !track) return;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const bulbs = gsap.utils.toArray<HTMLElement>(".sr-bulb", section);

        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const lit = self.progress * bulbs.length;
              bulbs.forEach((b, i) => b.style.setProperty("--lit", lit > i ? "1" : "0"));
            },
          },
        });

        gsap.utils.toArray<HTMLElement>(".sr-media").forEach((media) => {
          gsap.fromTo(
            media,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: media.parentElement, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>(".sr-chapter").forEach((chapter) => {
          gsap.from(chapter.querySelectorAll(".sr-in"), {
            yPercent: 115,
            duration: 1,
            stagger: 0.08,
            ease: EASE.enter,
            scrollTrigger: { trigger: chapter, containerAnimation: slide, start: "left 72%", ...PLAY_ONCE },
          });
        });
      });

      mm.add(`${MQ.mobile} and ${MQ.motion}`, () => {
        gsap.utils.toArray<HTMLElement>(".sr-chapter").forEach((chapter) => {
          gsap.from(chapter.querySelectorAll(".sr-in"), {
            yPercent: 115,
            duration: 1,
            stagger: 0.08,
            ease: EASE.enter,
            scrollTrigger: { trigger: chapter.querySelector(".sr-in"), start: "top 88%", ...PLAY_ONCE },
          });
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="sobre-capitulos" className="relative overflow-clip bg-char">
      <div className="motion-safe:lg:flex motion-safe:lg:h-[100svh] motion-safe:lg:flex-col motion-safe:lg:justify-center">
        <div className="sr-track flex flex-col gap-24 px-site py-24 lg:py-32 motion-safe:lg:w-max motion-safe:lg:flex-row motion-safe:lg:items-center motion-safe:lg:gap-[7vw] motion-safe:lg:py-0">
          <div className="motion-safe:lg:w-[26rem] motion-safe:lg:shrink-0">
            <p className="eyebrow text-mustard">A casa em cinco capítulos</p>
            <h2 id="sobre-capitulos" data-reveal="lines" className="mt-6 display text-[clamp(3rem,12vw,6.5rem)] text-bone">
              <span className="line-mask">
                <span className="line-inner">O que faz</span>
              </span>
              <span className="line-mask">
                <span className="line-inner">o Baiano</span>
              </span>
            </h2>
            <p className="mt-6 hidden text-sm text-crumb motion-safe:lg:block">Role para percorrer →</p>
          </div>

          {chapters.map((chapter, i) => (
            <article
              key={chapter.n}
              className={cn(
                "sr-chapter grid items-center gap-8 lg:grid-cols-2 lg:gap-14 motion-safe:lg:w-[min(64vw,58rem)] motion-safe:lg:shrink-0",
                i % 2 === 1 && "lg:[&>*:first-child]:order-2",
              )}
            >
              <div data-reveal="clip" className="mx-auto w-full max-w-md lg:max-w-none">
                <ChapterMedia chapter={chapter} />
              </div>
              <div>
                <p className="line-mask">
                  <span className="sr-in line-inner serif-accent text-3xl text-mustard">{chapter.n}</span>
                </p>
                <h3 className="mt-2 display text-[clamp(2.8rem,11vw,5.5rem)] text-bone">
                  <span className="line-mask">
                    <span className="sr-in line-inner">{chapter.title}</span>
                  </span>
                </h3>
                <p className="mt-6 max-w-sm text-lg leading-relaxed text-crumb">{chapter.text}</p>
                {chapter.n === "05" && (
                  <a
                    href={whatsappLink(MENSAGEM_CONTATO)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-mustard"
                  >
                    Chamar no WhatsApp <ArrowUpRight aria-hidden className="size-4" />
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                )}
              </div>
            </article>
          ))}
          <div aria-hidden className="hidden motion-safe:lg:block motion-safe:lg:w-[8vw] motion-safe:lg:shrink-0" />
        </div>

        {/* Progresso do rolo: uma lâmpada por capítulo */}
        <div aria-hidden className="absolute inset-x-0 bottom-[6svh] hidden justify-center gap-4 motion-safe:lg:flex">
          {chapters.map((c) => (
            <span key={c.n} className="bulb sr-bulb [--bulb:9px]" />
          ))}
        </div>
      </div>
    </section>
  );
}
