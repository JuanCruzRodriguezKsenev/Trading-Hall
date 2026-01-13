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

  // --- 🔒 VALIDACIÓN DE NIVEL ---
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

  // --- 💰 VALIDACIÓN DE PRECIO ---
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setPrice(0);
      return;
    }
    const num = parseInt(val);
    if (isNaN(num)) return;

    if (num > MAX_PRICE) setPrice(MAX_PRICE);
    else if (num < 0) setPrice(0);
    else setPrice(num);
  };

  const getRowClass = () => {
    if (level === 0) return styles.rowEmpty;
    if (level === definition.maxLevel) return styles.rowMax;
    if (level >= definition.maxLevel / 2) return styles.rowMid;
    return styles.rowLow;
  };

  const renderBadge = () => {
    // Caso 1: Falta (Gris)
    if (level === 0) {
      return (
        <span className={`${styles.badge} ${styles.badgeMissing}`}>FALTA</span>
      );
    }

    // Caso 2: Máximo (Verde)
    if (level === definition.maxLevel) {
      return <span className={`${styles.badge} ${styles.badgeMax}`}>MAX</span>;
    }

    // Caso 3: Mejora "Mid" (Dorado) - Si tiene la mitad o más del nivel
    if (level >= definition.maxLevel / 2) {
      return (
        <span className={`${styles.badge} ${styles.badgeMid}`}>MEJORA</span>
      );
    }

    // Caso 4: Mejora "Low" (Rojo) - Si tiene muy poco nivel
    return <span className={`${styles.badge} ${styles.badgeLow}`}>MEJORA</span>;
  };

  return (
    <tr className={getRowClass()}>
      {/* 1. Nombre y Metadata */}
      <td>
        <span className={styles.nameText}>{definition.name}</span>
        <div className={styles.metaContainer}>
          <span className={styles.subText}>{definition.appliesTo}</span>
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

      {/* 2. Input de Nivel */}
      <td className={styles.centerCell}>
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
        <span className={styles.maxSuffix}>/ {definition.maxLevel}</span>
      </td>

      {/* 3. Input de Precio */}
      <td className={styles.centerCell}>
        <div className={styles.priceWrapper}>
          <span>$</span>
          <input
            type="number"
            min="0"
            max={MAX_PRICE}
            value={price || ""}
            onChange={handlePriceChange}
            onBlur={handleBlur}
            className={styles.inputPrice}
            placeholder="-"
          />
        </div>
      </td>

      {/* 4. Badge de Estado */}
      <td className={styles.rightCell}>{renderBadge()}</td>
    </tr>
  );
}
