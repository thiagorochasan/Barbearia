"use client";

import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetTitle, SheetFooter } from "@/app/_components/ui/sheet";
import { Barbershop, Booking, Service } from "@prisma/client";
import { ptBR } from "date-fns/locale/pt-BR";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { generateDayTimeList } from "../_helpers/hours";
import { addDays, format, setHours, setMinutes } from "date-fns";
import { saveBooking } from "../_actions/save-booking";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getDayBookings } from "../_actions/get-day-bookings";
import BookingInfo from "@/app/_components/booking-info";
import { hasBookingAtTime } from "../_actions/has-booking-at-time";



interface ServiceItemProps {
  barbershop: Barbershop;
  service: Service;
  isAuthenticated: boolean;
}

const ServiceItem = ({ service, barbershop, isAuthenticated }: ServiceItemProps) => {

  const router = useRouter();
  const { data } = useSession();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hour, setHour] = useState<string | undefined>();
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);

  const isBarbershopDisabled = barbershop.id !== "dcc7b810-f9b8-42cc-a343-da0634343b8b";

  useEffect(() => {
    if (sheetIsOpen && date) {
      const refreshAvailableHours = async () => {
        const _dayBookings = await getDayBookings(barbershop.id, date);
        setDayBookings(_dayBookings);
      };

      refreshAvailableHours();

    }
  }, [sheetIsOpen, date, barbershop.id]);


  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined);
  }
  const handleHourClick = (time: string) => {
    setHour(time);
  };
  const handleBookingClick = () => {
    if (!isAuthenticated) {
      return signIn("google");
    }
  };

  const handleBookingSubmit = async () => {
    setSubmitIsLoading(true);
    try {
      if (!hour || !date || !data?.user) {
        return;
      }

      const dateHour = Number(hour.split(":")[0]);
      const dateMinutes = Number(hour.split(":")[1]);

      const newDate = setMinutes(setHours(date, dateHour), dateMinutes);

      // Verifica se já existe agendamento no mesmo horário
      const alreadyBooked = await hasBookingAtTime(barbershop.id, newDate);
      if (alreadyBooked) {

        const _dayBookings = await getDayBookings(barbershop.id, date);
        setDayBookings(_dayBookings);

        toast.error("Esse horário já foi reservado por outro cliente.");
        return;
      }


      await saveBooking({
        serviceId: service.id,
        barbershopId: barbershop.id,
        date: newDate,
        userId: (data.user as any).id,

      })

      // Atualiza os horários disponíveis com a nova reserva feita
      const _dayBookings = await getDayBookings(barbershop.id, newDate);
      setDayBookings(_dayBookings);

      setSheetIsOpen(false);
      setHour(undefined);
      
      toast.success("Reserva realizada com sucesso!", {
        description: format(newDate, "'Para' dd 'de' MMMM 'às' HH':'mm'.'", {
          locale: ptBR,
        }),
        action: {
          label: "Visualizar",
          onClick: () => router.push('/bookings'),
        },
      })

      console.log();

    } catch (error) {
      console.error(error);
    } finally {
      setSubmitIsLoading(false);
    }

  }

  const timeList = useMemo(() => {
    if (!date) {
      return [];
    }

    return generateDayTimeList(date).filter((time) => {
      const timeHour = Number(time.split(":")[0]);
      const timeMinutes = Number(time.split(":")[1]);

      const booking = dayBookings.find((booking) => {
        const bookingHour = booking.date.getHours();
        const bookingMinutes = booking.date.getMinutes();

        return bookingHour === timeHour && bookingMinutes === timeMinutes;
      });

      if (!booking) {
        return true;
      }

      return false;
    });
  }, [date, dayBookings]);


  return (

    <Card>
      <CardContent className="p-3 w-full">
        <div className="flex gap-4 items-center w-full">
          <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
            <Image
              className="rounded-lg"
              src={service.imageUrl}
              fill
              style={{ objectFit: "contain" }}
              alt={service.name}
            />
          </div>

          <div className="flex flex-col w-full">
            <h2 className="font-bold">{service.name}</h2>
            <p className="text-sm text-gray-400">{service.description}</p>

            <div className="flex items-center justify-between mt-3">
              <p className="text-primary text-sm font-bold">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>

              <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="secondary" onClick={handleBookingClick} disabled={isBarbershopDisabled}>
                    Reservar
                  </Button>
                </SheetTrigger>

                <SheetContent className="p-0 flex flex-col max-h-[90vh]">
                  <SheetHeader className="text-left px-5 py-6 border-b border-solid border-secondary">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="py-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateClick}
                      className="rounded-md border"
                      locale={ptBR}
                      disabled={{ before: new Date() }}
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: {
                          width: "100%",
                        },
                        button: {
                          width: "100%",
                        },
                        nav_button_previous: {
                          width: "32px",
                          height: "32px",
                        },
                        nav_button_next: {
                          width: "32px",
                          height: "32px",
                        },
                        caption: {
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </div>
                  {/* Mostrar lista de horários apenas se alguma data estiver selecionada */}

                  {date && (
                    <div className="flex gap-2 overflow-x-auto py-3 px-4 border-t border-solid border-secondary [&::-webkit-scrollbar]:hidden">
                      {timeList.map((time) => (
                        <Button
                          onClick={() => handleHourClick(time)}
                          variant={hour === time ? "default" : "outline"}
                          className="rounded-full"
                          key={time}
                        >
                          {time}
                        </Button>
                      ))}

                    </div>
                  )}

                  <div className="py-1 px-5 border-t border-solid border-secondary overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    <BookingInfo
                      booking={{
                        barbershop: barbershop,
                        date:
                          date && hour
                            ? setMinutes(setHours(date, Number(hour.split(":")[0])), Number(hour.split(":")[1]))
                            : undefined,
                        service: service,
                      }}
                    />
                  </div>

                  <SheetFooter className="px-5 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    <Button onClick={handleBookingSubmit} disabled={!hour || !date || submitIsLoading}>
                      {submitIsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Confirmar reserva
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

  );
}

export default ServiceItem;