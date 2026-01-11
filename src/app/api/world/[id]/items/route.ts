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

// 1. GET: Traer items + Datos del mundo (incluyendo inviteCode)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserFromRequest();

    if (!user)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    // Hacemos una sola consulta eficiente:
    // Buscamos el mundo SOLO si el usuario es Dueño O Miembro
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
        inviteCode: true, // 👈 ¡ESTO ES LO QUE TE FALTABA!
        ownerId: true,
        enchantments: true, // Traemos los items aquí mismo
      },
    });

    if (!worldData) {
      return NextResponse.json(
        { error: "Mundo no encontrado o no tienes permiso" },
        { status: 404 }
      );
    }

    // Devolvemos la estructura exacta que espera tu frontend
    return NextResponse.json({
      world: {
        id: worldData.id,
        name: worldData.name,
        inviteCode: worldData.inviteCode,
        ownerId: worldData.ownerId,
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

    // Verificar permisos antes de escribir
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
        { error: "No tienes permiso para editar" },
        { status: 403 }
      );
    }

    // Recibimos los datos
    const { enchantmentId, level, price, villagerId } = await request.json();

    // Validaciones
    if (!enchantmentId)
      return NextResponse.json({ error: "Falta ID" }, { status: 400 });
    if (price < 0)
      return NextResponse.json({ error: "Precio negativo" }, { status: 400 });

    // UPSERT
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
