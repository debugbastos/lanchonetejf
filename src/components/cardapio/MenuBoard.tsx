"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { EASE, gsap, MQ, PLAY_ONCE, prefersReducedMotion, useGSAP } from "@/animations/gsap";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useHashCategory } from "@/hooks/useHashCategory";
import { categorias, produtosDaCategoria, type CategoriaId } from "@/data/menu";
import { cn } from "@/lib/format";
import { mensagemConsultaCategoria, whatsappLink, whatsappPedidoGeral } from "@/lib/whatsapp";
import { MenuItem } from "./MenuItem";

const passos = [
  { n: "01", t: "Escolha a categoria e o lanche." },
  { n: "02", t: "Toque em Pedir: o WhatsApp abre com o nome do item." },
  { n: "03", t: "Combine os detalhes direto na conversa." },
];

function HowToOrder({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="eyebrow text-ink-soft">Como pedir</p>
      <ol className="mt-4 flex flex-col gap-3">
        {passos.map((p) => (
          <li key={p.n} className="flex gap-3 text-sm leading-relaxed text-ink">
            <span className="serif-accent text-base text-ketchup">{p.n}</span>
            {p.t}
          </li>
        ))}
      </ol>
      <div className="mt-6">
        <ButtonLink
          href={whatsappPedidoGeral}
          variant="dark"
          size="md"
          icon={<MessageCircle aria-hidden className="size-4" strokeWidth={2.2} />}
        >
          Pedir pelo WhatsApp
        </ButtonLink>
      </div>
    </div>
  );
}

/**
 * Quadro de preços da lanchonete (superfície calma, para ler e escolher).
 * Abas acessíveis por categoria (setas do teclado funcionam), indicador que desliza,
 * troca de conteúdo em camadas e deep link pela URL (#bebidas). Dados: src/data/menu.ts.
 */
export function MenuBoard() {
  const ref = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const [active, select] = useHashCategory();
  const [shown, setShown] = useState<CategoriaId>(active);
  const shownRef = useRef(shown);
  const firstIndicator = useRef(true);
  // Vira true no primeiro clique/tecla da pessoa: só então as trocas são animadas
  const interacted = useRef(false);

  const categoria = categorias.find((c) => c.id === shown) ?? categorias[0];
  const itens = produtosDaCategoria(shown);
  const indice = categorias.findIndex((c) => c.id === shown);

  // Indicadores: barra vertical (desktop) e chip centralizado na faixa (mobile)
  const placeIndicators = useCallback(() => {
    const instant = firstIndicator.current || !interacted.current || prefersReducedMotion();
    firstIndicator.current = false;
    const rail = railRef.current;
    const railTab = rail?.querySelector<HTMLElement>(`[data-cat="${active}"]`);
    const bar = rail?.querySelector<HTMLElement>(".mb-bar");
    if (railTab && bar) {
      const to = { y: railTab.offsetTop, height: railTab.offsetHeight, autoAlpha: 1 };
      if (instant) gsap.set(bar, to);
      else gsap.to(bar, { ...to, duration: 0.6, ease: "expo.out" });
    }
    // Mobile: o chip ativo tem estado próprio (CSS); aqui só o trazemos para o centro da faixa
    const chips = chipsRef.current;
    const chip = chips?.querySelector<HTMLElement>(`[data-cat="${active}"]`);
    if (chips && chip) {
      chips.scrollTo({ left: chip.offsetLeft - (chips.clientWidth - chip.offsetWidth) / 2, behavior: instant ? "auto" : "smooth" });
    }
  }, [active]);

  useGSAP(() => placeIndicators(), { dependencies: [placeIndicators] });

  useEffect(() => {
    const onResize = () => placeIndicators();
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [placeIndicators]);

  // Troca de categoria: o conteúdo atual sai em camadas e o novo entra (o painel remonta pela key).
  // A troca em si não depende da animação terminar (aba em segundo plano pausa o GSAP).
  // Só anima trocas feitas pela pessoa — a sincronização inicial com a URL (#combos) é direta.
  const choose = useCallback(
    (id: CategoriaId) => {
      interacted.current = true;
      select(id);
    },
    [select],
  );
  useEffect(() => {
    if (active === shownRef.current) return;
    const panel = panelRef.current;
    const animate = interacted.current && !!panel && !prefersReducedMotion();
    if (animate) {
      gsap.to(panel.querySelectorAll(".mb-out"), { y: -16, autoAlpha: 0, duration: 0.22, stagger: 0.02, ease: "power2.in" });
    }
    const timer = window.setTimeout(
      () => {
        shownRef.current = active;
        setShown(active);
      },
      animate ? 260 : 0,
    );
    return () => window.clearTimeout(timer);
  }, [active]);

  // Entrada do painel (a cada categoria nova e na primeira vez que o quadro aparece)
  const firstPanel = useRef(true);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({
          defaults: { ease: EASE.enter },
          scrollTrigger: firstPanel.current ? { trigger: panelRef.current, start: "top 85%", ...PLAY_ONCE } : undefined,
        });
        firstPanel.current = false;
        tl.from(".mb-title .line-inner", { yPercent: 115, duration: 0.8 })
          .fromTo(".mb-rule .bulb", { "--lit": 0 }, { "--lit": 1, duration: 0.18, stagger: 0.025, ease: "none" }, 0.1)
          .from(".mb-row", { y: 22, autoAlpha: 0, duration: 0.6, stagger: 0.045 }, 0.15);
      });
    },
    { dependencies: [shown], scope: panelRef, revertOnUpdate: true },
  );

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, orientation: "vertical" | "horizontal") => {
    const keysPrev = orientation === "vertical" ? ["ArrowUp", "ArrowLeft"] : ["ArrowLeft", "ArrowUp"];
    const keysNext = orientation === "vertical" ? ["ArrowDown", "ArrowRight"] : ["ArrowRight", "ArrowDown"];
    const i = categorias.findIndex((c) => c.id === active);
    let next = -1;
    if (keysPrev.includes(e.key)) next = (i - 1 + categorias.length) % categorias.length;
    else if (keysNext.includes(e.key)) next = (i + 1) % categorias.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = categorias.length - 1;
    if (next < 0) return;
    e.preventDefault();
    choose(categorias[next].id);
    const list = e.currentTarget.closest("[role='tablist']");
    list?.querySelector<HTMLElement>(`[data-cat="${categorias[next].id}"]`)?.focus();
  };

  return (
    <section
      ref={ref}
      data-hide-fab
      aria-labelledby="quadro-titulo"
      className="relative z-10 -mt-12 rounded-t-[36px] bg-cream text-ink lg:-mt-20 lg:rounded-t-[56px]"
    >
      <h2 id="quadro-titulo" className="sr-only">
        Itens do cardápio
      </h2>
      {/* âncoras para links como /cardapio#bebidas */}
      {categorias.map((c) => (
        <span key={c.id} id={c.id} aria-hidden className="absolute -top-24 left-0" />
      ))}

      <div className="container-site grid gap-10 pb-20 pt-10 lg:grid-cols-12 lg:gap-14 lg:pb-32 lg:pt-20">
        {/* Índice vertical (desktop) */}
        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-28">
            <p className="eyebrow text-ink-soft">Categorias</p>
            <div ref={railRef} role="tablist" aria-label="Categorias do cardápio" aria-orientation="vertical" className="relative mt-5 border-l-2 border-rule">
              <span aria-hidden className="mb-bar invisible absolute -left-[2px] top-0 w-[3px] rounded-full bg-ketchup" />
              {categorias.map((c, i) => {
                const selected = c.id === active;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    id={`tab-d-${c.id}`}
                    data-cat={c.id}
                    aria-selected={selected}
                    aria-controls="mb-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => choose(c.id)}
                    onKeyDown={(e) => onTabKey(e, "vertical")}
                    className={cn(
                      "group/t flex w-full items-baseline gap-4 py-2.5 pl-6 text-left transition-colors duration-300",
                      selected ? "text-ink" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    <span className={cn("serif-accent w-7 text-base", selected && "text-ketchup")}>0{i + 1}</span>
                    <span className="display text-[clamp(1.7rem,2.4vw,2.4rem)] font-extrabold leading-none transition-transform duration-500 ease-[var(--ease-brand)] group-hover/t:translate-x-1.5">
                      {c.nome}
                    </span>
                  </button>
                );
              })}
            </div>
            <HowToOrder className="mt-12 border-t border-rule pt-8" />
          </div>
        </aside>

        <div className="min-w-0 lg:col-span-8">
          {/* Abas horizontais (mobile/tablet) */}
          <div className="sticky top-[4.6rem] z-20 -mx-[clamp(1rem,4.5vw,3.5rem)] bg-cream/92 px-[clamp(1rem,4.5vw,3.5rem)] py-2 backdrop-blur-md lg:hidden">
            <div
              ref={chipsRef}
              role="tablist"
              aria-label="Categorias do cardápio"
              className="no-scrollbar relative flex gap-1 overflow-x-auto pr-10 [mask-image:linear-gradient(90deg,#000_calc(100%-2.5rem),transparent)]"
            >
              {categorias.map((c, i) => {
                const selected = c.id === active;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    id={`tab-m-${c.id}`}
                    data-cat={c.id}
                    aria-selected={selected}
                    aria-controls="mb-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => choose(c.id)}
                    onKeyDown={(e) => onTabKey(e, "horizontal")}
                    className={cn(
                      "relative flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[11px] font-bold uppercase tracking-[0.14em] transition-[background-color,color,transform] duration-300 active:scale-[0.97]",
                      selected ? "bg-ink text-cream" : "text-ink-soft",
                    )}
                  >
                    <span className="serif-accent text-sm tracking-normal">0{i + 1}</span>
                    {c.nome}
                  </button>
                );
              })}
            </div>
          </div>

          <div id="mb-panel" ref={panelRef} role="tabpanel" aria-label={categoria.nome} tabIndex={0} className="mt-6 outline-none lg:mt-0">
            <div key={shown}>
              <div className="mb-out flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
                <h3 className="mb-title flex min-w-0 flex-wrap items-baseline gap-x-4 display text-[clamp(2.1rem,10.5vw,7.5rem)] text-ink lg:text-[min(6.2vw,7.5rem)]">
                  <span className="serif-accent text-[0.36em] text-ketchup">0{indice + 1}</span>
                  <span className="line-mask">
                    <span className="line-inner">{categoria.nome}</span>
                  </span>
                </h3>
                {itens.length > 0 && (
                  <p className="eyebrow pb-3 text-ink-soft">
                    {itens.length} {itens.length === 1 ? "item" : "itens"}
                  </p>
                )}
              </div>
              <div aria-hidden className="mb-out mb-rule mt-5 flex items-center justify-between gap-1.5 [--bulb-off:var(--color-rule)]">
                {Array.from({ length: 24 }, (_, i) => (
                  <span key={i} data-lit="true" className={cn("bulb", i >= 14 && "max-sm:hidden")} />
                ))}
              </div>

              {itens.length > 0 ? (
                <ul className="mt-4">
                  {itens.map((produto) => (
                    <MenuItem key={produto.id} produto={produto} />
                  ))}
                </ul>
              ) : (
                <div className="mb-row mb-out mt-8 flex flex-col gap-6 rounded-[24px] border-2 border-dashed border-rule p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                  <div>
                    <p className="display text-3xl font-extrabold text-ink">Itens em atualização</p>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
                      Os itens de {categoria.nomeMensagem} ainda estão sendo cadastrados aqui no site. Enquanto isso, consulte as
                      opções direto com a gente.
                    </p>
                  </div>
                  <a
                    href={whatsappLink(mensagemConsultaCategoria(categoria.nomeMensagem))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/c inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-ink px-5 text-[11px] font-bold uppercase tracking-[0.14em] text-cream transition-colors duration-300 hover:bg-ketchup sm:self-auto"
                  >
                    Consultar no WhatsApp
                    <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover/c:rotate-45" strokeWidth={2.2} />
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          <p className="mt-12 border-t border-rule pt-6 text-sm text-ink-soft">
            Disponibilidade e valores podem ser confirmados no WhatsApp.
          </p>
          <HowToOrder className="mt-10 lg:hidden" />
        </div>
      </div>
    </section>
  );
}
