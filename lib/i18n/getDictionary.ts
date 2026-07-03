import "server-only";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";

const loaders: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  en: () => import("./dictionaries/en"),
  "zh-Hant": () => import("./dictionaries/zh-Hant"),
  "zh-Hans": () => import("./dictionaries/zh-Hans"),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = loaders[locale] ?? loaders.en;
  const mod = await loader();
  return mod.default;
}
