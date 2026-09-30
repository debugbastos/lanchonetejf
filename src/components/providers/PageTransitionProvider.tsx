"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/animations/gsap";
import { blockPage, releasePage } from "@/animations/page-ready";
import { scrollToTarget, startScroll, stickyOffset, stopScroll } from "@/animations/smooth-scroll";
import { logo } from "@/data/images";
import { labelForPath } from "@/data/navigation";

interface TransitionContextValue {
  navigate: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue>({ navigate: () => {} });

export const usePageTransition = () => useContext(TransitionContext);

type Phase = "idle" | "covering" | "covered";

const BANDS = 6;

/**
 * Transição "corte": seis fatias horizontais entram alternando esquerda/direita (as camadas
 * do lanche se fecham), a rota troca por baixo e as fatias seguem o corte saindo pelo lado
 * oposto. ~0,45 s para cobrir, ~0,55 s para revelar — a nova página já anima por baixo.
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);
  const phase = useRef<Phase>("idle");
  const safetyTimer = useRef(0);
  const [label, setLabel] = useState("");

  const reveal = useCallback(() => {
    const curtain = curtainRef.current;
    window.clearTimeout(safetyTimer.current);
    if (!curtain) return;
    const bands = gsap.utils.toArray<HTMLElement>("[data-band]", curtain);
    const brand = curtain.querySelector("[data-curtain-brand]");

    releasePage("transition");
    gsap
      .timeline({
        onComplete: () => {
          phase.current = "idle";
          gsap.set(curtain, { visibility: "hidden" });
        },
      })
      .to(brand, { autoAlpha: 0, scale: 0.96, duration: 0.16, ease: "power2.in" })
      // o corte continua: cada fatia sai pelo lado oposto ao que entrou
      .to(bands, { xPercent: (i) => (i % 2 ? -101 : 101), duration: 0.5, ease: "power4.inOut", stagger: 0.035 }, 0.05);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);

      if (url.pathname === window.location.pathname) {
        if (url.hash) scrollToTarget(url.hash, { offset: -stickyOffset() - 16 });
        else scrollToTarget(0);
        return;
      }
      if (phase.current !== "idle") return;

      const curtain = curtainRef.current;
      if (!curtain || prefersReducedMotion()) {
        router.push(href);
        return;
      }

      phase.current = "covering";
      setLabel(labelForPath(url.pathname));
      blockPage("transition");
      stopScroll();
      router.prefetch(href);

      const bands = gsap.utils.toArray<HTMLElement>("[data-band]", curtain);
      const brand = curtain.querySelector("[data-curtain-brand]");

      gsap
        .timeline({
          onComplete: () => {
            phase.current = "covered";
            router.push(href, { scroll: false });
            // Rede de segurança: se a rota não trocar (erro de rede), a cortina não fica presa.
            safetyTimer.current = window.setTimeout(() => {
              if (phase.current === "covered") {
                startScroll();
                reveal();
              }
            }, 6000);
          },
        })
        .set(curtain, { visibility: "visible" })
        // fatias entram alternando esquerda/direita — as camadas do lanche se fecham
        .fromTo(
          bands,
          { xPercent: (i) => (i % 2 ? 101 : -101) },
          { xPercent: 0, duration: 0.42, ease: "power4.inOut", stagger: 0.035 },
        )
        .fromTo(brand, { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power2.out" }, "-=0.16");
    },
    [router, reveal],
  );

  // A nova rota já está no DOM: reposiciona o scroll, recalcula os triggers e revela.
  useEffect(() => {
    let frame = 0;
    if (phase.current === "covered") {
      scrollToTarget(0, { immediate: true });
      startScroll();
      frame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        reveal();
        const { hash } = window.location;
        if (hash.length > 1) {
          window.setTimeout(() => scrollToTarget(hash, { offset: -stickyOffset() - 16 }), 450);
        }
      });
    } else {
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    }
    return () => cancelAnimationFrame(frame);
  }, [pathname, reveal]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div ref={curtainRef} aria-hidden="true" className="invisible fixed inset-0 z-[90] flex flex-col overflow-hidden">
        {Array.from({ length: BANDS }, (_, i) => (
          <div key={i} data-band className="relative -mb-px flex-1 bg-night">
            {/* fio mostarda logo à frente da borda que avança — só aparece enquanto a fatia corre */}
            <span className={`absolute inset-y-0 w-[2px] bg-mustard/80 ${i % 2 ? "right-full" : "left-full"}`} />
          </div>
        ))}
        <div data-curtain-brand className="invisible absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-5">
            <Image src={logo.src} width={logo.width} height={logo.height} alt="" className="h-16 w-auto" sizes="64px" />
            <span className="display text-5xl text-bone sm:text-6xl">{label}</span>
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
