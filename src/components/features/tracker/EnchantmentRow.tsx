"use client";
import React, { useState, useEffect } from "react";
import { UIEnchantment } from "@/types";
import { EnchantmentDef } from "@/lib/constants"; // Importa la interfaz desde constants
import { timeAgo } from "@/utils/formatters"; // Asumiendo que moviste timeAgo a utils
import styles from "./EnchantmentRow.module.css";

interface Props {
  definition: EnchantmentDef;
  entry?: UIEnchantment; // Puede ser undefined si no lo tenemos guardado
  onSave: (id: string, lvl: number, prc: number) => void;
}

export default function EnchantmentRow({ definition, entry, onSave }: Props) {
  // Estado local para edición fluida
  const [level, setLevel] = useState(entry?.level || 0);
  const [price, setPrice] = useState(entry?.price || 0);

  // Sincronizar si cambia la DB (ej: QuickCheck actualizó este row)
  useEffect(() => {
    setLevel(entry?.level || 0);
    setPrice(entry?.price || 0);
  }, [entry]);

  // Manejar el "Blur" (cuando sales del input) para guardar
  const handleBlur = () => {
    // Solo guardar si hay cambios respecto a lo que había
    if (level !== (entry?.level || 0) || price !== (entry?.price || 0)) {
      onSave(definition.id, level, price);
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
      {/* NOMBRE E INFO */}
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

      {/* NIVEL */}
      <td style={{ textAlign: "center" }}>
        <input
          type="number"
          min="0"
          max={definition.maxLevel}
          value={level || ""}
          onChange={(e) => setLevel(parseInt(e.target.value) || 0)}
          onBlur={handleBlur}
          className={styles.inputNumber}
          placeholder="0"
        />
        <span style={{ opacity: 0.5, marginLeft: "4px", fontSize: "0.8rem" }}>
          / {definition.maxLevel}
        </span>
      </td>

      {/* PRECIO */}
      <td style={{ textAlign: "center" }}>
        <div className={styles.priceWrapper}>
          <span style={{ marginRight: "4px", opacity: 0.6 }}>$</span>
          <input
            type="number"
            min="1"
            value={price || ""}
            onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
            onBlur={handleBlur}
            className={styles.inputPrice}
            placeholder="-"
          />
        </div>
      </td>

      {/* ESTADO */}
      <td style={{ textAlign: "right" }}>{renderBadge()}</td>
    </tr>
  );
}
