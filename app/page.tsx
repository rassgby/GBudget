'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, PieChart, Lock, Smartphone, BarChart3, ArrowRight, CheckCircle2, Star, Zap, Crown } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8 animate-pulse">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl">
                <Wallet className="h-16 w-16 md:h-20 md:w-20" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Prenez le contrôle de vos finances
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-10 text-blue-50 max-w-3xl mx-auto leading-relaxed">
              Baraaka vous aide à suivre vos dépenses, gérer votre budget et atteindre vos objectifs financiers en toute simplicité
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/subscribe">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 hover:scale-105 transition-transform text-lg px-10 py-7 rounded-xl shadow-xl font-semibold group">
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20 hover:scale-105 transition-transform text-lg px-10 py-7 rounded-xl font-semibold"
                >
                  Se connecter
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base text-blue-50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>À partir de 2000 FCFA/mois</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Données sécurisées</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Support FCFA</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Fonctionnalités principales
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Tous les outils dont vous avez besoin pour maîtriser vos finances personnelles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            <Card className="border-2 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-7 w-7 text-blue-600" />
                </div>
                <CardTitle className="text-xl mb-2">Suivi en temps réel</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Suivez vos revenus et dépenses en temps réel avec des mises à jour instantanées
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-300 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="h-14 w-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <PieChart className="h-7 w-7 text-green-600" />
                </div>
                <CardTitle className="text-xl mb-2">Catégorisation intelligente</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Organisez vos dépenses par catégories personnalisables
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-purple-300 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="h-14 w-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-7 w-7 text-purple-600" />
                </div>
                <CardTitle className="text-xl mb-2">Graphiques détaillés</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Visualisez vos finances avec des graphiques interactifs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-red-300 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="h-14 w-14 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Lock className="h-7 w-7 text-red-600" />
                </div>
                <CardTitle className="text-xl mb-2">100% Sécurisé</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Vos données sont cryptées et stockées de manière sécurisée
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-yellow-300 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="h-14 w-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Smartphone className="h-7 w-7 text-yellow-600" />
                </div>
                <CardTitle className="text-xl mb-2">Application PWA</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Installez l'app sur votre téléphone et utilisez-la hors ligne
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="h-14 w-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wallet className="h-7 w-7 text-indigo-600" />
                </div>
                <CardTitle className="text-xl mb-2">Mobile Money</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Suivez vos transferts Wave, Orange Money, Free Money
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Nos formules
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Choisissez l'offre qui correspond à vos besoins
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Pro Plan */}
            <Card className="border-2 border-blue-500 hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Populaire
                </span>
              </div>
              <CardHeader className="text-center pb-2 pt-8">
                <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">Pro</CardTitle>
                <CardDescription className="text-base">Pour une gestion complète</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">2 000</span>
                  <span className="text-gray-600"> FCFA/mois</span>
                </div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Transactions illimitées</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Catégories illimitées</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Export PDF & Excel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Statistiques avancées</span>
                  </li>
                </ul>
                <a href="https://pay.wave.com/m/M_sn_6OgqgsYN6-_n/c/sn/?amount=2000" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Souscrire - 2 000 FCFA</Button>
                </a>
              </CardContent>
            </Card>

            {/* Business Plan */}
            <Card className="border-2 hover:border-yellow-400 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-2">
                <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Business</CardTitle>
                <CardDescription className="text-base">Pour les pros</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">4 000</span>
                  <span className="text-gray-600"> FCFA/mois</span>
                </div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Tout de Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Multi-comptes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Rapports personnalisés</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Support prioritaire</span>
                  </li>
                </ul>
                <a href="https://pay.wave.com/m/M_sn_6OgqgsYN6-_n/c/sn/?amount=4000" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">Souscrire - 4 000 FCFA</Button>
                </a>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 hover:border-purple-400 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-2">
                <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Enterprise</CardTitle>
                <CardDescription className="text-base">Pour les entreprises</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">7 000</span>
                  <span className="text-gray-600"> FCFA/mois</span>
                </div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Tout de Business</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">API & Intégrations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Gestion d'équipe</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Support dédié 24/7</span>
                  </li>
                </ul>
                <a href="https://pay.wave.com/m/M_sn_6OgqgsYN6-_n/c/sn/?amount=7000" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Souscrire - 7 000 FCFA</Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Prêt à mieux gérer votre argent ?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont pris le contrôle de leurs finances avec Baraaka.
          </p>
          <Link href="/subscribe">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-7 rounded-xl shadow-xl font-semibold">
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Baraaka</span>
            </div>
            <div className="text-sm">
              © 2025 Baraaka. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}