import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/statistics - Get comprehensive statistics for dashboard
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    const userId = payload.userId

    // Fetch all transactions for the user
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    })

    // Fetch all budgets for the user
    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        isActive: true
      },
    })

    // Calculate total income
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    // Calculate total expenses
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    // Calculate balance
    const balance = totalIncome - totalExpenses

    // Calculate savings rate
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0

    // Group expenses by category
    const expensesByCategory = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc: Record<string, number>, transaction) => {
        const category = transaction.category
        acc[category] = (acc[category] || 0) + transaction.amount
        return acc
      }, {})

    // Get top 3 categories
    const topCategories = Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100) : 0,
      }))

    // Calculate monthly trends (last 6 months)
    const now = new Date()
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

    const monthlyData: Record<string, { income: number; expenses: number }> = {}

    for (let i = 0; i < 6; i++) {
      const date = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i, 1)
      const monthKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
      monthlyData[monthKey] = { income: 0, expenses: 0 }
    }

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date)
      if (transactionDate >= sixMonthsAgo) {
        const monthKey = transactionDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
        if (monthlyData[monthKey]) {
          if (transaction.type === 'income') {
            monthlyData[monthKey].income += transaction.amount
          } else {
            monthlyData[monthKey].expenses += transaction.amount
          }
        }
      }
    })

    const monthlyTrend = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
    }))

    // Get recent transactions (last 5)
    const recentTransactions = transactions.slice(0, 5)

    // Calculate budget status
    const currentMonth = now.toISOString().slice(0, 7) // YYYY-MM format

    const budgetStatus = budgets.map((budget) => {
      // Calculate spent amount for this budget period
      const budgetTransactions = transactions.filter((t) => {
        if (t.type !== 'expense') return false
        if (t.category !== budget.category) return false

        const transactionDate = new Date(t.date)
        const budgetStartDate = new Date(budget.startDate)

        // For monthly budgets, check if transaction is in the current month
        if (budget.period === 'monthly') {
          const transactionMonth = transactionDate.toISOString().slice(0, 7)
          const budgetMonth = budgetStartDate.toISOString().slice(0, 7)
          return transactionMonth === budgetMonth || transactionMonth === currentMonth
        }

        // For other periods, check if transaction is after start date and before end date (if exists)
        if (transactionDate < budgetStartDate) return false
        if (budget.endDate) {
          const budgetEndDate = new Date(budget.endDate)
          if (transactionDate > budgetEndDate) return false
        }

        return true
      })

      const spent = budgetTransactions.reduce((sum, t) => sum + t.amount, 0)
      const remaining = budget.amount - spent
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0

      return {
        id: budget.id,
        category: budget.category,
        budgetAmount: budget.amount,
        spent,
        remaining,
        percentage,
        isOverBudget: spent > budget.amount,
        period: budget.period,
      }
    })

    return NextResponse.json({
      summary: {
        totalIncome,
        totalExpenses,
        balance,
        savingsRate,
      },
      topCategories,
      expensesByCategory: Object.entries(expensesByCategory).map(([category, amount]) => ({
        category,
        amount,
      })),
      monthlyTrend,
      recentTransactions,
      budgetStatus,
      transactionsCount: transactions.length,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}
