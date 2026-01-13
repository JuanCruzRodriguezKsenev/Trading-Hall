"use client";
import React, { useEffect, useState } from "react";
import { apiCall } from "@/utils/api-client";
import { World } from "@/types";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { CreateWorldModal } from "./CreateWorldModal";
import { WorldCard } from "./WorldCard"; // Importamos el nuevo componente
import styles from "./WorldSelect.module.css";

interface Props {
  searchQuery: string;
  filterType: string;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
}

export const WorldList = ({ searchQuery, filterType, sortConfig }: Props) => {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentUserId = "cmk970xo00000qwu40doilmey";

  const fetchWorlds = async () => {
    try {
      setIsLoading(true);
      const res = await apiCall<{ worlds: World[] }>("/api/worlds");
      setWorlds(res.worlds);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorlds();
  }, []);

  const handleAction = async (
    e: React.MouseEvent,
    action: string,
    worldId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const message =
      action === "delete"
        ? "¿Eliminar este mundo para todos?"
        : "¿Abandonar mundo? El mando pasará al más antiguo.";

    if (confirm(message)) {
      // Lógica de API aquí según la acción
      // await apiCall(`/api/worlds/${worldId}${action === "leave" ? "/leave" : ""}`, { method: action === "delete" ? "DELETE" : "POST" });
      fetchWorlds();
    }
  };

  const processedWorlds = worlds
    .filter((world) => {
      const matchesSearch = world.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const isShared = ((world as any)._count?.members || 1) > 1;

      let matchesType = true;
      if (filterType === "Privado") matchesType = !isShared;
      if (filterType === "Compartido") matchesType = isShared;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const aValue = a[sortConfig.key as keyof World] ?? "";
      const bValue = b[sortConfig.key as keyof World] ?? "";
      return aValue < bValue
        ? sortConfig.direction === "asc"
          ? -1
          : 1
        : sortConfig.direction === "asc"
        ? 1
        : -1;
    });

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Spinner />
      </div>
    );

  return (
    <>
      <div className={styles.grid}>
        {/* Tarjeta estática de creación */}
        <Card
          className={`${styles.worldCard} ${styles.createCard}`}
          onClick={() => setIsModalOpen(true)}
        >
          <div className={styles.createContent}>
            <span className={styles.plus}>+</span>
            <h3>Nuevo Mundo</h3>
          </div>
        </Card>

        {/* Mapeo de tarjetas de mundo */}
        {processedWorlds.map((world) => (
          <WorldCard
            key={world.id}
            world={world}
            currentUserId={currentUserId}
            onAction={handleAction}
          />
        ))}
      </div>

      <CreateWorldModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchWorlds}
      />
    </>
  );
};
