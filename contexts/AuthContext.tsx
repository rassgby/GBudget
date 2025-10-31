'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, Category } from '@/types';
import {
  getCurrentUser,
  setCurrentUser,
  getUsers,
  saveUser,
  findUserByEmail,
  saveCategory,
  getCategories,
  DEFAULT_CATEGORIES
} from '@/lib/storage';
import { hashPassword, generateId } from '@/lib/utils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Charger l'utilisateur depuis le localStorage au démarrage
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const existingUser = findUserByEmail(email);

    if (!existingUser) {
      return false;
    }

    const hashedPassword = hashPassword(password);
    if (existingUser.password !== hashedPassword) {
      return false;
    }

    setUser(existingUser);
    setCurrentUser(existingUser);
    return true;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Vérifier si l'email existe déjà
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return false;
    }

    // Créer un nouvel utilisateur
    const newUser: User = {
      id: generateId(),
      name,
      email,
      password: hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    saveUser(newUser);

    // Créer les catégories par défaut pour ce nouvel utilisateur
    DEFAULT_CATEGORIES.forEach(cat => {
      const category: Category = {
        id: generateId(),
        name: cat.name,
        color: cat.color,
        userId: newUser.id,
      };
      saveCategory(category);
    });

    setUser(newUser);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
