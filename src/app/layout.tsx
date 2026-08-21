import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ClearTrust Tasks',
  description: 'Internal task tracker — used to demo OmniClaw watching bug reports',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
