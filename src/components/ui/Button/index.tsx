import React from "react";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${className || ""}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <span className={styles.spinner}></span>
          <span>Cargando...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
