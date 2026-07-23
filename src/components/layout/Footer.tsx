'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Globe, MessageCircle, Share2, ChevronRight, Heart, ShieldCheck, Headphones, Download } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-white" />
            <p className="text-white text-sm font-medium">Instale o MyFood no seu telemovel para acesso rapido!</p>
          </div>
          <button className="bg-white text-primary-600 font-semibold text-sm px-5 py-2 rounded-xl hover:bg-gray-100 transition-colors">
            Instalar App
          </button>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-white">
                My<span className="text-primary-400">Food</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              A comida que voce ama, entregue onde estiver. A melhor plataforma de entregas de Mocambique.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors" title="Facebook">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors" title="Instagram">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors" title="Partilhar">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Explorar</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Restaurantes', href: '/cliente' },
                { label: 'Promocoes', href: '/cliente' },
                { label: 'Categorias', href: '/cliente/pesquisa' },
                { label: 'Novidades', href: '/cliente' },
                { label: 'Favoritos', href: '/cliente/favoritos' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Ajuda</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Central de Ajuda', href: '#' },
                { label: 'Como pedir', href: '#' },
                { label: 'Metodos de pagamento', href: '#' },
                { label: 'Politica de devolucao', href: '#' },
                { label: 'Termos de servico', href: '#' },
                { label: 'Politica de privacidade', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">Av. Julius Nyerere, 1000, Maputo, Mocambique</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span className="text-sm text-gray-400">+258 84 000 0000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span className="text-sm text-gray-400">suporte@myfood.co.mz</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span className="text-sm text-gray-400">Todos os dias, 07:00 - 23:00</span>
              </li>
            </ul>

            {/* Trust badges */}
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-800">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-secondary-500" />
                Pagamento seguro
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Headphones className="w-3.5 h-3.5 text-secondary-500" />
                Suporte 24/7
              </div>
            </div>
          </div>
        </div>

        {/* Partners */}
        <div className="mt-10 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-2">Metodos de pagamento aceites</p>
              <div className="flex items-center gap-3">
                {['M-Pesa', 'e-Mola', 'Visa', 'Mastercard'].map((method) => (
                  <span key={method} className="text-[10px] bg-gray-800 text-gray-400 px-2.5 py-1 rounded-lg font-medium">
                    {method}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Junte-se a nos</p>
              <div className="flex gap-2">
                <Link href="/parceiro" className="text-[10px] bg-gray-800 text-gray-400 px-3 py-1.5 rounded-lg font-medium hover:bg-gray-700 hover:text-white transition-colors">
                  Seja Parceiro
                </Link>
                <Link href="/motorista" className="text-[10px] bg-gray-800 text-gray-400 px-3 py-1.5 rounded-lg font-medium hover:bg-gray-700 hover:text-white transition-colors">
                  Seja Entregador
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            &copy; 2026 MyFood. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Feito com <Heart className="w-3 h-3 text-red-500 fill-red-500" /> em Mocambique
          </p>
        </div>
      </div>
    </footer>
  );
}
