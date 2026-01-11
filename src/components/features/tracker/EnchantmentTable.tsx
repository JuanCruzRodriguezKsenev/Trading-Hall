"use client";
import React from "react";
import { MINECRAFT_ENCHANTS } from "@/lib/constants";
import { UIEnchantment } from "@/types";
import { apiCall } from "@/utils/api-client";
import EnchantmentRow from "./EnchantmentRow";
import styles from "./EnchantmentTable.module.css";

interface Props {
  worldId: string;
  dbData: UIEnchantment[];
  onRefresh: () => void;
  filteredDefs?: typeof MINECRAFT_ENCHANTS;
}

export default function EnchantmentTable({
  worldId,
  dbData,
  onRefresh,
  filteredDefs,
}: Props) {
  const sourceData = filteredDefs || MINECRAFT_ENCHANTS;

  const handleUpdate = async (
    enchantmentId: string,
    level: number,
    price: number
  ) => {
    try {
      await apiCall(`/api/world/${worldId}/items`, {
        data: { enchantmentId, level, price },
      });
      onRefresh();
    } catch (error) {
      console.error("Error updating row", error);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.colName}>Encantamiento</th>
            <th className={styles.colLevel}>Nivel</th>
            <th className={styles.colPrice}>Precio</th>
            <th className={styles.colState}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {sourceData.map((def) => {
            const entry = dbData.find((d) => d.enchantmentId === def.id);
            return (
              <EnchantmentRow
                key={def.id}
                definition={def}
                entry={entry} // Pasamos el dato de DB (puede ser undefined)
                onSave={handleUpdate}
              />
            );
          })}
          {sourceData.length === 0 && (
            <tr>
              <td
                colSpan={4}
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "var(--mc-text-muted)",
                }}
              >
                No hay resultados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
