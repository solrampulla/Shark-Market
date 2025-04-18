// --- FILE: app/layout.tsx ---

import type { Metadata } from "next";
import { Inter, Pacifico } from "next/font/google";
// Quitamos import Head from 'next/head' - ya no se usa así en App Router
import "./globals.css";

// Importa componentes globales
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Configuración de fuentes
const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});
const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: '--font-pacifico',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "BizPlan Market - Share and Sell Your Business Know-how",
  description: "The marketplace for business templates. Turn your business expertise into a valuable asset.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${pacifico.variable}`}>
      <head>
        {/* El CDN de Remixicon va aquí en App Router */}
        <link
            href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
            rel="stylesheet"
        />
      </head>
      {/* Aplicamos la fuente Inter por defecto, Pacifico se usa con font-pacifico */}
      <body className={`${inter.className} bg-gray-50 flex flex-col min-h-screen`}>
        <Header />
        {/* Ajusta pt-[60px] si la altura real del Header es diferente */}
        <main className="flex-grow pt-[60px]">
          {children} {/* Aquí se renderizará page.tsx */}
        </main>
        <Footer />
      </body>
    </html>
  );
}