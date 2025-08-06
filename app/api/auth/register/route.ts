import { NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
  }

  const userExists = await db.user.findUnique({ where: { email } });
  if (userExists) {
    return NextResponse.json({ error: "Usuário já existe" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: { name, email, hashedPassword },
  });

  return NextResponse.json({ message: "Usuário criado com sucesso", user });
}
