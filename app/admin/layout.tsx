import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

export const dynamic = 'force-dynamic'

export default async function AdminRootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  // Tell next-intl to use 'fr' for this layout and all its children
  // (necessary since the intl middleware doesn't run on /admin)
  setRequestLocale('fr')
  
  const messages = (await import('@/messages/fr.json')).default

  return (
    <NextIntlClientProvider locale="fr" messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
