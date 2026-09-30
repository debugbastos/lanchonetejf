"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "@/animations/gsap";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { logo } from "@/data/images";
import { isActivePath, mainNav } from "@/data/navigation";
import { cn } from "@/lib/format";
import { whatsappPedidoGeral } from "@/lib/whatsapp";
import { MobileMenu } from "./MobileMenu";

/**
 * Navbar: integrada à composição no topo; ao rolar, vira uma cápsula flutuante (fundo escuro
 * próprio + blur), então continua legível sobre qualquer seção — clara, escura ou mostarda.
 */
export function Header() {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstMove = useRef(true);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setCompact(window.scrollY > 60));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Indicador da página atual: um ponto mostarda que desliza até o link ativo
  const moveDot = useCallback(() => {
    const list = listRef.current;
    const dot = dotRef.current;
    if (!list || !dot) return;
    const active = list.querySelector<HTMLElement>("[aria-current='page']");
    const instant = firstMove.current || prefersReducedMotion();
    firstMove.current = false;
    if (!active) {
      gsap.to(dot, { autoAlpha: 0, duration: instant ? 0 : 0.3 });
      return;
    }
    const to = { x: active.offsetLeft + active.offsetWidth / 2 - 3, autoAlpha: 1 };
    if (instant) gsap.set(dot, to);
    else gsap.to(dot, { ...to, duration: 0.7, ease: "expo.out" });
  }, []);

  useGSAP(() => moveDot(), { dependencies: [pathname], scope: listRef });

  useEffect(() => {
    const onResize = () => moveDot();
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [moveDot]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const isCompact = compact && !menuOpen;

  return (
    <header data-site-header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "pointer-events-auto relative z-50 mx-auto flex items-center justify-between gap-3 transition-[max-width,width,margin,padding,background-color,box-shadow,border-radius] duration-700 ease-[var(--ease-brand)]",
          isCompact
            ? "mt-2 w-[calc(100%-1rem)] max-w-[62rem] rounded-full bg-night/80 py-1.5 pl-2 pr-1.5 shadow-[0_20px_60px_-24px_rgb(0_0_0/0.9)] ring-1 ring-bone/10 backdrop-blur-xl sm:mt-3"
            : "mt-0 w-full max-w-[96rem] rounded-none bg-transparent px-[clamp(1rem,4.5vw,3.5rem)] py-4 lg:py-6",
        )}
      >
        <TransitionLink href="/" aria-label="Lanches do Baiano — ir para o início" className="group flex items-center gap-3">
          <Image
            src={logo.src}
            width={logo.width}
            height={logo.height}
            alt=""
            sizes="56px"
            preload
            className={cn(
              "w-auto transition-[height,transform] duration-500 ease-[var(--ease-brand)] group-hover:-rotate-6",
              isCompact ? "h-10" : "h-11 lg:h-14",
            )}
          />
          <span
            className={cn(
              "hidden leading-none transition-opacity duration-300 2xl:block",
              isCompact && "2xl:hidden",
            )}
          >
            <span className="display block text-xl font-extrabold tracking-wide text-bone">Lanches do Baiano</span>
            <span className="eyebrow mt-1 block text-[9px] tracking-[0.26em] text-crumb">Hambúrguer · Cachorro-quente</span>
          </span>
        </TransitionLink>

        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul ref={listRef} className="relative flex items-center">
            {mainNav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <TransitionLink
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group/nav relative block px-3.5 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] transition-colors",
                      active ? "text-bone" : "text-crumb hover:text-bone",
                    )}
                  >
                    <span className="relative block overflow-hidden py-[0.1em] leading-[1.3]">
                      <span className="block transition-transform duration-500 ease-[var(--ease-brand)] group-hover/nav:-translate-y-[115%]">
                        {item.label}
                      </span>
                      <span
                        aria-hidden
                        className="absolute inset-x-0 top-[0.1em] block translate-y-[115%] text-mustard transition-transform duration-500 ease-[var(--ease-brand)] group-hover/nav:translate-y-0"
                      >
                        {item.label}
                      </span>
                    </span>
                  </TransitionLink>
                </li>
              );
            })}
            <span
              ref={dotRef}
              aria-hidden
              className="invisible absolute -bottom-0.5 left-0 size-1.5 rounded-full bg-mustard shadow-[0_0_10px_rgb(245_179_36/0.8)]"
            />
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="mr-2 hidden xl:block">
            <StatusBadge showDetail={false} />
          </div>
          <div className="hidden sm:block">
            <ButtonLink
              href={whatsappPedidoGeral}
              size="sm"
              magnetic
              icon={<MessageCircle className="size-4" strokeWidth={2.2} aria-hidden />}
            >
              Pedir agora
            </ButtonLink>
          </div>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            className="group flex h-11 items-center gap-3 rounded-full bg-bone pl-5 pr-4 text-ink transition-colors hover:bg-mustard lg:hidden"
          >
            <span className="eyebrow text-[11px]">{menuOpen ? "Fechar" : "Menu"}</span>
            <span aria-hidden className="relative block h-2.5 w-4">
              <span
                className={cn(
                  "absolute left-0 h-[2px] w-4 rounded-full bg-current transition-transform duration-500 ease-[var(--ease-brand)]",
                  menuOpen ? "top-1 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-[2px] w-4 rounded-full bg-current transition-transform duration-500 ease-[var(--ease-brand)]",
                  menuOpen ? "top-1 -rotate-45" : "top-2",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={closeMenu} toggleRef={toggleRef} />
    </header>
  );
}
