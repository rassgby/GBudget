import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'votre-secret-tres-securise-changez-moi-en-production'
);

// Vérifier si l'utilisateur est admin
async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return { error: 'Non authentifié', status: 401 };
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: { id: true, isAdmin: true },
    });

    if (!user?.isAdmin) {
      return { error: 'Accès refusé - Admin requis', status: 403 };
    }

    return { userId: user.id };
  } catch {
    return { error: 'Token invalide', status: 401 };
  }
}

// GET - Liste de tous les utilisateurs
export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionStart: true,
        subscriptionEnd: true,
        isAdmin: true,
        _count: {
          select: {
            transactions: true,
            categories: true,
            budgets: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Statistiques globales
    const stats = {
      totalUsers: users.length,
      legacyUsers: users.filter(u => u.subscriptionPlan === 'legacy').length,
      premiumUsers: users.filter(u => u.subscriptionPlan === 'premium').length,
      activeUsers: users.filter(u => u.subscriptionStatus === 'active').length,
      expiredUsers: users.filter(u => u.subscriptionStatus === 'expired').length,
      pendingUsers: users.filter(u => u.subscriptionStatus === 'pending').length,
    };

    return NextResponse.json({ users, stats }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
