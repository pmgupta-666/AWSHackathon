import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Meetr — Event Networking',
  description: 'Swipe to meet people at your next Luma event',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
