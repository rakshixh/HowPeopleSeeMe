import type { Metadata, Viewport } from 'next';
import '@/styles/globals.scss';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0F172A',
};

export const metadata: Metadata = {
  title: 'How People See Me: Discover how your friends appreciate you',
  description:
    'Create a free anonymous appreciation page and discover what your friends think you bring into the world. Takes less than 3 seconds to respond. No login required.',
  keywords: ['appreciation', 'friends', 'anonymous', 'social', 'personality'],
  authors: [{ name: 'How People See Me' }],
  openGraph: {
    title: 'How People See Me',
    description: 'Discover how your friends appreciate you, it takes only 3 seconds!',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How People See Me',
    description: 'Discover how your friends appreciate you, it takes only 3 seconds!',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
