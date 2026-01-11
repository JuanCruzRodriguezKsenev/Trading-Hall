import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// Helper para autenticación (mismo que usamos en las otras rutas)
async function getUserFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");
  if (!token) return null;
  return await verifyToken(token.value);
}

export async function POST(request: Request) {
  try {
    // 1. Verificar usuario logueado
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para unirte" },
        { status: 401 }
      );
    }

    // 2. Obtener el código enviado desde el frontend
    const { code } = await request.json();
    if (!code) {
      return NextResponse.json(
        { error: "Falta el código de invitación" },
        { status: 400 }
      );
    }

    // 3. Buscar el mundo que tenga ese código
    const world = await prisma.world.findUnique({
      where: { inviteCode: code },
    });

    if (!world) {
      return NextResponse.json(
        { error: "El código de invitación no es válido" },
        { status: 404 }
      );
    }

    // 4. Verificar si el usuario YA es miembro (o dueño)
    // Buscamos en la lista de miembros si existe este userID
    const alreadyMember = await prisma.world.findFirst({
      where: {
        id: world.id,
        members: { some: { id: user.userId } },
      },
    });

    if (alreadyMember) {
      return NextResponse.json({
        message: "Ya eres miembro de este mundo",
        worldId: world.id,
      });
    }

    // 5. Agregar al usuario a la lista de miembros
    await prisma.world.update({
      where: { id: world.id },
      data: {
        members: {
          connect: { id: user.userId },
        },
      },
    });

    // 6. Éxito: Devolvemos el ID del mundo para redirigir
    return NextResponse.json({
      message: "¡Unido exitosamente!",
      worldId: world.id,
    });
  } catch (error) {
    console.error("Error uniéndose al mundo:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
