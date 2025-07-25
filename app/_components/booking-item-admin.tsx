"use client";

import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Prisma } from "@prisma/client";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { cancelBooking } from "../_actions/cancel-bookin";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

interface BookingItemProps {
    booking: Prisma.BookingGetPayload<{
        include: {
            service: true;
            user: true;
        };
    }>;
}

const BookingItemAdmin = ({ booking }: BookingItemProps) => {

    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const isBookingConfirmed = isFuture(booking.date);

    const handleCancelClick = async () => {
        setIsDeleteLoading(true);

        try {
            await cancelBooking(booking.id);

            toast.success("Reserva cancelada com sucesso!");
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleteLoading(false);
        }
    };

    return (

        <Sheet>
            <SheetTrigger asChild>
                <Card className="min-w-full">
                    <CardContent className="py-0 flex px-0">
                        <div className="flex flex-col gap-1 py-5 flex-[3] pl-5">
                             <Badge variant={isBookingConfirmed ? 'default' : 'secondary'} className="w-fit" >

                                {isBookingConfirmed ? 'Confirmado' : 'Finalizado'}

                            </Badge>

                            <h3 className="text-sm" translate="no">
                                <span className="font-medium text-gray-500">Cliente:</span> {booking.user.name}
                            </h3>
                            <p className="text-sm" translate="no">
                                {booking.service.name} às {format(booking.date, "HH:mm")}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </SheetTrigger>

            <SheetContent className="px-0">
                <SheetHeader className="px-5 text-left pb-6 border-b border-solid border-secondary">
                    <SheetTitle>Informações da Reserva</SheetTitle>
                </SheetHeader>

                <div className="px-5">


                    <div className="relative h-[180px] w-full mt-6">
                        {/* <Image src="/barbershop-map.png" fill alt={booking.user.name ?? "Nome do cliente"} /> */}
                        <div className="w-full absolute bottom-4 left-0 px-5">
                            <Card>
                                <CardContent className="p-3 flex gap-2">
                                    <Avatar>
                                        <AvatarImage src={booking.user.image || undefined} />
                                    </Avatar>

                                    <div>
                                        <h2 className="font-bold" translate="no">{booking.user.name}</h2>
                                        <h3 className="text-xs overflow-hidden text-nowrap text-ellipsis">{booking.user.email}</h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <Badge variant={isBookingConfirmed ? "default" : "secondary"} className="w-fit my-3">
                        {isBookingConfirmed ? "Confirmado" : "Finalizado"}
                    </Badge>

                    <Card>
                        <CardContent className="p-3 gap-3 flex flex-col">
                            <div className="flex justify-between">
                                <h2 className="font-bold">{booking.service.name}</h2>
                                <h3 className="font-bold text-sm">
                                    {" "}
                                    {Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(Number(booking.service.price))}
                                </h3>
                            </div>


                            <>
                                <div className="flex justify-between">
                                    <h3 className="text-gray-400 text-sm">Data</h3>
                                    <h4 className="text-sm">
                                        {format(booking.date, "dd 'de' MMMM", {
                                            locale: ptBR,
                                        })}
                                    </h4>
                                </div>

                                <div className="flex justify-between">
                                    <h3 className="text-gray-400 text-sm">Horário</h3>
                                    <h4 className="text-sm">{format(booking.date, "hh:mm")}</h4>
                                </div>
                            </>


                            <div className="flex justify-between">
                                <h3 className="text-gray-400 text-sm">Usuário</h3>
                                <h4 className="text-sm">{booking.user.name}</h4>
                            </div>
                        </CardContent>
                    </Card>

                    <SheetFooter className="flex-row gap-3 mt-6">
                        <SheetClose asChild>
                            <Button className="w-full" variant="secondary">
                                Voltar
                            </Button>
                        </SheetClose>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>

                                <Button disabled={!isBookingConfirmed || isDeleteLoading} className="w-full" variant="destructive">
                                    Cancelar Reserva
                                </Button>

                            </AlertDialogTrigger>
                            <AlertDialogContent className="w-[90%]" >
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Deseja mesmo cancelar essa reserva?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Uma vez cancelada, não será possível reverter essa ação.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-row gap-3">
                                    <AlertDialogCancel className="w-full mt-0">Voltar</AlertDialogCancel>
                                    <AlertDialogAction disabled={isDeleteLoading} className="w-full" onClick={handleCancelClick}>
                                        {isDeleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Confirmar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>



                    </SheetFooter>

                </div>

            </SheetContent>

        </Sheet>

    );
}

export default BookingItemAdmin;