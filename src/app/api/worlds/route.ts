import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Para leer la cookie
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// Helper para obtener el usuario actual desde la cookie
async function getUserFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");

  if (!token) return null;

  const payload = await verifyToken(token.value);
  return payload; // { userId, username } o null
}

// 1. GET: Obtener mis mundos
export async function GET() {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Buscamos mundos donde el usuario esté en la lista de 'members'
    const worlds = await prisma.world.findMany({
      where: {
        members: {
          some: { id: user.userId },
        },
      },
      include: {
        _count: {
          select: { members: true }, // Opcional: Para saber cuántos miembros hay
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ worlds });
  } catch (error) {
    console.error("Error obteniendo mundos:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// 2. POST: Crear un nuevo mundo
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || name.length < 3) {
      return NextResponse.json(
        { error: "El nombre debe tener al menos 3 caracteres" },
        { status: 400 }
      );
    }

    // Creamos el mundo y conectamos al creador en el mismo paso
    const newWorld = await prisma.world.create({
      data: {
        name,
        members: {
          connect: { id: user.userId },
        },
      },
    });

    return NextResponse.json({ world: newWorld });
  } catch (error: any) {
    // Código P2002 de Prisma = Violación de Unique constraint (Nombre duplicado)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe un mundo con ese nombre" },
        { status: 409 }
      );
    }
    console.error("Error creando mundo:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
