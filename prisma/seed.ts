import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed de la base de données...');

  // Récupérer tous les utilisateurs sans catégories
  const users = await prisma.user.findMany({
    include: {
      categories: true,
    },
  });

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

  for (const user of users) {
    if (user.categories.length === 0) {
      console.log(`📁 Création des catégories pour l'utilisateur ${user.email}...`);

      await prisma.category.createMany({
        data: defaultCategories.map((cat) => ({
          ...cat,
          userId: user.id,
        })),
      });

      console.log(`✅ ${defaultCategories.length} catégories créées pour ${user.email}`);
    } else {
      console.log(`ℹ️  L'utilisateur ${user.email} a déjà ${user.categories.length} catégories`);
    }
  }

  console.log('✨ Seed terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
