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
// Exportamos el tipo base por si acaso
export type User = PrismaUser;

// "SafeUser": Sin password, para usar en el Frontend
export type SafeUser = Omit<PrismaUser, "password">;

// ==========================================
// 2. MUNDO
// ==========================================
// Exportamos el tipo base (soluciona el error "declared but never read")
export type World = PrismaWorld;

// "WorldWithMembers": El tipo complejo que incluye el array de miembros
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
