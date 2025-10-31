import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔹 Récupérer un budget par ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const budget = await prisma.budget.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!budget) {
      return NextResponse.json({ error: "Budget non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ budget });
  } catch (error) {
    console.error("Erreur lors de la récupération du budget:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🔹 Mettre à jour un budget existant
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    // Vérifier que le budget existe
    const existingBudget = await prisma.budget.findUnique({
      where: { id },
    });

    if (!existingBudget) {
      return NextResponse.json({ error: "Budget non trouvé" }, { status: 404 });
    }

    // Mise à jour
    const updatedBudget = await prisma.budget.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      message: "Budget mis à jour avec succès",
      budget: updatedBudget,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du budget:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🔹 Supprimer un budget
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const existingBudget = await prisma.budget.findUnique({
      where: { id },
    });

    if (!existingBudget) {
      return NextResponse.json({ error: "Budget non trouvé" }, { status: 404 });
    }

    await prisma.budget.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Budget supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du budget:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
