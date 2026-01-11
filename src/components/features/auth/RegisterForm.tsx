"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { validateUsername, validatePassword } from "@/utils/validations";
import styles from "./AuthForm.module.css"; // Reusamos el mismo CSS

export const RegisterForm = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    form: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ username: "", password: "", form: "" });

    // Validaciones Locales
    const userError = validateUsername(formData.username);
    const passError = validatePassword(formData.password);

    if (userError || passError) {
      setErrors({
        username: userError || "",
        password: passError || "",
        form: "",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        form: err.message || "Error al registrarse",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={styles.container}>
      <h1 className={`${styles.title} ${styles.titleRegister}`}>
        Crear Cuenta
      </h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Usuario"
          placeholder="Elige un nombre único"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          error={errors.username}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="Mínimo 4 caracteres"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          error={errors.password}
        />

        {errors.form && <div className={styles.errorAlert}>{errors.form}</div>}

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          style={{ marginTop: "0.5rem" }}
        >
          Registrarse
        </Button>
      </form>

      <div className={styles.footer}>
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className={styles.link}>
          Inicia Sesión
        </Link>
      </div>
    </Card>
  );
};
