import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyFood - A comida que voce ama, entregue onde estiver",
  description: "Plataforma de entrega de comida em Mocambique. Peca os seus pratos favoritos dos melhores restaurantes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>
        {children}
      </body>
    </html>
  );
}
