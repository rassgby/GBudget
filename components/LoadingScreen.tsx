'use client';

import { Wallet } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo animé */}
        <div className="relative mb-8">
          {/* Cercle pulsant en arrière-plan */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-white/20 rounded-full animate-ping" />
          </div>

          {/* Logo principal */}
          <div className="relative flex items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <Wallet className="h-12 w-12 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Nom de l'application */}
        <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
          Baraaka
        </h1>

        {/* Sous-titre */}
        <p className="text-xl text-white/90 mb-8 animate-fade-in-delay">
          Gestion de Budget Personnel
        </p>

        {/* Spinner de chargement */}
        <div className="flex justify-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>

        {/* Texte de chargement */}
        <p className="mt-6 text-white/80 text-sm animate-pulse">
          Chargement en cours...
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          50% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 1.2s ease-out;
        }
      `}</style>
    </div>
  );
}
