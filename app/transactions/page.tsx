'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { transactionsAPI, categoriesAPI } from '@/lib/api';
import { formatCurrency, formatShortDate } from '@/lib/utils';
import { Transaction, Category } from '@/types';
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  Search,
  X,
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  MoreVertical,
} from 'lucide-react';
import { ExportButton } from '@/components/ExportDialog';

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense' | 'transfer',
    amount: '',
    category: '',
    customCategory: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    fromAccount: '',
    toAccount: '',
  });

  // Types prédéfinis
  const expenseTypes = [
    { name: 'Alimentation', icon: '🍔' },
    { name: 'Transport', icon: '🚗' },
    { name: 'Logement', icon: '🏠' },
    { name: 'Santé', icon: '💊' },
    { name: 'Loisirs', icon: '🎮' },
    { name: 'Shopping', icon: '🛍️' },
    { name: 'Factures', icon: '📄' },
    { name: 'Restaurant', icon: '🍽️' },
  ];

  const incomeTypes = [
    { name: 'Salaire', icon: '💰' },
    { name: 'Transfert reçu', icon: '📥' },
    { name: 'Cadeau', icon: '🎁' },
    { name: 'Remboursement', icon: '↩️' },
    { name: 'Vente', icon: '🏷️' },
    { name: 'Freelance', icon: '💼' },
    { name: 'Prime', icon: '🏆' },
    { name: 'Investissement', icon: '📈' },
  ];

  const transferTypes = [
    { name: 'Orange Money', icon: '🟠' },
    { name: 'Wave', icon: '🌊' },
    { name: 'Free Money', icon: '🔵' },
    { name: 'Moov Money', icon: '🟣' },
    { name: 'Virement', icon: '🏦' },
    { name: 'Espèces', icon: '💵' },
    { name: 'Western Union', icon: '🌐' },
    { name: 'MoneyGram', icon: '💱' },
  ];

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [transactionsData, categoriesData] = await Promise.all([
        transactionsAPI.getAll(),
        categoriesAPI.getAll(),
      ]);
      setTransactions(transactionsData.transactions || []);
      setCategories(categoriesData.categories || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = formData.category === 'custom' 
      ? formData.customCategory 
      : formData.category;

    if (!user || !formData.amount || !finalCategory || !formData.description) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (formData.type === 'transfer' && (!formData.fromAccount || !formData.toAccount)) {
      alert('Veuillez remplir les champs expéditeur et destinataire');
      return;
    }

    try {
      const category = categories.find(c => c.name === finalCategory);
      const transactionData: any = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: finalCategory,
        categoryId: category?.id,
        description: formData.description,
        date: formData.date,
      };

      if (formData.type === 'transfer') {
        transactionData.fromAccount = formData.fromAccount;
        transactionData.toAccount = formData.toAccount;
      }

      if (editingTransaction) {
        await transactionsAPI.update(editingTransaction.id, transactionData);
      } else {
        await transactionsAPI.create(transactionData);
      }

      await loadData();
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la transaction');
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      customCategory: '',
      description: transaction.description,
      date: transaction.date,
      fromAccount: transaction.fromAccount || '',
      toAccount: transaction.toAccount || '',
    });
    setShowModal(true);
    setActiveMenu(null);
  };

  const handleDelete = async (transaction: Transaction) => {
    if (confirm('Supprimer cette transaction ?')) {
      try {
        await transactionsAPI.delete(transaction.id);
        await loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
    setActiveMenu(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      customCategory: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      fromAccount: '',
      toAccount: '',
    });
  };

  // Filtrer les transactions
  const filteredTransactions = transactions
    .filter((t) => {
      const matchesSearch =
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Stats
  const stats = {
    totalIncome: filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    totalTransfers: filteredTransactions
      .filter(t => t.type === 'transfer')
      .reduce((sum, t) => sum + t.amount, 0),
  };

  const availableTypes = formData.type === 'income' 
    ? incomeTypes 
    : formData.type === 'transfer'
      ? transferTypes
      : expenseTypes;

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
      <div className="min-h-screen bg-gray-50">
        {/* Header fixe */}
        <div className="sticky top-14 z-30 bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4 max-w-5xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Transactions
                </h1>
                <p className="text-sm text-gray-500">
                  {filteredTransactions.length} opération(s)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ExportButton
                  transactions={transactions}
                  categories={categories}
                  variant="outline"
                  size="sm"
                />
                <Button 
                  onClick={() => setShowModal(true)} 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Nouvelle</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 max-w-5xl">
          {/* Stats rapides */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-xl p-3 shadow-sm border">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-xs text-gray-500">Revenus</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-green-600">
                {formatCurrency(stats.totalIncome)}
              </p>
            </div>

            <div className="bg-white rounded-xl p-3 shadow-sm border">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                  <TrendingDown className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-xs text-gray-500">Dépenses</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-red-600">
                {formatCurrency(stats.totalExpenses)}
              </p>
            </div>

            <div className="bg-white rounded-xl p-3 shadow-sm border">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <ArrowLeftRight className="h-3 w-3 text-blue-600" />
                </div>
                <span className="text-xs text-gray-500">Transferts</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-blue-600">
                {formatCurrency(stats.totalTransfers)}
              </p>
            </div>
          </div>

          {/* Recherche et filtres */}
          <div className="bg-white rounded-xl shadow-sm border mb-4">
            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une transaction..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-gray-50 border-0"
                />
              </div>
            </div>
            
            <div className="border-t px-3 py-2">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    filterType === 'all'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilterType('income')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    filterType === 'income'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  💰 Revenus
                </button>
                <button
                  onClick={() => setFilterType('expense')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    filterType === 'expense'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  🛒 Dépenses
                </button>
                <button
                  onClick={() => setFilterType('transfer')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    filterType === 'transfer'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  🔄 Transferts
                </button>
              </div>
            </div>
          </div>

          {/* Liste des transactions */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {filteredTransactions.length > 0 ? (
              <div className="divide-y">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
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
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatShortDate(transaction.date)}
                        </span>
                      </div>
                      {transaction.type === 'transfer' && (
                        <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                          <span>{transaction.fromAccount}</span>
                          <ArrowLeftRight className="h-3 w-3" />
                          <span>{transaction.toAccount}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <p className={`font-bold ${getTypeTextColor(transaction.type)}`}>
                        {transaction.type === 'income' ? '+' : transaction.type === 'transfer' ? '' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === transaction.id ? null : transaction.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>
                      
                      {activeMenu === transaction.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setActiveMenu(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-1 z-20 min-w-[120px]">
                            <button
                              onClick={() => handleEdit(transaction)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Pencil className="h-4 w-4" />
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDelete(transaction)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Supprimer
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Aucune transaction</p>
                <p className="text-sm text-gray-400 mt-1">
                  Commencez par ajouter votre première transaction
                </p>
                <Button 
                  onClick={() => setShowModal(true)} 
                  className="mt-4" 
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter une transaction
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Modal d'ajout/modification */}
        {showModal && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                <h2 className="text-lg font-semibold">
                  {editingTransaction ? 'Modifier' : 'Nouvelle transaction'}
                </h2>
                <button 
                  onClick={closeModal} 
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="p-4 space-y-4">
                  {/* Type de transaction */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.type === 'expense'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl block mb-1">🛒</span>
                      <span className="text-xs font-medium">Dépense</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.type === 'income'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl block mb-1">💰</span>
                      <span className="text-xs font-medium">Revenu</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'transfer', category: '' })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.type === 'transfer'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl block mb-1">🔄</span>
                      <span className="text-xs font-medium">Transfert</span>
                    </button>
                  </div>

                  {/* Montant */}
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">
                      Montant (FCFA)
                    </Label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      placeholder="0"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="text-2xl font-bold h-14 text-center"
                      required
                    />
                  </div>

                  {/* Catégorie */}
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">
                      Catégorie
                    </Label>
                    <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                      {availableTypes.map((cat) => (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat.name })}
                          className={`p-2 rounded-xl border text-center transition-all ${
                            formData.category === cat.name
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-xl block">{cat.icon}</span>
                          <span className="text-[10px] text-gray-600 block truncate">
                            {cat.name}
                          </span>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, category: 'custom' })}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          formData.category === 'custom'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-xl block">➕</span>
                        <span className="text-[10px] text-gray-600 block">Autre</span>
                      </button>
                    </div>

                    {formData.category === 'custom' && (
                      <Input
                        placeholder="Nom de la catégorie..."
                        value={formData.customCategory}
                        onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                        className="mt-2"
                        required
                      />
                    )}
                  </div>

                  {/* Champs transfert */}
                  {formData.type === 'transfer' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium mb-1.5 block">De</Label>
                        <Input
                          placeholder="Expéditeur..."
                          value={formData.fromAccount}
                          onChange={(e) => setFormData({ ...formData, fromAccount: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-1.5 block">Vers</Label>
                        <Input
                          placeholder="Destinataire..."
                          value={formData.toAccount}
                          onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">
                      Description
                    </Label>
                    <Input
                      placeholder="Ex: Courses du mois..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">Date</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      max={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-2 p-4 border-t bg-gray-50 sticky bottom-0">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={closeModal} 
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={
                      !formData.amount || 
                      (!formData.category || (formData.category === 'custom' && !formData.customCategory)) || 
                      !formData.description
                    }
                  >
                    {editingTransaction ? 'Modifier' : 'Ajouter'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
