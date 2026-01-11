"use client";
import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useWorldData } from "@/hooks/use-world-data";
import { MINECRAFT_ENCHANTS, EnchantmentDef } from "@/lib/constants";
import { Spinner } from "@/components/ui/Spinner";

// ✅ CORRECCIÓN 1: Importamos UIEnchantment
import { UIEnchantment } from "@/types";

import { InviteButton } from "@/components/features/tracker/InviteButton";

// Componentes
import QuickCheck from "@/components/features/tracker/QuickCheck";
import EnchantmentTable from "@/components/features/tracker/EnchantmentTable";
import Filter, {
  FilterFieldDef,
  SortOptionDef,
} from "@/components/features/tracker/Filter/Filter";

// Tipos para el Filtro Complejo
import { SortConfig } from "@/hooks/useDataFilters"; // Asegúrate de tener este tipo o defínelo aquí si falta

// --- HELPER: Calcular Estado (Virtual) ---
// Nos dice el estado textual y un "peso" numérico para ordenar
const getItemStatus = (def: EnchantmentDef, dbEntry?: UIEnchantment) => {
  const level = dbEntry?.level || 0;
  
  if (level === 0) return { label: "Falta", weight: 0 };
  if (level === def.maxLevel) return { label: "Max", weight: 2 };
  return { label: "Mejora", weight: 1 };
};

export default function TrackerPage() {
  const params = useParams();
  const worldId = params.id as string;
  const { world, enchantments, isLoading, mutate } = useWorldData(worldId);

  // --- ESTADOS DEL FILTRO ---
  const [searchQuery, setSearchQuery] = useState("");
  // Usamos Record<string, string> para permitir claves virtuales como "status"
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig<any> | null>(null);

  // --- 1. CONFIGURACIÓN DEL FILTRO (Agregamos Estado) ---
  const filterFields: FilterFieldDef<any>[] = [
    {
      key: "type",
      label: "Tipo de Item",
      options: [
        "armor",
        "tool",
        "weapon",
        "bow",
        "fishing",
        "trident",
        "special",
      ],
    },
    {
      key: "status", // <--- NUEVO CAMPO VIRTUAL
      label: "Estado",
      options: ["Falta", "Mejora", "Max"],
    },
  ];

  // --- 2. CONFIGURACIÓN DE ORDEN (Agregamos Estado y Precio) ---
  const sortOptions: SortOptionDef<any>[] = [
    { label: "Nombre", key: "name" },
    { label: "Nivel Máximo", key: "maxLevel" },
    { label: "Estado (Progreso)", key: "status" }, // <--- NUEVO
    { label: "Precio", key: "price" }, // <--- NUEVO
  ];

  // --- 3. MOTOR DE FILTRADO Y ORDENAMIENTO ---
  const processedDefs = useMemo(() => {
    let result = [...MINECRAFT_ENCHANTS];

    // A. Filtro de Texto
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((def) =>
        def.name.toLowerCase().includes(lowerQuery)
      );
    }

    // B. Filtros por Categoría y ESTADO
    Object.keys(filters).forEach((key) => {
      const filterValue = filters[key];
      if (filterValue && filterValue !== "all") {
        // Lógica especial para el campo virtual "status"
        if (key === "status") {
          result = result.filter((def) => {
            const dbEntry = enchantments.find(
              (e) => e.enchantmentId === def.id
            );
            const status = getItemStatus(def, dbEntry);
            return status.label === filterValue;
          });
        }
        // Lógica normal para campos estáticos (type, etc)
        else {
          result = result.filter(
            (def) => String(def[key as keyof EnchantmentDef]) === filterValue
          );
        }
      }
    });

    // C. Ordenamiento
    if (sortConfig) {
      result.sort((a, b) => {
        // Obtenemos los datos de la DB para comparar
        const entryA = enchantments.find((e) => e.enchantmentId === a.id);
        const entryB = enchantments.find((e) => e.enchantmentId === b.id);

        let valA: any;
        let valB: any;

        // Selección del valor a comparar
        if (sortConfig.key === "status") {
          // Ordenar por peso: Falta(0) -> Mejora(1) -> Max(2)
          valA = getItemStatus(a, entryA).weight;
          valB = getItemStatus(b, entryB).weight;
        } else if (sortConfig.key === "price") {
          valA = entryA?.price || 0;
          valB = entryB?.price || 0;
        } else {
          // Ordenar por propiedades estáticas (name, maxLevel)
          valA = a[sortConfig.key as keyof EnchantmentDef];
          valB = b[sortConfig.key as keyof EnchantmentDef];
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [searchQuery, filters, sortConfig, enchantments]);

  // --- HELPERS ---
  // ✅ CORRECCIÓN 2: Cambiamos el tipo de 'key' a 'any' para evitar el error de TS.
  // Como el componente Filter es genérico con <any> (por los campos virtuales),
  // espera que esta función acepte cualquier clave, no solo strings estrictos.
  const getUniqueValues = (key: any) => {
    if (key === "status") return ["Falta", "Mejora", "Max"];
    return Array.from(
      new Set(
        MINECRAFT_ENCHANTS.map((item) =>
          String(item[key as keyof EnchantmentDef])
        )
      )
    );
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
    setSortConfig(null);
  };

  // --- RENDER ---
  if (isLoading)
    return (
      <div className="flex justify-center pt-16">
        <Spinner />
      </div>
    );
  if (!world) return <div className="text-redstone">Mundo no encontrado.</div>;

  // Lógica para mostrar colaboradores (excluyendo al dueño si aparece duplicado)
  const collaborators =
    world.members?.filter((m: any) => m.id !== world.ownerId) || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* 👇 CAMBIA ESTE BLOQUE DEL HEADER 👇 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2rem", color: "var(--mc-emerald)" }}>
            {world.name}
          </h1>

          {/* Info de Usuarios */}
          <div
            className="text-sm text-muted"
            style={{ marginTop: "0.5rem", color: "#a1a1aa" }}
          >
            <span style={{ marginRight: "1rem" }}>
              👑 <strong>{world.ownerName || "Dueño"}</strong>
            </span>

            {collaborators.length > 0 && (
              <span>
                👥 {collaborators.map((m: any) => m.username).join(", ")}
              </span>
            )}
          </div>
        </div>

        {/* Botón de Invitar */}
        {world.inviteCode && <InviteButton inviteCode={world.inviteCode} />}
      </div>

      <QuickCheck worldId={worldId} data={enchantments} onRefresh={mutate} />

      <Filter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilter={(key, val) =>
          setFilters((prev) => ({ ...prev, [key]: val }))
        }
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        getUniqueValues={getUniqueValues}
        clearFilters={clearFilters}
        filterFields={filterFields}
        sortOptions={sortOptions}
        placeholder="Buscar encantamiento..."
      />

      <EnchantmentTable
        worldId={worldId}
        dbData={enchantments}
        onRefresh={mutate}
        filteredDefs={processedDefs}
      />
    </div>
  );
}