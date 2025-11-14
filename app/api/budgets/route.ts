import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/budgets - Fetch all budgets for authenticated user
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    const userId = payload.userId

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
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    const userId = payload.userId

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
