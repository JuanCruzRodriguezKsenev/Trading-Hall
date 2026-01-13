"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { World } from "@/types";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/utils/formatters";
import styles from "./WorldCard.module.css";

interface WorldCardProps {
  world: World;
  currentUserId: string;
  onAction: (e: React.MouseEvent, action: string, worldId: string) => void;
}

export const WorldCard = ({
  world,
  currentUserId,
  onAction,
}: WorldCardProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // --- SUPER DEBUG LOGS ---
  useEffect(() => {
    const ownerIdStr = String(world.ownerId);
    const userIdStr = String(currentUserId);

    console.group(`🔍 Inspección: ${world.name}`);
    console.log(
      "DUEÑO (DB):",
      `'${ownerIdStr}'`,
      "| Longitud:",
      ownerIdStr.length,
      "| Tipo:",
      typeof world.ownerId
    );
    console.log(
      "USUARIO (APP):",
      `'${userIdStr}'`,
      "| Longitud:",
      userIdStr.length,
      "| Tipo:",
      typeof currentUserId
    );
    console.log("¿Son idénticos?:", ownerIdStr === userIdStr);
    console.log(
      "¿Son idénticos (con trim)?:",
      ownerIdStr.trim() === userIdStr.trim()
    );
    console.groupEnd();
  }, [world.ownerId, currentUserId, world.name]);

  // Aplicamos la comparación más agresiva posible
  const isOwner =
    world.ownerId && currentUserId
      ? world.ownerId.localeCompare(currentUserId) === 0
      : false;
  const membersCount = (world as any)._count?.members || 0;
  const isShared = membersCount > 1;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  return (
    <Link href={`/world/${world.id}`} className={styles.worldLink}>
      <Card className={styles.worldCard}>
        <div className={styles.cardHeader}>
          <div className={styles.headerText}>
            <h3 className={styles.worldName}>{world.name}</h3>
            <div className={styles.worldMeta}>
              <span
                className={
                  isShared ? styles.statusShared : styles.statusPrivate
                }
              >
                {isShared ? "🌍 Compartido" : "🔒 Privado"}
              </span>
              <span className={styles.dateText}>
                • {formatDate(world.createdAt)}
              </span>
            </div>
            {world.owner?.username && (
              <p className={styles.ownerInfo}>Dueño: {world.owner.username}</p>
            )}
          </div>

          <div className={styles.optionsWrapper} ref={menuRef}>
            <button
              className={`${styles.actionBtn} ${
                showOptions ? styles.active : ""
              }`}
              onClick={handleToggleMenu}
            >
              ⚙️
            </button>

            {showOptions && (
              <div className={styles.optionsMenu}>
                {/* Estas condiciones dependen de 'isOwner' que logueamos arriba */}
                {isOwner && (
                  <button
                    className={styles.menuItem}
                    onClick={(e) => {
                      setShowOptions(false);
                      onAction(e, "edit", world.id);
                    }}
                  >
                    ✏️ Editar nombre
                  </button>
                )}

                {isShared && (
                  <button
                    className={styles.menuItem}
                    onClick={(e) => {
                      setShowOptions(false);
                      onAction(e, "leave", world.id);
                    }}
                  >
                    🚪 Abandonar
                  </button>
                )}

                {isOwner && (
                  <button
                    className={`${styles.menuItem} ${styles.dangerItem}`}
                    onClick={(e) => {
                      setShowOptions(false);
                      onAction(e, "delete", world.id);
                    }}
                  >
                    🗑️ Eliminar mundo
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.enterText}>CLICK PARA ENTRAR</div>
      </Card>
    </Link>
  );
};
