import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/budgets - Obtenir les budgets de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer les paramètres de requête (optionnels)
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const categoryId = searchParams.get('categoryId');

    // Construire les filtres
    const filters: any = { userId };

    if (month) {
      filters.month = parseInt(month);
    }

    if (year) {
      filters.year = parseInt(year);
    }

    if (categoryId) {
      filters.categoryId = categoryId;
    } else if (searchParams.has('categoryId') && categoryId === null) {
      // Si categoryId est explicitement null, on cherche le budget global
      filters.categoryId = null;
    }

    const budgets = await prisma.budget.findMany({
      where: filters,
      include: {
        category: true,
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' },
      ],
    });

    return NextResponse.json({ budgets });
  } catch (error) {
    console.error('Erreur lors de la récupération des budgets:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des budgets' },
      { status: 500 }
    );
  }
}

// POST /api/budgets - Créer un nouveau budget
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, month, year, categoryId } = body;

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Le montant doit être supérieur à 0' },
        { status: 400 }
      );
    }

    if (!month || month < 1 || month > 12) {
      return NextResponse.json(
        { error: 'Le mois doit être entre 1 et 12' },
        { status: 400 }
      );
    }

    if (!year || year < 2000 || year > 2100) {
      return NextResponse.json(
        { error: 'Année invalide' },
        { status: 400 }
      );
    }

    // Vérifier si un budget existe déjà pour cette période
    const existingBudget = await prisma.budget.findUnique({
      where: {
        userId_month_year_categoryId: {
          userId,
          month: parseInt(month),
          year: parseInt(year),
          categoryId: categoryId || null,
        },
      },
    });

    if (existingBudget) {
      return NextResponse.json(
        { error: 'Un budget existe déjà pour cette période' },
        { status: 400 }
      );
    }

    // Créer le budget
    const budget = await prisma.budget.create({
      data: {
        userId,
        amount: parseFloat(amount),
        month: parseInt(month),
        year: parseInt(year),
        categoryId: categoryId || null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ budget }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du budget:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du budget' },
      { status: 500 }
    );
  }
}
