'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Home, CreditCard, Tag, ChevronDown, Clock } from 'lucide-react';
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
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
      router.push('/');
    }
  };

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/dashboard', label: 'Accueil', icon: Home },
    { href: '/transactions', label: 'Transactions', icon: CreditCard },
    { href: '/categories', label: 'Catégories', icon: Tag },
    { href: '/history', label: 'Historique', icon: Clock },
  ];

  return (
    <>
      {/* Header Desktop & Mobile */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link 
              href={user ? '/dashboard' : '/'} 
              className="flex items-center space-x-2 group"
            >
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-1.5 md:p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/25">
                <Wallet className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Baraaka
              </span>
            </Link>

            {/* Desktop Navigation */}
            {user ? (
              <>
                <nav className="hidden md:flex items-center space-x-1">
                  {navLinks.map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href}>
                      <Button
                        variant={isActive(href) ? 'default' : 'ghost'}
                        size="sm"
                        className={`flex items-center space-x-2 transition-all rounded-xl ${
                          isActive(href) 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25' 
                            : 'hover:bg-gray-100/80'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </Button>
                    </Link>
                  ))}

                  <div className="h-6 w-px bg-gray-300/50 mx-2" />

                  {/* User Menu Desktop */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center space-x-2 hover:bg-gray-100/80 rounded-xl"
                      >
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="hidden lg:inline font-medium">{user.name}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-xl">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="text-red-600 cursor-pointer focus:text-red-700 focus:bg-red-50 rounded-lg"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </nav>

                {/* Mobile User Avatar - Cliquable pour menu */}
                <div className="md:hidden">
                  <button
                    onClick={() => setShowUserMenu(true)}
                    className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-blue-500/25 active:scale-95 transition-transform"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100/80 rounded-xl">
                    Connexion
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 rounded-xl"
                  >
                    Inscription
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation - Liquid Glass Effect */}
      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
          {/* Glass Background */}
          <div className="mx-3 mb-3 rounded-2xl overflow-hidden">
            {/* Liquid Glass Effect Layer */}
            <div className="relative bg-white/70 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-2xl">
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent rounded-2xl pointer-events-none"></div>
              
              {/* Navigation Items */}
              <div className="relative flex items-center justify-around px-2 py-2">
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className="flex-1 flex flex-col items-center py-2 group"
                    >
                      <div className={`relative flex flex-col items-center transition-all duration-300 ${active ? 'scale-105' : 'group-active:scale-95'}`}>
                        {/* Active Background Pill */}
                        {active && (
                          <div className="absolute -inset-x-3 -inset-y-1 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-2xl blur-sm"></div>
                        )}
                        
                        {/* Icon Container */}
                        <div className={`relative z-10 p-2 rounded-xl transition-all duration-300 ${
                          active 
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30' 
                            : 'bg-transparent group-hover:bg-gray-100/80'
                        }`}>
                          <Icon className={`h-5 w-5 transition-colors ${
                            active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                          }`} />
                        </div>
                        
                        {/* Label */}
                        <span className={`text-[10px] mt-1 font-medium transition-colors ${
                          active ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {label}
                        </span>
                        
                        {/* Active Indicator Dot */}
                        {active && (
                          <div className="absolute -bottom-1 w-1 h-1 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile User Menu Modal */}
      {user && showUserMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden animate-in fade-in duration-200"
            onClick={() => setShowUserMenu(false)}
          />
          
          {/* Menu Sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-in slide-in-from-bottom duration-300">
            <div className="mx-3 mb-3 bg-white/90 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
              </div>

              {/* User Info */}
              <div className="px-5 pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-lg">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Options */}
              <div className="p-3">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center space-x-3 p-4 rounded-2xl text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                    <LogOut className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="font-medium">Déconnexion</span>
                </button>
              </div>

              {/* Cancel Button */}
              <div className="px-3 pb-3">
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full p-4 rounded-2xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}