// src/lib/auth.ts
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

// En producción, esto debe venir de una variable de entorno (.env)
// Por ahora usamos un string fijo para desarrollo
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "clave-secreta-super-dificil-de-adivinar"
);

// --- HASHEO DE CONTRASEÑAS ---

export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export async function verifyPassword(
  plainText: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

// --- TOKENS JWT (SESIONES) ---

export async function signToken(payload: { userId: string; username: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // La sesión dura 1 semana
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; username: string };
  } catch (error) {
    // Si el token es falso o expiró, devolvemos null
    return null;
  }
}
