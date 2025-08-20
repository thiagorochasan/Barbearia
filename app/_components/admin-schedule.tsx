
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import WeekSelector from "./week-selector";
import BookingItemAdmin from "./booking-item-admin";
import { getDayBookings } from "../barbershops/[id]/_actions/get-day-bookings";
import { Prisma } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { CalendarClock, CalendarPlus, PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";



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
    const router = useRouter();

    // const hours = Array.from({ length: 14 }, (_, i) => 8 + i) // 08h às 21h

    const handleBookingClick = () => {

        router.push(`/barbershops/${barbershopId}`);
    };

    const hours = Array.from({ length: 28 }, (_, i) => 8 + i * 0.5);

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

            <div className="flex items-center justify-between mt-4 p-b-10">
                <p className="text-sm mt-4">
                    {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </p>


                <DropdownMenu>
                    <DropdownMenuTrigger asChild>

                        <Button size="sm" className="rounded-full shadow-md text-white p-2" variant={"aqua"}>
                            <PlusIcon className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleBookingClick} >
                            <CalendarPlus className="mr-2 h-4 w-4" />
                            Agendar novo horário
                        </DropdownMenuItem >
                        <DropdownMenuItem onClick={handleBookingClick}>
                            <CalendarClock className="mr-2 h-4 w-4" />
                            Reservar horário
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>


            {loading ? (
                <p className="mt-4">Carregando...</p>
            ) : dayBookings.length === 0 ? (
                <p className="mt-4">Nenhum agendamento encontrado.</p>
            ) : (
                <div className="space-y-3">

                    {dayBookings.length > 0 && (
                        <>
                            {dayBookings.map((booking) => (
                                <BookingItemAdmin key={booking.id} booking={booking} />
                            ))}

                        </>
                    )}



                    {/* {hours.map((hour) => {
                        const wholeHour = Math.floor(hour); // ex: 8
                        const minutes = hour % 1 === 0.5 ? 30 : 0; // ex: 30 se for 8.5

                        const slot = setMinutes(setHours(selectedDate, wholeHour), minutes);


                        const booking = dayBookings.find((b) =>
                            isEqual(new Date(b.date), slot)
                        );

                        return (
                            <div key={hour} className="flex items-start space-x-4">
                                <div className="w-16 text-sm text-muted-foreground">
                                    {format(slot, "HH:mm")}
                                </div>
                                {booking ? (
                                    <BookingItemAdmin booking={booking} />
                                ) : (
                                    <Card className="min-w-full">
                                        <CardContent className="p-3 text-sm italic text-muted-foreground">
                                            Horário livre
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )
                    })} */}
                </div>
            )}

        </div>
    );
}
