'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Users,
  Crown,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Shield,
  Ban,
  Play,
  Calendar,
  Mail,
  Trash2,
  ChevronLeft,
  Wallet,
  BarChart3,
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  isAdmin: boolean;
  _count: {
    transactions: number;
    categories: number;
    budgets: number;
  };
}

interface Stats {
  totalUsers: number;
  legacyUsers: number;
  premiumUsers: number;
  activeUsers: number;
  expiredUsers: number;
  pendingUsers: number;
}

const PAYMENT_LINK = 'https://pay.wave.com/m/M_sn_6OgqgsYN6-_n/c/sn/?amount=3000';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user && !(user as any).isAdmin) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setStats(data.stats);
      } else if (response.status === 403) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (userId: string, action: string) => {
    setActionLoading(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le compte de ${userName} ? Cette action est irréversible.`)) {
      return;
    }

    setActionLoading(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const sendPaymentReminder = (email: string, name: string) => {
    const subject = encodeURIComponent('Rappel de paiement - Baraaka');
    const body = encodeURIComponent(
      `Bonjour ${name},\n\n` +
      `Nous vous rappelons que votre abonnement Baraaka nécessite un renouvellement.\n\n` +
      `Montant: 3 000 FCFA/mois\n` +
      `Lien de paiement Wave: ${PAYMENT_LINK}\n\n` +
      `Cordialement,\n` +
      `L'équipe Baraaka`
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || u.subscriptionPlan === filterPlan;
    const matchesStatus = filterStatus === 'all' || u.subscriptionStatus === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'legacy':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Legacy</span>;
      case 'premium':
        return <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full text-xs font-medium">Premium</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{plan}</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Actif</span>;
      case 'expired':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1"><XCircle className="h-3 w-3" /> Expiré</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1"><Clock className="h-3 w-3" /> En attente</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Retour
              </Button>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-xs text-gray-500">Gestion des utilisateurs</p>
                </div>
              </div>
            </div>
            <Button onClick={fetchUsers} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Crown className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.legacyUsers}</p>
                    <p className="text-xs text-gray-500">Legacy</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.premiumUsers}</p>
                    <p className="text-xs text-gray-500">Premium</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.activeUsers}</p>
                    <p className="text-xs text-gray-500">Actifs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.expiredUsers}</p>
                    <p className="text-xs text-gray-500">Expirés</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pendingUsers}</p>
                    <p className="text-xs text-gray-500">En attente</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white"
              >
                <option value="all">Tous les plans</option>
                <option value="legacy">Legacy</option>
                <option value="premium">Premium</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="expired">Expiré</option>
                <option value="pending">En attente</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Utilisateurs ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className={`p-4 border rounded-xl transition-all hover:shadow-md ${
                    u.isAdmin ? 'bg-purple-50 border-purple-200' : 'bg-white'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{u.name}</h3>
                        {u.isAdmin && (
                          <span className="px-2 py-0.5 bg-purple-600 text-white rounded-full text-xs font-medium flex items-center gap-1">
                            <Shield className="h-3 w-3" /> Admin
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{u.email}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {getPlanBadge(u.subscriptionPlan)}
                        {getStatusBadge(u.subscriptionStatus)}
                        <span className="text-xs text-gray-400">
                          Inscrit le {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          {u._count.transactions} transactions
                        </span>
                        <span>{u._count.categories} catégories</span>
                        <span>{u._count.budgets} budgets</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Envoyer rappel de paiement */}
                      {u.subscriptionPlan !== 'legacy' && u.subscriptionStatus !== 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendPaymentReminder(u.email, u.name)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Rappel
                        </Button>
                      )}

                      {/* Activer/Désactiver */}
                      {!u.isAdmin && (
                        <>
                          {u.subscriptionStatus === 'active' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAction(u.id, 'disable')}
                              disabled={actionLoading === u.id}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              Désactiver
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAction(u.id, 'enable')}
                              disabled={actionLoading === u.id}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Activer
                            </Button>
                          )}

                          {/* Prolonger abonnement */}
                          {u.subscriptionPlan === 'premium' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAction(u.id, 'extend')}
                              disabled={actionLoading === u.id}
                              className="text-purple-600 border-purple-200 hover:bg-purple-50"
                            >
                              <Calendar className="h-4 w-4 mr-1" />
                              +1 mois
                            </Button>
                          )}

                          {/* Supprimer */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(u.id, u.name)}
                            disabled={actionLoading === u.id}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun utilisateur trouvé</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
