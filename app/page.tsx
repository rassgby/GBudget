'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, PieChart, Lock, Smartphone, BarChart3, ArrowRight, CheckCircle2, Download, Monitor, Tablet } from 'lucide-react';
import InstallButton from '@/components/InstallButton';

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
                  Commencer gratuitement
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
                <span>Gratuit à vie</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Sans carte bancaire</span>
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
                <CardTitle className="text-xl mb-2">Entièrement gratuit</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Profitez de toutes les fonctionnalités premium sans aucun frais cachés ni abonnement
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* PWA Download Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/30 backdrop-blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* En-tête */}
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Download className="h-4 w-4" />
                Application Progressive (PWA)
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Téléchargez Baraaka sur votre appareil
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Installez Baraaka comme une application native sur votre téléphone, tablette ou ordinateur.
                Aucun store requis, installation en 1 clic !
              </p>
            </div>

            {/* Grille principale */}
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center mb-12">
              {/* Côté gauche - Avantages */}
              <div className="space-y-6">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Pourquoi installer l'application ?
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-blue-100 p-3 rounded-lg shrink-0">
                      <Smartphone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Accès instantané</h4>
                      <p className="text-gray-600 text-sm">
                        Lancez l'application directement depuis votre écran d'accueil, sans ouvrir le navigateur
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-green-100 p-3 rounded-lg shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Mode hors ligne</h4>
                      <p className="text-gray-600 text-sm">
                        Consultez vos données même sans connexion Internet
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-purple-100 p-3 rounded-lg shrink-0">
                      <Monitor className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Expérience native</h4>
                      <p className="text-gray-600 text-sm">
                        Interface plein écran sans barre d'adresse, comme une vraie application
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-yellow-100 p-3 rounded-lg shrink-0">
                      <Tablet className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Multi-appareils</h4>
                      <p className="text-gray-600 text-sm">
                        Installez sur tous vos appareils : smartphone, tablette, ordinateur
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Côté droit - Installation */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border-2 border-blue-100">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl mb-4 shadow-lg">
                    <Wallet className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Installer Baraaka
                  </h3>
                  <p className="text-gray-600">
                    Gratuit • Sans publicité • Installation rapide
                  </p>
                </div>

                {/* Bouton d'installation */}
                <div className="flex flex-col items-center gap-4 mb-6">
                  <InstallButton />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-bold text-gray-900 mb-4 text-center">
                    Compatible avec :
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Android (Chrome)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>iPhone/iPad (Safari)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Windows (Edge/Chrome)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Mac (Safari/Chrome)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 text-center">
                    💡 <strong>Astuce :</strong> Après installation, retrouvez Baraaka sur votre écran d'accueil comme n'importe quelle autre application
                  </p>
                </div>
              </div>
            </div>

            {/* Étapes d'installation */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-purple-100">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                Comment installer en 3 étapes simples
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full text-2xl font-bold text-blue-600 mb-4">
                    1
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Cliquez sur "Télécharger"</h4>
                  <p className="text-sm text-gray-600">
                    Sur Android/Desktop : Le bouton vert ci-dessus
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full text-2xl font-bold text-green-600 mb-4">
                    2
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Confirmez l'installation</h4>
                  <p className="text-sm text-gray-600">
                    Acceptez d'ajouter Baraaka à votre appareil
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full text-2xl font-bold text-purple-600 mb-4">
                    3
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">C'est terminé !</h4>
                  <p className="text-sm text-gray-600">
                    L'icône Baraaka apparaît sur votre écran d'accueil
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600 font-medium">Gratuit</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">0 FCFA</div>
              <div className="text-gray-600 font-medium">Frais cachés</div>
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
              Rejoignez des milliers d'utilisateurs qui ont déjà repris le contrôle de leur budget. Créez votre compte gratuitement en moins de 2 minutes.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 hover:scale-105 transition-transform text-lg px-10 py-7 rounded-xl shadow-2xl font-semibold group">
                Créer un compte gratuit
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="mt-6 text-sm text-blue-100">
              Aucune carte bancaire requise • Accès instantané
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
                <span className="text-2xl font-bold text-white">Baraaka</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Votre solution complète pour une gestion budgétaire intelligente et sans effort en FCFA
              </p>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-sm text-gray-500">
                &copy; 2025 Baraaka. Tous droits réservés. Application de gestion de budget personnel.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}