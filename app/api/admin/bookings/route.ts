

import { db } from "@/app/_lib/prisma";
import { NextResponse } from "next/server";
//import { db } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const barbershopId = searchParams.get("barbershopId");
  const date = searchParams.get("date");

  if (!barbershopId || !date) {
    return NextResponse.json([], { status: 400 });
  }

  const selectedDate = new Date(date);
  const start = new Date(selectedDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(selectedDate);
  end.setHours(23, 59, 59, 999);

  const bookings = await db.booking.findMany({
    where: {
      barbershopId,
      date: {
        gte: start,
        lte: end,
      },
    },
    include: {
      service: true,
      user: true,
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(bookings);
}
