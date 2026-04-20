import { NextIntlClientProvider } from 'next-intl'

export const dynamic = 'force-dynamic'

export default async function AdminRootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const messages = (await import('@/messages/fr.json')).default

  return (
    <NextIntlClientProvider locale="fr" messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
