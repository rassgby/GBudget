import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

export const metadata: Metadata = {
  title: "Baraaka - Gestion de Budget Personnel",
  description: "Application de gestion de budget personnel avec suivi des dépenses et revenus en FCFA",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Baraaka",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Baraaka",
    title: "Baraaka - Gestion de Budget Personnel",
    description: "Votre solution complète pour une gestion budgétaire intelligente",
  },
  twitter: {
    card: "summary",
    title: "Baraaka - Gestion de Budget",
    description: "Votre solution complète pour une gestion budgétaire intelligente",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Baraaka" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <PWAInstallPrompt />
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('SW enregistré:', registration.scope);
                    },
                    function(err) {
                      console.log('SW erreur:', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
