/**
 * @fileoverview Root layout component for the WordWise application.
 *
 * This component provides the base layout structure, global styles,
 * authentication context, and metadata for the entire application.
 * It wraps all pages and provides the necessary providers and
 * styling foundation.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth/auth-context';
import { ThemeProvider } from '@/context/theme-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WordWise - AI Writing Assistant for STEM Students',
  description:
    'A modern, distraction-free writing assistant designed specifically for STEM graduate students drafting dissertations and research papers.',
  keywords: [
    'writing assistant',
    'academic writing',
    'STEM',
    'dissertation',
    'research paper',
    'grammar checker',
  ],
  authors: [{ name: 'WordWise Team' }],
  creator: 'WordWise Team',
  publisher: 'WordWise',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://wordwise.app'),
  openGraph: {
    title: 'WordWise - AI Writing Assistant for STEM Students',
    description:
      'A modern, distraction-free writing assistant designed specifically for STEM graduate students.',
    url: 'https://wordwise.app',
    siteName: 'WordWise',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WordWise - AI Writing Assistant for STEM Students',
    description:
      'A modern, distraction-free writing assistant designed specifically for STEM graduate students.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

/**
 * Root layout component that wraps the entire application.
 *
 * @param children - The child components to render within the layout
 * @returns The root layout with providers and global styling
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} h-full bg-background-primary text-text-primary antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
