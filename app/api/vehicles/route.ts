import { NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";

// GET: listar todos os veículos
export async function GET() {
  const vehicles = await db.vehicle.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(vehicles);
}

// POST: cadastrar veículo
export async function POST(req: Request) {
  try {
    const { plate, model, brand, year, color } = await req.json();

    const vehicle = await db.vehicle.create({
      data: {
        plate,
        model,
        brand,
        year: parseInt(year),
        color,
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao cadastrar veículo" }, { status: 500 });
  }
}

// PATCH: atualizar quilometragem
export async function PATCH(req: Request) {
  try {
    const { id, mileage } = await req.json();

    const vehicle = await db.vehicle.update({
      where: { id },
      data: { mileage: parseInt(mileage) },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar quilometragem" }, { status: 500 });
  }
}
