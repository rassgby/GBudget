'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { statisticsAPI, categoriesAPI, budgetsAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatisticsResponse, Category, Budget } from '@/types';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, ArrowLeftRight, Plus, Target, AlertTriangle, CreditCard, Eye, EyeOff } from 'lucide-react';
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
  const [showBalance, setShowBalance] = useState(true);

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
      <div className="min-h-screen bg-gray-50">
        {/* Section fixe sur mobile : Carte + Actions */}
        <div className="md:relative md:bg-transparent sticky top-14 z-30 bg-gray-50 pb-3 pt-4 px-4 sm:px-6 md:py-6 lg:py-8">
          <div className="container mx-auto max-w-6xl">
            {/* Carte de crédit virtuelle */}
            <div className="mb-4 sm:mb-6">
              <div className="relative w-full max-w-sm mx-auto">
                <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden aspect-[1.7/1]">
                  {/* Motifs décoratifs */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-500/30 to-cyan-500/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-1.5 rounded-lg">
                          <CreditCard className="h-4 w-4 text-slate-900" />
                        </div>
                        <span className="text-white font-bold text-sm">Baraaka</span>
                      </div>
                      <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                      >
                        {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Solde */}
                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-0.5">Solde disponible</p>
                      <p className={`text-xl sm:text-3xl font-bold ${summary.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                        {showBalance ? formatCurrency(summary.balance) : '•••••••'}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-gray-500 text-[10px] uppercase">Titulaire</p>
                        <p className="text-white font-medium text-xs uppercase tracking-wide">
                          {user?.name || 'Utilisateur'}
                        </p>
                      </div>
                      <div className="w-10 h-7 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <Link href="/transactions">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Transaction
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setBudgetDialogOpen(true)}
                className="bg-white shadow-md"
              >
                <Target className="h-4 w-4 mr-1.5" />
                Ajouter Revenu
              </Button>
              <ExportButton
                transactions={recentTransactions}
                categories={categories}
                variant="outline"
                size="sm"
                className="bg-white shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl pb-8">

          {/* Stats simples en 2 colonnes */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Revenus</p>
                    <p className="text-lg font-bold text-green-600">
                      {showBalance ? formatCurrency(summary.totalIncome) : '•••••'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Dépenses</p>
                    <p className="text-lg font-bold text-red-600">
                      {showBalance ? formatCurrency(summary.totalExpenses) : '•••••'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alertes budget (simplifié) */}
          {budgetStatus.filter(b => b.isOverBudget || b.percentage > 80).length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Alertes
              </h2>
              <div className="space-y-2">
                {budgetStatus.filter(b => b.isOverBudget || b.percentage > 80).slice(0, 2).map((budget) => (
                  <div key={budget.id} className={`p-3 rounded-lg ${budget.isOverBudget ? 'bg-red-50' : 'bg-yellow-50'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900">{budget.category}</span>
                      <span className={`text-xs font-semibold ${budget.isOverBudget ? 'text-red-600' : 'text-yellow-600'}`}>
                        {budget.percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${budget.isOverBudget ? 'bg-red-500' : 'bg-yellow-500'}`}
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Historique des opérations */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Historique
                </CardTitle>
                <Link href="/history">
                  <Button variant="ghost" size="sm" className="text-xs text-blue-600">
                    Tout voir
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {recentTransactions.length > 0 ? (
                <div className="space-y-2">
                  {recentTransactions.slice(0, 8).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-green-100' : transaction.type === 'transfer' ? 'bg-blue-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'income' ? (
                            <ArrowDownRight className="h-4 w-4 text-green-600" />
                          ) : transaction.type === 'transfer' ? (
                            <ArrowLeftRight className="h-4 w-4 text-blue-600" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              transaction.type === 'income' ? 'bg-green-50 text-green-700' : transaction.type === 'transfer' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {transaction.category}
                            </span>
                            <span className="text-xs text-gray-400">{formatDate(transaction.date)}</span>
                          </div>
                        </div>
                      </div>
                      <p className={`text-sm font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : transaction.type === 'transfer' ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : transaction.type === 'transfer' ? '↔' : '-'}{showBalance ? formatCurrency(transaction.amount) : '•••'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 mb-2">Aucune opération</p>
                  <p className="text-xs text-gray-400">Commencez par ajouter un revenu ou une dépense</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Graphiques (version simplifiée) */}
          <div className="grid gap-4 lg:grid-cols-2 mt-6 sm:mt-8">
            {/* Dépenses par catégorie */}
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Dépenses par catégorie
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-sm text-gray-500">
                    Aucune dépense
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Évolution mensuelle */}
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Évolution mensuelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="revenus" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="dépenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
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
