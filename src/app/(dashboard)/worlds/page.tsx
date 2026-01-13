"use client";
import { useState } from "react";
import { WorldList } from "@/components/features/world-select/WorldList";
import Filter from "@/components/features/tracker/Filter/Filter";

export default function WorldsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Estado inicial sincronizado con el componente Filter
  const [filters, setFilters] = useState({
    type: "all",
  });

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>({ key: "createdAt", direction: "desc" });

  return (
    <div>
      <h1
        className="text-diamond"
        style={{ fontSize: "2rem", marginBottom: "0.5rem" }}
      >
        Mis Mundos
      </h1>
      <p className="text-muted" style={{ marginBottom: "2rem" }}>
        Selecciona un servidor para ver sus precios
      </p>

      <Filter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Buscar mundo por nombre..."
        filters={filters}
        setFilter={(key, val) => setFilters((f) => ({ ...f, [key]: val }))}
        clearFilters={() => setFilters({ type: "all" })}
        filterFields={[
          {
            key: "type",
            label: "Privacidad",
            // Solo pasamos las opciones extra, "Todos" lo crea el componente automáticamente
            options: ["Privado", "Compartido"],
          },
        ]}
        sortOptions={[
          { label: "Nombre", key: "name" },
          { label: "Recientes", key: "createdAt" },
        ]}
        getUniqueValues={() => []}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
      />

      <div style={{ marginTop: "2rem" }}>
        <WorldList
          searchQuery={searchQuery}
          filterType={filters.type}
          sortConfig={sortConfig}
        />
      </div>
    </div>
  );
}
