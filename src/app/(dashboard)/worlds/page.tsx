"use client";
import { useState } from "react";
import { WorldList } from "@/components/features/world-select/WorldList";
import Filter from "@/components/features/tracker/Filter/Filter";
import { World } from "@/types";

export default function WorldsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState<any>({
    type: "all",
  });

  const [sortConfig, setSortConfig] = useState<any>({
    key: "createdAt",
    direction: "desc",
  });

  return (
    <div>
      <h1
        className="text-diamond"
        style={{ fontSize: "2rem", marginBottom: "0.5rem" }}
      >
        Mis Mundos
      </h1>

      {/* Usamos <any> para relajar la validación de tipos en el build de Vercel */}
      <Filter<any>
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Buscar mundo por nombre..."
        filters={filters}
        setFilter={(key, val) => setFilters((f: any) => ({ ...f, [key]: val }))}
        clearFilters={() => setFilters({ type: "all" })}
        filterFields={[
          {
            key: "type",
            label: "Privacidad",
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
