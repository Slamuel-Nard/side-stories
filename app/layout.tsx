import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
  title: {
    default: 'Side Stories',
    template: '%s | Side Stories',
  },
  description:
    'Follow traveling artifacts, complete their quests, and add your chapter to a living record of unexpected kindness.',
  openGraph: {
    title: 'Side Stories',
    description:
      'Artifacts travel. Stories remain. Discover a relic and continue its journey.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Side Stories',
    description:
      'Artifacts travel. Stories remain. Discover a relic and continue its journey.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
