import { NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "next-auth/react";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.hashedPassword) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isValid) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  // Aqui, como usamos NextAuth, o login de credenciais será feito pelo provider "Credentials"
  return NextResponse.json({ message: "Login válido" });
}
