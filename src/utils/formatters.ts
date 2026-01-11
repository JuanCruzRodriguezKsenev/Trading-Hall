// src/utils/formatters.ts

/**
 * Formatea un precio (Esmeraldas).
 * Ej: 0 -> "Gratis", 10 -> "10", 64 -> "64 (1 Stack)"
 */
export function formatPrice(price: number): string {
  if (price === 0) return "Gratis";
  if (price >= 64) {
    const stacks = Math.floor(price / 64);
    const remainder = price % 64;
    if (remainder === 0)
      return `${price} (${stacks} Stack${stacks > 1 ? "s" : ""})`;
    return `${price} (${stacks} Stk + ${remainder})`;
  }
  return price.toString();
}

/**
 * Formatea una fecha en formato corto estándar.
 * Ej: "10/01/2026"
 */
export function formatDate(dateInput: Date | number | string): string {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/**
 * Calcula cuánto tiempo pasó desde una fecha ("Hace 2 horas").
 * Ideal para logs de actividad: "Modificado por Admin hace 5 min"
 */
export function timeAgo(dateInput: Date | number | string): string {
  const date = new Date(dateInput);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "hace unos segundos";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `hace ${days} día${days !== 1 ? "s" : ""}`;

  const months = Math.floor(days / 30);
  if (months < 12) return `hace ${months} mes${months !== 1 ? "es" : ""}`;

  return formatDate(date); // Si pasó más de un año, mostramos la fecha normal
}
