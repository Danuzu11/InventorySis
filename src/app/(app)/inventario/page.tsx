import { TriangleAlert } from "lucide-react";
import { loadKpis } from "@/lib/data";
import Link from "next/link";

export const instant = false;

export default async function InventarioPage() {
  const result = await loadKpis();

  if (!result.ok) {
    return (
      <div className="rise-in mx-auto max-w-xl rounded-2xl border border-borde bg-tarjeta p-8 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Inventario</h1>
        <p className="mt-3 text-[15px] font-semibold text-suave">
          Conecta tu planilla o activa el modo demostración para ver tu stock.
        </p>
        <Link
          href="/configuracion"
          className="mt-6 inline-block rounded-xl bg-ambar px-5 py-3 text-[15px] font-extrabold text-[#3B2417] transition-colors hover:bg-ambar-fuerte"
        >
          Ir a Configuración
        </Link>
      </div>
    );
  }

  const k = result.data;

  return (
    <div>
      <h1 className="text-[26px] leading-tight font-extrabold tracking-[-0.02em]">
        Inventario
      </h1>
      <p className="mt-2 mb-6 text-[14.5px] font-semibold text-suave">
        {k.inventario.length > 0
          ? `${k.inventario.length} productos · ${k.stockBajo.length} por debajo del mínimo`
          : "Tu pestaña de inventario está vacía. Carga un Excel de inventario o escribe directo en la planilla."}
      </p>

      {k.stockBajo.length > 0 && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-ambar/50 bg-ambar/15 px-5 py-4">
          <TriangleAlert size={18} className="mt-0.5 shrink-0 text-ambar-fuerte" strokeWidth={2.4} />
          <div>
            <p className="text-[14px] font-extrabold">
              {k.stockBajo.length} producto{k.stockBajo.length > 1 ? "s" : ""} por debajo del mínimo
            </p>
            <p className="text-[13px] font-semibold text-suave">
              {k.stockBajo.map((s) => s.producto).join(" · ")}
            </p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-borde bg-tarjeta">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="border-b border-borde">
              {["Producto", "Stock actual", "Mínimo", "Proveedor", "Estado"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-left font-mono text-[10px] font-semibold tracking-[0.1em] text-suave uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {k.inventario.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm font-semibold text-suave">
                  Sin productos cargados todavía.
                </td>
              </tr>
            )}
            {k.inventario.map((row) => {
              const bajo = row.actual < row.minimo;
              return (
                <tr key={row.producto} className="border-b border-borde/50 last:border-0">
                  <td className="px-5 py-3.5 text-[14px] font-bold">{row.producto}</td>
                  <td className={`tnum px-5 py-3.5 text-[14px] font-bold ${bajo ? "text-alerta" : ""}`}>
                    {row.actual.toLocaleString("es-BO")}
                  </td>
                  <td className="tnum px-5 py-3.5 text-[14px] font-semibold text-suave">
                    {row.minimo.toLocaleString("es-BO")}
                  </td>
                  <td className="px-5 py-3.5 text-[13.5px] font-semibold text-suave">
                    {row.proveedor || "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider uppercase ${
                        bajo
                          ? "bg-alerta/15 text-alerta"
                          : "bg-pistacho/40 text-[#33463A] dark:text-[#DFF0E2]"
                      }`}
                    >
                      {bajo ? "Reponer" : "OK"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
