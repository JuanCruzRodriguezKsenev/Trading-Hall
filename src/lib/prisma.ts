// src/lib/prisma.ts

// 1. Importamos el cliente desde TU ruta generada (no la default)
import { PrismaClient } from "@/app/generated/prisma/client";

// 2. Importamos las librerías del adaptador de base de datos
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// 3. Configuración del Singleton para evitar múltiples instancias en Hot Reload
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Leemos la URL de la base de datos
const connectionString = `${process.env.DATABASE_URL}`;

// 4. Configuramos el Pool de conexiones y el Adaptador
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 5. Exportamos la instancia de Prisma
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    // Opcional: Logs útiles para ver qué hace la DB en desarrollo
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
