// 1. Importamos desde TU ruta generada
import {
  Prisma,
  User as PrismaUser,
  World as PrismaWorld,
  EnchantmentEntry as PrismaEntry,
} from "@/app/generated/prisma/client";

// ==========================================
// 1. USUARIO
// ==========================================
export type User = PrismaUser;
export type SafeUser = Omit<PrismaUser, "password">;

// ==========================================
// 2. MUNDO (AQUÍ ESTÁ EL CAMBIO CLAVE)
// ==========================================

// En lugar de ser igual a PrismaWorld, lo "extendemos"
export interface World extends PrismaWorld {
  // Estos campos ya vienen de PrismaWorld, pero al extender
  // podemos agregar los nuevos que manda la API:

  ownerName?: string; // <--- Soluciona el error de ownerName

  // Definimos members como un array de objetos con id y username
  members?: { id: string; username: string }[];
}

// Mantenemos este por si lo usas en otro lado del backend
export type WorldWithMembers = Prisma.WorldGetPayload<{
  include: { members: true };
}>;

// ==========================================
// 3. ENCANTAMIENTOS
// ==========================================
export interface UIEnchantment extends PrismaEntry {
  displayName?: string;
  maxLevel?: number;
  isMaxed?: boolean;
}
