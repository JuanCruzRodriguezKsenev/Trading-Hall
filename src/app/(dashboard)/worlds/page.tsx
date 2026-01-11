import { WorldList } from "@/components/features/world-select/WorldList";

export default function WorldsPage() {
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

      <WorldList />
    </div>
  );
}
