"use server";

import { db } from "@/app/_lib/prisma";

export const hasBookingAtTime = async (barbershopId: string, date: Date) => {

  const booking = await db.booking.findFirst({

    where: {
      barbershopId: barbershopId,
      date: date
    },

  });

  return !!booking;
};
