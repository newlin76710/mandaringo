export const locales = ["en", "zh-Hant", "zh-Hans"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, { label: string; short: string }> = {
  en: { label: "English", short: "EN" },
  "zh-Hant": { label: "繁體中文", short: "繁" },
  "zh-Hans": { label: "简体中文", short: "简" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
