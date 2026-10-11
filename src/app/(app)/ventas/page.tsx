import { loadKpis } from "@/lib/data";
import { bs, usd } from "@/lib/format";
import Link from "next/link";

export const instant = false;

export default async function VentasPage() {
  const result = await loadKpis();

  if (!result.ok) {
    return (
      <div className="rise-in mx-auto max-w-xl rounded-2xl border border-borde bg-tarjeta p-8 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Ventas</h1>
        <p className="mt-3 text-[15px] font-semibold text-suave">
          Inicia sesion para ver tus ventas.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-ambar px-5 py-3 text-[15px] font-extrabold text-[#3B2417] transition-colors hover:bg-ambar-fuerte"
        >
          Iniciar sesion
        </Link>
      </div>
    );
  }

  const k = result.data;

  const ventas = k.serieDiaria.map((d) => ({
    fecha: d.fecha,
    ingresos: d.ingresos,
  }));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[26px] leading-tight font-extrabold tracking-[-0.02em]">
            Ventas
          </h1>
          <p className="mt-1 text-[14px] font-semibold text-suave">
            {k.ventasCount} ventas registradas en {k.periodoLabel}
          </p>
        </div>
        <div className="rounded-xl border border-borde bg-tarjeta px-4 py-2.5">
          <p className="font-mono text-[10px] font-semibold tracking-[0.1em] text-suave uppercase">
            Ingresos del mes
          </p>
          <p className="tnum text-[20px] font-extrabold">
            Bs {bs(k.ingresos)}{" "}
            <span className="text-[13px] font-bold text-suave">
              ~ USD {usd(k.ingresos, k.rate)}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-borde bg-tarjeta">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr className="border-b border-borde">
              <th className="px-5 py-3.5 text-left font-mono text-[10px] font-semibold tracking-[0.1em] text-suave uppercase">
                Fecha
              </th>
              <th className="px-5 py-3.5 text-right font-mono text-[10px] font-semibold tracking-[0.1em] text-suave uppercase">
                Ingresos
              </th>
              <th className="px-5 py-3.5 text-right font-mono text-[10px] font-semibold tracking-[0.1em] text-suave uppercase">
                USD
              </th>
            </tr>
          </thead>
          <tbody>
            {ventas.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-sm font-semibold text-suave">
                  Sin ventas registradas todavia.
                </td>
              </tr>
            )}
            {ventas.map((v) => (
              <tr key={v.fecha} className="border-b border-borde/50 last:border-0">
                <td className="tnum px-5 py-3 text-[14px] font-semibold">{v.fecha}</td>
                <td className="tnum px-5 py-3 text-right text-[14px] font-bold">
                  Bs {bs(v.ingresos)}
                </td>
                <td className="tnum px-5 py-3 text-right text-[13px] font-semibold text-suave">
                  {usd(v.ingresos, k.rate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {k.topProductos.length > 0 && (
        <div className="mt-6">
          <h2 className="text-[17px] font-extrabold tracking-[-0.01em]">
            Productos mas vendidos
          </h2>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-borde bg-tarjeta">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-borde">
                  <th className="px-5 py-3.5 text-left font-mono text-[10px] font-semibold tracking-[0.1em] text-suave uppercase">
                    Producto
                  </th>
                  <th className="px-5 py-3.5 text-right font-mono text-[10px] font-semibold tracking-[0.1em] text-suave uppercase">
                    Unidades
                  </th>
                  <th className="px-5 py-3.5 text-right font-mono text-[10px] font-semibold tracking-[0.1em] text-suave uppercase">
                    Ingresos
                  </th>
                </tr>
              </thead>
              <tbody>
                {k.topProductos.map((p) => (
                  <tr key={p.producto} className="border-b border-borde/50 last:border-0">
                    <td className="px-5 py-3 text-[14px] font-bold">{p.producto}</td>
                    <td className="tnum px-5 py-3 text-right text-[14px] font-semibold text-suave">
                      {p.unidades.toLocaleString("es-BO")}
                    </td>
                    <td className="tnum px-5 py-3 text-right text-[14px] font-bold">
                      Bs {bs(p.ingresos)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
