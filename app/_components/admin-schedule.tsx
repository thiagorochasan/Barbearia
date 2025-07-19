
"use client";

import { useEffect, useState } from "react";
import { format, startOfDay, endOfDay } from "date-fns";
import { Calendar } from "./ui/calendar";
import { ptBR } from "date-fns/locale/pt-BR";
import WeekSelector from "./week-selector";
import BookingItemAdmin from "./booking-item-admin";
import { getDayBookings } from "../barbershops/[id]/_actions/get-day-bookings";
//import { Booking } from "@prisma/client";
import { Prisma } from "@prisma/client";

type Booking = Prisma.BookingGetPayload<{
  include: {
    user: true
    service: true
  }
}>

export default function AdminSchedule({ barbershopId }: { barbershopId: string }) {

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    //const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [dayBookings, setDayBookings] = useState<Booking[]>([]);
    //const [dayBookings, setDayBookings] = useState<Prisma.BookingGetPayload<{ include: { user: true; service: true }>>[]>([]);


    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);

            //const res = await fetch(`/api/admin/bookings?barbershopId=${barbershopId}&date=${selectedDate.toISOString()}`);

            const _dayBookings = await getDayBookings(barbershopId, selectedDate);
            setDayBookings(_dayBookings);

            //const data = await res.json();
            //setBookings(data);
            setLoading(false);
        };

        fetchBookings();
    }, [selectedDate, barbershopId]);

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">Agendamentos</h1>

            <WeekSelector selectedDate={selectedDate} onSelect={setSelectedDate} />

            <p className="text-sm mt-4">
                {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </p>

            {loading ? (
                <p className="mt-4">Carregando...</p>
            ) : dayBookings.length === 0 ? (
                <p className="mt-4">Nenhum agendamento encontrado.</p>
            ) : (
                <ul className="space-y-4 mt-4">
                    {dayBookings.map((booking) => (
                        <BookingItemAdmin key={booking.id} booking={booking} />
                    ))}
                </ul>
            )}
        </div>
    );
}
