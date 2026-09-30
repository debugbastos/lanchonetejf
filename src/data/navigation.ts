export interface NavItem {
  href: "/" | "/sobre" | "/cardapio" | "/localizacao" | "/contato";
  label: string;
}

export const mainNav: NavItem[] = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/cardapio", label: "Cardápio" },
  { href: "/localizacao", label: "Localização" },
  { href: "/contato", label: "Contato" },
];

/** Rótulo exibido na transição de página para um destino */
export function labelForPath(pathname: string): string {
  const clean = pathname.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  return mainNav.find((item) => item.href === clean)?.label ?? "Lanches do Baiano";
}

export function isActivePath(current: string, href: string): boolean {
  if (href === "/") return current === "/";
  return current === href || current.startsWith(`${href}/`);
}
