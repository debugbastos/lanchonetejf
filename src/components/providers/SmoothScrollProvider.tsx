"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect, type ReactNode } from "react";
import { gsap, MQ, ScrollTrigger } from "@/animations/gsap";
import { setLenis } from "@/animations/smooth-scroll";

declare global {
  interface Window {
    __baianoReady?: boolean;
  }
}

/**
 * Smooth scroll com Lenis sincronizado ao ScrollTrigger:
 * - o ticker do GSAP dirige o requestAnimationFrame do Lenis (um único loop);
 * - cada evento de scroll do Lenis atualiza o ScrollTrigger;
 * - com prefers-reduced-motion o Lenis não é criado (rolagem nativa).
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    window.__baianoReady = true;
    const reduce = window.matchMedia(MQ.reduce);
    let lenis: Lenis | null = null;

    const tick = (time: number) => lenis?.raf(time * 1000);

    const create = () => {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
    };

    const destroy = () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
      setLenis(null);
    };

    if (!reduce.matches) create();

    const onPreferenceChange = () => {
      destroy();
      if (!reduce.matches) create();
      ScrollTrigger.refresh();
    };
    reduce.addEventListener("change", onPreferenceChange);

    return () => {
      reduce.removeEventListener("change", onPreferenceChange);
      destroy();
    };
  }, []);

  return <>{children}</>;
}
