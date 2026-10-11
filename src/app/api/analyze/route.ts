import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { computeKpis, demoKpis } from "@/lib/kpis";
import { generateReport } from "@/lib/openrouter";
import { insertAnalysis } from "@/lib/data";
import { sql, ensureSchema, getRate } from "@/lib/db";

export const maxDuration = 60;

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Inicia sesion primero." }, { status: 401 });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Falta la API key de OpenRouter. Pedile al administrador que cargue OPENROUTER_API_KEY.",
      },
      { status: 503 }
    );
  }

  try {
    let kpis;
    let rate = 6.92;

    if (session.demo || !session.licenseId) {
      kpis = demoKpis();
    } else {
      await ensureSchema();
      const licenseId = session.licenseId;
      const [sales, purchases, inventory] = await Promise.all([
        sql`SELECT fecha, producto, cantidad::numeric as cantidad, precio_unit::numeric as precio_unit, total::numeric as total FROM sales WHERE license_id = ${licenseId}`,
        sql`SELECT fecha, proveedor, producto, cantidad::numeric as cantidad, costo_unit::numeric as costo_unit, total::numeric as total FROM purchases WHERE license_id = ${licenseId}`,
        sql`SELECT producto, stock_actual::numeric as stock_actual, stock_minimo::numeric as stock_minimo, proveedor FROM inventory WHERE license_id = ${licenseId}`,
      ]);
      rate = await getRate(licenseId);
      kpis = computeKpis({
        sales: sales as never,
        purchases: purchases as never,
        inventory: inventory as never,
        rate,
      });
    }

    if (kpis.ventasCount === 0 && !session.demo) {
      return NextResponse.json(
        {
          error:
            "Todavia no hay ventas de este mes en la base de datos. Carga un Excel de ventas primero.",
        },
        { status: 422 }
      );
    }

    const informe = await generateReport({
      periodLabel: kpis.periodoLabel,
      kpis,
      rate,
    });

    const hoy = new Date().toISOString().slice(0, 10);
    if (session.licenseId && !session.demo) {
      try {
        await insertAnalysis(session.licenseId, kpis.periodoLabel, informe);
      } catch {
        // el informe se devuelve igual; el guardado es best-effort
      }
    }

    return NextResponse.json({
      informe,
      fecha: hoy,
      periodo: kpis.periodoLabel,
      demo: kpis.demo,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: `No pude generar el analisis: ${msg}` },
      { status: 422 }
    );
  }
}
