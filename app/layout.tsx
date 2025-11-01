import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "Baraaka - Gestion de Budget Personnel",
  description: "Application de gestion de budget personnel avec suivi des dépenses et revenus en FCFA",
  manifest: "/manifest.json",
  themeColor: "#10b981",
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
    description: "Application de gestion de budget personnel avec suivi des dépenses et revenus en FCFA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body>
        <AuthProvider>
          <PWARegister />
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
