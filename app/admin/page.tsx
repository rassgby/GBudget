'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Users,
  Crown,
  Clock,
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
  Wallet,
  BarChart3,
  Edit,
  LogOut,
  X,
  Save,
  UserCog,
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
  const { user, logout } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // États pour le modal d'édition
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    subscriptionPlan: '',
    subscriptionStatus: '',
  });
  const [editLoading, setEditLoading] = useState(false);

  // Vérifier si l'utilisateur est admin
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
    if (!confirm(`⚠️ ATTENTION!\n\nVous êtes sur le point de supprimer définitivement le compte de "${userName}".\n\nToutes les données (transactions, catégories, budgets) seront perdues.\n\nCette action est IRRÉVERSIBLE.\n\nConfirmer la suppression ?`)) {
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

  // Ouvrir le modal d'édition
  const openEditModal = (userData: UserData) => {
    setEditingUser(userData);
    setEditForm({
      name: userData.name,
      email: userData.email,
      subscriptionPlan: userData.subscriptionPlan,
      subscriptionStatus: userData.subscriptionStatus,
    });
    setEditModalOpen(true);
  };

  // Sauvegarder les modifications
  const handleSaveEdit = async () => {
    if (!editingUser) return;
    
    setEditLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          subscriptionPlan: editForm.subscriptionPlan,
          subscriptionStatus: editForm.subscriptionStatus,
        }),
      });

      if (response.ok) {
        setEditModalOpen(false);
        setEditingUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setEditLoading(false);
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

  const handleLogout = async () => {
    await logout();
    router.push('/login');
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
      {/* Header Admin */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dashboard Admin</h1>
                <p className="text-purple-100 text-sm">Gestion des utilisateurs Baraaka</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-purple-100 hidden sm:block">
                {(user as any)?.email}
              </span>
              <Button 
                onClick={handleLogout}
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <Card className="border-t-4 border-t-blue-500">
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

            <Card className="border-t-4 border-t-purple-500">
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

            <Card className="border-t-4 border-t-cyan-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.premiumUsers}</p>
                    <p className="text-xs text-gray-500">Premium</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-green-500">
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

            <Card className="border-t-4 border-t-red-500">
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

            <Card className="border-t-4 border-t-yellow-500">
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
              <Button onClick={fetchUsers} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Utilisateurs ({filteredUsers.length})
            </CardTitle>
            <CardDescription>
              Gérez les comptes utilisateurs : éditer, activer/désactiver, supprimer
            </CardDescription>
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
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
                      {!u.isAdmin && (
                        <>
                          {/* Bouton Éditer */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(u)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Éditer
                          </Button>

                          {/* Envoyer rappel de paiement */}
                          {u.subscriptionStatus !== 'active' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => sendPaymentReminder(u.email, u.name)}
                              className="text-amber-600 border-amber-200 hover:bg-amber-50"
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Rappel
                            </Button>
                          )}

                          {/* Activer/Désactiver */}
                          {u.subscriptionStatus === 'active' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAction(u.id, 'disable')}
                              disabled={actionLoading === u.id}
                              className="text-orange-600 border-orange-200 hover:bg-orange-50"
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

      {/* Modal d'édition */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Modifier l&apos;utilisateur
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations du compte
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nom complet</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-plan">Plan d&apos;abonnement</Label>
              <select
                id="edit-plan"
                value={editForm.subscriptionPlan}
                onChange={(e) => setEditForm({ ...editForm, subscriptionPlan: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="legacy">Legacy (Gratuit illimité)</option>
                <option value="premium">Premium (3000 FCFA/mois)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Statut</Label>
              <select
                id="edit-status"
                value={editForm.subscriptionStatus}
                onChange={(e) => setEditForm({ ...editForm, subscriptionStatus: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="active">Actif</option>
                <option value="pending">En attente de paiement</option>
                <option value="expired">Expiré / Désactivé</option>
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              <X className="h-4 w-4 mr-1" />
              Annuler
            </Button>
            <Button onClick={handleSaveEdit} disabled={editLoading}>
              {editLoading ? (
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-1" />
              )}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
