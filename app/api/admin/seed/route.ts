import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Cette API crée le compte admin par défaut
// À appeler une seule fois lors du déploiement initial
// GET /api/admin/seed?secret=VOTRE_SECRET

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'Korka@Rassoul@2025';
const ADMIN_NAME = 'Administrateur';

export async function GET(request: NextRequest) {
  try {
    // Vérifier le secret pour éviter les appels non autorisés
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    // En production, utilisez une variable d'environnement
    const expectedSecret = process.env.ADMIN_SEED_SECRET || 'baraaka-admin-setup-2025';
    
    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Secret invalide' },
        { status: 403 }
      );
    }

    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (existingAdmin) {
      // Mettre à jour pour s'assurer qu'il est admin
      if (!existingAdmin.isAdmin) {
        await prisma.user.update({
          where: { email: ADMIN_EMAIL },
          data: { isAdmin: true },
        });
        return NextResponse.json({
          message: 'Compte admin existant mis à jour avec droits admin',
          email: ADMIN_EMAIL,
        });
      }
      return NextResponse.json({
        message: 'Le compte admin existe déjà',
        email: ADMIN_EMAIL,
      });
    }

    // Créer le compte admin
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    
    const admin = await prisma.user.create({
      data: {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        subscriptionPlan: 'legacy', // Admin a accès legacy (illimité)
        subscriptionStatus: 'active',
        isAdmin: true,
      },
    });

    // Créer les catégories par défaut pour l'admin
    const defaultCategories = [
      { name: 'Alimentation', color: '#10b981' },
      { name: 'Transport', color: '#3b82f6' },
      { name: 'Loisirs', color: '#8b5cf6' },
      { name: 'Santé', color: '#ef4444' },
      { name: 'Logement', color: '#f97316' },
      { name: 'Shopping', color: '#ec4899' },
      { name: 'Éducation', color: '#14b8a6' },
      { name: 'Autres', color: '#6b7280' },
      { name: 'Salaire', color: '#10b981' },
    ];

    await prisma.category.createMany({
      data: defaultCategories.map((cat) => ({
        ...cat,
        userId: admin.id,
      })),
    });

    return NextResponse.json({
      message: 'Compte admin créé avec succès',
      email: ADMIN_EMAIL,
      note: 'Vous pouvez maintenant vous connecter avec les identifiants admin',
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création du compte admin:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte admin' },
      { status: 500 }
    );
  }
}
