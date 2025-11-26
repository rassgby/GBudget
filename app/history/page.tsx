'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { transactionsAPI, budgetsAPI, categoriesAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Transaction, Budget, Category } from '@/types';
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  Target,
  Search,
  Filter,
  ChevronDown,
  ArrowLeft,
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

// Type pour les éléments d'historique
interface HistoryItem {
  id: string;
  type: 'transaction' | 'budget';
  transactionType?: 'income' | 'expense' | 'transfer';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  fromAccount?: string;
  toAccount?: string;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'transaction' | 'budget'>('all');
  const [filterTransactionType, setFilterTransactionType] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsData, budgetsData, categoriesData] = await Promise.all([
        transactionsAPI.getAll(),
        budgetsAPI.getAll(),
        categoriesAPI.getAll(),
      ]);

      const transactions: Transaction[] = transactionsData.transactions || [];
      const budgets: Budget[] = budgetsData || [];

      // Convertir les transactions en éléments d'historique
      const transactionItems: HistoryItem[] = transactions.map((t) => ({
        id: t.id,
        type: 'transaction' as const,
        transactionType: t.type,
        amount: t.amount,
        category: t.category,
        description: t.description,
        date: t.date,
        createdAt: t.createdAt,
        fromAccount: t.fromAccount,
        toAccount: t.toAccount,
      }));

      // Convertir les budgets en éléments d'historique
      const budgetItems: HistoryItem[] = budgets.map((b) => ({
        id: b.id,
        type: 'budget' as const,
        amount: b.amount,
        category: b.category,
        description: `Budget ${b.period === 'monthly' ? 'mensuel' : b.period === 'weekly' ? 'hebdomadaire' : 'annuel'} défini`,
        date: b.startDate,
        createdAt: b.createdAt,
      }));

      // Fusionner et trier par date de création (plus récent en premier)
      const allItems = [...transactionItems, ...budgetItems].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setHistoryItems(allItems);
      setCategories(categoriesData.categories || []);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les éléments
  const filteredItems = historyItems.filter((item) => {
    // Filtre par recherche
    const matchesSearch =
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre par type (transaction ou budget)
    const matchesType = filterType === 'all' || item.type === filterType;

    // Filtre par type de transaction
    const matchesTransactionType =
      filterTransactionType === 'all' ||
      (item.type === 'transaction' && item.transactionType === filterTransactionType);

    // Filtre par date
    const itemDate = new Date(item.date);
    const matchesDateFrom = !filterDateFrom || itemDate >= new Date(filterDateFrom);
    const matchesDateTo = !filterDateTo || itemDate <= new Date(filterDateTo);

    return matchesSearch && matchesType && matchesTransactionType && matchesDateFrom && matchesDateTo;
  });

  // Statistiques
  const stats = {
    totalTransactions: filteredItems.filter((i) => i.type === 'transaction').length,
    totalBudgets: filteredItems.filter((i) => i.type === 'budget').length,
    totalIncome: filteredItems
      .filter((i) => i.type === 'transaction' && i.transactionType === 'income')
      .reduce((sum, i) => sum + i.amount, 0),
    totalExpenses: filteredItems
      .filter((i) => i.type === 'transaction' && i.transactionType === 'expense')
      .reduce((sum, i) => sum + i.amount, 0),
  };

  const getItemIcon = (item: HistoryItem) => {
    if (item.type === 'budget') {
      return (
        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
          <Target className="h-5 w-5 text-purple-600" />
        </div>
      );
    }

    if (item.transactionType === 'income') {
      return (
        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
          <ArrowDownRight className="h-5 w-5 text-green-600" />
        </div>
      );
    }

    if (item.transactionType === 'transfer') {
      return (
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <ArrowLeftRight className="h-5 w-5 text-blue-600" />
        </div>
      );
    }

    return (
      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
        <ArrowUpRight className="h-5 w-5 text-red-600" />
      </div>
    );
  };

  const getItemColor = (item: HistoryItem) => {
    if (item.type === 'budget') return 'text-purple-600';
    if (item.transactionType === 'income') return 'text-green-600';
    if (item.transactionType === 'transfer') return 'text-blue-600';
    return 'text-red-600';
  };

  const getItemPrefix = (item: HistoryItem) => {
    if (item.type === 'budget') return '📊';
    if (item.transactionType === 'income') return '+';
    if (item.transactionType === 'transfer') return '↔';
    return '-';
  };

  const getItemBadge = (item: HistoryItem) => {
    if (item.type === 'budget') {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
          Budget
        </span>
      );
    }
    if (item.transactionType === 'income') {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
          Revenu
        </span>
      );
    }
    if (item.transactionType === 'transfer') {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
          Transfert
        </span>
      );
    }
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
        Dépense
      </span>
    );
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de l'historique...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Historique complet
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Toutes vos opérations et budgets
              </p>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Opérations</p>
                    <p className="text-lg font-bold">{stats.totalTransactions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="text-xs text-gray-500">Budgets</p>
                    <p className="text-lg font-bold">{stats.totalBudgets}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-gray-500">Revenus</p>
                    <p className="text-sm font-bold text-green-600">{formatCurrency(stats.totalIncome)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-xs text-gray-500">Dépenses</p>
                    <p className="text-sm font-bold text-red-600">{formatCurrency(stats.totalExpenses)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Barre de recherche */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                placeholder="Rechercher dans l'historique..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full mt-2 flex items-center justify-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filtres</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Filtres */}
          {showFilters && (
            <Card className="mb-4 bg-white border-0 shadow-sm">
              <CardContent className="pt-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <Label className="text-xs mb-1.5 block">Type</Label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    >
                      <option value="all">Tous</option>
                      <option value="transaction">Transactions</option>
                      <option value="budget">Budgets</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block">Type de transaction</Label>
                    <select
                      value={filterTransactionType}
                      onChange={(e) => setFilterTransactionType(e.target.value as any)}
                      className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                      disabled={filterType === 'budget'}
                    >
                      <option value="all">Tous</option>
                      <option value="income">Revenus</option>
                      <option value="expense">Dépenses</option>
                      <option value="transfer">Transferts</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block">Date de début</Label>
                    <Input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => setFilterDateFrom(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block">Date de fin</Label>
                    <Input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => setFilterDateTo(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterType('all');
                    setFilterTransactionType('all');
                    setFilterDateFrom('');
                    setFilterDateTo('');
                    setSearchTerm('');
                  }}
                  className="mt-3 text-gray-500"
                >
                  Réinitialiser les filtres
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Liste de l'historique */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center justify-between">
                <span>Activité récente</span>
                <span className="text-sm font-normal text-gray-500">
                  {filteredItems.length} élément(s)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {filteredItems.length > 0 ? (
                <div className="space-y-2">
                  {filteredItems.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      {getItemIcon(item)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              {getItemBadge(item)}
                              <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                                {item.category}
                              </span>
                              {item.type === 'transaction' && item.transactionType === 'transfer' && item.fromAccount && item.toAccount && (
                                <span className="text-xs text-gray-400">
                                  {item.fromAccount} → {item.toAccount}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(item.date)}
                            </p>
                          </div>
                          <p className={`text-base font-bold whitespace-nowrap ${getItemColor(item)}`}>
                            {getItemPrefix(item)}{formatCurrency(item.amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun élément trouvé</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Essayez de modifier vos filtres
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
