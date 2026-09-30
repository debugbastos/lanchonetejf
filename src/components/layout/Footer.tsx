"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowUp, ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import { EASE, gsap, MQ, PLAY_ONCE, useGSAP } from "@/animations/gsap";
import { scrollToTarget } from "@/animations/smooth-scroll";
import { BulbRow } from "@/components/ui/BulbRow";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { business } from "@/data/business";
import { logo } from "@/data/images";
import { mainNav } from "@/data/navigation";
import { whatsappPedidoGeral } from "@/lib/whatsapp";

const WORD = "Lanches do Baiano";

const rowLink =
  "group/f flex min-h-11 items-center justify-between gap-4 border-b border-line/70 text-bone transition-colors hover:text-mustard";

/** `year` vem do layout (servidor) para não divergir na hidratação. */
export function Footer({ year }: { year: number }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(".ft-ch", {
          yPercent: 105,
          duration: 1.1,
          stagger: 0.028,
          ease: EASE.enter,
          scrollTrigger: { trigger: ".ft-word", start: "top 92%", ...PLAY_ONCE },
        });
        gsap.from(".ft-col", {
          y: 24,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.07,
          ease: EASE.enter,
          scrollTrigger: { trigger: ".ft-grid", start: "top 90%", ...PLAY_ONCE },
        });
      });
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} data-hide-fab className="relative overflow-clip bg-char">
      <div className="container-site pt-16 lg:pt-24">
        <BulbRow count={22} className="hidden sm:flex" />
        <BulbRow count={11} className="sm:hidden" />

        <p aria-hidden className="ft-word mt-10 overflow-hidden whitespace-nowrap text-center display text-[11.6vw] leading-[0.9] text-bone 2xl:text-[10.6rem]">
          {WORD.split("").map((ch, i) => (
            <span key={i} className="ft-ch inline-block">
              {ch === " " ? " " : ch}
            </span>
          ))}
        </p>

        <div className="ft-grid mt-14 grid gap-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          <div className="ft-col sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-5">
              <Image src={logo.src} width={logo.width} height={logo.height} alt={logo.alt} sizes="96px" className="h-20 w-auto lg:h-24" />
              <div>
                <p className="display text-3xl font-extrabold text-bone">{business.nome}</p>
                <p className="serif-accent mt-1 text-lg text-mustard">{business.descricao}</p>
              </div>
            </div>
            <StatusBadge className="mt-8" />
          </div>

          <nav aria-label="Rodapé" className="ft-col lg:col-span-2">
            <h2 className="eyebrow text-crumb">Navegação</h2>
            <ul className="mt-4">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <TransitionLink href={item.href} className="link-underline inline-flex min-h-10 items-center text-bone hover:text-mustard">
                    {item.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ft-col lg:col-span-3">
            <h2 className="eyebrow text-crumb">Fale com a gente</h2>
            <ul className="mt-4 border-t border-line/70">
              <li>
                <a href={whatsappPedidoGeral} target="_blank" rel="noopener noreferrer" className={rowLink}>
                  <span className="flex items-center gap-2.5">
                    <MessageCircle aria-hidden className="size-4 text-mustard" />
                    WhatsApp {business.telefone}
                  </span>
                  <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover/f:rotate-45" />
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
              <li>
                <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" className={rowLink}>
                  <span className="flex items-center gap-2.5">
                    <InstagramIcon className="size-4 text-mustard" />@{business.instagram}
                  </span>
                  <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover/f:rotate-45" />
                  <span className="sr-only"> (Instagram, abre em nova aba)</span>
                </a>
              </li>
              <li>
                <a href={business.telefoneLink} className={rowLink}>
                  <span className="flex items-center gap-2.5">
                    <Phone aria-hidden className="size-4 text-mustard" />
                    Ligar {business.telefone}
                  </span>
                  <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover/f:rotate-45" />
                </a>
              </li>
            </ul>
          </div>

          <div className="ft-col lg:col-span-3">
            <h2 className="eyebrow text-crumb">Endereço e horário</h2>
            <address className="mt-4 not-italic leading-relaxed text-bone">
              {business.endereco.rua}
              <br />
              {business.endereco.cidadeUf} · CEP {business.endereco.cep}
            </address>
            <ul className="mt-4 flex flex-col gap-1 text-sm text-crumb">
              {business.horarioResumo.map((l) => (
                <li key={l.dias}>
                  {l.dias}: <span className="font-semibold text-bone">{l.horas}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-x-5">
              <TransitionLink href="/localizacao" className="link-underline inline-flex min-h-11 items-center text-sm font-semibold text-mustard">
                Ver no mapa
              </TransitionLink>
              <a
                href={business.mapa.abrirUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-mustard"
              >
                Google Maps <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line/70 py-6 text-xs text-crumb sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.nomeCompleto}. Todos os direitos reservados.
          </p>
          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="group/top inline-flex min-h-11 items-center gap-2 self-start font-bold uppercase tracking-[0.18em] text-bone transition-colors hover:text-mustard sm:self-auto"
          >
            Voltar ao topo
            <span className="grid size-8 place-items-center rounded-full ring-1 ring-bone/30 transition-transform duration-500 ease-[var(--ease-brand)] group-hover/top:-translate-y-1">
              <ArrowUp aria-hidden className="size-4" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
