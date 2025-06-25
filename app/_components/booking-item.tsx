"use client";

import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

const BookingItem = () => {
    return (  
        <Card className="min-w-full">

            <CardContent className="py-0 flex px-0">
                <div className="flex flex-col gap-2 py-5 flex-[3] pl-5">
                    <Badge className="bg-[#221C30] text-primary hover:bg-[#221C30] w-fit" >Confirmado</Badge>

                    <h2 className="font-bold">Corte de cabelo</h2>

                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src="https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png" />
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>

                        <h3 className="text-sm">Vintage Barber</h3>

                        <div className="flex flex-col items-center justify-center flex-1 border-l border-solid border-secondary">
                            <p className="text-sm capitalize">Fevereiro</p>
                            <p className="text-2xl">06</p>
                            <p className="text-sm">09:45</p>
                        </div>

                    </div>
                </div>
            </CardContent>


        </Card>

    );
}
 
export default BookingItem;