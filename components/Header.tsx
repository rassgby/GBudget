'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Home, CreditCard, Tag, Menu, X, User, ChevronDown } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
      router.push('/');
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/transactions', label: 'Transactions', icon: CreditCard },
    { href: '/categories', label: 'Catégories', icon: Tag },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href={user ? '/dashboard' : '/'} 
            className="flex items-center space-x-2 group"
          >
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              GBudget
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

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
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

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2 animate-in slide-in-from-top">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={isActive(href) ? 'default' : 'ghost'}
                  size="sm"
                  className={`w-full justify-start space-x-2 ${
                    isActive(href) 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Button>
              </Link>
            ))}

            <div className="border-t border-gray-200 my-4 pt-4">
              <div className="flex items-center space-x-3 px-3 py-2 mb-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}