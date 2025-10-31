import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId requis' },
        { status: 400 }
      );
    }

    // Get all transactions for the user
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        category: true,
      },
    });

    // Calculate statistics
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Calculate expenses by category
    const expensesByCategory = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc: Record<string, { name: string; total: number; color: string }>, t) => {
        const categoryName = t.category.name;
        if (!acc[categoryName]) {
          acc[categoryName] = {
            name: categoryName,
            total: 0,
            color: t.category.color,
          };
        }
        acc[categoryName].total += t.amount;
        return acc;
      }, {});

    // Calculate monthly data (last 6 months)
    const monthlyData: Record<string, { income: number; expenses: number }> = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('fr-FR', { month: 'short' });
      monthlyData[monthKey] = { income: 0, expenses: 0 };
    }

    transactions.forEach((t) => {
      const transactionDate = new Date(t.date);
      const monthKey = transactionDate.toLocaleDateString('fr-FR', { month: 'short' });

      if (monthlyData[monthKey]) {
        if (t.type === 'income') {
          monthlyData[monthKey].income += t.amount;
        } else {
          monthlyData[monthKey].expenses += t.amount;
        }
      }
    });

    return NextResponse.json(
      {
        stats: {
          totalIncome,
          totalExpenses,
          balance,
          transactionCount: transactions.length,
        },
        expensesByCategory: Object.values(expensesByCategory),
        monthlyData: Object.entries(monthlyData).map(([month, data]) => ({
          month,
          revenus: data.income,
          dépenses: data.expenses,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
