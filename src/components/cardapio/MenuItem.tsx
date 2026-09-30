import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ProdutoCardapio } from "@/data/menu";
import { cn, formatarPreco } from "@/lib/format";
import { mensagemPedido, whatsappLink } from "@/lib/whatsapp";

/** Linha de cardápio de lanchonete: NOME ········ PREÇO, descrição abaixo e um "Pedir" discreto. */
export function MenuItem({ produto }: { produto: ProdutoCardapio }) {
  const { nome, descricao, preco, imagem, disponivel } = produto;

  return (
    <li
      className={cn(
        "mb-row group grid grid-cols-1 gap-3 border-b border-rule py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-x-8",
        !disponivel && "opacity-60",
      )}
    >
      <div className="flex min-w-0 gap-4">
        {imagem && (
          <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-rule">
            <Image src={imagem} alt="" fill sizes="56px" className="object-cover" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3">
            <h3 className="min-w-0 display text-[1.55rem] font-extrabold leading-[0.95] text-ink transition-colors duration-300 sm:text-[1.9rem] lg:group-hover:text-ketchup">
              {nome}
            </h3>
            <span
              aria-hidden
              className="menu-leader text-ink transition-[opacity,color] duration-300 lg:group-hover:text-ketchup lg:group-hover:opacity-70"
            />
            <p className="shrink-0 display text-[1.55rem] font-extrabold leading-none text-ketchup tabular sm:text-[1.9rem]">
              <span className="sr-only">Preço: </span>
              {formatarPreco(preco)}
            </p>
          </div>
          {descricao && <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft sm:text-[15px]">{descricao}</p>}
          {!disponivel && (
            <p className="eyebrow mt-2 inline-flex rounded-full bg-ink/10 px-3 py-1 text-[10px] text-ink">Indisponível no momento</p>
          )}
        </div>
      </div>

      {disponivel && (
        <a
          href={whatsappLink(mensagemPedido({ produto: nome }))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Pedir ${nome} pelo WhatsApp (abre em nova aba)`}
          className="group/p inline-flex h-11 items-center gap-1.5 justify-self-start rounded-full px-4 text-[11px] font-bold uppercase tracking-[0.18em] text-ink ring-1 ring-inset ring-ink/25 transition-colors duration-300 hover:bg-ink hover:text-cream hover:ring-ink active:scale-95 sm:justify-self-end"
        >
          Pedir
          <ArrowUpRight aria-hidden className="size-3.5 transition-transform duration-300 group-hover/p:rotate-45" strokeWidth={2.4} />
        </a>
      )}
    </li>
  );
}
