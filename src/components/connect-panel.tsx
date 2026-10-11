"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, PlayCircle, Save } from "lucide-react";

export function ConnectPanel({ bakery, rate }: { bakery: string; rate: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState<null | "demo" | "save">(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [bakeryName, setBakeryName] = useState(bakery);
  const [tasa, setTasa] = useState(String(rate));

  async function save() {
    setLoading("save");
    setError(null);
    setOk(null);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bakeryName, tasa }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "No se pudo guardar.");
        return;
      }
      setOk("Configuracion guardada.");
      router.refresh();
    } catch {
      setError("Fallo la conexion.");
    } finally {
      setLoading(null);
    }
  }

  async function demo() {
    setLoading("demo");
    setError(null);
    try {
      await fetch("/api/sheets/demo", { method: "POST" });
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("No se pudo activar el modo demostracion.");
      setLoading(null);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-borde bg-tarjeta p-6">
        <h2 className="text-[17px] font-extrabold tracking-[-0.01em]">
          Configuracion de tu panaderia
        </h2>
        <p className="mt-2 text-[13.5px] leading-relaxed font-semibold text-suave">
          Tu base de datos esta lista. Solo configura el nombre y la tasa de cambio.
        </p>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.1em] text-suave uppercase">
              Nombre de la panaderia
            </span>
            <input
              type="text"
              value={bakeryName}
              onChange={(e) => setBakeryName(e.target.value)}
              className="w-full rounded-xl border border-borde bg-masa px-3.5 py-2.5 text-[14px] font-semibold focus:border-ambar focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.1em] text-suave uppercase">
              Tasa de cambio (1 USD = ? Bs)
            </span>
            <input
              type="number"
              step="0.01"
              value={tasa}
              onChange={(e) => setTasa(e.target.value)}
              className="tnum w-full rounded-xl border border-borde bg-masa px-3.5 py-2.5 text-[14px] font-semibold focus:border-ambar focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={save}
            disabled={loading !== null}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-ambar px-5 py-3 text-[14.5px] font-extrabold text-[#3B2417] transition-colors hover:bg-ambar-fuerte disabled:opacity-50"
          >
            {loading === "save" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} strokeWidth={2.4} />
            )}
            Guardar configuracion
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-3 rounded-xl border border-alerta/40 bg-alerta/10 px-4 py-3 text-[13px] font-bold text-alerta">
            {error}
          </p>
        )}
        {ok && (
          <p className="mt-3 flex items-center gap-2 rounded-xl border border-pistacho/70 bg-pistacho/25 px-4 py-3 text-[13px] font-bold text-[#33463A] dark:text-[#DFF0E2]">
            <Check size={15} strokeWidth={3} className="text-verde" />
            {ok}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-borde bg-tarjeta p-6">
        <h2 className="text-[17px] font-extrabold tracking-[-0.01em]">
          Todavia no tienes datos?
        </h2>
        <p className="mt-2 text-[13.5px] leading-relaxed font-semibold text-suave">
          Recorre el sistema con datos de una panaderia ficticia. Nada se guarda
          en tu base de datos en modo demostracion.
        </p>
        <button
          type="button"
          onClick={demo}
          disabled={loading !== null}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-borde px-4 py-3 text-[14.5px] font-extrabold transition-colors hover:border-ambar hover:text-ambar-fuerte disabled:opacity-50"
        >
          {loading === "demo" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <PlayCircle size={16} strokeWidth={2.4} />
          )}
          Explorar con datos de demostracion
        </button>

        <div className="mt-7 border-t border-borde pt-5">
          <h3 className="text-[14px] font-extrabold">Como funciona</h3>
          <ul className="mt-2 space-y-1.5 text-[12.5px] font-semibold text-suave">
            <li>Sube tus Excels de ventas y compras en la pestaña Subir Excel</li>
            <li>La IA acomoda las columnas automaticamente</li>
            <li>El dashboard muestra tus metricas al instante</li>
            <li>Pedir analisis IA cuando quieras</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
