"use client";
import React, { useState, useMemo } from "react";
import { MINECRAFT_ENCHANTS } from "@/lib/constants";
import { UIEnchantment } from "@/types";
import { apiCall } from "@/utils/api-client";
import styles from "./QuickCheck.module.css";

const MAX_PRICE = 64; // Límite global

interface Props {
  worldId: string;
  data: UIEnchantment[];
  onRefresh: () => void;
}

export default function QuickCheck({ worldId, data, onRefresh }: Props) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [newLevel, setNewLevel] = useState<string>("");
  const [newPrice, setNewPrice] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const selectedDef = useMemo(
    () => MINECRAFT_ENCHANTS.find((e) => e.id === selectedId),
    [selectedId]
  );

  const currentData = useMemo(() => {
    if (!selectedId) return null;
    const entry = data.find((d) => d.enchantmentId === selectedId);
    return {
      level: entry?.level || 0,
      price: entry?.price || 0,
    };
  }, [selectedId, data]);

  // --- 🔒 VALIDACIÓN NIVEL ---
  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setNewLevel("");
      return;
    }

    const num = parseInt(val);
    if (isNaN(num)) return;

    const max = selectedDef?.maxLevel || 1;
    if (num > max) setNewLevel(String(max));
    else if (num < 0) setNewLevel("1");
    else setNewLevel(val);
  };

  // --- 💰 NUEVA VALIDACIÓN PRECIO ---
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setNewPrice("");
      return;
    }

    const num = parseInt(val);
    if (isNaN(num)) return;

    if (num > MAX_PRICE) {
      setNewPrice(String(MAX_PRICE)); // Fuerza 64
    } else if (num < 0) {
      setNewPrice("0");
    } else {
      setNewPrice(val);
    }
  };

  // Logic for Save Button
  const inputLvl = parseInt(newLevel);
  // Solo validamos que no esté vacío o sea 0 negativo extraño
  const isInvalidZero =
    selectedId && (newLevel === "" || (inputLvl <= 0 && newLevel !== ""));

  const canSave =
    selectedId && newLevel && newPrice && !isInvalidZero && !isSaving;

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
      setNewLevel("");
      setNewPrice("");
      onRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const getFeedbackMessage = () => {
    if (!selectedId || !currentData || !newLevel || !newPrice) return null;
    if (isInvalidZero) return null;

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
      if (nextPrc < currentPrc)
        return (
          <span className={styles.good}>
            🤑 ¡Oferta! Ahorras {currentPrc - nextPrc} esm.
          </span>
        );
      if (nextPrc > currentPrc)
        return (
          <span className={styles.bad}>
            💸 Estafa. Pierdes {nextPrc - currentPrc} esm.
          </span>
        );
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

  const maxLabel = selectedDef ? selectedDef.maxLevel : "-";

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
            placeholder={selectedId ? `Max ${maxLabel}` : "-"}
            value={newLevel}
            onChange={handleLevelChange} // <--- VALIDACIÓN
            disabled={!selectedId}
            min="1"
            max={maxLabel}
          />
        </div>

        <div>
          <label className={styles.label}>Precio</label>
          <input
            type="number"
            className={styles.input}
            placeholder="$"
            value={newPrice}
            onChange={handlePriceChange} // <--- VALIDACIÓN
            disabled={!selectedId}
            min="1"
            max={MAX_PRICE}
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

        {selectedId && (newLevel || newPrice) && (
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
