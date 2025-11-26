'use client';

import { useState } from 'react';
import { FileDown, FileText, FileSpreadsheet } from 'lucide-react';
import { Transaction, Category } from '@/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from './ui/dialog';
import {
  ExportFilters,
  filterTransactions,
  exportToPDF,
  exportToExcel,
  generateFileName
} from '@/lib/export';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactions: Transaction[];
  categories: Category[];
}

export function ExportDialog({
  open,
  onOpenChange,
  transactions,
  categories
}: ExportDialogProps) {
  const [filters, setFilters] = useState<ExportFilters>({
    type: 'all'
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Filtrer les transactions en temps réel
  const filteredTransactions = filterTransactions(
    transactions,
    { ...filters, categoryIds: selectedCategories }
  );

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    const exportFilters: ExportFilters = {
      ...filters,
      categoryIds: selectedCategories
    };

    if (format === 'pdf') {
      exportToPDF(
        filteredTransactions,
        categories,
        exportFilters,
        generateFileName('transactions', 'pdf')
      );
    } else {
      exportToExcel(
        filteredTransactions,
        categories,
        exportFilters,
        generateFileName('transactions', 'xlsx')
      );
    }

    onOpenChange(false);
  };

  const resetFilters = () => {
    setFilters({ type: 'all' });
    setSelectedCategories([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader onClose={() => onOpenChange(false)}>
          <div>
            <DialogTitle>Exporter les transactions</DialogTitle>
            <DialogDescription>
              Sélectionnez les filtres et le format d'export souhaité
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filtres de date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate || ''}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value || undefined })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate || ''}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value || undefined })
                }
              />
            </div>
          </div>

          {/* Filtre de type */}
          <div className="space-y-2">
            <Label>Type de transaction</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={filters.type === 'all' ? 'default' : 'outline'}
                onClick={() => setFilters({ ...filters, type: 'all' })}
                className="flex-1"
              >
                Tous
              </Button>
              <Button
                type="button"
                variant={filters.type === 'income' ? 'default' : 'outline'}
                onClick={() => setFilters({ ...filters, type: 'income' })}
                className="flex-1"
              >
                Revenus
              </Button>
              <Button
                type="button"
                variant={filters.type === 'expense' ? 'default' : 'outline'}
                onClick={() => setFilters({ ...filters, type: 'expense' })}
                className="flex-1"
              >
                Dépenses
              </Button>
            </div>
          </div>

          {/* Filtre de catégories */}
          <div className="space-y-2">
            <Label>Catégories</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Filtres de montant */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minAmount">Montant minimum (FCFA)</Label>
              <Input
                id="minAmount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={filters.minAmount || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minAmount: e.target.value ? parseFloat(e.target.value) : undefined
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAmount">Montant maximum (FCFA)</Label>
              <Input
                id="maxAmount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={filters.maxAmount || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxAmount: e.target.value ? parseFloat(e.target.value) : undefined
                  })
                }
              />
            </div>
          </div>

          {/* Aperçu */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">{filteredTransactions.length}</span>{' '}
              transaction{filteredTransactions.length > 1 ? 's' : ''} sera
              {filteredTransactions.length > 1 ? 'ont' : ''} exportée
              {filteredTransactions.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={resetFilters}>
            Réinitialiser
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            disabled={filteredTransactions.length === 0}
          >
            <FileText className="w-4 h-4 mr-2" />
            Exporter en PDF
          </Button>
          <Button
            onClick={() => handleExport('excel')}
            disabled={filteredTransactions.length === 0}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Exporter en Excel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Composant bouton pour déclencher l'export
interface ExportButtonProps {
  transactions: Transaction[];
  categories: Category[];
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function ExportButton({
  transactions,
  categories,
  variant = 'outline',
  size = 'default',
  className
}: ExportButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className={className}
      >
        <FileDown className="w-4 h-4 mr-2" />
        Exporter
      </Button>

      <ExportDialog
        open={open}
        onOpenChange={setOpen}
        transactions={transactions}
        categories={categories}
      />
    </>
  );
}
