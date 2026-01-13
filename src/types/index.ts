import {
  Prisma,
  User as PrismaUser,
  World as PrismaWorld,
  EnchantmentEntry as PrismaEntry,
} from "@/app/generated/prisma/client";

export type User = PrismaUser;
export type SafeUser = Omit<PrismaUser, "password">;

// --- INTERFAZ EXTENDIDA ---
export interface World extends PrismaWorld {
  ownerName?: string;
  // Reflejamos el 'include' de tu API
  owner?: {
    username: string;
  };
  // Reflejamos el '_count' de Prisma para los miembros
  _count?: {
    members: number;
  };
  members?: { id: string; username: string }[];
}

export interface UIEnchantment extends PrismaEntry {
  displayName?: string;
  maxLevel?: number;
  isMaxed?: boolean;
}
