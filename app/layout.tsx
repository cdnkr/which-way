import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

export const metadata: Metadata = {
  title: 'Which Way',
  description:
    'Select a location, and see which direction it is from your current location.',
}

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/192.png" />
        <meta name="theme-color" content="#111111" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#111111] md:bg-black font-sans`}
      >
        {children}
      </body>
    </html>
  )
}
