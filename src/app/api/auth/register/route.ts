import { NextResponse } from "next/server";
// CORRECCIÓN IMPORTANTE:
// Importamos 'prisma' (minúscula) desde nuestra librería, NO desde el generado.
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 1. Validaciones básicas
    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña requeridos" },
        { status: 400 }
      );
    }
    if (password.length < 4) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 4 caracteres" },
        { status: 400 }
      );
    }

    // 2. Verificar si ya existe
    // CORRECCIÓN: Usamos 'prisma' (la variable de conexión)
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El usuario ya existe" },
        { status: 409 }
      );
    }

    // 3. Encriptar contraseña y Crear Usuario
    const hashedPassword = await hashPassword(password);

    // CORRECCIÓN: 'prisma.user.create'
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // 4. Crear Token de sesión
    const token = await signToken({
      userId: newUser.id,
      username: newUser.username,
    });

    // 5. Responder
    const response = NextResponse.json({
      success: true,
      user: { id: newUser.id, username: newUser.username },
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error en Register:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
