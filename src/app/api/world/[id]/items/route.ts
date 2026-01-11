import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// --- HELPERS ---

async function getUserFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");
  if (!token) return null;
  return verifyToken(token.value);
}

// --- ENDPOINTS ---

// 1. GET: Traer items + Datos del mundo (incluyendo colaboradores)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserFromRequest();

    if (!user)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    // Buscamos el mundo y verificamos permisos en la misma consulta
    const worldData = await prisma.world.findFirst({
      where: {
        id: id,
        OR: [
          { ownerId: user.userId }, // Soy el dueño
          { members: { some: { id: user.userId } } }, // Soy miembro
        ],
      },
      select: {
        id: true,
        name: true,
        inviteCode: true,
        ownerId: true,
        // 👇 Traemos el nombre del dueño
        owner: {
          select: { username: true },
        },
        // 👇 Traemos la lista de miembros (id y username)
        members: {
          select: { username: true, id: true },
        },
        enchantments: true, // Traemos los items del mundo
      },
    });

    if (!worldData) {
      return NextResponse.json(
        { error: "Mundo no encontrado o acceso denegado" },
        { status: 404 }
      );
    }

    // Mapeamos la respuesta para que el frontend la reciba limpia
    return NextResponse.json({
      world: {
        id: worldData.id,
        name: worldData.name,
        inviteCode: worldData.inviteCode,
        ownerId: worldData.ownerId,
        // 👇 Agregamos estos campos para la UI de colaboradores
        ownerName: worldData.owner.username,
        members: worldData.members,
      },
      enchantments: worldData.enchantments,
    });
  } catch (error) {
    console.error("Error obteniendo items:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// 2. POST: Guardar (Crear o Actualizar) un encantamiento
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserFromRequest();

    if (!user)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    // Verificar permisos antes de escribir (Dueño o Miembro)
    const hasAccess = await prisma.world.count({
      where: {
        id: id,
        OR: [
          { ownerId: user.userId },
          { members: { some: { id: user.userId } } },
        ],
      },
    });

    if (hasAccess === 0) {
      return NextResponse.json(
        { error: "No tienes permiso para editar este mundo" },
        { status: 403 }
      );
    }

    // Recibimos los datos del formulario
    const { enchantmentId, level, price, villagerId } = await request.json();

    // Validaciones básicas
    if (!enchantmentId)
      return NextResponse.json(
        { error: "Falta ID del encantamiento" },
        { status: 400 }
      );
    if (price < 0)
      return NextResponse.json(
        { error: "El precio no puede ser negativo" },
        { status: 400 }
      );

    // Guardar en la base de datos (Upsert)
    const savedItem = await prisma.enchantmentEntry.upsert({
      where: {
        worldId_enchantmentId: {
          worldId: id,
          enchantmentId: enchantmentId,
        },
      },
      update: {
        level: Number(level) || 0,
        price: Number(price) || 0,
        villagerId: villagerId || "",
        modifiedBy: user.username,
        modifiedAt: new Date(),
      },
      create: {
        worldId: id,
        enchantmentId: enchantmentId,
        level: Number(level) || 0,
        price: Number(price) || 0,
        villagerId: villagerId || "",
        modifiedBy: user.username,
        modifiedAt: new Date(),
      },
    });

    return NextResponse.json({ item: savedItem });
  } catch (error) {
    console.error("Error guardando item:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
