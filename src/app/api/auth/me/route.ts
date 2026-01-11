import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");

    // 1. Si no hay cookie, no hay sesión
    if (!token) {
      return NextResponse.json(
        { error: "No hay sesión activa" },
        { status: 401 }
      );
    }

    // 2. Verificar si el token es válido (firma correcta y no expirado)
    const payload = await verifyToken(token.value);

    if (!payload) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 401 }
      );
    }

    // 3. (Opcional pero recomendado) Verificar que el usuario siga existiendo en DB
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 401 }
      );
    }

    // 4. Devolver usuario limpio (sin password)
    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Error en /auth/me:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
