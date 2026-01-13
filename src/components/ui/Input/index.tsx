import React, { forwardRef } from "react";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// Envolvemos el componente en forwardRef
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className={`${styles.container} ${className || ""}`}>
        {/* Accesibilidad: Vinculamos el label con el input usando el ID */}
        {label && id && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}
        {label && !id && <label className={styles.label}>{label}</label>}

        <input
          ref={ref} // 👈 Pasamos la ref aquí
          id={id} // Pasamos el ID explícitamente si existe
          className={`${styles.input} ${error ? styles.errorInput : ""}`}
          {...props}
        />
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input"; // Ayuda en las herramientas de desarrollo
