import React from "react";
import { Input } from "@/components/ui/Input";
import styles from "./Tracker.module.css";

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
  type: string;
  onTypeChange: (val: string) => void;
}

export const Filter = ({
  search,
  onSearchChange,
  type,
  onTypeChange,
}: Props) => {
  return (
    <div className={styles.filterBar}>
      <div className={styles.searchBox}>
        <Input
          placeholder="Buscar encantamiento (ej: Mending)"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        className={styles.select}
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
      >
        <option value="all">Todos</option>
        <option value="tool">Herramientas</option>
        <option value="armor">Armadura</option>
        <option value="weapon">Armas</option>
        <option value="bow">Arcos</option>
        <option value="special">Especiales</option>
      </select>
    </div>
  );
};
