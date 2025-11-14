import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// GET /api/budgets - Fetch all budgets for authenticated user
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const budgets = await prisma.budget.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(budgets)
  } catch (error) {
    console.error('Erreur lors de la récupération des budgets:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des budgets' },
      { status: 500 }
    )
  }
}

// POST /api/budgets - Create a new budget
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { categoryId, category, amount, period, startDate, endDate, isActive } = body

    // Validation
    if (!category || !amount || !period || !startDate) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Le montant du budget doit être positif' },
        { status: 400 }
      )
    }

    const budget = await prisma.budget.create({
      data: {
        userId,
        categoryId: categoryId || null,
        category,
        amount: parseFloat(amount),
        period,
        startDate,
        endDate: endDate || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    })

    return NextResponse.json(budget, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du budget:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du budget' },
      { status: 500 }
    )
  }
}
