'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTransactions, getCategories } from '@/lib/storage';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Transaction, Category } from '@/types';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Calendar, Activity, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (user) {
      const userTransactions = getTransactions(user.id);
      const userCategories = getCategories(user.id);
      setTransactions(userTransactions);
      setCategories(userCategories);
    }
  }, [user]);

  // Calculs des statistiques
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Taux d'épargne
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0';

  // Dépenses par catégorie
  const expensesByCategory = categories.map(category => {
    const amount = transactions
      .filter(t => t.type === 'expense' && t.category === category.name)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      name: category.name,
      value: amount,
      color: category.color,
    };
  }).filter(item => item.value > 0);

  // Transactions récentes (dernières 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Évolution mensuelle (simulation sur les 6 derniers mois)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });

    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      revenus: income,
      dépenses: expenses,
    };
  });

  // Top 3 catégories de dépenses
  const topCategories = [...expensesByCategory]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-600">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Vue d'ensemble de vos finances
              </p>
            </div>
            <Link href="/transactions">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle transaction
              </Button>
            </Link>
          </div>

          {/* Cartes de statistiques principales */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Revenus</CardTitle>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold text-green-600">
                  {formatCurrency(totalIncome)}
                </div>
                <p className="text-xs text-gray-500 mt-2">Total des revenus</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Dépenses</CardTitle>
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold text-red-600">
                  {formatCurrency(totalExpenses)}
                </div>
                <p className="text-xs text-gray-500 mt-2">Total des dépenses</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Solde</CardTitle>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl md:text-3xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(balance)}
                </div>
                <p className="text-xs text-gray-500 mt-2">Solde actuel</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Épargne</CardTitle>
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold text-purple-600">
                  {savingsRate}%
                </div>
                <p className="text-xs text-gray-500 mt-2">Taux d'épargne</p>
              </CardContent>
            </Card>
          </div>

          {/* Top catégories */}
          {topCategories.length > 0 && (
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              {topCategories.map((category, index) => (
                <Card key={category.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: category.color }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{category.name}</p>
                          <p className="text-sm text-gray-500">Top dépense</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(category.value)}</p>
                        <p className="text-xs text-gray-500">
                          {totalExpenses > 0 ? ((category.value / totalExpenses) * 100).toFixed(0) : 0}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* Graphique des dépenses par catégorie */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  Dépenses par catégorie
                </CardTitle>
                <CardDescription>Répartition de vos dépenses</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {expensesByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Activity className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium">Aucune dépense enregistrée</p>
                    <p className="text-sm mt-1">Ajoutez des transactions pour voir les statistiques</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Évolution mensuelle */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  Évolution mensuelle
                </CardTitle>
                <CardDescription>Revenus vs Dépenses sur 6 mois</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {transactions.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value as number)}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenus" fill="#10b981" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="dépenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <BarChart className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium">Aucune transaction enregistrée</p>
                    <p className="text-sm mt-1">Commencez à suivre vos finances dès maintenant</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Transactions récentes */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                    Transactions récentes
                  </CardTitle>
                  <CardDescription>Vos 5 dernières transactions</CardDescription>
                </div>
                <Link href="/transactions">
                  <Button variant="outline" size="sm">
                    Voir tout
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-sm ${
                          transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'income' ? (
                            <ArrowUpRight className="h-6 w-6 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-6 w-6 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{transaction.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">{transaction.category}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500">{formatDate(transaction.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                      <Wallet className="h-10 w-10 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Aucune transaction enregistrée
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Commencez par ajouter votre première transaction !
                  </p>
                  <Link href="/transactions">
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une transaction
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}