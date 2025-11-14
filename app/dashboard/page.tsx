'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { statisticsAPI, categoriesAPI, budgetsAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatisticsResponse, Category, Budget } from '@/types';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Calendar, Activity, Plus, Target, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExportButton } from '@/components/ExportDialog';
import { BudgetDialog } from '@/components/BudgetDialog';

export default function DashboardPage() {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState<StatisticsResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, categoriesData, budgetsData] = await Promise.all([
        statisticsAPI.get(),
        categoriesAPI.getAll(),
        budgetsAPI.getAll(),
      ]);
      setStatistics(statsData);
      setCategories(categoriesData.categories || []);
      setBudgets(budgetsData || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !statistics) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-sm sm:text-base text-gray-600">Chargement des données...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const { summary, topCategories, expensesByCategory, monthlyTrend, recentTransactions, budgetStatus } = statistics;

  // Préparer les données pour le graphique en camembert
  const pieChartData = expensesByCategory.map(item => {
    const category = categories.find(c => c.name === item.category);
    return {
      name: item.category,
      value: item.amount,
      color: category?.color || '#6B7280',
    };
  }).filter(item => item.value > 0);

  // Préparer les données pour le graphique en barres
  const barChartData = monthlyTrend.map(item => ({
    month: item.month.charAt(0).toUpperCase() + item.month.slice(1),
    revenus: item.income,
    dépenses: item.expenses,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 sm:p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-xs sm:text-sm text-gray-900">{payload[0].payload.name}</p>
          <p className="text-xs sm:text-sm text-gray-600">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-3 sm:py-4 md:py-6 lg:py-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 md:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 flex items-center gap-1.5 sm:gap-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                Vue d'ensemble de vos finances
              </p>
            </div>
            <div className="flex flex-col xs:flex-row gap-1.5 sm:gap-2 md:gap-3 w-full sm:w-auto">
              <Button
                onClick={() => setBudgetDialogOpen(true)}
                variant="outline"
                className="w-full xs:w-auto text-xs sm:text-sm md:text-base border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Target className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 mr-1.5 sm:mr-2" />
                Définir un budget
              </Button>
              <ExportButton
                transactions={recentTransactions}
                categories={categories}
                variant="outline"
                className="w-full xs:w-auto text-xs sm:text-sm md:text-base"
              />
              <Link href="/transactions" className="w-full xs:w-auto">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md w-full text-xs sm:text-sm md:text-base">
                  <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 mr-1.5 sm:mr-2" />
                  Nouvelle transaction
                </Button>
              </Link>
            </div>
          </div>

          {/* Cartes de statistiques principales */}
          <div className="grid gap-2 sm:gap-3 md:gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-4 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-2 sm:px-4 md:px-6 pt-2 sm:pt-4 md:pt-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Revenus</CardTitle>
                <div className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent className="px-2 sm:px-4 md:px-6 pb-2 sm:pb-4 md:pb-6">
                <div className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-green-600 break-words">
                  {formatCurrency(summary.totalIncome)}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 md:mt-2">Total des revenus</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-2 sm:px-4 md:px-6 pt-2 sm:pt-4 md:pt-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Dépenses</CardTitle>
                <div className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-red-600" />
                </div>
              </CardHeader>
              <CardContent className="px-2 sm:px-4 md:px-6 pb-2 sm:pb-4 md:pb-6">
                <div className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-red-600 break-words">
                  {formatCurrency(summary.totalExpenses)}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 md:mt-2">Total des dépenses</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-2 sm:px-4 md:px-6 pt-2 sm:pt-4 md:pt-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Solde</CardTitle>
                <div className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Wallet className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="px-2 sm:px-4 md:px-6 pb-2 sm:pb-4 md:pb-6">
                <div className={`text-base sm:text-xl md:text-2xl lg:text-3xl font-bold break-words ${summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(summary.balance)}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 md:mt-2">Solde actuel</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-2 sm:px-4 md:px-6 pt-2 sm:pt-4 md:pt-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Épargne</CardTitle>
                <div className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Activity className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent className="px-2 sm:px-4 md:px-6 pb-2 sm:pb-4 md:pb-6">
                <div className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-600">
                  {summary.savingsRate.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 md:mt-2">Taux d'épargne</p>
              </CardContent>
            </Card>
          </div>

          {/* Budget Status Alerts */}
          {budgetStatus.length > 0 && (
            <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 space-y-2 sm:space-y-3">
              {budgetStatus.filter(b => b.isOverBudget || b.percentage > 80).map((budget) => (
                <Card key={budget.id} className={`border-l-4 ${budget.isOverBudget ? 'border-l-red-500 bg-red-50' : 'border-l-yellow-500 bg-yellow-50'}`}>
                  <CardContent className="p-2 sm:p-3 md:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <AlertTriangle className={`h-4 w-4 sm:h-5 sm:w-5 ${budget.isOverBudget ? 'text-red-600' : 'text-yellow-600'} mt-0.5 shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs sm:text-sm md:text-base text-gray-900">
                          {budget.isOverBudget ? 'Budget dépassé' : 'Attention au budget'} - {budget.category}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                          Dépensé : {formatCurrency(budget.spent)} sur {formatCurrency(budget.budgetAmount)} ({budget.percentage.toFixed(0)}%)
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-1.5 sm:mt-2">
                          <div
                            className={`h-1.5 sm:h-2 rounded-full ${budget.isOverBudget ? 'bg-red-600' : 'bg-yellow-600'}`}
                            style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Top catégories */}
          {topCategories.length > 0 && (
            <div className="grid gap-2 sm:gap-3 md:gap-4 md:grid-cols-3 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
              {topCategories.map((category, index) => {
                const categoryData = categories.find(c => c.name === category.category);
                return (
                  <Card key={category.category} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-2 sm:pt-3 md:pt-4 lg:pt-6 px-2 sm:px-3 md:px-4 lg:px-6 pb-2 sm:pb-3 md:pb-4 lg:pb-6">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                          <div
                            className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm md:text-base shrink-0"
                            style={{ backgroundColor: categoryData?.color || '#6B7280' }}
                          >
                            {index + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 truncate">{category.category}</p>
                            <p className="text-xs text-gray-500">Top dépense</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-xs sm:text-sm md:text-base text-gray-900">{formatCurrency(category.amount)}</p>
                          <p className="text-xs text-gray-500">
                            {category.percentage.toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="grid gap-2 sm:gap-3 md:gap-4 lg:gap-6 lg:grid-cols-2 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
            {/* Graphique des dépenses par catégorie */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="px-2 sm:px-4 md:px-6 pt-2 sm:pt-4 md:pt-6">
                <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base md:text-lg lg:text-xl">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Activity className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-white" />
                  </div>
                  Dépenses par catégorie
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Répartition de vos dépenses
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-4 md:px-6 pb-2 sm:pb-4 md:pb-6">
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200} className="sm:!h-[250px] md:!h-[300px]">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        className="sm:!outerRadius-[80] md:!outerRadius-[100]"
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        wrapperStyle={{ fontSize: '10px' }}
                        className="sm:!text-xs md:!text-sm"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[200px] sm:h-[250px] md:h-[300px] flex items-center justify-center text-xs sm:text-sm text-gray-500">
                    Aucune dépense à afficher
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Graphique d'évolution mensuelle */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="px-2 sm:px-4 md:px-6 pt-2 sm:pt-4 md:pt-6">
                <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base md:text-lg lg:text-xl">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-white" />
                  </div>
                  Évolution mensuelle
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Revenus vs Dépenses (6 derniers mois)
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-4 md:px-6 pb-2 sm:pb-4 md:pb-6">
                <ResponsiveContainer width="100%" height={200} className="sm:!h-[250px] md:!h-[300px]">
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 10 }}
                      className="sm:!text-xs md:!text-sm"
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      className="sm:!text-xs md:!text-sm"
                    />
                    <Tooltip />
                    <Legend
                      wrapperStyle={{ fontSize: '10px' }}
                      className="sm:!text-xs md:!text-sm"
                    />
                    <Bar dataKey="revenus" fill="#10b981" />
                    <Bar dataKey="dépenses" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Transactions récentes */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="px-2 sm:px-4 md:px-6 pt-2 sm:pt-4 md:pt-6">
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
                <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base md:text-lg lg:text-xl">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-white" />
                  </div>
                  Transactions récentes
                </CardTitle>
                <Link href="/transactions">
                  <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                    Voir tout
                    <ArrowUpRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </Link>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                Les 5 dernières transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-4 md:px-6 pb-2 sm:pb-4 md:pb-6">
              {recentTransactions.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors gap-2"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center shrink-0 ${
                          transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'income' ? (
                            <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-xs sm:text-sm text-gray-900 truncate">{transaction.description}</p>
                          <p className="text-xs text-gray-500">{transaction.category}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`font-bold text-xs sm:text-sm ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 text-xs sm:text-sm text-gray-500">
                  Aucune transaction pour le moment
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Budget Dialog */}
      <BudgetDialog
        open={budgetDialogOpen}
        onOpenChange={setBudgetDialogOpen}
        categories={categories}
        onSuccess={loadData}
      />
    </AuthGuard>
  );
}
