"use client";

import { useEffect, useState } from "react";
import { Input } from "@/app/_components/ui/input";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { toast } from "sonner";
import Header from "@/app/_components/header"; // ✅ importa o Header
import { Loader2 } from "lucide-react";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [mileage, setMileage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/vehicles")
      .then((res) => res.json())
      .then(setVehicles);
  }, []);

  const filtered = vehicles.filter(
    (v) =>
      v.plate.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveMileage = async () => {
    if (!selectedVehicle) return;

    setIsLoading(true);

    try {

      const res = await fetch("/api/vehicles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedVehicle.id, mileage }),
      });

      if (res.ok) {
        toast.success("Quilometragem atualizada!");
        const updated = await res.json();
        setVehicles((prev) =>
          prev.map((v) => (v.id === updated.id ? updated : v))
        );
        setSelectedVehicle(null); // fecha modal
        setMileage("");
      } else {
        toast.error("Erro ao atualizar quilometragem.");
      }

    } finally {
      setIsLoading(false);
    }

  };

  return (

    <div>
      <Header />

      <div className="max-w-2xl mx-auto mt-10 p-4">
        <h1 className="text-2xl font-bold mb-4">Veículos Cadastrados</h1>

        <Input
          placeholder="Pesquisar por placa ou modelo"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />

        <div className="space-y-3">
          {filtered.map((v) => (
            <Card key={v.id} onClick={() => setSelectedVehicle(v)} className="cursor-pointer hover:bg-gray-50">
              <CardContent className="p-3">
                <p><strong>Placa:</strong> {v.plate}</p>
                <p><strong>Modelo:</strong> {v.model}</p>
                <p><strong>Marca:</strong> {v.brand}</p>
                <p><strong>Ano:</strong> {v.year}</p>
                {v.color && <p><strong>Cor:</strong> {v.color}</p>}
                {v.mileage && <p><strong>KM:</strong> {v.mileage}</p>}
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <p className="text-gray-500">Nenhum veículo encontrado.</p>
          )}
        </div>

        {/* Modal para editar KM */}
        <Dialog open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atualizar KM - {selectedVehicle?.plate}</DialogTitle>
            </DialogHeader>

            <Input
              type="number"
              placeholder="Digite a quilometragem"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedVehicle(null)}>
                Cancelar
              </Button>
              {/* <Button onClick={handleSaveMileage}>Salvar KM</Button> */}

              <Button
                onClick={handleSaveMileage}
                disabled={isLoading}
              >
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Salvar KM
              </Button>



            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

    </div>
  );
}
