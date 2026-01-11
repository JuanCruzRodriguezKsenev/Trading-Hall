"use client";
import { useState, use } from "react"; // 'use' es necesario en Next 15 para params
import { useRouter } from "next/navigation";
import { apiCall } from "@/utils/api-client";
// Ajusta estos imports según donde tengas tus componentes UI
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export default function JoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const router = useRouter();
  // En Next.js 15, params es una promesa que debemos desempaquetar
  const { code } = use(params);

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [msg, setMsg] = useState("");

  const handleJoin = async () => {
    setStatus("loading");
    try {
      // Llamamos a la API que creamos antes
      const res = await apiCall<{ worldId: string }>("/api/world/join", {
        data: { code },
      });
      setStatus("success");
      setMsg("¡Te has unido correctamente!");
      // Redirigimos al mundo después de 1 segundo
      setTimeout(() => router.push(`/world/${res.worldId}`), 1000);
    } catch (err: any) {
      setStatus("error");
      setMsg(err.message || "La invitación no es válida.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "2rem",
          textAlign: "center",
          background: "var(--mc-bg-card)",
          border: "1px solid var(--mc-border)",
          borderRadius: "12px",
        }}
      >
        <h1
          style={{
            color: "var(--mc-emerald)",
            marginBottom: "1rem",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          Invitación a Mundo
        </h1>

        {status === "loading" && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "1rem",
            }}
          >
            <Spinner />
          </div>
        )}

        {status === "error" && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.2)",
              color: "#fca5a5",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            {msg}
          </div>
        )}

        {status === "success" && (
          <div
            style={{
              background: "rgba(16, 185, 129, 0.2)",
              color: "#6ee7b7",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            {msg}
          </div>
        )}

        {status !== "success" && status !== "loading" && (
          <>
            <p
              style={{
                marginBottom: "2rem",
                color: "var(--mc-text-secondary)",
              }}
            >
              Has recibido un código de invitación para colaborar en un Trading
              Hall.
            </p>
            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <Button
                onClick={() => router.push("/")}
                style={{ background: "#4b5563" }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleJoin}
                style={{ background: "var(--mc-emerald)", color: "#000" }}
              >
                Aceptar y Unirse
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
