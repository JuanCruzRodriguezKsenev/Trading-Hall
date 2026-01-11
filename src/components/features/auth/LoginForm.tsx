"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import styles from "./AuthForm.module.css"; // <--- Importamos los estilos

export const LoginForm = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formData);
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={styles.container}>
      <h1 className={`${styles.title} ${styles.titleLogin}`}>Iniciar Sesión</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Usuario"
          placeholder="Tu nombre en el server"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        {error && <div className={styles.errorAlert}>{error}</div>}

        {/* El botón ya tiene margin interno o gap del form */}
        <Button
          type="submit"
          isLoading={isLoading}
          style={{ marginTop: "0.5rem" }}
        >
          Entrar al Mundo
        </Button>
      </form>

      <div className={styles.footer}>
        ¿No tienes cuenta?{" "}
        <Link href="/register" className={styles.link}>
          Registrarse
        </Link>
      </div>
    </Card>
  );
};
