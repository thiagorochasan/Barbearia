import { format } from "date-fns";
import Header from "../_components/header";
import { ptBR } from "date-fns/locale/pt-BR";
import Search from "./_components/search";
import BookingItem from "../_components/booking-item";
import { db } from "../_lib/prisma";
import BarbershopItem from "./_components/barbershop-item";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import AdminHome from "../_components/admin-home";


export default async function Home() {

    const session = await getServerSession(authOptions);

    console.log("Session:", session);

    let isAdmin = false;


    if (session?.user?.email) {
        const user = await db.user.findUnique({
            where: { email: session.user.email },
        });

        isAdmin = !!user?.isAdmin;
    }

    // Se for admin, renderiza a página do admin e não continua
    if (isAdmin) {
        return (
            <div>
                <Header />
                <AdminHome />
            </div>
        );
    }

    const [barbershops, recommendedBarbershops, confirmedBookings] = await Promise.all([

        db.barbershop.findMany({}),
        db.barbershop.findMany({
            orderBy: {
                id: "asc",
            },
        }),
        session?.user
            ? db.booking.findMany({
                where: {
                    userId: (session.user as any).id,
                    date: {
                        gte: new Date(),
                    }
                },
                include: {
                    service: true,
                    barbershop: true
                }
            }) : Promise.resolve([])
    ])

    return (

        <div>

            <Header></Header>
            <div className="px-5 pt-5">

                <h2 className="text-xl font-bold">
                    {session?.user ? `Olá, ${session.user.name?.split(" ")[0]}!` : "Olá! Vamos agendar?"}
                </h2>

                <p className="capitalize text-sm">
                    {format(new Date(), "EEEE',' dd 'de' MMMM", {
                        locale: ptBR,
                    })}
                </p>
            </div>
            <div className="px-5 mt-6">
                <Search />
            </div>

            <div className="px-5 mt-6">
                {confirmedBookings.length > 0 && (
                    <>
                        <h2 className="pl-5 text-xs mb-3 uppercase text-gray-400 font-bold">Agendamentos</h2>

                        <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">

                            {confirmedBookings.map((booking) => (
                                <BookingItem key={booking.id} booking={booking} />
                            ))}

                        </div>
                    </>
                )}
            </div>

            <div className="mt-6">
                <h2 className="px-5 text-xs mb-3 uppercase text-gray-400 font-bold">Recomendados</h2>

                <div className="flex px-5 gap-4 overflow-x-auto">
                    {barbershops.map((barbershop) => (
                        <div key={barbershop.id} className="min-w-[167px] max-w-[167px]">
                            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <h2 className="px-5 text-xs mb-3 uppercase text-gray-400 font-bold">Populares</h2>

                <div className="flex px-5 gap-4 overflow-x-auto">
                    {recommendedBarbershops.map((barbershop) => (
                        <div key={barbershop.id} className="min-w-[167px] max-w-[167px]">
                            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
}