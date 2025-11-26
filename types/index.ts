export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  category: string;
  categoryId?: string;
  description: string;
  date: string;
  createdAt: string;
  // Champs optionnels pour les transferts
  fromAccount?: string;
  toAccount?: string;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId?: string | null;
  category: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}

export interface TopCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface ExpenseByCategory {
  category: string;
  amount: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
}

export interface BudgetStatus {
  id: string;
  category: string;
  budgetAmount: number;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  period: string;
}

export interface StatisticsResponse {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    savingsRate: number;
  };
  topCategories: TopCategory[];
  expensesByCategory: ExpenseByCategory[];
  monthlyTrend: MonthlyTrend[];
  recentTransactions: Transaction[];
  budgetStatus: BudgetStatus[];
  transactionsCount: number;
}
