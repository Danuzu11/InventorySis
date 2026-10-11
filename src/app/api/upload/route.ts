import { NextRequest, NextResponse } from "next/server";
import { FIELD_OPTIONS, parseWorkbook, type TargetType } from "@/lib/excel";
import { proposeMapping, type ColumnMapping } from "@/lib/openrouter";
import { getSession } from "@/lib/session";

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Iniciá sesión primero." }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const targetType = String(form.get("targetType") ?? "") as TargetType;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "El archivo supera los 5 MB. Dividilo en partes más chicas." },
      { status: 413 }
    );
  }
  if (!(targetType in FIELD_OPTIONS)) {
    return NextResponse.json(
      { error: "Elige a qué pestaña va este archivo: ventas, compras o inventario." },
      { status: 400 }
    );
  }

  try {
    const wb = await parseWorkbook(file);
    if (wb.sheets.length === 0) {
      return NextResponse.json(
        { error: "No encontré columnas con datos en ese archivo." },
        { status: 422 }
      );
    }

    const primary = wb.sheets[0];
    let mapping: ColumnMapping;
    const fields = FIELD_OPTIONS[targetType];

    if (process.env.OPENROUTER_API_KEY) {
      try {
        mapping = await proposeMapping(
          primary.headers,
          primary.rows,
          targetType
        );
      } catch {
        mapping = Object.fromEntries(fields.map((f, i) => [f, i])) as ColumnMapping;
      }
    } else {
      mapping = Object.fromEntries(fields.map((f, i) => [f, i])) as ColumnMapping;
    }

    const preview = primary.rows.slice(0, 8).map((r) =>
      r.map((c) => (c instanceof Date ? c.toLocaleDateString("es-BO") : String(c ?? "")))
    );

    return NextResponse.json({
      sheets: wb.sheets.map((s) => ({ name: s.name, headers: s.headers })),
      usedSheet: primary.name,
      headers: primary.headers,
      rowCount: primary.rows.length,
      mapping,
      preview,
      fields,
      totalRows: primary.rows.length,
      rawRows: primary.rows.slice(0, 500).map((r) =>
        r.map((c) => (c instanceof Date ? c.toISOString() : c))
      ),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: `No pude leer el archivo: ${msg}` },
      { status: 422 }
    );
  }
}
