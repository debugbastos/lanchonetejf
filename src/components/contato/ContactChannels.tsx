"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { useMouseDepth, usePageIntro, useScrollReveal } from "@/animations/hooks";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { Magnetic } from "@/components/ui/Magnetic";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { business } from "@/data/business";
import { photos } from "@/data/images";
import { cn } from "@/lib/format";
import { archRadius } from "@/lib/shape";
import { MENSAGEM_CONTATO, whatsappLink } from "@/lib/whatsapp";

interface BigChannelProps {
  href: string;
  label: string;
  hint: string;
  icon: ReactNode;
  value: string;
  valueClassName?: string;
}

/** Canal principal em tipografia gigante: no hover, a mostarda preenche o texto da esquerda para a direita. */
function BigChannel({ href, label, hint, icon, value, valueClassName }: BigChannelProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-hero="wipe"
      className="group grid grid-cols-1 items-end gap-x-5 gap-y-3 border-b border-line py-7 sm:grid-cols-[1fr_auto] sm:py-9"
    >
      <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-crumb sm:col-span-2">
        <span className="text-mustard">{icon}</span>
        <span className="eyebrow">{label}</span>
        <span className="text-xs text-crumb/80">· {hint}</span>
      </span>
      <span className={cn("relative block min-w-0 display [overflow-wrap:anywhere] text-bone", valueClassName)}>
        <span className="block">{value}</span>
        <span
          aria-hidden
          className="absolute inset-0 block text-mustard [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-700 ease-[var(--ease-brand)] group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)]"
        >
          {value}
        </span>
      </span>
      <span className="hidden sm:block">
        <Magnetic strength={0.35}>
          <span className="grid size-16 shrink-0 place-items-center rounded-full ring-1 ring-bone/30 transition-[background-color,color,transform] duration-500 ease-[var(--ease-brand)] group-hover:rotate-45 group-hover:bg-mustard group-hover:text-ink">
            <ArrowUpRight aria-hidden className="size-6" strokeWidth={1.8} />
          </span>
        </Magnetic>
      </span>
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}

const smallRow =
  "group/s flex min-h-16 items-center justify-between gap-4 border-b border-line py-4 text-bone transition-colors hover:text-mustard";

/** Contato: canais oficiais (WhatsApp e Instagram) em destaque, depois telefone, endereço e horário. */
export function ContactChannels() {
  const ref = useRef<HTMLElement>(null);
  usePageIntro(ref);
  useScrollReveal(ref);
  useMouseDepth(ref);

  return (
    <section ref={ref} aria-labelledby="contato-titulo" className="relative overflow-clip bg-night pb-24 pt-28 sm:pt-32 lg:pb-36 lg:pt-40">
      <div className="container-site grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-8">
          <SectionLabel data-hero index="04" label="Contato" />
          <h1 id="contato-titulo" data-hero="montage" className="mt-7 display text-[clamp(3.8rem,17vw,9.5rem)] text-bone">
            <span className="line-mask">
              <span className="line-inner">Fala com</span>
            </span>
            <span className="line-mask">
              <span className="line-inner">
                o <span className="text-mustard">Baiano.</span>
              </span>
            </span>
          </h1>
          <p data-hero className="mt-7 max-w-md text-lg leading-relaxed text-crumb">
            Pedidos, dúvidas ou recados — o caminho mais rápido é o WhatsApp.
          </p>

          <div className="mt-12 border-t border-line">
            <BigChannel
              href={whatsappLink(MENSAGEM_CONTATO)}
              label="WhatsApp"
              hint="pedidos e atendimento"
              icon={<MessageCircle aria-hidden className="size-4" strokeWidth={2.2} />}
              value={business.telefone}
              valueClassName="whitespace-nowrap text-[clamp(2.2rem,10.5vw,7.25rem)] lg:text-[min(7.4vw,7.25rem)]"
            />
            <BigChannel
              href={business.instagramUrl}
              label="Instagram"
              hint="perfil oficial"
              icon={<InstagramIcon className="size-4" />}
              value={`@${business.instagram}`}
              valueClassName="text-[clamp(1.9rem,8.6vw,5.5rem)]"
            />
          </div>

          <ul data-reveal="stagger" className="mt-10 grid gap-x-10 sm:grid-cols-2">
            <li>
              <a href={business.telefoneLink} className={smallRow}>
                <span className="flex items-center gap-3">
                  <Phone aria-hidden className="size-4 text-mustard" />
                  <span>
                    <span className="eyebrow block text-crumb">Telefone</span>
                    <span className="font-semibold">{business.telefone}</span>
                  </span>
                </span>
                <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover/s:rotate-45" />
              </a>
            </li>
            <li>
              <TransitionLink href="/localizacao" className={smallRow}>
                <span className="flex min-w-0 items-center gap-3">
                  <MapPin aria-hidden className="size-4 shrink-0 text-mustard" />
                  <span className="min-w-0">
                    <span className="eyebrow block text-crumb">Endereço</span>
                    <span className="font-semibold">{business.endereco.rua}</span>
                    <span className="block text-sm text-crumb">
                      {business.endereco.cidadeUf} · <span className="whitespace-nowrap">CEP {business.endereco.cep}</span>
                    </span>
                  </span>
                </span>
                <ArrowRight aria-hidden className="size-4 shrink-0 transition-transform group-hover/s:translate-x-1" />
              </TransitionLink>
            </li>
            <li className="sm:col-span-2">
              <TransitionLink href="/localizacao#horario" className={smallRow}>
                <span className="flex min-w-0 items-center gap-3">
                  <Clock aria-hidden className="size-4 shrink-0 text-mustard" />
                  <span className="min-w-0">
                    <span className="eyebrow block text-crumb">Horário</span>
                    {business.horarioResumo.map((l) => (
                      <span key={l.dias} className="block text-sm">
                        {l.dias}: <span className="font-semibold">{l.horas}</span>
                      </span>
                    ))}
                  </span>
                </span>
                <ArrowRight aria-hidden className="size-4 shrink-0 transition-transform group-hover/s:translate-x-1" />
              </TransitionLink>
            </li>
          </ul>
          <StatusBadge className="mt-6" />
        </div>

        <div className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-28" data-depth="14">
            <div
              data-hero="media"
              className="relative aspect-[0.72] overflow-hidden bg-smoke"
              style={{ borderRadius: archRadius(0.72, "2rem") }}
            >
              <Image
                src={photos.momentoBaiano.src}
                alt={photos.momentoBaiano.alt}
                fill
                preload
                sizes="30vw"
                className="object-cover object-[42%_20%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
