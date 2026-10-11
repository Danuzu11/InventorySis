import { FIELD_OPTIONS, type TargetType } from "./excel";

const MODEL = process.env.OPENROUTER_MODEL || "openrouter/auto";

type ChatMessage = { role: "system" | "user"; content: string };

async function chat(messages: ChatMessage[], maxTokens = 2000): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY no está configurado");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://inventariosis.app",
      "X-Title": "InventarioSIS",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter devolvió una respuesta vacía");
  return content;
}

export type ColumnMapping = Record<string, number | null>;

export async function proposeMapping(
  headers: string[],
  sampleRows: unknown[][],
  targetType: TargetType
): Promise<ColumnMapping> {
  const fields = FIELD_OPTIONS[targetType];
  const sample = [headers, ...sampleRows.slice(0, 5)];
  const prompt = `Voy a cargar un archivo Excel a la pestaña "${targetType}" de una planilla de Google de una panadería.

Campos destino (en este orden en la planilla): ${fields.join(", ")}

Encabezados del archivo: ${JSON.stringify(headers)}
Primeras filas: ${JSON.stringify(sample)}

Devuelve SOLO un JSON válido, sin explicaciones, mapeando cada campo destino al índice de columna (0-based) o null si no existe:
${JSON.stringify(Object.fromEntries(fields.map((f) => [f, null])), null, 0)}

Ejemplo de respuesta: {"fecha":0,"producto":2,"cantidad":3,"precio_unit":4,"total":5}`;

  const raw = await chat(
    [
      {
        role: "system",
        content:
          "Sos un asistente que mapea columnas de Excels de panaderías. Respondés solo JSON válido.",
      },
      { role: "user", content: prompt },
    ],
    400
  );

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("La IA no devolvió un JSON de mapeo válido");
  const parsed = JSON.parse(match[0]) as Record<string, unknown>;

  const mapping: ColumnMapping = {};
  for (const f of fields) {
    const v = parsed[f];
    mapping[f] =
      typeof v === "number" && v >= 0 && v < headers.length
        ? v
        : typeof v === "string" && /^\d+$/.test(v) && Number(v) < headers.length
          ? Number(v)
          : null;
  }
  return mapping;
}

export type ReportInput = {
  periodLabel: string;
  kpis: {
    ingresos: number;
    costos: number;
    ganancia: number;
    margen: number;
    ingresosPrev: number;
    topProductos: { producto: string; unidades: number; ingresos: number }[];
    stockBajo: { producto: string; actual: number; minimo: number }[];
    ventasCount: number;
  };
  rate: number;
};

export async function generateReport(input: ReportInput): Promise<string> {
  const { periodLabel, kpis, rate } = input;
  const prompt = `Sos el analista financiero de una panadería. Escribí un informe accionable en español neutro para el dueño (no técnico).

Período: ${periodLabel}
Tasa: 1 USD = ${rate} Bs
Ingresos: Bs ${Math.round(kpis.ingresos)} (≈ USD ${Math.round(kpis.ingresos / rate)})
Costos: Bs ${Math.round(kpis.costos)}
Ganancia neta: Bs ${Math.round(kpis.ganancia)}
Margen: ${kpis.margen.toFixed(1)}%
Ingresos período anterior: Bs ${Math.round(kpis.ingresosPrev)}
Ventas registradas: ${kpis.ventasCount}

Top productos:
${kpis.topProductos.map((p) => `- ${p.producto}: ${p.unidades} uds, Bs ${Math.round(p.ingresos)}`).join("\n")}

Stock bajo mínimo:
${kpis.stockBajo.map((s) => `- ${s.producto}: quedan ${s.actual} (mínimo ${s.minimo})`).join("\n") || "- ninguno"}

Estructura del informe (con estos títulos exactos, en markdown):
## Qué se vendió bien
## Qué perdió dinero o no se movió
## Stock: qué reponer ya
## Tres acciones para la próxima semana

Máximo 350 palabras. Sé concreto con números. Sin jerga contable. Sin inventar datos que no estén acá.`;

  return chat(
    [
      {
        role: "system",
        content:
          "Ses analista de panaderías pequeñas en Bolivia/LatAm. Informes claros, cálidos y accionables.",
      },
      { role: "user", content: prompt },
    ],
    1600
  );
}
