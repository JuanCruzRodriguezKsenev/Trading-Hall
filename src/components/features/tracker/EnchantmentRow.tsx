"use client";
import React, { useState, useEffect } from "react";
import { UIEnchantment } from "@/types";
import { EnchantmentDef } from "@/lib/constants";
import { timeAgo } from "@/utils/formatters";
import styles from "./EnchantmentRow.module.css";

// 💰 Límite de precio en Minecraft (1 Stack)
const MAX_PRICE = 64;

interface Props {
  definition: EnchantmentDef;
  entry?: UIEnchantment;
  onSave: (id: string, lvl: number, prc: number) => void;
}

export default function EnchantmentRow({ definition, entry, onSave }: Props) {
  const [level, setLevel] = useState(entry?.level || 0);
  const [price, setPrice] = useState(entry?.price || 0);

  useEffect(() => {
    setLevel(entry?.level || 0);
    setPrice(entry?.price || 0);
  }, [entry]);

  const handleBlur = () => {
    if (level !== (entry?.level || 0) || price !== (entry?.price || 0)) {
      onSave(definition.id, level, price);
    }
  };

  // --- 🔒 VALIDACIÓN DE NIVEL (Igual que antes) ---
  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setLevel(0);
      return;
    }

    const num = parseInt(val);
    if (isNaN(num)) return;

    if (num > definition.maxLevel) setLevel(definition.maxLevel);
    else if (num < 0) setLevel(0);
    else setLevel(num);
  };

  // --- 💰 NUEVA VALIDACIÓN DE PRECIO ---
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Si borra, dejamos en 0 visualmente
    if (val === "") {
      setPrice(0);
      return;
    }

    const num = parseInt(val);
    if (isNaN(num)) return;

    // Lógica de Portero para Precio
    if (num > MAX_PRICE) {
      setPrice(MAX_PRICE); // Fuerza el máximo (64)
    } else if (num < 0) {
      setPrice(0); // No negativos
    } else {
      setPrice(num);
    }
  };

  const getRowClass = () => {
    if (level === 0) return styles.rowEmpty;
    if (level === definition.maxLevel) return styles.rowMax;
    if (level >= definition.maxLevel / 2) return styles.rowMid;
    return styles.rowLow;
  };

  const renderBadge = () => {
    if (level === 0)
      return (
        <span
          className={styles.badge}
          style={{ color: "var(--mc-text-muted)" }}
        >
          FALTA
        </span>
      );
    if (level === definition.maxLevel)
      return (
        <span className={styles.badge} style={{ color: "var(--mc-emerald)" }}>
          MAX
        </span>
      );
    return (
      <span className={styles.badge} style={{ color: "var(--mc-gold)" }}>
        MEJORA
      </span>
    );
  };

  return (
    <tr className={getRowClass()}>
      <td>
        <span className={styles.nameText}>{definition.name}</span>
        <div className={styles.metaContainer}>
          <span className={styles.subText}>
            {definition.appliesTo} • Max: {definition.maxLevel}
          </span>
          {entry?.modifiedBy && (
            <div className={styles.commitInfo}>
              <span className={styles.userDot}></span>
              <span className={styles.userName}>{entry.modifiedBy}</span>
              <span className={styles.dateText}>
                • {timeAgo(entry.modifiedAt)}
              </span>
            </div>
          )}
        </div>
      </td>

      <td style={{ textAlign: "center" }}>
        <input
          type="number"
          min="0"
          max={definition.maxLevel}
          value={level || ""}
          onChange={handleLevelChange}
          onBlur={handleBlur}
          className={styles.inputNumber}
          placeholder="0"
        />
        <span style={{ opacity: 0.5, marginLeft: "4px", fontSize: "0.8rem" }}>
          / {definition.maxLevel}
        </span>
      </td>

      <td style={{ textAlign: "center" }}>
        <div className={styles.priceWrapper}>
          <span style={{ marginRight: "4px", opacity: 0.6 }}>$</span>
          <input
            type="number"
            min="0"
            max={MAX_PRICE} // Sugerencia HTML
            value={price || ""}
            onChange={handlePriceChange} // <--- APLICADO AQUÍ
            onBlur={handleBlur}
            className={styles.inputPrice}
            placeholder="-"
          />
        </div>
      </td>

      <td style={{ textAlign: "right" }}>{renderBadge()}</td>
    </tr>
  );
}
