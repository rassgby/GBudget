import { User, Category, Transaction } from '@/types';

// Clés de stockage
const STORAGE_KEYS = {
  USERS: 'budget_users',
  CURRENT_USER: 'budget_current_user',
  CATEGORIES: 'budget_categories',
  TRANSACTIONS: 'budget_transactions',
};

// Catégories par défaut
export const DEFAULT_CATEGORIES = [
  { name: 'Alimentation', color: '#10b981' },
  { name: 'Transport', color: '#3b82f6' },
  { name: 'Loisirs', color: '#8b5cf6' },
  { name: 'Santé', color: '#ef4444' },
  { name: 'Logement', color: '#f59e0b' },
  { name: 'Shopping', color: '#ec4899' },
  { name: 'Éducation', color: '#14b8a6' },
  { name: 'Autres', color: '#6b7280' },
  { name: 'Salaire', color: '#22c55e' },
];

// Users
export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const findUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.email === email);
};

// Current User
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Categories
export const getCategories = (userId: string): Category[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  const categories: Category[] = data ? JSON.parse(data) : [];
  return categories.filter(c => c.userId === userId);
};

export const saveCategory = (category: Category): void => {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  const categories: Category[] = data ? JSON.parse(data) : [];
  categories.push(category);
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

export const updateCategory = (category: Category): void => {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  const categories: Category[] = data ? JSON.parse(data) : [];
  const index = categories.findIndex(c => c.id === category.id);
  if (index !== -1) {
    categories[index] = category;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }
};

export const deleteCategory = (categoryId: string): void => {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  const categories: Category[] = data ? JSON.parse(data) : [];
  const filtered = categories.filter(c => c.id !== categoryId);
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
};

// Transactions
export const getTransactions = (userId: string): Transaction[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  const transactions: Transaction[] = data ? JSON.parse(data) : [];
  return transactions.filter(t => t.userId === userId);
};

export const saveTransaction = (transaction: Transaction): void => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  const transactions: Transaction[] = data ? JSON.parse(data) : [];
  transactions.push(transaction);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const updateTransaction = (transaction: Transaction): void => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  const transactions: Transaction[] = data ? JSON.parse(data) : [];
  const index = transactions.findIndex(t => t.id === transaction.id);
  if (index !== -1) {
    transactions[index] = transaction;
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }
};

export const deleteTransaction = (transactionId: string): void => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  const transactions: Transaction[] = data ? JSON.parse(data) : [];
  const filtered = transactions.filter(t => t.id !== transactionId);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filtered));
};
