'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { statisticsAPI, categoriesAPI, budgetsAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatisticsResponse, Category, Budget } from '@/types';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, ArrowLeftRight, Plus, Target, AlertTriangle, CreditCard, Eye, EyeOff } from 'lucide-react';
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

  const { summary, topCategories, recentTransactions, budgetStatus } = statistics;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Section fixe : Carte + Actions */}
        <div className="sticky top-14 z-30 bg-gradient-to-b from-gray-50 via-gray-50 to-gray-50/95 backdrop-blur-sm pb-4 pt-4 px-4 sm:px-6 lg:px-8 shadow-sm">
          <div className="container mx-auto max-w-6xl">
            {/* Layout Desktop: Carte à gauche, Stats à droite */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
              
              {/* Carte de crédit virtuelle */}
              <div className="mb-4 lg:mb-0 lg:flex-shrink-0">
                <div className="relative w-full max-w-sm mx-auto lg:mx-0 lg:w-[380px]">
                  <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Motifs décoratifs */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-r from-blue-600/10 to-green-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    
                    {/* Contenu de la carte */}
                    <div className="relative z-10 p-5 sm:p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4 lg:mb-5">
                        <div className="flex items-center gap-2">
                          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-lg shadow-lg">
                            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-slate-900" />
                          </div>
                          <span className="text-white font-bold text-sm sm:text-base">Baraaka</span>
                        </div>
                        <button
                          onClick={() => setShowBalance(!showBalance)}
                          className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                        >
                          {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                        </button>
                      </div>

                      {/* Solde - Centre */}
                      <div className="text-center py-3 sm:py-4 lg:py-5">
                        <p className="text-gray-400 text-xs sm:text-sm mb-1">Solde disponible</p>
                        <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${summary.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                          {showBalance ? formatCurrency(summary.balance) : '•••••••'}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-end justify-between mt-3 pt-3 lg:mt-4 lg:pt-4 border-t border-white/10">
                        <div>
                          <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider">Titulaire</p>
                          <p className="text-white font-semibold text-sm sm:text-base uppercase tracking-wide">
                            {user?.name || 'Utilisateur'}
                          </p>
                        </div>
                        {/* Puce de carte */}
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-8 sm:w-12 sm:h-9 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-md shadow-md flex items-center justify-center">
                            <div className="w-6 h-4 sm:w-7 sm:h-5 border border-yellow-600/30 rounded-sm"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section droite Desktop: Stats + Actions */}
              <div className="flex-1 lg:flex lg:flex-col lg:justify-center">
                {/* Stats rapides - Visible sur Desktop dans la section fixe */}
                <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4 lg:mb-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm border">
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
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm border">
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
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Épargne</p>
                        <p className="text-lg font-bold text-blue-600">
                          {showBalance ? `${summary.savingsRate.toFixed(0)}%` : '•••'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions rapides - Mobile: boutons circulaires avec labels */}
                <div className="w-full lg:w-auto">
                  {/* Version Mobile: Boutons circulaires avec icônes et labels */}
                  <div className="flex justify-center gap-6 sm:gap-8 lg:hidden">
                    <Link href="/transactions" className="flex flex-col items-center gap-1.5 group">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                        <Plus className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Transaction</span>
                    </Link>
                    
                    <button 
                      onClick={() => setBudgetDialogOpen(true)} 
                      className="flex flex-col items-center gap-1.5 group"
                    >
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-105 transition-transform">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Revenu</span>
                    </button>
                    
                    <div className="flex flex-col items-center gap-1.5 group">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
                        <ExportButton
                          transactions={recentTransactions}
                          categories={categories}
                          variant="ghost"
                          size="sm"
                          className="h-full w-full p-0 hover:bg-transparent"
                          iconOnly
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Exporter</span>
                    </div>
                  </div>

                  {/* Version Desktop: Boutons classiques */}
                  <div className="hidden lg:flex lg:flex-wrap lg:gap-3">
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
            </div>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl pb-24 md:pb-8 pt-6">

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
          <Card className="bg-white border-0 shadow-sm mt-2">
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
