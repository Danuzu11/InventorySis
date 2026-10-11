import { NextResponse } from "next/server";
import { getSession, createSession } from "@/lib/session";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Inicia sesion primero." }, { status: 401 });
  }
  await createSession({
    lic: session.lic,
    demo: true,
    bakery: "Panaderia La Espiga",
  });
  return NextResponse.json({ ok: true });
}
