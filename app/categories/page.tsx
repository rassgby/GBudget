'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { categoriesAPI, transactionsAPI } from '@/lib/api';
import { Category } from '@/types';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';

const PRESET_COLORS = [
  '#10b981', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ef4444', // red
  '#f59e0b', // orange
  '#ec4899', // pink
  '#14b8a6', // teal
  '#6b7280', // gray
  '#f97316', // orange
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#a855f7', // violet
];

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: PRESET_COLORS[0],
  });

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user]);

  const loadCategories = async () => {
    if (!user) return;
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      alert('Erreur lors du chargement des catégories');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !formData.name) {
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
      const categoryData = {
        name: formData.name,
        color: formData.color,
      };

      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, categoryData);
      } else {
        await categoriesAPI.create(categoryData);
      }

      await loadCategories();
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la catégorie');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
    });
    setShowModal(true);
  };

  const handleDelete = async (category: Category) => {
    try {
      // Vérifier si la catégorie est utilisée dans des transactions
      const transactionsData = await transactionsAPI.getAll();
      const transactions = transactionsData.transactions || [];
      const isUsed = transactions.some(t => t.category === category.name);

      if (isUsed) {
        if (!confirm('Cette catégorie est utilisée dans des transactions. Êtes-vous sûr de vouloir la supprimer ?')) {
          return;
        }
      } else {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
          return;
        }
      }

      await categoriesAPI.delete(category.id);
      await loadCategories();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la catégorie');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      color: PRESET_COLORS[0],
    });
  };

  // Compter les transactions par catégorie
  const getCategoryUsageCount = (categoryName: string): number => {
    if (!user) return 0;
    const transactions = getTransactions(user.id);
    return transactions.filter(t => t.category === categoryName).length;
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Catégories</h1>
              <p className="text-gray-600 mt-1">Gérez vos catégories de dépenses et revenus</p>
            </div>
            <Button onClick={() => setShowModal(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nouvelle catégorie</span>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mes catégories</CardTitle>
              <CardDescription>{categories.length} catégorie(s)</CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {categories.map((category) => {
                    const usageCount = getCategoryUsageCount(category.name);
                    return (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                        style={{ borderLeft: `4px solid ${category.color}` }}
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div
                            className="h-12 w-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            <Tag className="h-6 w-6" style={{ color: category.color }} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{category.name}</p>
                            <p className="text-sm text-gray-500">
                              {usageCount} transaction{usageCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(category)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(category)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Aucune catégorie trouvée
                  <p className="text-sm mt-2">
                    Commencez par ajouter votre première catégorie !
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modal d'ajout/modification */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>
                    {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                  </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom de la catégorie</Label>
                      <Input
                        id="name"
                        placeholder="Ex: Restaurant"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Couleur</Label>
                      <div className="grid grid-cols-6 gap-3">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`h-10 w-10 rounded-lg transition-all ${
                              formData.color === color
                                ? 'ring-2 ring-offset-2 ring-blue-600 scale-110'
                                : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setFormData({ ...formData, color })}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <p className="text-sm text-gray-600 mb-2">Aperçu</p>
                      <div
                        className="flex items-center space-x-3 p-3 bg-white rounded-lg border"
                        style={{ borderLeft: `4px solid ${formData.color}` }}
                      >
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${formData.color}20` }}
                        >
                          <Tag className="h-5 w-5" style={{ color: formData.color }} />
                        </div>
                        <p className="font-medium">{formData.name || 'Nom de la catégorie'}</p>
                      </div>
                    </div>
                  </CardContent>
                  <div className="flex justify-end space-x-2 p-6 pt-0">
                    <Button type="button" variant="outline" onClick={closeModal}>
                      Annuler
                    </Button>
                    <Button type="submit">
                      {editingCategory ? 'Modifier' : 'Ajouter'}
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
