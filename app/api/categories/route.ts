import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all categories for a user
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId requis' },
        { status: 400 }
      );
    }

    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    );
  }
}

// POST create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color, userId } = body;

    // Validation
    if (!name || !color || !userId) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name,
        color,
        userId,
      },
    });

    return NextResponse.json(
      {
        message: 'Catégorie créée avec succès',
        category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    );
  }
}

// DELETE a category
export async function DELETE(request: NextRequest) {
  try {
    const categoryId = request.nextUrl.searchParams.get('id');
    const userId = request.nextUrl.searchParams.get('userId');

    if (!categoryId || !userId) {
      return NextResponse.json(
        { error: 'ID de catégorie et userId requis' },
        { status: 400 }
      );
    }

    // Check if category belongs to user
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    // Delete category (this will cascade delete related transactions)
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json(
      { message: 'Catégorie supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la catégorie' },
      { status: 500 }
    );
  }
}

// PUT update a category
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, color, userId } = body;

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'ID de catégorie et userId requis' },
        { status: 400 }
      );
    }

    // Check if category belongs to user
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

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(color && { color }),
      },
    });

    return NextResponse.json(
      {
        message: 'Catégorie mise à jour avec succès',
        category: updatedCategory,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la catégorie' },
      { status: 500 }
    );
  }
}
