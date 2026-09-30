"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { usePageTransition } from "@/components/providers/PageTransitionProvider";

type TransitionLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "onNavigate"> & {
  href: string;
};

/**
 * Link interno com a transição da marca.
 * Mantém tudo do <Link> (prefetch, Ctrl/Cmd+clique abre nova aba, acessibilidade) —
 * só intercepta navegações client-side via `onNavigate`.
 */
export function TransitionLink({ href, children, ...rest }: TransitionLinkProps) {
  const { navigate } = usePageTransition();
  return (
    <Link
      href={href}
      onNavigate={(event) => {
        event.preventDefault();
        navigate(href);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
