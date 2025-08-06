"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      toast.success("Login realizado com sucesso!");
      router.push("/");
    } else {
      toast.error("E-mail ou senha inválidos.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded-xl shadow-xl bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          placeholder="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Entrar</Button>
      </form>

      <p className="text-sm mt-4 text-center">
        Não tem uma conta?{" "}
        <Link href="/register" className="text-blue-500 underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
