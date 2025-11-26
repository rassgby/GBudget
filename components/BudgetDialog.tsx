'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { transactionsAPI } from '@/lib/api';
import { Category } from '@/types';
import { Plus, Loader2, Wallet, Send, Briefcase, Gift, CreditCard, PiggyBank } from 'lucide-react';

interface BudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSuccess: () => void;
}

// Types de revenus prédéfinis
const incomeTypes = [
  { value: 'transfer', label: 'Transfert d\'argent', icon: Send },
  { value: 'salary', label: 'Salaire', icon: Briefcase },
  { value: 'gift', label: 'Cadeau / Don', icon: Gift },
  { value: 'refund', label: 'Remboursement', icon: CreditCard },
  { value: 'savings', label: 'Épargne retirée', icon: PiggyBank },
  { value: 'other', label: 'Autre revenu', icon: Wallet },
];

export function BudgetDialog({ open, onOpenChange, categories, onSuccess }: BudgetDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    incomeType: '',
    customType: '',
    amount: '',
    description: '',
    source: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.incomeType || !formData.amount) {
      setError('Veuillez sélectionner un type et entrer un montant');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Le montant doit être un nombre positif');
      return;
    }

    try {
      setLoading(true);
      
      // Trouver le label du type de revenu
      const selectedType = incomeTypes.find(t => t.value === formData.incomeType);
      const categoryName = formData.incomeType === 'other' && formData.customType 
        ? formData.customType 
        : selectedType?.label || 'Revenu';

      // Créer une transaction de type income
      await transactionsAPI.create({
        type: 'income',
        amount,
        category: categoryName,
        description: formData.description || `${categoryName}${formData.source ? ` de ${formData.source}` : ''}`,
        date: new Date().toISOString().split('T')[0],
      });

      // Reset form
      setFormData({
        incomeType: '',
        customType: '',
        amount: '',
        description: '',
        source: '',
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'ajout du revenu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            Ajouter un revenu
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Ajoutez un revenu pour augmenter votre solde (transfert, salaire, etc.)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* Type de revenu */}
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">Type de revenu</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {incomeTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.incomeType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, incomeType: type.value, customType: '' })}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isSelected ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="text-xs font-medium text-center">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Type personnalisé si "Autre" est sélectionné */}
          {formData.incomeType === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="customType" className="text-xs sm:text-sm">
                Nom du type de revenu
              </Label>
              <Input
                id="customType"
                placeholder="Ex: Vente, Location, etc."
                value={formData.customType}
                onChange={(e) => setFormData({ ...formData, customType: e.target.value })}
                className="text-sm"
              />
            </div>
          )}

          {/* Montant */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-xs sm:text-sm">
              Montant (FCFA)
            </Label>
            <Input
              id="amount"
              type="number"
              step="1"
              placeholder="Ex: 50000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="text-lg font-semibold"
            />
          </div>

          {/* Source (optionnel) */}
          <div className="space-y-2">
            <Label htmlFor="source" className="text-xs sm:text-sm">
              Source / Expéditeur (optionnel)
            </Label>
            <Input
              id="source"
              placeholder="Ex: Orange Money, Papa, Employeur..."
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="text-sm"
            />
          </div>

          {/* Description (optionnel) */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs sm:text-sm">
              Description (optionnel)
            </Label>
            <Input
              id="description"
              placeholder="Note ou détails supplémentaires..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="text-sm"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:flex-1 text-sm"
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-sm"
              disabled={loading || !formData.incomeType || !formData.amount}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ajout...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter {formData.amount ? `${parseInt(formData.amount).toLocaleString()} FCFA` : ''}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
