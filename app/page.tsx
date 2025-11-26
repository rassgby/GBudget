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
              <Link href="/register">
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
                <span>Essai 7 jours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Annulation facile</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Installation en 2 minutes</span>
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
                  Suivez vos revenus et dépenses en temps réel avec des mises à jour instantanées et des notifications personnalisées
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
                  Organisez vos dépenses par catégories personnalisables pour une meilleure visibilité et compréhension
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
                  Visualisez vos finances avec des graphiques interactifs, des statistiques avancées et des rapports personnalisés
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
                  Vos données sont cryptées et stockées de manière sécurisée. Votre confidentialité est notre priorité absolue
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-yellow-300 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="h-14 w-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Smartphone className="h-7 w-7 text-yellow-600" />
                </div>
                <CardTitle className="text-xl mb-2">Multi-plateforme</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Accédez à vos finances depuis n'importe quel appareil : ordinateur, tablette ou smartphone
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="h-14 w-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wallet className="h-7 w-7 text-indigo-600" />
                </div>
                <CardTitle className="text-xl mb-2">Support dédié</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Bénéficiez d'un support client réactif et d'une assistance personnalisée pour toutes vos questions
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
              Nos formules d'abonnement
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Choisissez l'offre qui correspond le mieux à vos besoins
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <Card className="border-2 hover:border-blue-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <CardHeader className="text-center pb-2">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Essentiel</CardTitle>
                <CardDescription className="text-base">
                  Pour bien démarrer
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">2 500</span>
                  <span className="text-gray-600"> FCFA/mois</span>
                </div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Suivi des transactions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">5 catégories</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Rapports mensuels</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Support par email</span>
                  </li>
                </ul>
                <Link href="/register">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl font-semibold">
                    Choisir Essentiel
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan - Popular */}
            <Card className="border-2 border-green-400 hover:shadow-2xl transition-all duration-300 relative overflow-hidden transform md:scale-105">
              <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                Populaire
              </div>
              <CardHeader className="text-center pb-2">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Pro</CardTitle>
                <CardDescription className="text-base">
                  Pour les utilisateurs réguliers
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">5 000</span>
                  <span className="text-gray-600"> FCFA/mois</span>
                </div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Tout de Essentiel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Catégories illimitées</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Graphiques avancés</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Export PDF & Excel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Support prioritaire</span>
                  </li>
                </ul>
                <Link href="/register">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-xl font-semibold">
                    Choisir Pro
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 hover:border-purple-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <CardHeader className="text-center pb-2">
                <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Premium</CardTitle>
                <CardDescription className="text-base">
                  Pour une gestion complète
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">7 500</span>
                  <span className="text-gray-600"> FCFA/mois</span>
                </div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Tout de Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Budgets multiples</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Prévisions financières</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Conseils personnalisés</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">Support téléphonique</span>
                  </li>
                </ul>
                <Link href="/register">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-xl font-semibold">
                    Choisir Premium
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">3</div>
              <div className="text-gray-600 font-medium">Formules</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">7 jours</div>
              <div className="text-gray-600 font-medium">Essai offert</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Disponible</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">2min</div>
              <div className="text-gray-600 font-medium">Configuration</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-blue-600 to-green-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Prêt à transformer vos finances ?
            </h2>
            <p className="text-lg md:text-xl mb-10 text-blue-50 leading-relaxed">
              Rejoignez des milliers d'utilisateurs qui ont déjà repris le contrôle de leur budget. Commencez avec 7 jours d'essai offerts.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 hover:scale-105 transition-transform text-lg px-10 py-7 rounded-xl shadow-2xl font-semibold group">
                Commencer l'essai gratuit
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="mt-6 text-sm text-blue-100">
              7 jours d'essai • Annulation à tout moment
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">GBudget</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Votre solution complète pour une gestion budgétaire intelligente et sans effort
              </p>
            </div>
            
            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-sm text-gray-500">
                &copy; 2025 GBudget. Tous droits réservés. Application de gestion de budget personnel.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}