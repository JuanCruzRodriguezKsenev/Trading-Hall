// src/utils/validations.ts

export const RULES = {
  USERNAME_MIN_LENGTH: 3,
  PASSWORD_MIN_LENGTH: 4, // Lo dejamos bajo para facilitar pruebas, luego subilo a 6 u 8
  WORLD_NAME_MIN_LENGTH: 3,
};

/**
 * Valida si un nombre de usuario es aceptable
 */
export function validateUsername(username: string): string | null {
  if (!username) return "El usuario es requerido";
  if (username.length < RULES.USERNAME_MIN_LENGTH) {
    return `El usuario debe tener al menos ${RULES.USERNAME_MIN_LENGTH} caracteres`;
  }
  // Regex: Solo letras, números y guiones bajos (sin espacios)
  const validUserRegex = /^[a-zA-Z0-9_]+$/;
  if (!validUserRegex.test(username)) {
    return "El usuario solo puede contener letras, números y guiones bajos";
  }
  return null; // Null significa "Sin errores"
}

/**
 * Valida contraseña
 */
export function validatePassword(password: string): string | null {
  if (!password) return "La contraseña es requerida";
  if (password.length < RULES.PASSWORD_MIN_LENGTH) {
    return `La contraseña debe tener al menos ${RULES.PASSWORD_MIN_LENGTH} caracteres`;
  }
  return null;
}

/**
 * Valida nombre del mundo
 */
export function validateWorldName(name: string): string | null {
  if (!name) return "El nombre del mundo es requerido";
  if (name.length < RULES.WORLD_NAME_MIN_LENGTH) {
    return `El nombre debe tener al menos ${RULES.WORLD_NAME_MIN_LENGTH} caracteres`;
  }
  return null;
}

/**
 * Valida precios y niveles (No negativos)
 */
export function validatePositiveNumber(
  value: number,
  fieldName: string
): string | null {
  if (value < 0) return `El campo ${fieldName} no puede ser negativo`;
  if (!Number.isInteger(value))
    return `El campo ${fieldName} debe ser un número entero`;
  return null;
}
