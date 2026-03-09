import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ANGOLA_CONFIG } from "@/lib/config";
import ConditionalLayout from "@/components/ConditionalLayout";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { CookieProvider } from "@/contexts/CookieContext";
import CookieBanner from "@/components/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: ANGOLA_CONFIG.seo.defaultTitle,
  description: ANGOLA_CONFIG.seo.defaultDescription,
  keywords: ANGOLA_CONFIG.seo.keywords,
  authors: [{ name: ANGOLA_CONFIG.company.name }],
  creator: ANGOLA_CONFIG.company.name,
  publisher: ANGOLA_CONFIG.company.name,
  metadataBase: new URL(`https://${ANGOLA_CONFIG.company.domain}`),
  icons: {
    icon: [
      { url: '/assets/images/auto-prestige-logo.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/assets/images/auto-prestige-logo.svg', sizes: '192x192', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/assets/images/auto-prestige-logo.svg', sizes: '180x180', type: 'image/svg+xml' },
      ],
      shortcut: '/assets/images/auto-prestige-logo.svg',
  },
  alternates: {
    canonical: '/',
    languages: {
      'pt-AO': '/',
      'pt': '/',
    },
  },
  openGraph: {
    title: ANGOLA_CONFIG.seo.defaultTitle,
    description: ANGOLA_CONFIG.seo.defaultDescription,
    url: `https://${ANGOLA_CONFIG.company.domain}`,
    siteName: ANGOLA_CONFIG.company.fullName,
    locale: 'pt_AO',
    type: 'website',
    countryName: 'Angola',
    images: [
      {
        url: '/assets/images/auto-prestige-logo.svg',
        width: 1200,
        height: 630,
        alt: 'Auto Prestige - Revista Digital Automotiva de Angola',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: ANGOLA_CONFIG.seo.defaultTitle,
    description: ANGOLA_CONFIG.seo.defaultDescription,
    creator: '@autoprestigeangola',
    images: ['/assets/images/auto-prestige-logo.svg'],
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
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-AO" suppressHydrationWarning>
      <head>
        <meta name="geo.region" content="AO" />
        <meta name="geo.country" content="Angola" />
        <meta name="geo.placename" content="Luanda" />
        <meta name="ICBM" content="-8.8390,13.2894" />
        <meta name="currency" content="AOA" />
        <meta name="country-code" content="AO" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CookieProvider>
          <Suspense fallback={null}>
            {GA_MEASUREMENT_ID && <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />}
          </Suspense>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <CookieBanner />
        </CookieProvider>
      </body>
    </html>
  );
}
