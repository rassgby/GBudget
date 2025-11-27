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

// GET - Détails d'un utilisateur
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await verifyAdmin(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionStart: true,
        subscriptionEnd: true,
        paymentReference: true,
        isAdmin: true,
        _count: {
          select: {
            transactions: true,
            categories: true,
            budgets: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PATCH - Modifier un utilisateur (activer/désactiver, changer statut, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await verifyAdmin(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { action, subscriptionStatus, subscriptionPlan, subscriptionEnd } = body;

    const updateData: any = {};

    // Actions spécifiques
    if (action === 'disable') {
      updateData.subscriptionStatus = 'expired';
    } else if (action === 'enable') {
      updateData.subscriptionStatus = 'active';
    } else if (action === 'extend') {
      // Prolonger d'un mois
      const currentEnd = new Date();
      currentEnd.setMonth(currentEnd.getMonth() + 1);
      updateData.subscriptionEnd = currentEnd;
      updateData.subscriptionStatus = 'active';
    }

    // Modifications directes
    if (subscriptionStatus) {
      updateData.subscriptionStatus = subscriptionStatus;
    }
    if (subscriptionPlan) {
      updateData.subscriptionPlan = subscriptionPlan;
    }
    if (subscriptionEnd) {
      updateData.subscriptionEnd = new Date(subscriptionEnd);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionEnd: true,
      },
    });

    return NextResponse.json({ 
      message: 'Utilisateur mis à jour',
      user 
    }, { status: 200 });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await verifyAdmin(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  // Empêcher l'auto-suppression
  if (auth.userId === id) {
    return NextResponse.json(
      { error: 'Vous ne pouvez pas supprimer votre propre compte' },
      { status: 400 }
    );
  }

  try {
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Utilisateur supprimé' }, { status: 200 });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
