import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/format";
import { Magnetic } from "./Magnetic";
import { TransitionLink } from "./TransitionLink";

type Variant = "primary" | "outline" | "outlineDark" | "dark" | "light";
type Size = "sm" | "md" | "lg";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Ícone à esquerda do texto (a seta à direita é automática) */
  icon?: ReactNode;
  magnetic?: boolean;
  fullWidth?: boolean;
  className?: string;
  /** Classes do wrapper magnético (ex.: "sm:w-auto" para desfazer o fullWidth) */
  wrapperClassName?: string;
  "aria-label"?: string;
}

/** Cores por fundo: primary/outline (fundo escuro) · outlineDark (creme) · dark (mostarda) · light (ketchup) */
const variants: Record<Variant, string> = {
  primary: "bg-mustard text-ink hover:bg-bone",
  outline: "text-bone ring-1 ring-inset ring-bone/35 hover:bg-bone hover:text-ink hover:ring-bone",
  outlineDark: "text-ink ring-1 ring-inset ring-ink/30 hover:bg-ink hover:text-cream hover:ring-ink",
  dark: "bg-ink text-mustard hover:bg-ketchup hover:text-paper",
  light: "bg-paper text-ketchup hover:bg-ink hover:text-paper",
};

// Em telas estreitas (≤ 400px) tracking e padding diminuem para o rótulo caber em 288px úteis.
const sizes: Record<Size, string> = {
  sm: "h-11 px-5 text-[11px] gap-2 tracking-[0.14em]",
  md: "h-12 px-5 text-xs gap-2 tracking-[0.1em] min-[401px]:gap-2.5 min-[401px]:px-6 min-[401px]:tracking-[0.14em]",
  lg: "h-14 px-5 text-xs gap-2 tracking-[0.1em] min-[401px]:gap-3 min-[401px]:px-7 min-[401px]:text-[13px] min-[401px]:tracking-[0.14em] sm:px-8",
};

/**
 * Botão-link da marca. Microinteração: o rótulo "rola" (sai por cima, entra por baixo),
 * o fundo troca e a seta avança.
 * - href iniciando com "/" → navegação interna com transição
 * - href http(s) → nova aba com rel seguro · tel:/mailto: → link nativo
 */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  icon,
  magnetic = false,
  fullWidth = false,
  className,
  wrapperClassName,
  "aria-label": ariaLabel,
}: ButtonLinkProps) {
  const internal = href.startsWith("/");
  const external = /^https?:\/\//.test(href);
  const Arrow = external ? ArrowUpRight : ArrowRight;

  const classes = cn(
    "group relative inline-flex max-w-full shrink-0 select-none items-center justify-center overflow-hidden rounded-full font-bold uppercase whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-300 active:scale-[0.97]",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );

  const content = (
    <>
      {icon && <span className="flex shrink-0">{icon}</span>}
      <span className="relative flex overflow-hidden py-[0.12em] leading-[1.3]">
        <span className="block transition-transform duration-500 ease-[var(--ease-brand)] group-hover:-translate-y-[115%]">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-x-0 top-[0.12em] block translate-y-[115%] transition-transform duration-500 ease-[var(--ease-brand)] group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
      <Arrow
        aria-hidden
        className={cn(
          "size-4 shrink-0 transition-transform duration-500 ease-[var(--ease-brand)]",
          external ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5" : "group-hover:translate-x-1",
        )}
        strokeWidth={2.2}
      />
      {external && <span className="sr-only"> (abre em nova aba)</span>}
    </>
  );

  const link = internal ? (
    <TransitionLink href={href} className={classes} aria-label={ariaLabel}>
      {content}
    </TransitionLink>
  ) : external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes} aria-label={ariaLabel}>
      {content}
    </a>
  ) : (
    <a href={href} className={classes} aria-label={ariaLabel}>
      {content}
    </a>
  );

  return magnetic ? <Magnetic className={cn(fullWidth && "w-full", wrapperClassName)}>{link}</Magnetic> : link;
}
