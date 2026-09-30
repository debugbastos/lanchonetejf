import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/business";
import { mainNav } from "@/data/navigation";

export default function sitemap(): MetadataRoute.Sitemap {
  return mainNav.map((item) => ({
    url: `${siteUrl}${item.href === "/" ? "" : item.href}`,
    changeFrequency: item.href === "/cardapio" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1 : item.href === "/cardapio" ? 0.9 : 0.7,
  }));
}
