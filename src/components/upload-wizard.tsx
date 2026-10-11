"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  RotateCcw,
  Upload,
} from "lucide-react";

type TargetType = "ventas" | "compras" | "inventario";

type AnalyzeResponse = {
  headers: string[];
  fields: string[];
  mapping: Record<string, number | null>;
  preview: string[][];
  rawRows: unknown[][];
  rowCount: number;
  error?: string;
};

const TARGETS: { id: TargetType; label: string; hint: string }[] = [
  { id: "ventas", label: "Ventas", hint: "Lo que vendiste: fecha, producto, cantidades, precios" },
  { id: "compras", label: "Compras", hint: "Lo que compraste: proveedores, insumos, costos" },
  { id: "inventario", label: "Inventario", hint: "Stock actual por producto y mínimo" },
];

export function UploadWizard() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [target, setTarget] = useState<TargetType>("ventas");
  const [fileName, setFileName] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "reading" | "mapping" | "ready" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [mapping, setMapping] = useState<Record<string, number | null>>({});

  async function analyze(file: File) {
    setError(null);
    setFileName(file.name);
    setPhase("reading");
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("targetType", target);
      setPhase("mapping");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = (await res.json()) as AnalyzeResponse;
      if (!res.ok) {
        setError(data.error ?? "No se pudo leer el archivo.");
        setPhase("idle");
        return;
      }
      setResult(data);
      setMapping(data.mapping);
      setPhase("ready");
    } catch {
      setError("Falló la conexión al analizar el archivo.");
      setPhase("idle");
    }
  }

  async function commit() {
    if (!result) return;
    setPhase("saving");
    setError(null);
    try {
      const res = await fetch("/api/upload/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: target,
          mapping,
          rows: result.rawRows,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "No se pudieron escribir las filas.");
        setPhase("ready");
        return;
      }
      setPhase("done");
      router.refresh();
    } catch {
      setError("Falló la conexión al guardar.");
      setPhase("ready");
    }
  }

  function reset() {
    setPhase("idle");
    setResult(null);
    setFileName(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const busy = phase === "reading" || phase === "mapping" || phase === "saving";

  if (phase === "done" && result) {
    return (
      <div className="rise-in rounded-2xl border border-pistacho/70 bg-pistacho/20 p-8 text-center">
        <CheckCircle2 size={36} className="mx-auto text-verde" strokeWidth={2.2} />
        <h2 className="mt-4 text-xl font-extrabold">
          {result.rawRows.length} filas cargadas en «{target}»
        </h2>
        <p className="mt-2 text-[14.5px] font-semibold text-suave">
          Ya están en tu planilla de Google y alimentan tu dashboard.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-xl bg-ambar px-5 py-3 text-[14px] font-extrabold text-[#3B2417] transition-colors hover:bg-ambar-fuerte"
          >
            Ver mi dashboard
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-xl border border-borde px-5 py-3 text-[14px] font-bold text-suave transition-colors hover:border-ambar hover:text-tinta"
          >
            Subir otro archivo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="mb-3 text-sm font-bold">¿A qué pestaña va este archivo?</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {TARGETS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTarget(t.id)}
              disabled={busy}
              className={`rounded-2xl border p-4 text-left transition-all ${
                target === t.id
                  ? "border-ambar bg-ambar/10"
                  : "border-borde bg-tarjeta hover:border-suave/50"
              }`}
            >
              <span className="flex items-center gap-2 text-[15px] font-extrabold">
                <FileSpreadsheet size={16} strokeWidth={2.3} className="text-ambar-fuerte" />
                {t.label}
              </span>
              <span className="mt-1 block text-[12.5px] leading-snug font-semibold text-suave">
                {t.hint}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      {phase === "idle" && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-borde bg-tarjeta/60 px-6 py-14 transition-colors hover:border-ambar"
        >
          <Upload size={26} className="text-ambar-fuerte" strokeWidth={2.2} />
          <span className="text-[15px] font-extrabold">Elige tu Excel o CSV</span>
          <span className="text-[13px] font-semibold text-suave">
            Hasta 5 MB · el formato de columnas lo acomodamos nosotros
          </span>
        </button>
      )}

      {busy && (
        <div className="flex items-center gap-3 rounded-2xl border border-borde bg-tarjeta px-5 py-4">
          <Loader2 size={18} className="animate-spin text-ambar-fuerte" />
          <p className="text-[14px] font-bold">
            {phase === "saving"
              ? "Escribiendo en tu planilla…"
              : phase === "mapping"
                ? "La IA está acomodando las columnas…"
                : `Leyendo ${fileName ?? "el archivo"}…`}
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) analyze(f);
        }}
      />

      {error && (
        <p role="alert" className="rounded-xl border border-alerta/40 bg-alerta/10 px-4 py-3 text-sm font-bold text-alerta">
          {error}
        </p>
      )}

      {phase === "ready" && result && (
        <div className="rise-in space-y-4 rounded-2xl border border-borde bg-tarjeta p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-[15px] font-extrabold">Revisa cómo leí tus columnas</h2>
              <p className="text-[12.5px] font-semibold text-suave">
                {fileName} · {result.rowCount.toLocaleString("es-BO")} filas · hoja «{result.headers.length > 0 ? "primera" : ""}»
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1.5 rounded-lg border border-borde px-3 py-2 text-[12px] font-bold text-suave transition-colors hover:border-ambar hover:text-tinta"
            >
              <RotateCcw size={13} strokeWidth={2.4} />
              Empezar de nuevo
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {result.fields.map((field) => (
              <label key={field} className="block">
                <span className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.1em] text-suave uppercase">
                  {field}
                </span>
                <select
                  value={mapping[field] ?? ""}
                  onChange={(e) =>
                    setMapping((m) => ({
                      ...m,
                      [field]: e.target.value === "" ? null : Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-xl border border-borde bg-masa px-3 py-2.5 text-[13.5px] font-semibold focus:border-ambar focus:outline-none"
                >
                  <option value="">— no existe —</option>
                  {result.headers.map((h, i) => (
                    <option key={i} value={i}>
                      {h || `Columna ${i + 1}`}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div className="overflow-x-auto rounded-xl border border-borde">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-borde bg-masa/60">
                  {result.headers.slice(0, 6).map((h, i) => (
                    <th
                      key={i}
                      className="px-3 py-2.5 text-left font-mono text-[10px] font-semibold tracking-[0.08em] text-suave uppercase"
                    >
                      {h || `Col ${i + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.preview.slice(0, 6).map((row, ri) => (
                  <tr key={ri} className="border-b border-borde/50 last:border-0">
                    {row.slice(0, 6).map((cell, ci) => (
                      <td key={ci} className="tnum px-3 py-2.5 text-[12.5px] font-semibold">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={commit}
            className="flex items-center gap-2 rounded-xl bg-ambar px-5 py-3 text-[14.5px] font-extrabold text-[#3B2417] transition-colors hover:bg-ambar-fuerte"
          >
            Cargar {result.rawRows.length} filas a «{target}»
            <ArrowRight size={16} strokeWidth={2.6} />
          </button>
        </div>
      )}
    </div>
  );
}
