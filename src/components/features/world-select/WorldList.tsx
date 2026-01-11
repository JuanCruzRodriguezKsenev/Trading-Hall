"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiCall } from "@/utils/api-client";
import { World } from "@/types"; // Recuerda exportar World en types/index.ts
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { CreateWorldModal } from "./CreateWorldModal";
import { formatDate } from "@/utils/formatters";
import styles from "./WorldSelect.module.css";

export const WorldList = () => {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWorlds = async () => {
    try {
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

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Spinner />
      </div>
    );

  return (
    <>
      <div className={styles.grid}>
        {/* Tarjeta de Crear Nuevo (Siempre primero) */}
        <Card className={`${styles.worldCard} ${styles.createCard}`}>
          <div
            onClick={() => setIsModalOpen(true)}
            style={{ width: "100%", height: "100%" }}
            className={styles.createContent}
          >
            <span className={styles.plus}>+</span>
            <h3>Nuevo Mundo</h3>
          </div>
        </Card>

        {/* Lista de Mundos */}
        {worlds.map((world) => (
          <Link href={`/world/${world.id}`} key={world.id}>
            <Card className={styles.worldCard}>
              <div>
                <h3 className={styles.worldName}>{world.name}</h3>
                <p className={styles.worldMeta}>
                  Creado: {formatDate(world.createdAt)}
                </p>
              </div>
              <div
                style={{
                  marginTop: "1rem",
                  color: "var(--mc-emerald)",
                  fontSize: "0.8rem",
                }}
              >
                CLICK PARA ENTRAR
              </div>
            </Card>
          </Link>
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
