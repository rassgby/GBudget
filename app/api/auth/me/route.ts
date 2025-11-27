import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'votre-secret-tres-securise-changez-moi-en-production'
);

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token du cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier le token
    const { payload } = await jwtVerify(token, SECRET_KEY);

    // Récupérer l'utilisateur avec les infos d'abonnement
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionStart: true,
        subscriptionEnd: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'abonnement est expiré
    let subscriptionStatus = user.subscriptionStatus;
    if (user.subscriptionEnd && new Date(user.subscriptionEnd) < new Date()) {
      if (user.subscriptionPlan !== 'legacy') {
        subscriptionStatus = 'expired';
        // Mettre à jour le statut en base
        await prisma.user.update({
          where: { id: user.id },
          data: { subscriptionStatus: 'expired' },
        });
      }
    }

    return NextResponse.json({ 
      user: {
        ...user,
        subscriptionStatus,
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Token invalide' },
      { status: 401 }
    );
  }
}
