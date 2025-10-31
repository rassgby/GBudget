import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// GET - Récupérer toutes les transactions de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle transaction
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, amount, category, categoryId, description, date } = body;

    // Validation
    if (!type || !amount || !category || !description || !date) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (type !== 'income' && type !== 'expense') {
      return NextResponse.json(
        { error: 'Type invalide' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Le montant doit être positif' },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount,
        category,
        categoryId,
        description,
        date,
        userId,
      },
    });

    return NextResponse.json(
      {
        message: 'Transaction créée avec succès',
        transaction,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de la création de la transaction:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
