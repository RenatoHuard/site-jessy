
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useSiteConfig } from '@/hooks/useSiteConfig.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, isAdmin, isMember, logout } = useAuth();
  const { config } = useSiteConfig();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/servicos', label: 'Serviços' },
    { path: '/sobre', label: 'Sobre' },
    { path: '/contato', label: 'Contato' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const avatarUrl = currentUser?.foto_perfil_url 
    ? currentUser.foto_perfil_url 
    : null;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <span className="heading-font text-2xl md:text-3xl font-bold text-accent">
              {config?.site_title || 'Jéssica Rayane'}
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-medium transition-all duration-200 relative ${
                  isActive(link.path)
                    ? 'text-accent font-semibold'
                    : 'text-foreground hover:text-accent'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute -bottom-[1.35rem] left-0 right-0 h-0.5 bg-accent" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <Button asChild className="rounded-full px-6 bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/login">Login</Link>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-accent/20">
                      {avatarUrl && <AvatarImage src={avatarUrl} alt={currentUser?.nome} />}
                      <AvatarFallback className="bg-accent/10 text-accent font-medium">
                        {getInitials(currentUser?.nome || currentUser?.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {currentUser?.nome && <p className="font-medium">{currentUser.nome}</p>}
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {currentUser?.email}
                      </p>
                    </div>
                  </div>
                  
                  {isAdmin && (
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/admin" className="flex items-center w-full hover:text-accent">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Painel Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {(isMember || isAdmin) && (
                    <>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/members/dashboard" className="flex items-center w-full hover:text-accent">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Minha Área</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/members/profile" className="flex items-center w-full hover:text-accent">
                          <User className="mr-2 h-4 w-4" />
                          <span>Meu Perfil</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:text-accent"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-base font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-accent font-semibold'
                    : 'text-foreground hover:text-accent'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              {!isAuthenticated ? (
                <Button asChild className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                </Button>
              ) : (
                <div className="space-y-2">
                  {isAdmin && (
                    <Button asChild variant="outline" className="w-full justify-start hover:text-accent hover:border-accent">
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Settings className="mr-2 h-4 w-4" /> Painel Admin
                      </Link>
                    </Button>
                  )}
                  {(isMember || isAdmin) && (
                    <>
                      <Button asChild variant="outline" className="w-full justify-start hover:text-accent hover:border-accent">
                        <Link to="/members/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          <LayoutDashboard className="mr-2 h-4 w-4" /> Minha Área
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start hover:text-accent hover:border-accent">
                        <Link to="/members/profile" onClick={() => setMobileMenuOpen(false)}>
                          <User className="mr-2 h-4 w-4" /> Meu Perfil
                        </Link>
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" className="w-full justify-start text-destructive" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                    <LogOut className="mr-2 h-4 w-4" /> Sair
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
