"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import { gsap, MQ, useGSAP } from "@/animations/gsap";
import { logo } from "@/data/images";
import { cn } from "@/lib/format";

/**
 * Selo circular: texto girando ao redor da logo oficial (estática, sem distorção). Gira com o scroll.
 * Posicione pelo className (ex.: "absolute -top-10 right-0"); o padrão é "relative".
 */
export function RotatingBadge({ text, className }: { text: string; className?: string }) {
  const positioned = /\b(absolute|fixed|sticky)\b/.test(className ?? "");
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.to(".badge-ring", {
          rotate: 300,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden="true" className={cn("aspect-square", !positioned && "relative", className)}>
      <svg viewBox="0 0 200 200" className="badge-ring absolute inset-0 size-full">
        <defs>
          <path id={`${id}-circle`} d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
        </defs>
        <circle cx="100" cy="100" r="97" fill="var(--color-night)" stroke="var(--color-mustard)" strokeOpacity="0.45" />
        <text
          fill="var(--color-bone)"
          fontSize="13.5"
          fontWeight="700"
          letterSpacing="3"
          style={{ fontFamily: "var(--font-schibsted), sans-serif", textTransform: "uppercase" }}
        >
          <textPath href={`#${id}-circle`} textLength="512" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-[27%] grid place-items-center">
        <Image src={logo.src} width={logo.width} height={logo.height} alt="" sizes="96px" className="h-full w-auto" />
      </div>
    </div>
  );
}
