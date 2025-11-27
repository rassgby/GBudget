'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { transactionsAPI, categoriesAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Transaction, Category } from '@/types';
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Wallet,
} from 'lucide-react';

export default function HistoryPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');
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
      const [transactionsData, categoriesData] = await Promise.all([
        transactionsAPI.getAll(),
        categoriesAPI.getAll(),
      ]);
      setTransactions(transactionsData.transactions || []);
      setCategories(categoriesData.categories || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les transactions
  const filteredTransactions = transactions
    .filter((t) => {
      const matchesSearch =
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      const itemDate = new Date(t.date);
      const matchesDateFrom = !filterDateFrom || itemDate >= new Date(filterDateFrom);
      const matchesDateTo = !filterDateTo || itemDate <= new Date(filterDateTo);
      return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Grouper par date
  const groupedByDate = filteredTransactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const getTypeIcon = (type: string) => {
    if (type === 'income') return <ArrowDownRight className="h-4 w-4 text-green-600" />;
    if (type === 'transfer') return <ArrowLeftRight className="h-4 w-4 text-blue-600" />;
    return <ArrowUpRight className="h-4 w-4 text-red-600" />;
  };

  const getTypeBgColor = (type: string) => {
    if (type === 'income') return 'bg-green-100';
    if (type === 'transfer') return 'bg-blue-100';
    return 'bg-red-100';
  };

  const getTypeTextColor = (type: string) => {
    if (type === 'income') return 'text-green-600';
    if (type === 'transfer') return 'text-blue-600';
    return 'text-red-600';
  };

  const resetFilters = () => {
    setFilterType('all');
    setFilterDateFrom('');
    setFilterDateTo('');
    setSearchTerm('');
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
        {/* Header */}
        <div className="sticky top-14 z-30 bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4 max-w-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Historique</h1>
                <p className="text-sm text-gray-500">{filteredTransactions.length} opération(s)</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-blue-50 border-blue-200' : ''}
              >
                <Filter className="h-4 w-4 mr-1" />
                Filtrer
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 max-w-3xl">
          {/* Recherche */}
          <div className="bg-white rounded-xl shadow-sm border mb-4 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-50 border-0"
              />
            </div>
          </div>

          {/* Filtres */}
          {showFilters && (
            <div className="bg-white rounded-xl shadow-sm border mb-4 p-4 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Type</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'Tous' },
                    { value: 'income', label: 'Revenus' },
                    { value: 'expense', label: 'Dépenses' },
                    { value: 'transfer', label: 'Transferts' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilterType(option.value as any)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        filterType === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1.5">Du</p>
                  <Input
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1.5">Au</p>
                  <Input
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-gray-500">
                Réinitialiser
              </Button>
            </div>
          )}

          {/* Liste groupée par date */}
          {Object.keys(groupedByDate).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(groupedByDate).map(([date, items]) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">{formatDate(date)}</span>
                    <span className="text-xs text-gray-400">({items.length})</span>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="divide-y">
                      {items.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center gap-3 p-4"
                        >
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${getTypeBgColor(transaction.type)}`}>
                            {getTypeIcon(transaction.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {transaction.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="px-1.5 py-0.5 bg-gray-100 rounded">
                                {transaction.category}
                              </span>
                              {transaction.type === 'transfer' && transaction.fromAccount && (
                                <span className="text-blue-600">
                                  {transaction.fromAccount} → {transaction.toAccount}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className={`font-bold ${getTypeTextColor(transaction.type)}`}>
                            {transaction.type === 'income' ? '+' : transaction.type === 'transfer' ? '' : '-'}
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
              <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Aucune opération</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm || filterType !== 'all' || filterDateFrom || filterDateTo
                  ? 'Modifiez vos filtres'
                  : 'Votre historique est vide'}
              </p>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
