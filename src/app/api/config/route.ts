import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "@/lib/session";
import { setConfig, setBakeryName } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.licenseId) {
    return NextResponse.json({ error: "Inicia sesion primero." }, { status: 401 });
  }

  let body: { bakeryName?: string; tasa?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Peticion invalida." }, { status: 400 });
  }

  const licenseId = session.licenseId;

  if (body.bakeryName && body.bakeryName.trim()) {
    const name = body.bakeryName.trim().slice(0, 80);
    await setBakeryName(licenseId, name);
    await updateSession({ bakery: name });
  }

  if (body.tasa) {
    const n = Number(body.tasa.replace(",", "."));
    if (Number.isFinite(n) && n > 0) {
      await setConfig(licenseId, "tasa_usd_bs", String(n));
    }
  }

  return NextResponse.json({ ok: true });
}
