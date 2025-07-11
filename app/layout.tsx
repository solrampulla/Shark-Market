import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Shark Market | Marketplace de Herramientas para Emprendedores',
  description: 'Compra y vende planes de negocio, modelos financieros y estrategias de alto impacto.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfairDisplay.variable} h-full`}>
      <head>
        <link
            href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
            rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen bg-slate-50 text-slate-800`}>
        <Header />
        <main className="flex-grow pt-[60px]">
          {children}
        </main>
        <Footer />
        
        {/* --- INICIO DE LA CORRECCIÓN --- */}
        <Toaster richColors position="bottom-right" duration={2500} />
        {/* --- FIN DE LA CORRECCIÓN --- */}
        
      </body>
    </html>
  );
}