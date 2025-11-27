import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// API pour activer un abonnement après paiement
// Peut être appelée manuellement ou via un webhook Wave

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, paymentReference, plan } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Calculer la nouvelle date d'expiration
    const now = new Date();
    let subscriptionEnd = new Date();
    
    // Si l'abonnement est encore actif, ajouter au temps restant
    if (user.subscriptionEnd && new Date(user.subscriptionEnd) > now) {
      subscriptionEnd = new Date(user.subscriptionEnd);
    }
    
    // Ajouter 1 mois
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        subscriptionStatus: 'active',
        subscriptionStart: user.subscriptionStart || now,
        subscriptionEnd,
        paymentReference: paymentReference || user.paymentReference,
        subscriptionPlan: plan || user.subscriptionPlan,
      },
    });

    return NextResponse.json({
      message: 'Abonnement activé avec succès',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        subscriptionPlan: updatedUser.subscriptionPlan,
        subscriptionStatus: updatedUser.subscriptionStatus,
        subscriptionEnd: updatedUser.subscriptionEnd,
      },
    });
  } catch (error) {
    console.error('Erreur activation abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'activation de l\'abonnement' },
      { status: 500 }
    );
  }
}

// GET pour vérifier le statut d'un abonnement
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
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

    // Vérifier si expiré
    let status = user.subscriptionStatus;
    if (user.subscriptionEnd && new Date(user.subscriptionEnd) < new Date()) {
      if (user.subscriptionPlan !== 'legacy') {
        status = 'expired';
      }
    }

    return NextResponse.json({
      ...user,
      subscriptionStatus: status,
      isActive: status === 'active' || user.subscriptionPlan === 'legacy',
    });
  } catch (error) {
    console.error('Erreur vérification abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}
