// Hook personnalisé pour les appels API avec gestion d'erreurs

export async function fetchAPI(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Important pour les cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Une erreur est survenue');
  }

  return data;
}

// Transactions API
export const transactionsAPI = {
  getAll: () => fetchAPI('/api/transactions'),

  create: (transaction: {
    type: string;
    amount: number;
    category: string;
    categoryId?: string;
    description: string;
    date: string;
  }) => fetchAPI('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(transaction),
  }),

  update: (id: string, transaction: {
    type: string;
    amount: number;
    category: string;
    categoryId?: string;
    description: string;
    date: string;
  }) => fetchAPI(`/api/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(transaction),
  }),

  delete: (id: string) => fetchAPI(`/api/transactions/${id}`, {
    method: 'DELETE',
  }),
};

// Categories API
export const categoriesAPI = {
  getAll: () => fetchAPI('/api/categories'),

  create: (category: { name: string; color: string }) =>
    fetchAPI('/api/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    }),

  update: (id: string, category: { name: string; color: string }) =>
    fetchAPI(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    }),

  delete: (id: string) =>
    fetchAPI(`/api/categories/${id}`, {
      method: 'DELETE',
    }),
};

// Budgets API
export const budgetsAPI = {
  getAll: () => fetchAPI('/api/budgets'),

  create: (budget: {
    categoryId?: string;
    category: string;
    amount: number;
    period: string;
    startDate: string;
    endDate?: string;
    isActive?: boolean;
  }) => fetchAPI('/api/budgets', {
    method: 'POST',
    body: JSON.stringify(budget),
  }),

  update: (id: string, budget: {
    categoryId?: string;
    category?: string;
    amount?: number;
    period?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
  }) => fetchAPI(`/api/budgets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(budget),
  }),

  delete: (id: string) => fetchAPI(`/api/budgets/${id}`, {
    method: 'DELETE',
  }),
};

// Statistics API
export const statisticsAPI = {
  get: () => fetchAPI('/api/statistics'),
};
