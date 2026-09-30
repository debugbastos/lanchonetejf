"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type RefObject } from "react";
import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "@/animations/gsap";
import { startScroll, stopScroll } from "@/animations/smooth-scroll";
import { BulbRow } from "@/components/ui/BulbRow";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { NeonSign } from "@/components/ui/NeonSign";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { business } from "@/data/business";
import { isActivePath, mainNav } from "@/data/navigation";
import { cn } from "@/lib/format";
import { whatsappPedidoGeral } from "@/lib/whatsapp";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  toggleRef: RefObject<HTMLButtonElement | null>;
}

const BANDS = 5;

/**
 * Menu de toque: fatias entram alternando os lados (mesma linguagem da transição de página),
 * os links sobem em sequência e a placa neon acende. Fecha ao escolher, com Esc ou pelo botão.
 */
export function MobileMenu({ open, onClose, toggleRef }: MobileMenuProps) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const firstRun = useRef(true);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (firstRun.current) {
        firstRun.current = false;
        if (!open) return;
      }
      const reduced = prefersReducedMotion();
      const d = (s: number) => (reduced ? 0 : s);
      const bands = gsap.utils.toArray<HTMLElement>(".mm-band", el);

      tl.current?.kill();
      if (open) {
        tl.current = gsap
          .timeline()
          .set(el, { visibility: "visible" })
          .fromTo(bands, { xPercent: (i) => (i % 2 ? 101 : -101) }, { xPercent: 0, duration: d(0.5), ease: "power4.inOut", stagger: d(0.04) })
          .fromTo(".mm-link", { yPercent: 115 }, { yPercent: 0, duration: d(0.8), ease: "expo.out", stagger: d(0.055) }, d(0.28))
          .fromTo(".mm-foot", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: d(0.6), ease: "expo.out", stagger: d(0.06) }, d(0.45));
      } else {
        tl.current = gsap
          .timeline()
          .to(".mm-link, .mm-foot", { autoAlpha: 0, duration: d(0.18) })
          .to(bands, { xPercent: (i) => (i % 2 ? -101 : 101), duration: d(0.45), ease: "power4.inOut", stagger: d(0.03) }, d(0.08))
          .set(el, { visibility: "hidden" })
          .set(".mm-link, .mm-foot", { autoAlpha: 1 });
      }
    },
    { dependencies: [open], scope: ref },
  );

  // Trava o scroll, isola o restante da página e trata Esc
  useEffect(() => {
    if (!open) return;
    stopScroll();
    const outside = [document.getElementById("conteudo"), document.querySelector("footer"), document.querySelector("[data-fab]")];
    outside.forEach((node) => node?.setAttribute("inert", ""));
    document.documentElement.style.overflow = "hidden";
    ref.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        toggleRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) onClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      startScroll();
      outside.forEach((node) => node?.removeAttribute("inert"));
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, onClose, toggleRef]);

  return (
    <div
      ref={ref}
      id="menu-mobile"
      aria-label="Menu de navegação"
      aria-hidden={!open}
      data-lenis-prevent
      className="invisible fixed inset-0 z-40 overflow-y-auto overscroll-contain lg:hidden"
    >
      <div aria-hidden className="fixed inset-0 flex flex-col">
        {Array.from({ length: BANDS }, (_, i) => (
          <div key={i} className={cn("mm-band -mb-px flex-1", i % 2 ? "bg-char" : "bg-night")} />
        ))}
      </div>

      <div className="container-site relative flex min-h-full flex-col justify-between gap-10 pb-[calc(1.75rem+env(safe-area-inset-bottom))] pt-24">
        <nav aria-label="Navegação principal (menu)">
          <ul className="flex flex-col">
            {mainNav.map((item, i) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href} className="border-b border-line/70">
                  <TransitionLink
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className="group flex items-center justify-between gap-4 py-2.5"
                  >
                    <span className="line-mask">
                      <span
                        className={cn(
                          "mm-link flex items-baseline gap-4 display text-[clamp(2.6rem,min(14vw,9svh),5rem)] font-extrabold leading-[0.95] transition-colors",
                          active ? "text-mustard" : "text-bone group-active:text-mustard",
                        )}
                      >
                        <span className="serif-accent text-base text-crumb">0{i + 1}</span>
                        {item.label}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden
                      className={cn("mm-foot size-6 shrink-0", active ? "text-mustard" : "text-crumb")}
                      strokeWidth={1.8}
                    />
                  </TransitionLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex flex-col gap-6">
          <BulbRow className="mm-foot" count={14} mode="on" size={6} />
          <div className="mm-foot flex flex-wrap items-end justify-between gap-5">
            <NeonSign size="1.9rem" detailClassName="text-xs" />
            <a
              href={business.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-2 text-sm font-semibold text-bone"
            >
              <InstagramIcon className="size-5 text-mustard" />@{business.instagram}
              <span className="sr-only"> (Instagram, abre em nova aba)</span>
            </a>
          </div>
          <div className="mm-foot">
            <ButtonLink
              href={whatsappPedidoGeral}
              size="lg"
              fullWidth
              icon={<MessageCircle className="size-5" strokeWidth={2.2} aria-hidden />}
            >
              Pedir pelo WhatsApp
            </ButtonLink>
          </div>
          <p className="mm-foot flex items-start gap-2 text-sm text-crumb">
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-mustard" />
            {business.endereco.rua} — {business.endereco.cidadeUf}
          </p>
        </div>
      </div>
    </div>
  );
}
