import type { Metadata } from 'next'
import { Work_Sans, Space_Grotesk } from 'next/font/google'
import './globals.css'

// Body text font
const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

// Headline font (similar to TT Firs - geometric, modern)
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KI-Beratung für den Mittelstand | IT Consulting by Tricept',
  description: 'Praxisnahe KI-Strategie für KMU - Von der Vision zur Umsetzung',
  icons: {
    icon: '/assets/Bildmarke.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${workSans.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
