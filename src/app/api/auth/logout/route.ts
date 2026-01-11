import { NextResponse } from "next/server";

export async function POST() {
  // Creamos una respuesta exitosa
  const response = NextResponse.json({ success: true });

  // "Borramos" la cookie seteandola vacía y con expiración inmediata (0)
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    expires: new Date(0), // Fecha en el pasado = Borrar inmediatamente
    path: "/",
  });

  return response;
}
