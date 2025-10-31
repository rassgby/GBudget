import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all transactions for a user
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId requis' },
        { status: 400 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des transactions' },
      { status: 500 }
    );
  }
}

// POST create a new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, amount, description, date, userId, categoryId } = body;

    // Validation
    if (!type || !amount || !description || !date || !userId || !categoryId) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (type !== 'income' && type !== 'expense') {
      return NextResponse.json(
        { error: 'Type doit être "income" ou "expense"' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Le montant doit être positif' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Check if category exists and belongs to user
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount: parseFloat(amount),
        description,
        date: new Date(date),
        userId,
        categoryId,
      },
      include: {
        category: true,
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
    console.error('Create transaction error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la transaction' },
      { status: 500 }
    );
  }
}

// DELETE a transaction
export async function DELETE(request: NextRequest) {
  try {
    const transactionId = request.nextUrl.searchParams.get('id');
    const userId = request.nextUrl.searchParams.get('userId');

    if (!transactionId || !userId) {
      return NextResponse.json(
        { error: 'ID de transaction et userId requis' },
        { status: 400 }
      );
    }

    // Check if transaction belongs to user
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction non trouvée' },
        { status: 404 }
      );
    }

    // Delete transaction
    await prisma.transaction.delete({
      where: { id: transactionId },
    });

    return NextResponse.json(
      { message: 'Transaction supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete transaction error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la transaction' },
      { status: 500 }
    );
  }
}

// PUT update a transaction
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, type, amount, description, date, userId, categoryId } = body;

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'ID de transaction et userId requis' },
        { status: 400 }
      );
    }

    // Check if transaction belongs to user
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction non trouvée' },
        { status: 404 }
      );
    }

    // If categoryId is provided, check if it belongs to user
    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          userId,
        },
      });

      if (!category) {
        return NextResponse.json(
          { error: 'Catégorie non trouvée' },
          { status: 404 }
        );
      }
    }

    // Update transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...(type && { type }),
        ...(amount && { amount: parseFloat(amount) }),
        ...(description && { description }),
        ...(date && { date: new Date(date) }),
        ...(categoryId && { categoryId }),
      },
      include: {
        category: true,
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
    console.error('Update transaction error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la transaction' },
      { status: 500 }
    );
  }
}
