import { NextRequest, NextResponse } from "next/server";
import { FIELD_OPTIONS, type TargetType } from "@/lib/excel";
import { getSession } from "@/lib/session";
import { insertSales, insertPurchases, insertInventory } from "@/lib/data";
import type { ColumnMapping } from "@/lib/openrouter";

function excelDateToISO(v: unknown): string | null {
  if (!v) return null;
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  if (typeof v === "string" && /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(v)) {
    const [d, m, y] = v.split(/[\/\-]/);
    const yy = y.length === 2 ? `20${y}` : y;
    return `${yy}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return String(v).slice(0, 10);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Inicia sesion primero." }, { status: 401 });
  }
  if (!session.licenseId) {
    return NextResponse.json(
      { error: "Conecta tu base de datos antes de cargar archivos." },
      { status: 400 }
    );
  }

  let body: {
    targetType?: TargetType;
    mapping?: ColumnMapping;
    rows?: unknown[][];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Peticion invalida." }, { status: 400 });
  }

  const { targetType, mapping, rows } = body;
  if (!targetType || !(targetType in FIELD_OPTIONS) || !mapping || !rows?.length) {
    return NextResponse.json(
      { error: "Faltan datos del mapeo o de las filas." },
      { status: 400 }
    );
  }

  const fields = Object.keys(mapping);
  const out: unknown[][] = rows.map((row) =>
    fields.map((field) => {
      const col = mapping[field];
      if (col == null || col < 0) return "";
      const val = row[col];
      if (field === "fecha") return excelDateToISO(val);
      return val;
    })
  );

  const licenseId = session.licenseId;

  try {
    if (targetType === "ventas") {
      await insertSales(licenseId, out);
    } else if (targetType === "compras") {
      await insertPurchases(licenseId, out);
    } else if (targetType === "inventario") {
      await insertInventory(licenseId, out);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: `Error al escribir en la base de datos: ${msg}` },
      { status: 422 }
    );
  }

  return NextResponse.json({ ok: true, written: out.length });
}
