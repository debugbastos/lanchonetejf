"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { MessageCircle } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "@/animations/gsap";
import { whatsappPedidoGeral } from "@/lib/whatsapp";

/** Rotas onde o botão flutuante não faz sentido (a própria página já é o canal de contato) */
const HIDDEN_ON = ["/contato"];

/**
 * Atalho flutuante para o WhatsApp — só no mobile/tablet (no desktop a cápsula do header já tem o CTA).
 * Aparece depois da primeira dobra e some sobre áreas marcadas com `data-hide-fab`
 * (CTA final, quadro do cardápio, rodapé) para nunca cobrir botões importantes.
 */
export function FloatingWhatsApp() {
  const pathname = usePathname();
  const ref = useRef<HTMLAnchorElement>(null);
  const hiddenRoute = HIDDEN_ON.includes(pathname);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.set(el, { autoAlpha: 0, scale: 0.7, y: 16 });
      if (hiddenRoute) return;

      let pastFold = false;
      const blockers = new Set<Element>();
      let shown = false;

      const update = () => {
        const should = pastFold && blockers.size === 0;
        if (should === shown) return;
        shown = should;
        gsap.to(el, {
          autoAlpha: should ? 1 : 0,
          scale: should ? 1 : 0.7,
          y: should ? 0 : 16,
          duration: prefersReducedMotion() ? 0 : 0.5,
          ease: should ? "expo.out" : "power2.in",
          overwrite: true,
        });
      };

      const onScroll = () => {
        pastFold = window.scrollY > window.innerHeight * 0.55;
        update();
      };

      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) blockers.add(entry.target);
          else blockers.delete(entry.target);
        });
        update();
      });
      document.querySelectorAll("[data-hide-fab]").forEach((node) => io.observe(node));

      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        io.disconnect();
        window.removeEventListener("scroll", onScroll);
      };
    },
    { dependencies: [pathname, hiddenRoute], revertOnUpdate: true },
  );

  return (
    <a
      ref={ref}
      data-fab
      href={whatsappPedidoGeral}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Pedir pelo WhatsApp (abre em nova aba)"
      className="group invisible fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 lg:hidden"
    >
      <span className="flex h-14 items-center gap-2.5 rounded-full bg-mustard pl-5 pr-2 text-ink shadow-[0_14px_36px_-10px_rgb(245_179_36/0.6)] transition-transform duration-300 group-active:scale-95">
        <span className="eyebrow text-[11px] tracking-[0.16em]">Pedir</span>
        <span className="grid size-10 place-items-center rounded-full bg-ink text-mustard">
          <MessageCircle aria-hidden className="size-5" strokeWidth={2.2} />
        </span>
      </span>
    </a>
  );
}
