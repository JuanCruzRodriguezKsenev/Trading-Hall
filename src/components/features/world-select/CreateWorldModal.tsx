"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Para refrescar la página tras crear
import { apiCall } from "@/utils/api-client";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { validateWorldName } from "@/utils/validations";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Para recargar la lista
}

export const CreateWorldModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateWorldName(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await apiCall("/api/worlds", { data: { name } });
      setName("");
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error creando mundo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Mundo">
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <Input
          label="Nombre del Servidor"
          placeholder="Ej: Survival 1.21"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
          autoFocus
        />
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Crear Mundo
          </Button>
        </div>
      </form>
    </Modal>
  );
};
