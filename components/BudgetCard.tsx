'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/utils';
import { budgetsAPI } from '@/lib/api';
import { Budget } from '@/types';
import { Target, Edit2, AlertTriangle, TrendingUp } from 'lucide-react';

interface BudgetCardProps {
  budget: Budget | null;
  currentMonthExpenses: number;
  onBudgetUpdated: () => void;
}

export function BudgetCard({ budget, currentMonthExpenses, onBudgetUpdated }: BudgetCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState(budget?.amount.toString() || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const budgetValue = budget?.amount || 0;
  const percentage = budgetValue > 0 ? (currentMonthExpenses / budgetValue) * 100 : 0;
  const remaining = budgetValue - currentMonthExpenses;

  // Déterminer la couleur de la barre de progression
  const getProgressColor = () => {
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleSaveBudget = async () => {
    setError('');
    const amount = parseFloat(budgetAmount);

    if (isNaN(amount) || amount <= 0) {
      setError('Veuillez entrer un montant valide');
      return;
    }

    setIsLoading(true);

    try {
      if (budget) {
        // Mettre à jour le budget existant
        await budgetsAPI.update(budget.id, { amount });
      } else {
        // Créer un nouveau budget pour le mois actuel
        await budgetsAPI.create({
          amount,
          month: currentMonth,
          year: currentYear,
        });
      }

      setIsDialogOpen(false);
      onBudgetUpdated();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde du budget');
    } finally {
      setIsLoading(false);
    }
  };

  const openDialog = () => {
    setBudgetAmount(budget?.amount.toString() || '');
    setError('');
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
        <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Budget mensuel</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={openDialog}
              className="text-xs sm:text-sm"
            >
              <Edit2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {budget ? 'Modifier' : 'Définir'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 space-y-3 sm:space-y-4">
          {budget ? (
            <>
              {/* Budget et dépenses */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Budget défini</p>
                  <p className="text-base sm:text-lg md:text-xl font-bold text-purple-600 break-words">
                    {formatCurrency(budgetValue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Dépensé</p>
                  <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900 break-words">
                    {formatCurrency(currentMonthExpenses)}
                  </p>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">
                    {percentage > 100 ? 'Dépassement' : 'Utilisé'}: {Math.min(percentage, 100).toFixed(0)}%
                  </span>
                  <span className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {remaining >= 0 ? 'Reste' : 'Dépassement'}: {formatCurrency(Math.abs(remaining))}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Alerte de dépassement */}
              {percentage >= 90 && (
                <div className={`flex items-start gap-2 p-2 sm:p-3 rounded-lg ${
                  percentage >= 100 ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <AlertTriangle className={`h-4 w-4 sm:h-5 sm:w-5 mt-0.5 shrink-0 ${
                    percentage >= 100 ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                  <div>
                    <p className={`text-xs sm:text-sm font-semibold ${
                      percentage >= 100 ? 'text-red-900' : 'text-yellow-900'
                    }`}>
                      {percentage >= 100 ? 'Budget dépassé !' : 'Attention au budget'}
                    </p>
                    <p className={`text-xs ${
                      percentage >= 100 ? 'text-red-700' : 'text-yellow-700'
                    }`}>
                      {percentage >= 100
                        ? `Vous avez dépassé votre budget de ${formatCurrency(Math.abs(remaining))}`
                        : `Il vous reste seulement ${formatCurrency(remaining)} pour ce mois`
                      }
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                </div>
              </div>
              <p className="text-sm sm:text-base font-medium text-gray-900 mb-1 sm:mb-2">
                Aucun budget défini
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                Définissez un budget mensuel pour mieux gérer vos dépenses
              </p>
              <Button
                onClick={openDialog}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-xs sm:text-sm"
              >
                <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Définir mon budget
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour modifier/créer le budget */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {budget ? 'Modifier le budget' : 'Définir un budget'}
            </DialogTitle>
            <DialogDescription>
              Budget pour {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="budget-amount">Montant du budget (FCFA)</Label>
              <Input
                id="budget-amount"
                type="number"
                placeholder="100000"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                disabled={isLoading}
                min="0"
                step="1000"
              />
              <p className="text-xs text-gray-500">
                Dépenses actuelles du mois : {formatCurrency(currentMonthExpenses)}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSaveBudget}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
