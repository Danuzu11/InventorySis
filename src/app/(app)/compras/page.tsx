import { loadKpis } from "@/lib/data";
import { bs } from "@/lib/format";
import Link from "next/link";

export const instant = false;

export default async function ComprasPage() {
  const result = await loadKpis();

  if (!result.ok) {
    return (
      <div className="rise-in mx-auto max-w-xl rounded-2xl border border-borde bg-tarjeta p-8 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Compras</h1>
        <p className="mt-3 text-[15px] font-semibold text-suave">
          Inicia sesion para ver tus compras.
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

  const proveedores = new Map<string, number>();
  for (const inv of k.inventario) {
    if (inv.proveedor) {
      proveedores.set(inv.proveedor, (proveedores.get(inv.proveedor) ?? 0) + 1);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[26px] leading-tight font-extrabold tracking-[-0.02em]">
            Compras
          </h1>
          <p className="mt-1 text-[14px] font-semibold text-suave">
            Insumos y proveedores de {k.periodoLabel}
          </p>
        </div>
        <div className="rounded-xl border border-borde bg-tarjeta px-4 py-2.5">
          <p className="font-mono text-[10px] font-semibold tracking-[0.1em] text-suave uppercase">
            Costos del mes
          </p>
          <p className="tnum text-[20px] font-extrabold">Bs {bs(k.costos)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-borde bg-tarjeta p-5">
          <h2 className="text-[15px] font-extrabold">Resumen de costos</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13.5px] font-semibold text-suave">Ingresos</span>
              <span className="tnum text-[15px] font-bold">Bs {bs(k.ingresos)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13.5px] font-semibold text-suave">Costos</span>
              <span className="tnum text-[15px] font-bold text-alerta">Bs {bs(k.costos)}</span>
            </div>
            <div className="border-t border-borde pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] font-extrabold">Ganancia neta</span>
                <span className="tnum text-[17px] font-extrabold text-verde">
                  Bs {bs(k.ganancia)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-borde bg-tarjeta p-5">
          <h2 className="text-[15px] font-extrabold">Proveedores</h2>
          {proveedores.size === 0 ? (
            <p className="mt-4 text-sm font-semibold text-suave">
              Sin proveedores registrados.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {[...proveedores.entries()].map(([prov, count]) => (
                <div
                  key={prov}
                  className="flex items-center justify-between rounded-lg bg-masa/60 px-3.5 py-2.5"
                >
                  <span className="text-[13.5px] font-bold">{prov}</span>
                  <span className="rounded-full bg-pistacho/40 px-2.5 py-1 text-[11px] font-bold text-[#33463A] dark:text-[#DFF0E2]">
                    {count} insumo{count > 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {k.inventario.length > 0 && (
        <div className="mt-6">
          <h2 className="text-[17px] font-extrabold tracking-[-0.01em]">
            Insumos en inventario
          </h2>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-borde bg-tarjeta">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-borde">
                  <th className="px-5 py-3.5 text-left font-mono text-[10px] font-semibold tracking-[0.1em] text-suave uppercase">
                    Producto
                  </th>
                  <th className="px-5 py-3.5 text-left font-mono text-[10px] font-semibold tracking-[0.1em] text-suave uppercase">
                    Proveedor
                  </th>
                  <th className="px-5 py-3.5 text-right font-mono text-[10px] font-semibold tracking-[0.1em] text-suave uppercase">
                    Stock
                  </th>
                  <th className="px-5 py-3.5 text-right font-mono text-[10px] font-semibold tracking-[0.1em] text-suave uppercase">
                    Minimo
                  </th>
                </tr>
              </thead>
              <tbody>
                {k.inventario.map((item) => (
                  <tr key={item.producto} className="border-b border-borde/50 last:border-0">
                    <td className="px-5 py-3 text-[14px] font-bold">{item.producto}</td>
                    <td className="px-5 py-3 text-[13px] font-semibold text-suave">
                      {item.proveedor || "—"}
                    </td>
                    <td className="tnum px-5 py-3 text-right text-[14px] font-bold">
                      {item.actual}
                    </td>
                    <td className="tnum px-5 py-3 text-right text-[13px] font-semibold text-suave">
                      {item.minimo}
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
