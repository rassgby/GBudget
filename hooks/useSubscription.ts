'use client';

import { useAuth } from '@/contexts/AuthContext';
import { PLAN_LIMITS, SubscriptionPlan } from '@/types';

export function useSubscription() {
  const { user } = useAuth();

  const plan = (user?.subscriptionPlan || 'legacy') as SubscriptionPlan;
  const status = user?.subscriptionStatus || 'active';
  const limits = PLAN_LIMITS[plan];

  const isActive = status === 'active' || plan === 'legacy';
  const isPending = status === 'pending';
  const isExpired = status === 'expired';

  const canExportPDF = isActive && limits.exportPDF;
  const canExportExcel = isActive && limits.exportExcel;
  const canUseMultiAccounts = isActive && limits.multiAccounts;
  const hasApiAccess = isActive && limits.apiAccess;
  const hasPrioritySupport = isActive && limits.prioritySupport;

  const getTransactionLimit = () => {
    if (!isActive) return 0;
    return limits.transactions;
  };

  const getCategoryLimit = () => {
    if (!isActive) return 0;
    return limits.categories;
  };

  const getBudgetLimit = () => {
    if (!isActive) return 0;
    return limits.budgets;
  };

  const canAddTransaction = (currentCount: number) => {
    const limit = getTransactionLimit();
    return limit === Infinity || currentCount < limit;
  };

  const canAddCategory = (currentCount: number) => {
    const limit = getCategoryLimit();
    return limit === Infinity || currentCount < limit;
  };

  const canAddBudget = (currentCount: number) => {
    const limit = getBudgetLimit();
    return limit === Infinity || currentCount < limit;
  };

  const getDaysRemaining = () => {
    if (!user?.subscriptionEnd) return null;
    const end = new Date(user.subscriptionEnd);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return {
    plan,
    planName: limits.name,
    status,
    isActive,
    isPending,
    isExpired,
    limits,
    canExportPDF,
    canExportExcel,
    canUseMultiAccounts,
    hasApiAccess,
    hasPrioritySupport,
    getTransactionLimit,
    getCategoryLimit,
    getBudgetLimit,
    canAddTransaction,
    canAddCategory,
    canAddBudget,
    getDaysRemaining,
  };
}
