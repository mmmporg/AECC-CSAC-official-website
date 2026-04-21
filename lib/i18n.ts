import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

export const locales = ['fr', 'en'] as const
export const defaultLocale = 'fr'

export type Locale = (typeof locales)[number]

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale
  let resolvedLocale = locale
  if (!locale || !isLocale(locale)) {
    resolvedLocale = defaultLocale
  }

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default
  }
})
