"use client";
import React, { useState } from "react";
// Ajusta la importación de tu Button si está en otra ruta (ej: @/components/ui/Button)
import { Button } from "@/components/ui/Button";

interface Props {
  inviteCode: string;
}

export const InviteButton = ({ inviteCode }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Genera el link: http://localhost:3000/join/CODIGO
    const url = `${window.location.origin}/join/${inviteCode}`;

    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "0.5rem",
      }}
    >
      <Button
        // Si tu componente Button no acepta 'variant', quita esta prop o cámbiala por className
        onClick={handleCopy}
        style={{
          fontSize: "0.85rem",
          padding: "0.5rem 1rem",
          background: copied ? "#10b981" : undefined,
        }}
      >
        {copied ? "✅ Link Copiado!" : "🔗 Invitar Amigo"}
      </Button>
    </div>
  );
};
