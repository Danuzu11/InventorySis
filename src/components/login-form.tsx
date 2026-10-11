"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [license, setLicense] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ license }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "No se pudo validar la licencia.");
        return;
      }
      const next = params.get("next");
      router.push(next && next.startsWith("/") ? next : "/dashboard");
      router.refresh();
    } catch {
      setError("No se pudo conectar. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label htmlFor="license" className="block text-sm font-bold">
        Clave de licencia
      </label>
      <input
        id="license"
        type="text"
        value={license}
        onChange={(e) => setLicense(e.target.value)}
        placeholder="INV-XXXX-XXXX"
        autoComplete="off"
        spellCheck={false}
        required
        className="tnum w-full rounded-xl border border-borde bg-masa px-4 py-3.5 font-mono text-[15px] tracking-wider transition-colors focus:border-ambar focus:outline-none"
      />
      {error && (
        <p role="alert" className="rounded-xl border border-alerta/40 bg-alerta/10 px-4 py-3 text-sm font-semibold text-alerta">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading || license.trim().length < 4}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-ambar px-4 py-3.5 text-[15px] font-extrabold text-[#3B2417] transition-all hover:bg-ambar-fuerte disabled:cursor-not-allowed disabled:opacity-45"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Validando…
          </>
        ) : (
          <>
            Entrar a mi panadería
            <ArrowRight size={16} strokeWidth={2.6} />
          </>
        )}
      </button>
    </form>
  );
}
