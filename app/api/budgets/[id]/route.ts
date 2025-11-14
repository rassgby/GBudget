import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// PUT /api/budgets/[id] - Update a budget
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { categoryId, category, amount, period, startDate, endDate, isActive } = body

    // Verify budget belongs to user
    const existingBudget = await prisma.budget.findUnique({
      where: { id },
    })

    if (!existingBudget) {
      return NextResponse.json({ error: 'Budget non trouvé' }, { status: 404 })
    }

    if (existingBudget.userId !== userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    // Validation
    if (amount !== undefined && amount <= 0) {
      return NextResponse.json(
        { error: 'Le montant du budget doit être positif' },
        { status: 400 }
      )
    }

    const budget = await prisma.budget.update({
      where: { id },
      data: {
        ...(categoryId !== undefined && { categoryId: categoryId || null }),
        ...(category && { category }),
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(period && { period }),
        ...(startDate && { startDate }),
        ...(endDate !== undefined && { endDate: endDate || null }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json(budget)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du budget:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du budget' },
      { status: 500 }
    )
  }
}

// DELETE /api/budgets/[id] - Delete a budget
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = await params

    // Verify budget belongs to user
    const existingBudget = await prisma.budget.findUnique({
      where: { id },
    })

    if (!existingBudget) {
      return NextResponse.json({ error: 'Budget non trouvé' }, { status: 404 })
    }

    if (existingBudget.userId !== userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    await prisma.budget.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Budget supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du budget:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du budget' },
      { status: 500 }
    )
  }
}
