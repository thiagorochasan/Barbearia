
"use client";

import { useEffect, useState } from "react";
import { format, startOfDay, endOfDay, setMinutes, setHours, isSameHour } from "date-fns";
import { Calendar } from "./ui/calendar";
import { ptBR } from "date-fns/locale/pt-BR";
import WeekSelector from "./week-selector";
import BookingItemAdmin from "./booking-item-admin";
import { getDayBookings } from "../barbershops/[id]/_actions/get-day-bookings";
import { Prisma } from "@prisma/client";
import { Card, CardContent } from "./ui/card";

type Booking = Prisma.BookingGetPayload<{
    include: {
        user: true
        service: true
    }
}>

export default function AdminSchedule({ barbershopId }: { barbershopId: string }) {

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(true);
    const [dayBookings, setDayBookings] = useState<Booking[]>([]);

    const hours = Array.from({ length: 14 }, (_, i) => 8 + i) // 08h às 21h

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            const _dayBookings = await getDayBookings(barbershopId, selectedDate);
            setDayBookings(_dayBookings);
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
                <div className="space-y-3">
                    {hours.map((hour) => {
                        const slot = setMinutes(setHours(selectedDate, hour), 0)
                        const booking = dayBookings.find((b) =>
                            isSameHour(new Date(b.date), slot)
                        )

                        return (
                            <div key={hour} className="flex items-start space-x-4">
                                <div className="w-16 text-sm text-muted-foreground">{format(slot, "HH:mm")}</div>
                                {booking ? (
                                    <BookingItemAdmin booking={booking} />
                                ) : (
                                    <Card className="min-w-full">

                                        <CardContent className="p-3 text-sm italic text-muted-foreground">Horário livre

                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
