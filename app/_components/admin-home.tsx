
import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import BookingItemAdmin from "./booking-item-admin";

export default async function AdminHome() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return <p className="p-5">Acesso não autorizado.</p>;
    }

    // Buscar o usuário completo para pegar o barbershopId
    const user = await db.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user?.isAdmin || !user.barbershopId) {
        return <p className="p-5">Você não tem permissão para acessar esta página.</p>;
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    endOfDay.setDate(endOfDay.getDate() + 1); // Adiciona 1 dia

    // Buscar agendamentos da barbearia desse admin no dia atual
    const bookings = await db.booking.findMany({
        where: {
            barbershopId: user.barbershopId,
            date: {
                gte: startOfDay,
                lte: endOfDay,
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

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">Agendamentos do Dia</h1>

            {bookings.length === 0 && <p>Não há agendamentos para hoje.</p>}

            <ul className="space-y-4">
                {bookings.map((booking) => (
                    <BookingItemAdmin key={booking.id} booking={booking} />
                ))}
            </ul>
        </div>
    );
}
