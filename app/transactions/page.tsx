"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getTransactions,
  getCategories,
  saveTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/lib/storage";
import { formatCurrency, formatShortDate, generateId } from "@/lib/utils";
import { Transaction, Category } from "@/types";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  X,
  ChevronDown,
} from "lucide-react";

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );

  // Form state
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    if (!user) return;
    const userTransactions = getTransactions(user.id);
    const userCategories = getCategories(user.id);
    setTransactions(userTransactions);
    setCategories(userCategories);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !user ||
      !formData.amount ||
      !formData.category ||
      !formData.description
    ) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    if (editingTransaction) {
      const updated: Transaction = {
        ...editingTransaction,
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date,
      };
      updateTransaction(updated);
    } else {
      const newTransaction: Transaction = {
        id: generateId(),
        userId: user.id,
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date,
        createdAt: new Date().toISOString(),
      };
      saveTransaction(newTransaction);
    }

    loadData();
    closeModal();
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description,
      date: transaction.date,
    });
    setShowModal(true);
  };

  const handleDelete = (transaction: Transaction) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette transaction ?")) {
      deleteTransaction(transaction.id);
      loadData();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
    setFormData({
      type: "expense",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  // Filtrer les transactions
  const filteredTransactions = transactions
    .filter((t) => {
      const matchesSearch =
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filterCategory || t.category === filterCategory;
      const matchesType = filterType === "all" || t.type === filterType;

      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const incomeCategories = categories.filter(
    (c) => c.name === "Salaire" || c.name.toLowerCase().includes("revenu")
  );
  const expenseCategories = categories.filter(
    (c) => c.name !== "Salaire" && !c.name.toLowerCase().includes("revenu")
  );

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-3 sm:py-6 md:py-8">
        <div className="w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          {/* En-tête responsive */}
          <div className="flex flex-col xs:flex-row xs:items-start sm:items-center justify-between gap-3 xs:gap-4 mb-4 sm:mb-6 md:mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 truncate">
                Transactions
              </h1>
              <p className="text-xs xs:text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-1">
                Gérez toutes vos transactions
              </p>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="w-full xs:w-auto shrink-0 flex items-center justify-center gap-2 h-9 sm:h-10 text-sm sm:text-base px-3 sm:px-4"
            >
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Nouvelle transaction</span>
              <span className="xs:hidden">Ajouter</span>
            </Button>
          </div>

          {/* Barre de recherche et filtres mobile */}
          <div className="mb-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 sm:pl-9 h-9 sm:h-10 text-sm sm:text-base"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full mt-2 flex items-center justify-center gap-2 h-9 sm:h-10 text-sm sm:text-base"
            >
              <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Filtres</span>
              <ChevronDown className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Filtres - Responsive pour tous les appareils */}
          <Card className={`mb-4 sm:mb-6 transition-all duration-300 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <CardContent className="pt-4 sm:pt-6">
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Recherche - Desktop uniquement */}
                <div className="hidden md:block lg:col-span-1 xl:col-span-2">
                  <Label htmlFor="search" className="text-xs sm:text-sm mb-1.5 block">
                    Rechercher
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 pointer-events-none" />
                    <Input
                      id="search"
                      placeholder="Description ou catégorie..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 sm:pl-9 h-9 sm:h-10 text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                {/* Filtre catégorie */}
                <div className="sm:col-span-1">
                  <Label htmlFor="filterCategory" className="text-xs sm:text-sm mb-1.5 block">
                    Catégorie
                  </Label>
                  <select
                    id="filterCategory"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="flex h-9 sm:h-10 w-full rounded-md border border-gray-300 bg-white px-2.5 sm:px-3 py-2 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <option value="">Toutes</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Filtre type */}
                <div className="sm:col-span-1">
                  <Label htmlFor="filterType" className="text-xs sm:text-sm mb-1.5 block">
                    Type
                  </Label>
                  <select
                    id="filterType"
                    value={filterType}
                    onChange={(e) =>
                      setFilterType(
                        e.target.value as "all" | "income" | "expense"
                      )
                    }
                    className="flex h-9 sm:h-10 w-full rounded-md border border-gray-300 bg-white px-2.5 sm:px-3 py-2 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <option value="all">Tous</option>
                    <option value="income">Revenus</option>
                    <option value="expense">Dépenses</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des transactions - Optimisée pour tous les appareils */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base sm:text-lg md:text-xl">
                    Liste des transactions
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1">
                    {filteredTransactions.length} transaction(s)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-3 xs:px-4 sm:px-6">
              {filteredTransactions.length > 0 ? (
                <div className="space-y-2 sm:space-y-2.5">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex flex-col xs:flex-row xs:items-center gap-2.5 xs:gap-3 sm:gap-4 p-2.5 xs:p-3 sm:p-4 border rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                    >
                      {/* Icône et contenu */}
                      <div className="flex items-start xs:items-center gap-2.5 xs:gap-3 sm:gap-4 flex-1 min-w-0">
                        <div
                          className={`h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 shrink-0 rounded-full flex items-center justify-center ${
                            transaction.type === "income"
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowUpRight className="h-4 w-4 xs:h-4.5 xs:w-4.5 sm:h-5 sm:w-5 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 xs:h-4.5 xs:w-4.5 sm:h-5 sm:w-5 text-red-600" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start xs:items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm xs:text-base text-gray-900 truncate">
                                {transaction.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-1 xs:gap-1.5 mt-0.5">
                                <p className="text-xs xs:text-sm text-gray-500 truncate">
                                  {transaction.category}
                                </p>
                                <span className="text-gray-400">•</span>
                                <p className="text-xs text-gray-400 shrink-0">
                                  {formatShortDate(transaction.date)}
                                </p>
                              </div>
                            </div>
                            
                            {/* Montant */}
                            <div
                              className={`text-base xs:text-lg sm:text-xl font-semibold whitespace-nowrap ml-2 ${
                                transaction.type === "income"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "income" ? "+" : "-"}
                              <span className="hidden xs:inline">{formatCurrency(transaction.amount)}</span>
                              <span className="xs:hidden">{formatCurrency(transaction.amount).replace(/\s/g, '')}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end xs:justify-start gap-1 xs:gap-1.5 sm:gap-2 pl-10 xs:pl-0 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(transaction)}
                          className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-blue-50 active:bg-blue-100 touch-manipulation"
                          aria-label="Modifier"
                        >
                          <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(transaction)}
                          className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-red-50 active:bg-red-100 touch-manipulation"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-xs xs:text-sm sm:text-base text-gray-500">
                    Aucune transaction trouvée
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Commencez par ajouter une nouvelle transaction
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modal d'ajout/modification - Ultra-responsive */}
          {showModal && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center p-0 sm:p-4 z-50 overflow-y-auto"
              onClick={(e) => {
                if (e.target === e.currentTarget) closeModal();
              }}
            >
              <Card className="w-full sm:max-w-md sm:my-8 min-h-screen sm:min-h-0 sm:rounded-lg rounded-none animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200">
                <CardHeader className="relative sticky top-0 bg-white z-10 border-b pb-3 sm:pb-4 sm:border-b-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base xs:text-lg sm:text-xl pr-10">
                      {editingTransaction
                        ? "Modifier la transaction"
                        : "Nouvelle transaction"}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={closeModal}
                      className="absolute right-3 sm:right-4 top-3 sm:top-4 h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-100 active:bg-gray-200 touch-manipulation"
                      aria-label="Fermer"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </CardHeader>
                
                <form onSubmit={handleSubmit} className="flex flex-col">
                  <CardContent className="space-y-4 sm:space-y-5 px-4 xs:px-5 sm:px-6 py-4 sm:py-6 flex-1 overflow-y-auto">
                    {/* Type de transaction */}
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-xs xs:text-sm sm:text-base font-medium">
                        Type <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="type"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value as "income" | "expense",
                            category: "",
                          })
                        }
                        className="flex h-10 xs:h-11 sm:h-12 w-full rounded-md border border-gray-300 bg-white px-3 xs:px-3.5 sm:px-4 py-2 text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all touch-manipulation"
                        required
                      >
                        <option value="expense">Dépense</option>
                        <option value="income">Revenu</option>
                      </select>
                    </div>

                    {/* Montant */}
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-xs xs:text-sm sm:text-base font-medium">
                        Montant (€) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        required
                        aria-describedby="amount-hint"
                        className="h-10 xs:h-11 sm:h-12 text-sm xs:text-base px-3 xs:px-3.5 sm:px-4 touch-manipulation"
                      />
                      <p id="amount-hint" className="text-xs text-gray-500">
                        Entrez un montant positif
                      </p>
                    </div>

                    {/* Catégorie */}
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-xs xs:text-sm sm:text-base font-medium">
                        Catégorie <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="flex h-10 xs:h-11 sm:h-12 w-full rounded-md border border-gray-300 bg-white px-3 xs:px-3.5 sm:px-4 py-2 text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                        disabled={!formData.type}
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {(formData.type === "income"
                          ? incomeCategories
                          : expenseCategories
                        ).map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {!formData.type && (
                        <p className="text-xs text-gray-500">
                          Sélectionnez d'abord un type
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-xs xs:text-sm sm:text-base font-medium">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="description"
                        placeholder="Ex: Courses du mois"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        required
                        maxLength={100}
                        className="h-10 xs:h-11 sm:h-12 text-sm xs:text-base px-3 xs:px-3.5 sm:px-4 touch-manipulation"
                      />
                      <p className="text-xs text-gray-500">
                        {formData.description.length}/100 caractères
                      </p>
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-xs xs:text-sm sm:text-base font-medium">
                        Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        max={new Date().toISOString().split("T")[0]}
                        required
                        className="h-10 xs:h-11 sm:h-12 text-sm xs:text-base px-3 xs:px-3.5 sm:px-4 touch-manipulation"
                      />
                    </div>
                  </CardContent>

                  {/* Boutons d'action - Sticky en mobile */}
                  <div className="sticky bottom-0 bg-white border-t sm:border-t-0 flex flex-col-reverse xs:flex-row justify-end gap-2 xs:gap-3 px-4 xs:px-5 sm:px-6 py-3 xs:py-4 sm:pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] sm:shadow-none">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeModal}
                      className="w-full xs:w-auto xs:min-w-[100px] h-10 xs:h-10 sm:h-11 text-sm xs:text-base touch-manipulation"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      className="w-full xs:w-auto xs:min-w-[100px] h-10 xs:h-10 sm:h-11 text-sm xs:text-base touch-manipulation disabled:opacity-50"
                      disabled={
                        !formData.amount || !formData.category || !formData.date || !formData.description
                      }
                    >
                      {editingTransaction ? "Modifier" : "Ajouter"}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}