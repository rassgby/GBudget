import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// PUT - Mettre à jour une transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Vérifier que la transaction appartient à l'utilisateur
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour
    const updatedTransaction = await prisma.transaction.update({
      where: { id: params.id },
      data: {
        type,
        amount,
        category,
        categoryId,
        description,
        date,
      },
    });

    return NextResponse.json(
      {
        message: 'Transaction mise à jour avec succès',
        transaction: updatedTransaction,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la transaction:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier que la transaction appartient à l'utilisateur
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer la transaction
    await prisma.transaction.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Transaction supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression de la transaction:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
