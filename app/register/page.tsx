"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Usuário criado com sucesso!");
      router.push("/login");
    } else {
      toast.error(data.error || "Erro ao cadastrar usuário.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded-xl shadow-xl bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-bold mb-6 text-center">Cadastro</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <Button type="submit">Cadastrar</Button>
      </form>

      <p className="text-sm mt-4 text-center">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-blue-500 underline">
          Faça login
        </Link>
      </p>
    </div>
  );
}
