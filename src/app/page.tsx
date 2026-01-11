import Link from "next/link";
import { Button } from "@/components/ui/Button";

// ¡Asegúrate de que diga 'export default function'!
export default function LandingPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        padding: "2rem",
        gap: "2rem",
        // Un fondo oscuro elegante
        background:
          "radial-gradient(circle at center, #2d3436 0%, #121212 100%)",
      }}
    >
      <div style={{ maxWidth: "600px" }}>
        <h1
          className="text-diamond"
          style={{
            fontSize: "3.5rem",
            marginBottom: "1rem",
            lineHeight: "1.1",
          }}
        >
          Trading Hall <br /> Tracker
        </h1>

        <p
          className="text-muted"
          style={{ fontSize: "1.2rem", marginBottom: "2rem" }}
        >
          Organiza tu servidor de Minecraft. Controla los precios de tus
          aldeanos, comparte la lista con tu clan y nunca más olvides quién
          vende Mending a 1 esmeralda.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link href="/login">
            <Button
              variant="primary"
              style={{ fontSize: "1.1rem", padding: "1rem 2rem" }}
            >
              Iniciar Sesión
            </Button>
          </Link>

          <Link href="/register">
            <Button
              variant="secondary"
              style={{ fontSize: "1.1rem", padding: "1rem 2rem" }}
            >
              Crear Cuenta
            </Button>
          </Link>
        </div>
      </div>

      <footer
        style={{ marginTop: "auto", color: "#636e72", fontSize: "0.9rem" }}
      >
        Compatible con Minecraft Java & Bedrock
      </footer>
    </div>
  );
}
