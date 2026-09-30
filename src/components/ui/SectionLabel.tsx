import type { HTMLAttributes } from "react";
import { cn } from "@/lib/format";

interface SectionLabelProps extends HTMLAttributes<HTMLParagraphElement> {
  index?: string;
  label: string;
  tone?: "mustard" | "ink" | "paper" | "ketchup";
}

const tones = { mustard: "text-mustard", ink: "text-ink", paper: "text-paper", ketchup: "text-ketchup" };

/** Rótulo editorial: "01 ── A casa" */
export function SectionLabel({ index, label, tone = "mustard", className, ...rest }: SectionLabelProps) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", tones[tone], className)} {...rest}>
      {index && <span className="serif-accent text-lg leading-none tracking-normal">{index}</span>}
      <span aria-hidden className="h-px w-8 bg-current opacity-60" />
      <span>{label}</span>
    </p>
  );
}
