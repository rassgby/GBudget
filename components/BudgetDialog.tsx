'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { budgetsAPI } from '@/lib/api';
import { Category } from '@/types';
import { Target, Loader2 } from 'lucide-react';

interface BudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSuccess: () => void;
}

export function BudgetDialog({ open, onOpenChange, categories, onSuccess }: BudgetDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.category || !formData.amount) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Le montant doit être un nombre positif');
      return;
    }

    try {
      setLoading(true);
      const selectedCategory = categories.find(c => c.name === formData.category);

      // Calculate start date based on period
      const now = new Date();
      let startDate = '';

      if (formData.period === 'monthly') {
        // Start of current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      } else if (formData.period === 'weekly') {
        // Start of current week (Monday)
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        startDate = new Date(now.setDate(diff)).toISOString();
      } else {
        // Start of current year
        startDate = new Date(now.getFullYear(), 0, 1).toISOString();
      }

      await budgetsAPI.create({
        categoryId: selectedCategory?.id,
        category: formData.category,
        amount,
        period: formData.period,
        startDate,
        isActive: true,
      });

      setFormData({ category: '', amount: '', period: 'monthly' });
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            Définir un budget
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Fixez un budget pour une catégorie de dépenses
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 mt-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
              {error}
            </div>
          )}

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="category" className="text-xs sm:text-sm">
              Catégorie
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger id="category" className="text-xs sm:text-sm">
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.name} className="text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled className="text-xs sm:text-sm">
                    Aucune catégorie disponible
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="amount" className="text-xs sm:text-sm">
              Montant du budget (FCFA)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="Ex: 50000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="period" className="text-xs sm:text-sm">
              Période
            </Label>
            <Select
              value={formData.period}
              onValueChange={(value) => setFormData({ ...formData, period: value })}
            >
              <SelectTrigger id="period" className="text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly" className="text-xs sm:text-sm">Mensuel</SelectItem>
                <SelectItem value="weekly" className="text-xs sm:text-sm">Hebdomadaire</SelectItem>
                <SelectItem value="yearly" className="text-xs sm:text-sm">Annuel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:flex-1 text-xs sm:text-sm"
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer le budget'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
