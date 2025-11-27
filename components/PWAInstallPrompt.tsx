'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Vérifier si c'est iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Vérifier si l'app est déjà installée (mode standalone)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');
    setIsStandalone(isInStandaloneMode);

    // Écouter l'événement d'installation (Android/Desktop)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Afficher le prompt après un délai si pas déjà refusé
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Afficher le prompt iOS après un délai
    if (isIOSDevice && !isInStandaloneMode) {
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 5000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Ne pas afficher si déjà installé
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-500 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-white" />
              <span className="text-white font-semibold text-sm">Installer Baraaka</span>
            </div>
            <button 
              onClick={handleDismiss}
              className="text-white/80 hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-4">
          {isIOS ? (
            <>
              <p className="text-sm text-gray-600 mb-3">
                Pour installer l'application sur votre iPhone/iPad :
              </p>
              <ol className="text-sm text-gray-600 space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <span>Appuyez sur le bouton <strong>Partager</strong> (icône carré avec flèche)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <span>Sélectionnez <strong>"Sur l'écran d'accueil"</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <span>Appuyez sur <strong>Ajouter</strong></span>
                </li>
              </ol>
              <Button 
                onClick={handleDismiss}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                J'ai compris
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Installez Baraaka sur votre appareil pour un accès rapide, même hors ligne !
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={handleInstall}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Installer
                </Button>
                <Button 
                  onClick={handleDismiss}
                  variant="outline"
                  className="flex-1"
                >
                  Plus tard
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
