import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Importamos la instancia Singleton
import { verifyPassword, signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 1. Validaciones básicas
    if (!username || !password) {
      return NextResponse.json(
        { error: "Faltan credenciales" },
        { status: 400 }
      );
    }

    // 2. Buscar Usuario en la DB
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      // Retornamos 401 (Unauthorized) y un mensaje genérico por seguridad
      // para no dar pistas de si el usuario existe o no.
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // 3. Verificar Contraseña (Hash vs Texto plano)
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // 4. Generar Token JWT
    const token = await signToken({
      userId: user.id,
      username: user.username,
    });

    // 5. Preparar respuesta
    const response = NextResponse.json({
      success: true,
      // Devolvemos datos básicos para el Frontend (sin password)
      user: {
        id: user.id,
        username: user.username,
      },
    });

    // 6. Guardar Token en Cookie HTTP-Only
    response.cookies.set("auth-token", token, {
      httpOnly: true, // JavaScript no puede leer esto (Seguridad XSS)
      secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
      sameSite: "strict", // Protección CSRF
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("❌ Error en Login:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
