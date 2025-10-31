'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Détecter iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Écouter l'événement beforeinstallprompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Écouter l'événement appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        setShowIOSInstructions(true);
      }
      return;
    }

    // Afficher la prompt d'installation
    deferredPrompt.prompt();

    // Attendre la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('App installée');
    }

    // Réinitialiser le prompt
    setDeferredPrompt(null);
  };

  // Ne rien afficher si déjà installé
  if (isInstalled) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Bouton d'installation principal */}
      <Button
        onClick={handleInstallClick}
        size="lg"
        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg px-8 py-6 rounded-xl font-semibold group w-full sm:w-auto"
      >
        <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
        {isIOS ? "Instructions d'installation" : "Télécharger l'application"}
      </Button>

      {/* Instructions pour iOS */}
      {showIOSInstructions && isIOS && (
        <div className="mt-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 p-3 rounded-lg shrink-0">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-gray-900 mb-3">
                Installation sur iPhone/iPad
              </h4>
              <ol className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 shrink-0">1.</span>
                  <span>
                    Appuyez sur le bouton <Share className="inline h-4 w-4 mx-1" />
                    <strong>"Partager"</strong> en bas de votre navigateur Safari
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 shrink-0">2.</span>
                  <span>
                    Faites défiler et sélectionnez <strong>"Sur l'écran d'accueil"</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 shrink-0">3.</span>
                  <span>
                    Appuyez sur <strong>"Ajouter"</strong> en haut à droite
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 shrink-0">4.</span>
                  <span>
                    L'icône Baraaka apparaîtra sur votre écran d'accueil !
                  </span>
                </li>
              </ol>
              <Button
                onClick={() => setShowIOSInstructions(false)}
                variant="outline"
                className="mt-4 w-full"
              >
                J'ai compris
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Message d'aide si pas de prompt disponible */}
      {!deferredPrompt && !isIOS && !showIOSInstructions && (
        <p className="mt-3 text-sm text-gray-600 text-center sm:text-left">
          💡 Pour installer : Ouvrez le menu de votre navigateur et sélectionnez "Installer l'application"
        </p>
      )}
    </div>
  );
}
