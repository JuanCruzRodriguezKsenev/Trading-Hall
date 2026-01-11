"use client";
import React, { useState, useMemo } from "react";
import { MINECRAFT_ENCHANTS } from "@/lib/constants";
import { UIEnchantment } from "@/types";
import { apiCall } from "@/utils/api-client";
import styles from "./QuickCheck.module.css";

interface Props {
  worldId: string;
  data: UIEnchantment[]; // Datos reales de la DB
  onRefresh: () => void; // Para recargar la tabla tras guardar
}

export default function QuickCheck({ worldId, data, onRefresh }: Props) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [newLevel, setNewLevel] = useState<string>("");
  const [newPrice, setNewPrice] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  // 1. Datos estáticos (Definiciones)
  const selectedDef = useMemo(
    () => MINECRAFT_ENCHANTS.find((e) => e.id === selectedId),
    [selectedId]
  );

  // 2. Datos actuales (Lo que ya tienes en DB)
  const currentData = useMemo(() => {
    if (!selectedId) return null;
    const entry = data.find((d) => d.enchantmentId === selectedId);
    return {
      level: entry?.level || 0,
      price: entry?.price || 0,
    };
  }, [selectedId, data]);

  // 3. Validaciones
  const maxLevel = selectedDef?.maxLevel || 1;
  const inputLvl = parseInt(newLevel);
  const isInvalidMax = selectedId && inputLvl > maxLevel;
  const isInvalidZero =
    selectedId && (newLevel === "" || (inputLvl <= 0 && newLevel !== ""));

  const canSave =
    selectedId &&
    newLevel &&
    newPrice &&
    !isInvalidMax &&
    !isInvalidZero &&
    !isSaving;

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    try {
      await apiCall(`/api/world/${worldId}/items`, {
        data: {
          enchantmentId: selectedId,
          level: inputLvl,
          price: parseInt(newPrice),
        },
      });
      // Limpiamos y refrescamos
      setNewLevel("");
      setNewPrice("");
      onRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const preventNegative = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "e") e.preventDefault();
  };

  const getFeedbackMessage = () => {
    if (!selectedId || !currentData || !newLevel || !newPrice) return null;
    if (isInvalidMax || isInvalidZero) return null;

    const currentLvl = currentData.level;
    const currentPrc = currentData.price;
    const nextLvl = parseInt(newLevel);
    const nextPrc = parseInt(newPrice);

    if (currentLvl === 0)
      return <span className={styles.good}>✨ ¡Nuevo hallazgo!</span>;

    if (nextLvl > currentLvl) {
      return (
        <span className={styles.good}>
          🔥 ¡Upgrade! Nivel {currentLvl} ➔ {nextLvl}
        </span>
      );
    }

    if (nextLvl < currentLvl) {
      return (
        <span className={styles.bad}>
          ⚠️ Downgrade: Bajarías de Nivel {currentLvl} a {nextLvl}
        </span>
      );
    }

    if (nextLvl === currentLvl) {
      if (nextPrc < currentPrc) {
        return (
          <span className={styles.good}>
            🤑 ¡Oferta! Ahorras {currentPrc - nextPrc} esmeraldas.
          </span>
        );
      }
      if (nextPrc > currentPrc) {
        return (
          <span className={styles.bad}>
            💸 Estafa. Pierdes {nextPrc - currentPrc} esmeraldas.
          </span>
        );
      }
      return (
        <span className={styles.neutral}>
          😐 Es exactamente la misma oferta.
        </span>
      );
    }
  };

  const sortedOptions = useMemo(
    () => [...MINECRAFT_ENCHANTS].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  return (
    <div className={styles.card}>
      <div className={styles.header}>⚡ Verificador Rápido</div>
      <div className={styles.grid}>
        <div className={styles.fullWidthMobile}>
          <label className={styles.label}>Aldeano ofrece...</label>
          <select
            className={styles.select}
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setNewLevel("");
              setNewPrice("");
            }}
          >
            <option value="">Selecciona libro...</option>
            {sortedOptions.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} (Max {e.maxLevel})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={styles.label}>Nivel</label>
          <input
            type="number"
            className={styles.input}
            style={
              isInvalidMax
                ? {
                    borderColor: "var(--mc-redstone)",
                    color: "var(--mc-redstone)",
                  }
                : {}
            }
            placeholder={selectedDef ? `Max ${maxLevel}` : "-"}
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value)}
            onKeyDown={preventNegative}
            disabled={!selectedId}
            min="1"
            max={maxLevel}
          />
        </div>

        <div>
          <label className={styles.label}>Precio</label>
          <input
            type="number"
            className={styles.input}
            placeholder="$"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            onKeyDown={preventNegative}
            disabled={!selectedId}
            min="1"
          />
        </div>

        <button
          className={styles.button}
          onClick={handleSave}
          disabled={!canSave}
        >
          {isSaving
            ? "..."
            : currentData?.level === 0
            ? "Guardar"
            : "Reemplazar"}
        </button>

        {isInvalidMax && (
          <div className={styles.errorBanner}>
            ⛔ ¡Error! El nivel máximo de <b>{selectedDef?.name}</b> es{" "}
            {maxLevel}.
          </div>
        )}

        {selectedId && !isInvalidMax && (newLevel || newPrice) && (
          <div className={styles.comparisonContainer}>
            <div className={styles.currentInfo}>
              Tienes actualmente:{" "}
              {currentData && currentData.level > 0 ? (
                <b>
                  Nivel {currentData.level} a {currentData.price} esm.
                </b>
              ) : (
                "No lo tienes"
              )}
            </div>
            <div className={styles.feedbackMsg}>{getFeedbackMessage()}</div>
          </div>
        )}
      </div>
    </div>
  );
}
