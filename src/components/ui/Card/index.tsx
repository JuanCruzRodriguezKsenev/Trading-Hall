import React from "react";
import styles from "./Card.module.css";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  // Añadimos onClick a la interfaz para que TypeScript lo reconozca
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Card = ({ children, className, onClick }: CardProps) => {
  return (
    <div
      className={`${styles.card} ${className || ""}`}
      // Pasamos el evento al div real que se renderiza en el DOM
      onClick={onClick}
    >
      {children}
    </div>
  );
};
