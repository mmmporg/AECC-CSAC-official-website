import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AECC',
  description: "Association des Étudiants Camerounais en Chine"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  )
}
