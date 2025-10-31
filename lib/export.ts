import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Transaction, Category } from '@/types';
import { formatCurrency, formatDate } from './utils';

export interface ExportFilters {
  startDate?: string;
  endDate?: string;
  categoryIds?: string[];
  type?: 'income' | 'expense' | 'all';
  minAmount?: number;
  maxAmount?: number;
}

/**
 * Filtre les transactions selon les critères spécifiés
 */
export function filterTransactions(
  transactions: Transaction[],
  filters: ExportFilters
): Transaction[] {
  return transactions.filter((transaction) => {
    // Filtre par date de début
    if (filters.startDate && transaction.date < filters.startDate) {
      return false;
    }

    // Filtre par date de fin
    if (filters.endDate && transaction.date > filters.endDate) {
      return false;
    }

    // Filtre par type
    if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }

    // Filtre par catégories
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      if (!transaction.categoryId || !filters.categoryIds.includes(transaction.categoryId)) {
        return false;
      }
    }

    // Filtre par montant minimum
    if (filters.minAmount !== undefined && transaction.amount < filters.minAmount) {
      return false;
    }

    // Filtre par montant maximum
    if (filters.maxAmount !== undefined && transaction.amount > filters.maxAmount) {
      return false;
    }

    return true;
  });
}

/**
 * Exporte les transactions en PDF
 */
export function exportToPDF(
  transactions: Transaction[],
  categories: Category[],
  filters: ExportFilters,
  fileName: string = 'transactions.pdf'
): void {
  const doc = new jsPDF();

  // En-tête du document
  doc.setFontSize(20);
  doc.text('Baraaka - Export des Transactions', 14, 22);

  // Informations sur les filtres
  doc.setFontSize(10);
  let yPos = 32;

  if (filters.startDate || filters.endDate) {
    const dateRange = `Période: ${filters.startDate ? formatDate(filters.startDate) : 'Début'} - ${filters.endDate ? formatDate(filters.endDate) : 'Fin'}`;
    doc.text(dateRange, 14, yPos);
    yPos += 6;
  }

  if (filters.type && filters.type !== 'all') {
    doc.text(`Type: ${filters.type === 'income' ? 'Revenus' : 'Dépenses'}`, 14, yPos);
    yPos += 6;
  }

  if (filters.categoryIds && filters.categoryIds.length > 0) {
    const selectedCategories = categories
      .filter(cat => filters.categoryIds!.includes(cat.id))
      .map(cat => cat.name)
      .join(', ');
    doc.text(`Catégories: ${selectedCategories}`, 14, yPos);
    yPos += 6;
  }

  doc.text(`Date d'export: ${formatDate(new Date().toISOString())}`, 14, yPos);
  yPos += 10;

  // Statistiques
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Résumé:', 14, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 6;
  doc.text(`Total Revenus: ${formatCurrency(totalIncome)}`, 14, yPos);
  yPos += 6;
  doc.text(`Total Dépenses: ${formatCurrency(totalExpenses)}`, 14, yPos);
  yPos += 6;
  doc.text(`Solde: ${formatCurrency(balance)}`, 14, yPos);
  yPos += 10;

  // Création du tableau des transactions
  const tableData = transactions.map(transaction => {
    const category = categories.find(cat => cat.id === transaction.categoryId);
    return [
      formatDate(transaction.date),
      transaction.type === 'income' ? 'Revenu' : 'Dépense',
      category?.name || 'N/A',
      transaction.description,
      formatCurrency(transaction.amount)
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Type', 'Catégorie', 'Description', 'Montant']],
    body: tableData,
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [59, 130, 246], // Bleu
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 25 },
      2: { cellWidth: 30 },
      3: { cellWidth: 60 },
      4: { cellWidth: 30, halign: 'right' }
    }
  });

  // Ajouter le nombre de transactions
  const finalY = (doc as any).lastAutoTable.finalY || yPos;
  doc.setFontSize(10);
  doc.text(`Total: ${transactions.length} transaction${transactions.length > 1 ? 's' : ''}`, 14, finalY + 10);

  // Télécharger le PDF
  doc.save(fileName);
}

/**
 * Exporte les transactions en Excel
 */
export function exportToExcel(
  transactions: Transaction[],
  categories: Category[],
  filters: ExportFilters,
  fileName: string = 'transactions.xlsx'
): void {
  // Créer un nouveau classeur
  const workbook = XLSX.utils.book_new();

  // Préparer les données des transactions
  const transactionsData = transactions.map(transaction => {
    const category = categories.find(cat => cat.id === transaction.categoryId);
    return {
      Date: formatDate(transaction.date),
      Type: transaction.type === 'income' ? 'Revenu' : 'Dépense',
      Catégorie: category?.name || 'N/A',
      Description: transaction.description,
      Montant: transaction.amount
    };
  });

  // Calculer les statistiques
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Créer la feuille des transactions
  const worksheet = XLSX.utils.json_to_sheet(transactionsData);

  // Ajouter les statistiques en bas
  const statsStartRow = transactionsData.length + 3;
  XLSX.utils.sheet_add_aoa(worksheet, [
    ['RÉSUMÉ'],
    ['Total Revenus', totalIncome],
    ['Total Dépenses', totalExpenses],
    ['Solde', balance],
    [''],
    ['Nombre de transactions', transactions.length]
  ], { origin: { r: statsStartRow, c: 0 } });

  // Ajouter les informations de filtrage
  const filterInfo: any[][] = [['FILTRES APPLIQUÉS']];

  if (filters.startDate || filters.endDate) {
    filterInfo.push(['Période', `${filters.startDate || 'Début'} - ${filters.endDate || 'Fin'}`]);
  }

  if (filters.type && filters.type !== 'all') {
    filterInfo.push(['Type', filters.type === 'income' ? 'Revenus' : 'Dépenses']);
  }

  if (filters.categoryIds && filters.categoryIds.length > 0) {
    const selectedCategories = categories
      .filter(cat => filters.categoryIds!.includes(cat.id))
      .map(cat => cat.name)
      .join(', ');
    filterInfo.push(['Catégories', selectedCategories]);
  }

  if (filters.minAmount !== undefined) {
    filterInfo.push(['Montant minimum', filters.minAmount]);
  }

  if (filters.maxAmount !== undefined) {
    filterInfo.push(['Montant maximum', filters.maxAmount]);
  }

  filterInfo.push(['Date d\'export', new Date().toLocaleDateString('fr-FR')]);

  // Créer une feuille pour les filtres
  const filtersWorksheet = XLSX.utils.aoa_to_sheet(filterInfo);

  // Ajouter les feuilles au classeur
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  XLSX.utils.book_append_sheet(workbook, filtersWorksheet, 'Filtres');

  // Créer une feuille avec le résumé par catégorie
  const categoryStats = categories.map(category => {
    const categoryTransactions = transactions.filter(
      t => t.categoryId === category.id
    );
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    const count = categoryTransactions.length;

    return {
      Catégorie: category.name,
      'Nombre de transactions': count,
      'Montant total': total,
      'Montant moyen': count > 0 ? total / count : 0
    };
  }).filter(stat => stat['Nombre de transactions'] > 0);

  if (categoryStats.length > 0) {
    const categoryWorksheet = XLSX.utils.json_to_sheet(categoryStats);
    XLSX.utils.book_append_sheet(workbook, categoryWorksheet, 'Par Catégorie');
  }

  // Télécharger le fichier Excel
  XLSX.writeFile(workbook, fileName);
}

/**
 * Génère un nom de fichier avec la date actuelle
 */
export function generateFileName(prefix: string, extension: string): string {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0];
  return `${prefix}_${dateStr}.${extension}`;
}
