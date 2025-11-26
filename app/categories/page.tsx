'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { categoriesAPI, transactionsAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Category, Transaction } from '@/types';
import { Plus, Pencil, Trash2, Tag, X, Palette, Check, Search, MoreVertical, TrendingDown } from 'lucide-react';

const PRESET_COLORS = [
  { name: 'Vert', value: '#10b981' },
  { name: 'Bleu', value: '#3b82f6' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Rouge', value: '#ef4444' },
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Rose', value: '#ec4899' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Ambre', value: '#f97316' },
  { name: 'Emeraude', value: '#059669' },
  { name: 'Gris', value: '#6b7280' },
];

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    color: PRESET_COLORS[0].value,
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [categoriesData, transactionsData] = await Promise.all([
        categoriesAPI.getAll(),
        transactionsAPI.getAll(),
      ]);
      setCategories(categoriesData.categories || []);
      setTransactions(transactionsData.transactions || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !formData.name.trim()) {
      alert('Veuillez entrer un nom de catégorie');
      return;
    }

    // Vérifier si le nom existe déjà
    const nameExists = categories.some(
      c => c.name.toLowerCase() === formData.name.toLowerCase() &&
      c.id !== editingCategory?.id
    );

    if (nameExists) {
      alert('Une catégorie avec ce nom existe déjà');
      return;
    }

    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, formData);
      } else {
        await categoriesAPI.create(formData);
      }
      await loadData();
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
    });
    setShowModal(true);
    setActiveMenu(null);
  };

  const handleDelete = async (category: Category) => {
    const usageCount = getCategoryStats(category.name).count;
    
    const message = usageCount > 0
      ? `Cette catégorie est utilisée dans ${usageCount} transaction(s). Supprimer quand même ?`
      : 'Supprimer cette catégorie ?';

    if (confirm(message)) {
      try {
        await categoriesAPI.delete(category.id);
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
    setEditingCategory(null);
    setFormData({
      name: '',
      color: PRESET_COLORS[0].value,
    });
  };

  // Stats par catégorie
  const getCategoryStats = (categoryName: string) => {
    const categoryTransactions = transactions.filter(t => t.category === categoryName);
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      count: categoryTransactions.length,
      total,
    };
  };

  // Filtrer les catégories
  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Trier par utilisation
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    return getCategoryStats(b.name).count - getCategoryStats(a.name).count;
  });

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
          <div className="container mx-auto px-4 py-4 max-w-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Catégories</h1>
                <p className="text-sm text-gray-500">{categories.length} catégorie(s)</p>
              </div>
              <Button onClick={() => setShowModal(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Nouvelle</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 max-w-3xl">
          {/* Barre de recherche */}
          <div className="bg-white rounded-xl shadow-sm border mb-4 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-50 border-0"
              />
            </div>
          </div>

          {/* Liste des catégories */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {sortedCategories.length > 0 ? (
              <div className="divide-y">
                {sortedCategories.map((category) => {
                  const stats = getCategoryStats(category.name);
                  return (
                    <div
                      key={category.id}
                      className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                    >
                      {/* Icône colorée */}
                      <div
                        className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${category.color}15` }}
                      >
                        <Tag className="h-5 w-5" style={{ color: category.color }} />
                      </div>

                      {/* Infos */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{category.name}</p>
                          <div
                            className="h-3 w-3 rounded-full shrink-0"
                            style={{ backgroundColor: category.color }}
                          />
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span>{stats.count} transaction(s)</span>
                          {stats.total > 0 && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <TrendingDown className="h-3 w-3" />
                                {formatCurrency(stats.total)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Menu actions */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === category.id ? null : category.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>

                        {activeMenu === category.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveMenu(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-1 z-20 min-w-[120px]">
                              <button
                                onClick={() => handleEdit(category)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Pencil className="h-4 w-4" />
                                Modifier
                              </button>
                              <button
                                onClick={() => handleDelete(category)}
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
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Tag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  {searchTerm ? 'Aucune catégorie trouvée' : 'Aucune catégorie'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchTerm ? 'Essayez un autre terme' : 'Créez votre première catégorie'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setShowModal(true)} className="mt-4" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Créer une catégorie
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Légende couleurs */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Couleurs disponibles
            </h3>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <div
                  key={color.value}
                  className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-full"
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-xs text-gray-600">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal d'ajout/modification */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">
                  {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-4 space-y-4">
                  {/* Nom */}
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">Nom de la catégorie</Label>
                    <Input
                      placeholder="Ex: Restaurant, Shopping..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-12"
                      required
                      autoFocus
                    />
                  </div>

                  {/* Couleur */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Couleur</Label>
                    <div className="grid grid-cols-6 gap-3">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, color: color.value })}
                          className={`relative h-10 w-10 rounded-xl transition-all ${
                            formData.color === color.value
                              ? 'ring-2 ring-offset-2 ring-blue-600 scale-110'
                              : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.value }}
                        >
                          {formData.color === color.value && (
                            <Check className="h-5 w-5 text-white absolute inset-0 m-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Aperçu */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-2">Aperçu</p>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${formData.color}15` }}
                      >
                        <Tag className="h-5 w-5" style={{ color: formData.color }} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {formData.name || 'Nom de la catégorie'}
                        </span>
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: formData.color }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-2 p-4 border-t bg-gray-50">
                  <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={!formData.name.trim()}
                  >
                    {editingCategory ? 'Modifier' : 'Créer'}
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
