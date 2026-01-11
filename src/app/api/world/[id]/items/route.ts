import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// --- HELPERS (Podríamos moverlos a utils, pero aquí están bien por ahora) ---

async function getUserFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");
  if (!token) return null;
  return verifyToken(token.value);
}

async function checkWorldAccess(worldId: string, userId: string) {
  const world = await prisma.world.findUnique({
    where: { id: worldId },
    include: { members: true },
  });

  if (!world) return { error: "Mundo no encontrado", status: 404 };

  // Verificamos si el usuario está en la lista de miembros
  const isMember = world.members.some((m) => m.id === userId);
  if (!isMember)
    return { error: "No tienes permiso en este mundo", status: 403 };

  return { world };
}

// --- ENDPOINTS ---

// 1. GET: Traer todos los encantamientos del mundo
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Next.js 15: params es promesa
    const user = await getUserFromRequest();

    if (!user)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    // Verificar permisos
    const access = await checkWorldAccess(id, user.userId);
    if (access.error)
      return NextResponse.json(
        { error: access.error },
        { status: access.status }
      );

    // Traer items
    const enchantments = await prisma.enchantmentEntry.findMany({
      where: { worldId: id },
    });

    // Devolvemos también la info básica del mundo (nombre) para el header
    return NextResponse.json({
      world: {
        id: access.world?.id,
        name: access.world?.name,
        createdAt: access.world?.createdAt,
      },
      enchantments,
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

    // Recibimos los datos del formulario/tabla
    const { enchantmentId, level, price, villagerId } = await request.json();

    if (!user)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    // Verificar permisos
    const access = await checkWorldAccess(id, user.userId);
    if (access.error)
      return NextResponse.json(
        { error: access.error },
        { status: access.status }
      );

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

    // UPSERT: La magia de Prisma
    // Busca por la clave compuesta (worldId + enchantmentId)
    // Si existe -> UPDATE. Si no -> CREATE.
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
        modifiedBy: user.username, // Guardamos quién lo modificó
        modifiedAt: new Date(), // Y cuándo
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
