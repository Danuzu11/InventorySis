"use client";

import { useState } from "react";
import { BrainCircuit, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Report = {
  informe: string;
  fecha: string;
  periodo: string;
  error?: string;
};

export function AnalyzePanel() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", { method: "POST" });
      const data = (await res.json()) as Report;
      if (!res.ok) {
        setError(data.error ?? "No se pudo generar el análisis.");
        return;
      }
      setReport(data);
    } catch {
      setError("Falló la conexión con el servicio de análisis.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {!report && (
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="flex items-center gap-2.5 rounded-xl bg-ambar px-6 py-4 text-[15px] font-extrabold text-[#3B2417] transition-all hover:bg-ambar-fuerte disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Analizando tus números…
            </>
          ) : (
            <>
              <BrainCircuit size={17} strokeWidth={2.4} />
              Generar análisis de este mes
            </>
          )}
        </button>
      )}

      {loading && (
        <div className="mt-6 space-y-3 rounded-2xl border border-borde bg-tarjeta p-6">
          {[92, 78, 85, 60].map((w, i) => (
            <div
              key={i}
              className="h-4 rounded bg-melaza/50"
              style={{ width: `${w}%`, animationDelay: `${i * 90}ms` }}
            />
          ))}
          <p className="pt-2 text-[13px] font-semibold text-suave">
            Leyendo ventas, compras e inventario de tu planilla…
          </p>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-alerta/40 bg-alerta/10 px-4 py-3 text-sm font-bold text-alerta">
          {error}
        </p>
      )}

      {report && !loading && (
        <article className="rise-in mt-6 rounded-2xl border border-borde bg-tarjeta p-7">
          <header className="mb-5 flex flex-wrap items-baseline justify-between gap-2 border-b border-borde pb-4">
            <h2 className="text-[19px] font-extrabold tracking-[-0.01em]">
              Análisis de {report.periodo}
            </h2>
            <p className="font-mono text-[11px] font-semibold tracking-wider text-suave uppercase">
              Generado {report.fecha}
              {report.periodo && ""}
            </p>
          </header>
          <div className="prose-inventario max-w-[65ch] text-[15px] leading-relaxed [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-[16px] [&_h2]:font-extrabold [&_li]:mt-1 [&_p]:mt-2 [&_p]:font-medium [&_strong]:font-extrabold">
            <ReactMarkdown>{report.informe}</ReactMarkdown>
          </div>
          <button
            type="button"
            onClick={() => setReport(null)}
            className="mt-7 rounded-xl border border-borde px-4 py-2.5 text-[13px] font-bold text-suave transition-colors hover:border-ambar hover:text-tinta"
          >
            Pedir otro análisis
          </button>
        </article>
      )}
    </div>
  );
}
