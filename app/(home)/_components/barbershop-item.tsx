"use client";

import { Card, CardContent } from "@/app/_components/ui/card";
import { Barbershop } from '@prisma/client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import { Loader2, StarIcon } from "lucide-react";
import { useState } from "react";

interface BarberShopItemProps {
  barbershop: Barbershop;
}

const BarberShopItem = ({ barbershop }: BarberShopItemProps) => {

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleBookingClick = () => {
    setIsLoading(true);

    router.push(`/barbershops/${barbershop.id}`);

  };

  return (
    <Card className="min-w-[167px] max-w-[167px] rounded-2xl">
      <CardContent className="px-1 py-0 pt-1">
        <div className="px-1 w-full h-[159px] relative">
          <div className="absolute top-2 left-2 z-50">
            <Badge variant="secondary" className="opacity-90 flex gap-1 items-center top-3 left-3">
              <StarIcon size={12} className="fill-primary text-primary" />
              <span className="text-xs">5,0</span>
            </Badge>
          </div>
          <Image
            alt={barbershop.name}
            src={barbershop.imageUrl}
            style={{
              objectFit: "cover",
            }}
            fill
            className="rounded-2xl"
          />
        </div>

        <div className="px-2 pb-3">
          <h2 className="font-bold mt-2 overflow-hidden text-ellipsis text-nowrap">{barbershop.name}</h2>
          <p className="text-sm text-gray-400 overflow-hidden text-ellipsis text-nowrap">{barbershop.address}</p>
          <Button disabled={isLoading} className="w-full mt-3" variant="secondary" onClick={handleBookingClick}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reservar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default BarberShopItem;