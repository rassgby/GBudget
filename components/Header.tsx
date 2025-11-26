'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Home, CreditCard, Tag, Menu, X, User, ChevronDown, ChevronRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fermer la sidebar quand on change de page
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Empêcher le scroll du body quand la sidebar est ouverte
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
      router.push('/');
      setSidebarOpen(false);
    }
  };

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/transactions', label: 'Transactions', icon: CreditCard },
    { href: '/categories', label: 'Catégories', icon: Tag },
  ];

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Mobile Menu Button */}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2 -ml-2"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            )}

            {/* Logo */}
            <Link 
              href={user ? '/dashboard' : '/'} 
              className="flex items-center space-x-2 group"
            >
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-1.5 md:p-2 rounded-lg group-hover:scale-110 transition-transform">
                <Wallet className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Baraaka
              </span>
            </Link>

            {/* Desktop Navigation */}
            {user ? (
              <>
                <nav className="hidden md:flex items-center space-x-2">
                  {navLinks.map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href}>
                      <Button
                        variant={isActive(href) ? 'default' : 'ghost'}
                        size="sm"
                        className={`flex items-center space-x-2 transition-all ${
                          isActive(href) 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-md' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </Button>
                    </Link>
                  ))}

                  <div className="h-6 w-px bg-gray-300 mx-2" />

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center space-x-2 hover:bg-gray-100"
                      >
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center text-white font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="hidden lg:inline font-medium">{user.name}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="text-red-600 cursor-pointer focus:text-red-700 focus:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </nav>

                {/* Mobile User Avatar */}
                <div className="md:hidden">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                    Connexion
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md"
                  >
                    Inscription
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {user && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {user && (
        <div 
          className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-1.5 rounded-lg">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Baraaka
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center text-white font-semibold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Menu
            </p>
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)}>
                <div
                  className={`flex items-center justify-between px-3 py-3 rounded-xl transition-all ${
                    isActive(href) 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{label}</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 ${isActive(href) ? 'text-white' : 'text-gray-400'}`} />
                </div>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50 py-3"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Déconnexion</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}