import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/public/Footer'
import { Header } from '@/components/public/Header'
import { isLocale, type Locale } from '@/lib/i18n'

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) {
  if (!isLocale(params.locale)) {
    notFound()
  }

  const locale = params.locale as Locale
  const messages = (await import(`@/messages/${locale}.json`)).default

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen flex-col">
        <Header locale={locale} />
        <main className="flex-1 pt-28">{children}</main>
        <Footer locale={locale} />
      </div>
    </NextIntlClientProvider>
  )
}
