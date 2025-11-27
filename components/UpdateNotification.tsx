'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { Button } from './ui/button';

export function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Enregistrer le Service Worker
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        setRegistration(reg);
        console.log('[App] Service Worker enregistré');

        // Vérifier les mises à jour immédiatement
        reg.update();

        // Vérifier les mises à jour périodiquement (toutes les 60 secondes)
        const interval = setInterval(() => {
          reg.update();
        }, 60 * 1000);

        // Écouter quand une nouvelle version est disponible
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nouvelle version disponible
                console.log('[App] Nouvelle version disponible');
                setShowUpdate(true);
              }
            });
          }
        });

        return () => clearInterval(interval);
      }).catch((error) => {
        console.error('[App] Erreur enregistrement SW:', error);
      });

      // Écouter les messages du Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATED') {
          console.log('[App] SW mis à jour vers version:', event.data.version);
          // Recharger la page après mise à jour
          window.location.reload();
        }
      });

      // Détecter quand le SW prend le contrôle
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[App] Nouveau SW actif, rechargement...');
        window.location.reload();
      });
    }
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      // Demander au SW en attente de s'activer
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    setShowUpdate(false);
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-96 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-blue-600 text-white rounded-xl shadow-2xl p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <RefreshCw className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Mise à jour disponible</p>
          <p className="text-xs text-blue-100">Une nouvelle version de Baraaka est prête</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleUpdate}
            size="sm"
            className="bg-white text-blue-600 hover:bg-blue-50 text-xs px-3"
          >
            Mettre à jour
          </Button>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
