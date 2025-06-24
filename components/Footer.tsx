// --- ARCHIVO ACTUALIZADO: components/Footer.tsx ---
// CAMBIO: Se actualiza el nombre de la marca a "Shark Market".
'use client';

import Link from 'next/link';
import React from 'react';
import { Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Columna 1: Logo y Descripción */}
          <div className="col-span-2 md:col-span-1">
            {/* ---> CORRECCIÓN: Se actualiza el nombre de la marca */}
            <Link href="/" className="text-2xl font-serif font-bold text-white">
              Shark Market
            </Link>
            <p className="mt-4 text-sm text-slate-400">
              El marketplace de know-how para emprendedores y startups.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-200">Navegación</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/search" className="text-sm text-slate-400 hover:text-white transition-colors">Explorar</Link></li>
              <li><Link href="/#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">Cómo Funciona</Link></li>
              <li><Link href="/upload" className="text-sm text-slate-400 hover:text-white transition-colors">Vender</Link></li>
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-200">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/legal/terms" className="text-sm text-slate-400 hover:text-white transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/legal/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">Política de Privacidad</Link></li>
              <li><Link href="/legal/refund" className="text-sm text-slate-400 hover:text-white transition-colors">Política de Reembolso</Link></li>
            </ul>
          </div>

          {/* Columna 4: Soporte */}
           <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-200">Soporte</h3>
            <ul className="mt-4 space-y-2">
                <li><Link href="/help-center" className="text-sm text-slate-400 hover:text-white transition-colors">Centro de Ayuda</Link></li>
                <li><Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

        </div>

        {/* Barra inferior de Copyright */}
        <div className="mt-12 border-t border-slate-700 pt-8 text-center">
          {/* ---> CORRECCIÓN: Se actualiza el nombre en el copyright */}
          <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} Shark Market. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}