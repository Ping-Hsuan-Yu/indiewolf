export const APP_LOCALES = ['zh', 'en'] as const

export type AppLocale = (typeof APP_LOCALES)[number]

export const DEFAULT_APP_LOCALE: AppLocale = 'zh'

const DATABASE_LOCALE_MAP: Record<AppLocale, string> = {
  zh: 'zh-TW',
  en: 'en-US',
}

export function isAppLocale(value: string): value is AppLocale {
  return APP_LOCALES.includes(value as AppLocale)
}

export function normalizeLocale(value?: string | null): AppLocale {
  if (!value) {
    return DEFAULT_APP_LOCALE
  }
  return isAppLocale(value) ? value : DEFAULT_APP_LOCALE
}

export function toDatabaseLocale(locale: AppLocale): string {
  return DATABASE_LOCALE_MAP[locale]
}
