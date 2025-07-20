
import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import BookingItemAdmin from "./booking-item-admin";
import AdminSchedule from "./admin-schedule";

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

    return (

        <AdminSchedule barbershopId={user.barbershopId} />
    );
}
