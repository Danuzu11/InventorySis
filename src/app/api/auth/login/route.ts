import { NextRequest, NextResponse } from "next/server";
import { validateLicense } from "@/lib/license";
import { createSession } from "@/lib/session";
import { getBakeryName } from "@/lib/db";

export async function POST(req: NextRequest) {
  let license = "";
  try {
    const body = (await req.json()) as { license?: string };
    license = body.license ?? "";
  } catch {
    return NextResponse.json({ error: "Peticion invalida." }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const result = await validateLicense(license, ip);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, locked: result.locked ?? false },
      { status: result.locked ? 429 : 401 }
    );
  }

  const bakery = await getBakeryName(result.licenseId);
  await createSession({ lic: license.trim(), licenseId: result.licenseId, bakery });
  return NextResponse.json({ ok: true });
}
