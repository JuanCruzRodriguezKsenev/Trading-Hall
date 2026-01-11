import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// Helper de Auth (reutilizado)
async function getUserFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");
  if (!token) return null;
  return verifyToken(token.value);
}

// Helper para verificar si el usuario pertenece al mundo que quiere tocar
async function checkWorldAccess(worldId: string, userId: string) {
  const world = await prisma.world.findUnique({
    where: { id: worldId },
    include: { members: true },
  });

  if (!world) return { error: "Mundo no encontrado", status: 404 };

  const isMember = world.members.some((m) => m.id === userId);
  if (!isMember)
    return { error: "No tienes permiso en este mundo", status: 403 };

  return { world }; // Todo OK
}

// 1. DELETE: Borrar mundo
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Next.js 15 requiere await params
    const user = await getUserFromRequest();

    if (!user)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    // Verificamos permisos
    const check = await checkWorldAccess(id, user.userId);
    if (check.error)
      return NextResponse.json(
        { error: check.error },
        { status: check.status }
      );

    // Borramos
    // Nota: Prisma borra en cascada los enchantments si está configurado,
    // pero por seguridad borramos primero los items para evitar errores de FK si no está en Cascade
    await prisma.enchantmentEntry.deleteMany({ where: { worldId: id } });
    await prisma.world.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error borrando mundo:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// 2. PUT: Renombrar mundo
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserFromRequest();
    const { name } = await request.json();

    if (!user)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const check = await checkWorldAccess(id, user.userId);
    if (check.error)
      return NextResponse.json(
        { error: check.error },
        { status: check.status }
      );

    const updatedWorld = await prisma.world.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json({ world: updatedWorld });
  } catch (error) {
    console.error("Error actualizando mundo:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
