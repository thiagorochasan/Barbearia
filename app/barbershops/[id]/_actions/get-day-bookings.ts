"use server";

import { db } from "@/app/_lib/prisma";
import { endOfDay, startOfDay } from "date-fns";

export const getDayBookings = async (barbershopId: string, date: Date) => {


  const bookings = await db.booking.findMany({
    where: {
      barbershopId: barbershopId,
      date: {
        lte: endOfDay(date),
        gte: startOfDay(date),
      },
    },
    include: {
      user: true,
      service: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  return bookings;
};
