'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { AlertTriangle, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export function SubscriptionAlert() {
  const { status, isExpired, isPending, plan, getDaysRemaining } = useSubscription();

  // Pas d'alerte pour les utilisateurs legacy
  if (plan === 'legacy') return null;

  // Alerte pour abonnement en attente de paiement
  if (isPending) {
    return (
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Paiement en attente.</span>{' '}
              Finalisez votre paiement pour activer votre compte.
            </p>
          </div>
          <Link href="/subscribe">
            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
              Payer maintenant
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Alerte pour abonnement expiré
  if (isExpired) {
    return (
      <div className="bg-red-50 border-b border-red-200 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">
              <span className="font-semibold">Abonnement expiré.</span>{' '}
              Renouvelez pour continuer à utiliser toutes les fonctionnalités.
            </p>
          </div>
          <Link href="/subscribe">
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              Renouveler
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Alerte pour abonnement qui expire bientôt (moins de 7 jours)
  const daysRemaining = getDaysRemaining();
  if (daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0) {
    return (
      <div className="bg-orange-50 border-b border-orange-200 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0" />
            <p className="text-sm text-orange-800">
              <span className="font-semibold">Votre abonnement expire dans {daysRemaining} jour{daysRemaining > 1 ? 's' : ''}.</span>{' '}
              Renouvelez pour éviter toute interruption.
            </p>
          </div>
          <Link href="/subscribe">
            <Button size="sm" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-100">
              Renouveler
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
