"use client";
import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useWorldData } from "@/hooks/use-world-data";
import { MINECRAFT_ENCHANTS, EnchantmentDef } from "@/lib/constants";
import { Spinner } from "@/components/ui/Spinner";

// Componentes
import QuickCheck from "@/components/features/tracker/QuickCheck";
import EnchantmentTable from "@/components/features/tracker/EnchantmentTable";
import Filter, {
  FilterFieldDef,
  SortOptionDef,
} from "@/components/features/tracker/Filter/Filter";

// Tipos para el Filtro Complejo
import { SortConfig } from "@/hooks/useDataFilters"; // Asegúrate de tener este tipo o defínelo aquí si falta

export default function TrackerPage() {
  const params = useParams();
  const worldId = params.id as string;
  const { world, enchantments, isLoading, mutate } = useWorldData(worldId);

  // --- ESTADOS DEL FILTRO COMPLEJO ---
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<
    Partial<Record<keyof EnchantmentDef, string>>
  >({});
  const [sortConfig, setSortConfig] =
    useState<SortConfig<EnchantmentDef> | null>(null);

  // --- CONFIGURACIÓN DEL FILTRO ---
  const filterFields: FilterFieldDef<EnchantmentDef>[] = [
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
  ];

  const sortOptions: SortOptionDef<EnchantmentDef>[] = [
    { label: "Nombre", key: "name" },
    { label: "Nivel Máximo", key: "maxLevel" },
  ];

  // --- LÓGICA DE FILTRADO Y ORDENAMIENTO ---
  const processedDefs = useMemo(() => {
    let result = [...MINECRAFT_ENCHANTS];

    // 1. Filtro de Texto
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((def) =>
        def.name.toLowerCase().includes(lowerQuery)
      );
    }

    // 2. Filtros por Categoría (Pills)
    Object.keys(filters).forEach((key) => {
      const filterValue = filters[key as keyof EnchantmentDef];
      if (filterValue && filterValue !== "all") {
        result = result.filter(
          (def) => String(def[key as keyof EnchantmentDef]) === filterValue
        );
      }
    });

    // 3. Ordenamiento
    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [searchQuery, filters, sortConfig]);

  // --- HELPERS ---
  const getUniqueValues = (key: keyof EnchantmentDef) => {
    return Array.from(
      new Set(MINECRAFT_ENCHANTS.map((item) => String(item[key])))
    );
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
    setSortConfig(null);
  };

  // --- RENDER ---

  if (isLoading) {
    return (
      <div className="flex justify-center pt-16">
        <Spinner />
      </div>
    );
  }

  if (!world) {
    return <div className="text-redstone">Mundo no encontrado.</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "2rem", color: "var(--mc-emerald)" }}>
          {world.name}
        </h1>
        <p className="text-muted">Trading Hall Tracker</p>
      </div>

      {/* 1. QuickCheck (Arreglado: Pasamos worldId y onRefresh) */}
      <QuickCheck worldId={worldId} data={enchantments} onRefresh={mutate} />

      {/* 2. Filter (Adaptado al componente complejo) */}
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

      {/* 3. Tabla (Arreglado: Recibe filteredDefs para mostrar solo lo buscado) */}
      <EnchantmentTable
        worldId={worldId}
        dbData={enchantments}
        onRefresh={mutate}
        filteredDefs={processedDefs} // <--- Pasamos la lista filtrada aquí
      />
    </div>
  );
}
