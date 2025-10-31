import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// PUT /api/budgets/[id] - Mettre à jour un budget
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier que le budget existe et appartient à l'utilisateur
    const existingBudget = await prisma.budget.findUnique({
      where: { id },
    });

    if (!existingBudget) {
      return NextResponse.json(
        { error: 'Budget non trouvé' },
        { status: 404 }
      );
    }

    if (existingBudget.userId !== userId) {
      return NextResponse.json(
        { error: 'Non autorisé à modifier ce budget' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { amount, month, year, categoryId } = body;

    // Validation
    if (amount !== undefined && amount <= 0) {
      return NextResponse.json(
        { error: 'Le montant doit être supérieur à 0' },
        { status: 400 }
      );
    }

    if (month !== undefined && (month < 1 || month > 12)) {
      return NextResponse.json(
        { error: 'Le mois doit être entre 1 et 12' },
        { status: 400 }
      );
    }

    if (year !== undefined && (year < 2000 || year > 2100)) {
      return NextResponse.json(
        { error: 'Année invalide' },
        { status: 400 }
      );
    }

    // Vérifier si la modification créerait un doublon
    if (month !== undefined || year !== undefined || categoryId !== undefined) {
      const newMonth = month !== undefined ? parseInt(month) : existingBudget.month;
      const newYear = year !== undefined ? parseInt(year) : existingBudget.year;
      const newCategoryId = categoryId !== undefined ? (categoryId || null) : existingBudget.categoryId;

      // Vérifier si un autre budget existe pour ces critères
      const duplicate = await prisma.budget.findFirst({
        where: {
          userId,
          month: newMonth,
          year: newYear,
          categoryId: newCategoryId,
          id: { not: id },
        },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: 'Un budget existe déjà pour cette période' },
          { status: 400 }
        );
      }
    }

    // Mettre à jour le budget
    const updatedBudget = await prisma.budget.update({
      where: { id },
      data: {
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(month !== undefined && { month: parseInt(month) }),
        ...(year !== undefined && { year: parseInt(year) }),
        ...(categoryId !== undefined && { categoryId: categoryId || null }),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ budget: updatedBudget });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du budget:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du budget' },
      { status: 500 }
    );
  }
}

// DELETE /api/budgets/[id] - Supprimer un budget
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier que le budget existe et appartient à l'utilisateur
    const existingBudget = await prisma.budget.findUnique({
      where: { id },
    });

    if (!existingBudget) {
      return NextResponse.json(
        { error: 'Budget non trouvé' },
        { status: 404 }
      );
    }

    if (existingBudget.userId !== userId) {
      return NextResponse.json(
        { error: 'Non autorisé à supprimer ce budget' },
        { status: 403 }
      );
    }

    // Supprimer le budget
    await prisma.budget.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Budget supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du budget:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du budget' },
      { status: 500 }
    );
  }
}
