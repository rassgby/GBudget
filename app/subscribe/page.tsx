'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, Crown, Rocket, CheckCircle2, ArrowLeft, ArrowRight, Loader2, Wallet } from 'lucide-react';
import { SubscriptionPlan, PLAN_LIMITS } from '@/types';

const PAYMENT_LINKS = {
  pro: 'https://pay.wave.com/m/M_sn_6OgqgsYN6-_n/c/sn/?amount=2000',
  business: 'https://pay.wave.com/m/M_sn_6OgqgsYN6-_n/c/sn/?amount=4000',
  enterprise: 'https://pay.wave.com/m/M_sn_6OgqgsYN6-_n/c/sn/?amount=7000',
};

const PLAN_INFO = {
  pro: {
    icon: Zap,
    color: 'blue',
    bgColor: 'bg-blue-600',
    features: ['Transactions illimitées', 'Catégories illimitées', 'Export PDF & Excel', 'Statistiques avancées'],
  },
  business: {
    icon: Crown,
    color: 'yellow',
    bgColor: 'bg-yellow-500',
    features: ['Tout de Pro', 'Multi-comptes', 'Rapports personnalisés', 'Support prioritaire'],
  },
  enterprise: {
    icon: Rocket,
    color: 'purple',
    bgColor: 'bg-purple-600',
    features: ['Tout de Business', 'API & Intégrations', 'Gestion d\'équipe', 'Support dédié 24/7'],
  },
};

type Step = 'plan' | 'info' | 'payment';

function SubscribeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get('plan') as 'pro' | 'business' | 'enterprise' | null;
  
  const [step, setStep] = useState<Step>(initialPlan ? 'info' : 'plan');
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'business' | 'enterprise' | null>(initialPlan);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePlanSelect = (plan: 'pro' | 'business' | 'enterprise') => {
    setSelectedPlan(plan);
    setStep('info');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Le nom est requis');
      return false;
    }
    if (!formData.email.trim()) {
      setError('L\'email est requis');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email invalide');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleSubmitInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedPlan) return;

    setIsLoading(true);
    try {
      // Créer le compte avec statut pending
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          subscriptionPlan: selectedPlan,
          subscriptionStatus: 'pending',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      // Passer à l'étape de paiement
      setStep('payment');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = () => {
    if (!selectedPlan) return;
    // Ouvrir le lien de paiement Wave
    window.open(PAYMENT_LINKS[selectedPlan], '_blank');
  };

  const renderPlanSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Choisissez votre forfait</h1>
        <p className="text-gray-600">Sélectionnez l'offre qui correspond à vos besoins</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {(['pro', 'business', 'enterprise'] as const).map((plan) => {
          const info = PLAN_INFO[plan];
          const limits = PLAN_LIMITS[plan];
          const Icon = info.icon;
          
          return (
            <Card 
              key={plan}
              className={`border-2 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                plan === 'pro' ? 'border-blue-500 relative' : 'hover:border-gray-300'
              }`}
              onClick={() => handlePlanSelect(plan)}
            >
              {plan === 'pro' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Populaire
                  </span>
                </div>
              )}
              <CardHeader className={`text-center ${plan === 'pro' ? 'pt-8' : ''}`}>
                <div className={`h-16 w-16 ${info.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">{limits.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-gray-900">{limits.price.toLocaleString()}</span>
                  <span className="text-gray-600"> FCFA/mois</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {info.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className={`w-full ${info.bgColor} hover:opacity-90`}>
                  Sélectionner
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-600">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-semibold">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );

  const renderInfoForm = () => {
    if (!selectedPlan) return null;
    const info = PLAN_INFO[selectedPlan];
    const limits = PLAN_LIMITS[selectedPlan];
    const Icon = info.icon;

    return (
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => setStep('plan')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux forfaits
        </button>

        <Card>
          <CardHeader className="text-center border-b">
            <div className={`h-12 w-12 ${info.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <CardTitle>Forfait {limits.name}</CardTitle>
            <CardDescription>
              {limits.price.toLocaleString()} FCFA/mois
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmitInfo} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className={`w-full ${info.bgColor} hover:opacity-90`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Création du compte...
                  </>
                ) : (
                  <>
                    Continuer vers le paiement
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPayment = () => {
    if (!selectedPlan) return null;
    const info = PLAN_INFO[selectedPlan];
    const limits = PLAN_LIMITS[selectedPlan];
    const Icon = info.icon;

    return (
      <div className="max-w-lg mx-auto text-center">
        <Card>
          <CardHeader className="border-b">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Compte créé avec succès !</CardTitle>
            <CardDescription>
              Finalisez votre inscription en effectuant le paiement
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Forfait</span>
                <span className="font-semibold">{limits.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Montant</span>
                <span className="text-2xl font-bold text-gray-900">
                  {limits.price.toLocaleString()} FCFA
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handlePayment}
                className="w-full bg-[#1DC1EC] hover:bg-[#19aed6] text-white py-6 text-lg"
              >
                <Wallet className="h-5 w-5 mr-2" />
                Payer avec Wave
              </Button>
              
              <p className="text-xs text-gray-500">
                Après le paiement, votre compte sera activé automatiquement.
                <br />
                Vous recevrez un email de confirmation.
              </p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3">
                Paiement effectué ? Connectez-vous :
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Se connecter
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Baraaka</span>
          </Link>
        </div>

        {/* Étapes */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {(['plan', 'info', 'payment'] as Step[]).map((s, idx) => (
              <div key={s} className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step === s 
                    ? 'bg-blue-600 text-white' 
                    : idx < ['plan', 'info', 'payment'].indexOf(step)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {idx < ['plan', 'info', 'payment'].indexOf(step) ? '✓' : idx + 1}
                </div>
                {idx < 2 && (
                  <div className={`w-12 h-1 mx-2 ${
                    idx < ['plan', 'info', 'payment'].indexOf(step)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contenu */}
        {step === 'plan' && renderPlanSelection()}
        {step === 'info' && renderInfoForm()}
        {step === 'payment' && renderPayment()}
      </div>
    </div>
  );
}

// Loading fallback
function SubscribeLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  );
}

// Page principale avec Suspense
export default function SubscribePage() {
  return (
    <Suspense fallback={<SubscribeLoading />}>
      <SubscribeContent />
    </Suspense>
  );
}
