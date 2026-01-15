"use client";
import { useState } from "react";
import { WorldList } from "@/components/features/world-select/WorldList";
import Filter from "@/components/features/tracker/Filter/Filter";
import { World } from "@/types"; // Importamos la interfaz para el genérico

export default function WorldsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Definimos el estado de filtros usando la interfaz World para evitar errores de tipo
  const [filters, setFilters] = useState<
    Partial<Record<keyof World | "type", string>>
  >({
    type: "all",
  });

  const [sortConfig, setSortConfig] = useState<{
    key: keyof World;
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

      {/* PASO CLAVE: Añadimos <any> o <World> al componente Filter. 
        Esto permite que acepte llaves como 'name' y 'createdAt' sin quejarse 
        de que no coinciden con 'type'.
      */}
      <Filter<any>
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
          filterType={filters.type || "all"}
          sortConfig={sortConfig}
        />
      </div>
    </div>
  );
}
