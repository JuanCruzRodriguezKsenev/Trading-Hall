import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// Helper para obtener el usuario actual desde la cookie
async function getUserFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");

  if (!token) return null;

  const payload = await verifyToken(token.value);
  return payload; // { userId, username }
}

// 1. GET: Obtener mis mundos (Propios + Compartidos)
export async function GET() {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Buscamos mundos donde seas Dueño (ownerId) O Miembro (members list)
    const worlds = await prisma.world.findMany({
      where: {
        OR: [
          { ownerId: user.userId }, // Soy el dueño
          { members: { some: { id: user.userId } } }, // Soy colaborador
        ],
      },
      include: {
        // Incluimos el nombre del dueño para mostrarlo en la tarjeta ("Creado por Juan")
        owner: {
          select: { username: true },
        },
        _count: {
          select: { members: true },
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

    // Creamos el mundo asignando el ownerId obligatorio
    // y conectando al usuario también como miembro
    const newWorld = await prisma.world.create({
      data: {
        name,
        ownerId: user.userId, // <--- NUEVO: Campo obligatorio por el Schema
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
