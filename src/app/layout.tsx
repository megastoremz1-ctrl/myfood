import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWAProvider from "@/components/pwa/PWAProvider";
import { AuthProviderWrapper } from "@/components/auth/AuthProviderWrapper";

export const metadata: Metadata = {
  title: "MyFood - A comida que voce ama, entregue onde estiver",
  description: "Plataforma de entrega de comida em Mocambique. Peca os seus pratos favoritos dos melhores restaurantes.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MyFood",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "MyFood",
    title: "MyFood - Entrega de Comida",
    description: "A comida que voce ama, entregue onde estiver.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MyFood" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#f97316" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body>
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
        <PWAProvider />
      </body>
    </html>
  );
}
