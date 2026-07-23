import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "MyFood - A comida que você ama, entregue onde estiver",
  description: "Plataforma de entrega de comida em Moçambique. Peça os seus pratos favoritos dos melhores restaurantes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>
        <Header />
        <main className="min-h-screen pb-20 md:pb-0">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
