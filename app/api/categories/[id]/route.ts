import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// PUT - Mettre à jour une catégorie
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, color } = body;

    if (!name || !color) {
      return NextResponse.json(
        { error: 'Nom et couleur requis' },
        { status: 400 }
      );
    }

    // Vérifier que la catégorie appartient à l'utilisateur
    const category = await prisma.category.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, color },
    });

    return NextResponse.json(
      {
        message: 'Catégorie mise à jour avec succès',
        category: updatedCategory,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une catégorie
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier que la catégorie appartient à l'utilisateur
    const category = await prisma.category.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer la catégorie
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Catégorie supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}