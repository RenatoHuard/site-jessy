
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Mail, BookOpen } from 'lucide-react';
import { useSiteConfig } from '@/hooks/useSiteConfig.js';

function Footer() {
  const currentYear = new Date().getFullYear();
  const { config } = useSiteConfig();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <h3 className="heading-font text-3xl font-bold mb-6">{config?.site_title || 'Jéssica Rayane'}</h3>
            <p className="text-primary-foreground/90 leading-relaxed max-w-md text-lg">
              Bailarina, educadora, coordenadora pedagógica e criadora de comunidade. Explorando dança, leitura e desenvolvimento pessoal.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-semibold text-lg mb-6 tracking-wide uppercase text-primary-foreground/80">Navegação</h4>
            <nav className="space-y-4">
              <Link to="/" className="block text-primary-foreground hover:text-accent transition-colors duration-200">
                Home
              </Link>
              <Link to="/servicos" className="block text-primary-foreground hover:text-accent transition-colors duration-200">
                Serviços
              </Link>
              <Link to="/sobre" className="block text-primary-foreground hover:text-accent transition-colors duration-200">
                Sobre
              </Link>
              <Link to="/contato" className="block text-primary-foreground hover:text-accent transition-colors duration-200">
                Contato
              </Link>
            </nav>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-semibold text-lg mb-6 tracking-wide uppercase text-primary-foreground/80">Conecte-se</h4>
            <div className="space-y-4">
              <a
                href="https://www.instagram.com/jr.dancing?igsh=YmJhcXFrNzU1eTB1&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-primary-foreground hover:text-accent transition-colors duration-200"
              >
                <Instagram className="h-5 w-5" />
                <span>Instagram Profissional (@jr.dancing)</span>
              </a>
              <a
                href="https://www.instagram.com/jr.entrelivros?igsh=dXJpZGJ4d3YwOHA5&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-primary-foreground hover:text-accent transition-colors duration-200"
              >
                <BookOpen className="h-5 w-5" />
                <span>Instagram Leitura (@jr.entrelivros)</span>
              </a>
              <a
                href="https://youtube.com/@jr.dancing?si=89aYmgTnHox2wtHA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-primary-foreground hover:text-accent transition-colors duration-200"
              >
                <Youtube className="h-5 w-5" />
                <span>YouTube (jr.dancing)</span>
              </a>
              <a
                href="mailto:contato@jessicarayane.com"
                className="flex items-center space-x-3 text-primary-foreground hover:text-accent transition-colors duration-200 pt-2"
              >
                <Mail className="h-5 w-5" />
                <span>contato@jessicarayane.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-primary-foreground/80 text-sm">
            © {currentYear} Jéssica Rayane. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200">
              Política de Privacidade
            </a>
            <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200">
              Termos de Serviço
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
