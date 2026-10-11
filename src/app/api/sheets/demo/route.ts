import { NextResponse } from "next/server";
import { getSession, updateSession } from "@/lib/session";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Inicia sesion primero." }, { status: 401 });
  }
  await updateSession({ demo: true, licenseId: undefined, bakery: "Datos de demostracion" });
  return NextResponse.json({ ok: true });
}
