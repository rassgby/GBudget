import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 🔹 GET — Récupérer un budget par ID
 */
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    const budget = await prisma.budget.findUnique({
      where: { id },
    });

    if (!budget) {
      return NextResponse.json({ error: "Budget non trouvé" }, { status: 404 });
    }

    return NextResponse.json(budget);
  } catch (error) {
    console.error("Erreur GET budget:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du budget" },
      { status: 500 }
    );
  }
}

/**
 * 🔹 PATCH — Mettre à jour un budget
 */
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const data = await req.json();

    const updatedBudget = await prisma.budget.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedBudget);
  } catch (error) {
    console.error("Erreur PATCH budget:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du budget" },
      { status: 500 }
    );
  }
}

/**
 * 🔹 DELETE — Supprimer un budget
 */
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    await prisma.budget.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Budget supprimé avec succès" });
  } catch (error) {
    console.error("Erreur DELETE budget:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du budget" },
      { status: 500 }
    );
  }
}
