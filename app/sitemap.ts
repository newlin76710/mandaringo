import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";

const pages = ["", "/about", "/curriculum", "/resources", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://mandaringo.co.uk";
  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${base}/${locale}${page}`,
      lastModified: new Date(0),
    }))
  );
}
