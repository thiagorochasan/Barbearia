"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { toast } from "sonner";
import Header from "@/app/_components/header"; // ✅ importa o Header
import { Loader2 } from "lucide-react";

export default function VehicleForm() {
    const [plate, setPlate] = useState("");
    const [model, setModel] = useState("");
    const [brand, setBrand] = useState("");
    const [year, setYear] = useState("");
    const [color, setColor] = useState("");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {

            const res = await fetch("/api/vehicles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plate, model, brand, year, color }),
            });

            if (res.ok) {
                toast.success("Veículo cadastrado com sucesso!");
                router.push("/vehicles");
            } else {
                toast.error("Erro ao cadastrar veículo.");
            }

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {/* ✅ Header no topo */}
            <Header />

            <div className="max-w-lg mx-auto mt-6 p-6 border rounded-xl shadow bg-white dark:bg-zinc-900">
                <h1 className="text-xl font-bold mb-6">Cadastrar Veículo</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input placeholder="Placa" value={plate} onChange={(e) => setPlate(e.target.value)} required />
                    <Input placeholder="Modelo" value={model} onChange={(e) => setModel(e.target.value)} required />
                    <Input placeholder="Marca" value={brand} onChange={(e) => setBrand(e.target.value)} required />
                    <Input placeholder="Ano" type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
                    <Input placeholder="Cor" value={color} onChange={(e) => setColor(e.target.value)} />
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar
                    </Button>
                </form>
            </div>
        </div>
    );
}
